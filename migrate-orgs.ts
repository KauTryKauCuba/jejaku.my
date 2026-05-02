import { db } from './src/db';
import { users, organizations } from './src/db/schema';
import { isNull, eq } from 'drizzle-orm';

async function migrate() {
  console.log('Starting migration...');
  const existingUsers = await db.select().from(users).where(isNull(users.organizationId));
  
  console.log(`Found ${existingUsers.length} users to migrate.`);
  
  for (const user of existingUsers) {
    if (user.organizationName) {
      console.log(`Migrating user ${user.email} with organization ${user.organizationName}`);
      
      // Create organization
      const [newOrg] = await db.insert(organizations).values({
        name: user.organizationName,
        industry: user.industry,
      }).returning();
      
      // Update user
      await db.update(users)
        .set({ organizationId: newOrg.id, role: 'owner' })
        .where(eq(users.id, user.id));
        
      console.log(`Successfully migrated ${user.email}`);
    }
  }
  
  console.log('Migration complete.');
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
