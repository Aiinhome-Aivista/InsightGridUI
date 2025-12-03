import { useState } from "react";
import DashboardHeader from "./Components/DashboardHeader";
import DashboardTable from "./Components/DashboardTable";
import { useTheme } from "../../theme";
import Chat from "./Components/chat";


export default function Dashboard_page() {
  const { theme } = useTheme();
  const [globalFilter, setGlobalFilter] = useState("");

  const data = [
    { sales: "Python", product: "10 mints", customer: "17/10/2025", purchase: "Active" },
    { sales: "SQL", product: "22 mints", customer: "11/10/2025", purchase: "Active" },
    { sales: "JAVA", product: "7 mints", customer: "13/10/2025", purchase: "Active" },
  ];

  return (
    <>
    <div className="flex flex-col bg-[#D9D9D91A] rounded-xl m-5">
      <DashboardHeader
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter} onRefresh={function (): void {
          throw new Error("Function not implemented.");
        } }      />
      
      <DashboardTable data={data} globalFilter={globalFilter} />
      </div>
      <div>
      <Chat />
    </div>
    </>
  );
}