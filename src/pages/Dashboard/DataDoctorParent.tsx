import { useEffect, useState } from "react";
import DashboardHeader from "./Components/DashboardHeader";
import DashboardTable from "./Components/DashboardTable";
import Chat from "./Components/DataDoctorChat";
import ApiServices from "../../services/ApiServices";

export default function Dashboard_page() {
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
    console.log("Refresh triggered");
  };



  const getStoredUser = () => {
    try {
      const raw = localStorage.getItem("ig_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const fetchTableData = async () => {
    const user = getStoredUser();

    const payload = {
      created_by: user?.user_id || "",
      session_id: user?.session_id || "",
    };

    console.log(" Payload Sent to API:", payload);

    try {
      const response = await ApiServices.getTableData(payload);

      console.log(" API Response:", response.data);

      const data = response.data.data || {}; 

      setTableData({
        rows: data.rows || [],
        columns: data.column_metadata || [],
        insights: data.insights || [],
        tableName: data.table_name || "Product Details",
      });

    } catch (error) {
      console.error(" API Error:", error);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);


  return (
    <>
      <div className="flex flex-col bg-[#D9D9D91A] rounded-xl m-5 max-w-screen">
        <DashboardHeader
          onRefresh={handleRefresh}
          onTableSelect={handleTableDataSelect}
          viewSelection={viewSelection}
          onViewChange={setViewSelection}
        />
        <DashboardTable data={tableData.rows} columns={tableData.columns} insights={tableData.insights} tableName={tableData.tableName} viewSelection={viewSelection} globalFilter={""} />
      </div>
      <div>
        <Chat />
      </div>
    </>
  );
}