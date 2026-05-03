import { pgTable, text, timestamp, uuid, boolean, integer, decimal, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums for movement types
export const movementTypeEnum = pgEnum('movement_type', ['IN', 'OUT', 'ADJUST', 'MOVE']);
export const trackingTypeEnum = pgEnum('tracking_type', ['QUANTITY', 'SERIALIZED']);
export const unitStatusEnum = pgEnum('unit_status', ['AVAILABLE', 'SOLD', 'DAMAGED', 'MAINTENANCE', 'RESERVED']);

// Organizations Table
export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  industry: text('industry'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Users Table (Updated to link to Organizations)
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  isOnboarded: boolean('is_onboarded').default(false).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id),
  role: text('role'), // owner, admin, member
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Categories Table
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Items Table
export const items = pgTable('items', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  categoryId: uuid('category_id').references(() => categories.id),
  name: text('name').notNull(),
  sku: text('sku').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 12, scale: 2 }).default('0.00'),
  minStock: integer('min_stock').default(0).notNull(),
  unit: text('unit').default('pcs').notNull(), // pcs, kg, box, etc.
  trackingType: text('tracking_type').default('QUANTITY').notNull(), // QUANTITY or SERIALIZED
  imageUrl: text('image_url'),
  qrCode: text('qr_code').unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Locations Table
export const locations = pgTable('locations', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  name: text('name').notNull(), // Warehouse A, Main Store, etc.
  address: text('address'),
  isDefault: boolean('is_default').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Individual Units for Serialized Tracking
export const itemUnits = pgTable('item_units', {
  id: uuid('id').primaryKey().defaultRandom(),
  itemId: uuid('item_id').references(() => items.id, { onDelete: 'cascade' }).notNull(),
  locationId: uuid('location_id').references(() => locations.id).notNull(),
  serialNumber: text('serial_number').notNull(),
  status: text('status').default('AVAILABLE').notNull(), // AVAILABLE, SOLD, DAMAGED, etc.
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Stock Levels (Current quantity per item per location)
export const stockLevels = pgTable('stock_levels', {
  id: uuid('id').primaryKey().defaultRandom(),
  itemId: uuid('item_id').references(() => items.id, { onDelete: 'cascade' }).notNull(),
  locationId: uuid('location_id').references(() => locations.id, { onDelete: 'cascade' }).notNull(),
  quantity: integer('quantity').default(0).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Stock Movements (History log)
export const stockMovements = pgTable('stock_movements', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  itemId: uuid('item_id').references(() => items.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id),
  fromLocationId: uuid('from_location_id').references(() => locations.id),
  toLocationId: uuid('to_location_id').references(() => locations.id),
  type: text('type').notNull(), // IN, OUT, ADJUST, MOVE
  quantity: integer('quantity').notNull(),
  reason: text('reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  items: many(items),
  locations: many(locations),
}));

export const itemsRelations = relations(items, ({ one, many }) => ({
  organization: one(organizations, { fields: [items.organizationId], references: [organizations.id] }),
  category: one(categories, { fields: [items.categoryId], references: [categories.id] }),
  stockLevels: many(stockLevels),
  units: many(itemUnits),
}));

export const itemUnitsRelations = relations(itemUnits, ({ one }) => ({
  item: one(items, { fields: [itemUnits.itemId], references: [items.id] }),
  location: one(locations, { fields: [itemUnits.locationId], references: [locations.id] }),
}));

export const stockLevelsRelations = relations(stockLevels, ({ one }) => ({
  item: one(items, { fields: [stockLevels.itemId], references: [items.id] }),
  location: one(locations, { fields: [stockLevels.locationId], references: [locations.id] }),
}));

export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
  item: one(items, { fields: [stockMovements.itemId], references: [items.id] }),
  user: one(users, { fields: [stockMovements.userId], references: [users.id] }),
  fromLocation: one(locations, { fields: [stockMovements.fromLocationId], references: [locations.id] }),
  toLocation: one(locations, { fields: [stockMovements.toLocationId], references: [locations.id] }),
}));

export const usersRelations = relations(users, ({ one }) => ({
  organization: one(organizations, { fields: [users.organizationId], references: [organizations.id] }),
}));

