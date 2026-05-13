export default function BlackboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-slate-50">
      {children}
    </div>
  );
}
