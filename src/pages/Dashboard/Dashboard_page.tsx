import { useState } from "react";
import DashboardHeader from "./Components/DashboardHeader";
import DashboardTable from "./Components/DashboardTable";
import Chat from "./Components/chat";

export default function Dashboard_page() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [viewSelection, setViewSelection] = useState('dataview');
  const [tableData, setTableData] = useState({
    rows: [],
    columns: [],
    insights: [],
    tableName: "Product Details", // Default title
  });

  const handleTableDataSelect = (data: any) => {
    setTableData({
      rows: data.rows || [],
      columns: data.column_metadata || [],
      insights: data.insights || [],
      tableName: data.table_name || "Product Details",
    });
  };

  const handleRefresh = () => {
    // Implement your refresh logic here, e.g., re-fetch data
    console.log("Refresh triggered");
  };

  return (
    <>
      <div className="flex flex-col bg-[#D9D9D91A] rounded-xl m-5 max-w-screen">
        <DashboardHeader
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          onRefresh={handleRefresh}
          onTableSelect={handleTableDataSelect}
          viewSelection={viewSelection}
          onViewChange={setViewSelection}
        />
        <DashboardTable data={tableData.rows} columns={tableData.columns} insights={tableData.insights} globalFilter={globalFilter} tableName={tableData.tableName} viewSelection={viewSelection} />
      </div>
      <div>
      <Chat/>
    </div>
    </>
  );
}