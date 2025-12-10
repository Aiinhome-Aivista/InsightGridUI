import { useEffect, useState } from "react";
import DashboardHeader from "./Components/DashboardHeader";
import DashboardTable from "./Components/DashboardTable";
import Chat from "./Components/DataDoctorChat";
import ApiServices from "../../services/ApiServices";
import { useLocation } from "react-router-dom";

export default function Dashboard_page() {
  const [viewSelection, setViewSelection] = useState('dataview');
  const [tableData, setTableData] = useState({
    rows: [],
    columns: [],
    insights: [],
    tableName: "", // Default title
  });
  const [tableOptions, setTableOptions] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const location = useLocation();
  const [passedData, setPassedData] = useState({ user_query: "", query_title: "", ai_response: "" });
  

  const handleTableDataSelect = (data: any) => {
    setTableData({
      rows: data.data || [],
      columns: data.columns || [],
      insights: Array.isArray(data.insights)
        ? data.insights
        : JSON.parse(data.insights || "[]"),
      tableName: data.tableName || "Product Details",
    });
  };

  useEffect(() => {
  if (location.state && location.state.data) {
    const rowData = location.state.data;

    setPassedData({
      user_query: rowData.user_query || "",
      query_title: rowData.query_title || "",
      ai_response: rowData.ai_response || "",
    });

    console.log("Received user_query & query_title:", rowData.user_query, rowData.query_title, rowData.ai_response);
  }
}, [location.state]);


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
    setIsFetching(true);
    const user = getStoredUser();

    const payload = {
      created_by: user?.user_id || "",
      session_id: user?.session_id || "",
    };

    console.log(" Payload Sent to API:", payload);

    try {
      const response = await ApiServices.getTableData(payload);

      console.log(" API Response:", response.data);

      const responseData = response.data.data || {};
      const tables = responseData.tables_dropdown || [];
      setTableOptions(tables);
    } catch (error) {
      console.error(" API Error:", error);
    } finally {
      setIsFetching(false);
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
          tableOptions={tableOptions}
          viewSelection={viewSelection}
          isLoading={isFetching}
          onViewChange={setViewSelection}
          passedData={passedData}
          onTableLoading={setIsFetching}
        />
        <DashboardTable data={tableData.rows} columns={tableData.columns} insights={tableData.insights} tableName={tableData.tableName} viewSelection={viewSelection} globalFilter={""} isLoading={isFetching} />
      </div>
      <div>
        <Chat 
         passedData={passedData}
         />
      </div>
    </>
  );
}