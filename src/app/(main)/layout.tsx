import { Footer } from "@/components/footer";
import { Header } from "@/components/layout/Header";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  let user = null;

  if (session?.userId) {
    user = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
    });
  }

  return (
    <>
      <div className="fixed inset-0 -z-50 size-full bg-dot-grid pointer-events-none" />
      <Header user={user ? { name: user.name, email: user.email } : null} />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </>
  );
}
