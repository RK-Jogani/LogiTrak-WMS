import { ManagementLayout } from "@/components/layouts/ManagementLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ManagementLayout>{children}</ManagementLayout>;
}
