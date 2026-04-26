export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-50 size-full bg-dot-grid pointer-events-none" />
      {children}
    </div>
  );
}
