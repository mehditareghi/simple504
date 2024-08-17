// app/(admin)/admin-dashboard/layout.tsx
import Breadcrumbs from "@/components/Breadcrumbs";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="p-4">
      <Breadcrumbs />
      <div className="mt-4">{children}</div>
    </div>
  );
}
