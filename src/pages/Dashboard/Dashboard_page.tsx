import { useState } from "react";
import DashboardHeader from "./Components/DashboardHeader";
import DashboardTable from "./Components/DashboardTable";

export default function DashboardPage() {
  const [globalFilter, setGlobalFilter] = useState("");

  const data = [
    { sales: "Python", product: "10 mints", customer: "17/10/2025", purchase: "Active" },
    { sales: "SQL", product: "22 mints", customer: "11/10/2025", purchase: "Active" },
    { sales: "JAVA", product: "7 mints", customer: "13/10/2025", purchase: "Active" },
  ];

  return (
    <div className="h-full bg-gray-50">
      <DashboardHeader
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />

      <DashboardTable
        data={data}
        globalFilter={globalFilter}
      />
    </div>
  );
}
