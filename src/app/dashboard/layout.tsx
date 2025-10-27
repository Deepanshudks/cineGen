import Header from "../components/appbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <main className="md:ml-64 p-6 pt-20">{children}</main>
    </div>
  );
}
