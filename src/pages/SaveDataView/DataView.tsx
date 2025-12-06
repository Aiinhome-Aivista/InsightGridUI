import { useState } from "react";
import DataViewHeader from "./components/DataViewHeader";
import DataViewTable from "./components/DataViewTable";
import { useTheme } from "../../theme";

export default function TableView() {
  const { theme } = useTheme();
  const [globalFilter, setGlobalFilter] = useState("");

  const data = [
    { sales: "Python", product: "10 mints", customer: "17/10/2025", purchase: "Active" },
    { sales: "SQL", product: "22 mints", customer: "11/10/2025", purchase: "Active" },
    { sales: "JAVA", product: "7 mints", customer: "13/10/2025", purchase: "Active" },
  ];

  return (
    <div className="h-full bg-[#D9D9D91A]" style={{ backgroundColor: theme.background }}>
      <DataViewHeader
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter} onRefresh={function (): void {
          throw new Error("Function not implemented.");
        } }      />
      
      <DataViewTable
        data={data}
        globalFilter={globalFilter}
      />
    </div>
  );
}