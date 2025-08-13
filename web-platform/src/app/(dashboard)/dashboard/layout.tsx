import { getConfigs } from "@/configs";
import RouteGuard from "@/utils/routeGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {getConfigs().isApp && <RouteGuard />}
      {children}
    </>
  );
}
