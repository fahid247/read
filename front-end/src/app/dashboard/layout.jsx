import DashboardClient from "@/components/DashboardClient/DashboardClient";


export const metadata = {
  title: "Dashboard - ReadMart",
  description: "Manage your ReadMart account and books",
};

export default function DashboardLayout({ children }) {
  return <DashboardClient>{children}</DashboardClient>;
}