import { useEffect, useState } from "react";
import DataViewHeader from "./components/ReportDesignerHeader";
import DataViewTable from "./components/ReportDesignerTable";
import { useTheme } from "../../theme";
import ApiServices from "../../services/ApiServices";
import { useLocation } from "react-router-dom";
import { MdOutlineDescription } from "react-icons/md";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
export default function TableView() {
  const { theme } = useTheme();
  const [globalFilter, setGlobalFilter] = useState("");
  const [allData, setAllData] = useState<any>({});
  const [tableOptions, setTableOptions] = useState<any[]>([]);
  const [selectedTables, setSelectedTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [reportName, setReportName] = useState("");
  const [editReport, setEditReport] = useState<any>(null);
  const location = useLocation();
  const report = location.state?.report;
  useEffect(() => {
    if (report) {
      console.log(" Edit report received:", report);

      setEditReport(report);
      setReportName(report.report_name || "");
    }
  }, [report]);
  useEffect(() => {
    getSavedQueryResponse();
  }, []);
  const getSavedQueryResponse = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("ig_user"));
      const payload = {
        created_by: userData?.user_id,
        session_id: userData?.session_id,
      };
      const response = await ApiServices.getSavedQueryResponse(payload);
      const apiData = response.data.data;
      const dropdown = apiData.queries?.flatMap((q) => {
        if (!q.messages || q.messages.length === 0) return [];
        const lastMessage = q.messages[q.messages.length - 1];
        if (!lastMessage.ai_response) return [];
        return [{
          label: q.query_title,
          value: {
            id: lastMessage.id,           
            ai_response: lastMessage.ai_response,
            query_title: q.query_title,
          }
        }];
      });

      setTableOptions(dropdown || []);
      setSelectedTables([]); 
      setAllData({});    
      setTableOptions(dropdown);

    } catch (err) {
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (selectedTables.length > 0) {
        await handleRunScript(selectedTables[0].ai_response);
      } else {
        await getSavedQueryResponse();
      }
    } finally {
      setIsRefreshing(false);
    }
  };
  useEffect(() => {
    if (selectedTables.length > 0) {
      handleRunScript(selectedTables[0].ai_response);
    }
  }, [selectedTables]);

  const handleRunScript = async (sqlQuery: string) => {
    try {
      const payload = { sql_query: sqlQuery };
      const response = await ApiServices.executeSql(payload);
      const api = response.data.data;

      const formatted = {
        [sqlQuery]: {
          title: "Report Result",
          rows: api.rows,
          columns: api.columns.map((col) => ({ column_name: col })),
          procedure_sql: sqlQuery,
        },
      };

      setAllData(formatted);
    } catch (error) {
      console.error("Execute SQL API Error:", error);
    } finally {
      setIsRefreshing(false);
    }
  };
  const handleSaveReport = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("ig_user"));
      if (!selectedTables.length) {
        console.error("No query selected");
        return;
      }
      const selectedQuery = selectedTables[0]; 

      const payload = {
        session_id: userData?.session_id,
        created_by: userData?.user_id,
        // report_id: `report_${Date.now()}`,
        report_id: editReport?.report_id
          ? editReport.report_id    
          : `report_${Date.now()}`,
        query_history_id: selectedQuery.id, 
        report_name: reportName,
      };

      const response = await ApiServices.report_save(payload);

      console.log("Report saved:", response.data);
    } catch (error) {
      console.error("Save report error:", error);
    }
  };


  return (
    <div className="flex flex-col  bg-[#D9D9D91A] rounded-xl m-4 max-w-screen overflow-hidden">
      <DataViewHeader
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        selectedTables={selectedTables}
        setSelectedTables={setSelectedTables}
        tableOptions={tableOptions}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onRunScript={() => { }}
        reportName={reportName}
        setReportName={setReportName}
        onSaveReport={handleSaveReport}
        editReport={editReport}
        setIsRefreshing={setIsRefreshing}
      />
      {selectedTables.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
          <div className="mb-3 text-4xl">🗑️</div>
          <p className="text-sm font-medium">
            Please select a view to create report
          </p>
        </div>
      ) : selectedTables.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full h-96">
          <MdOutlineDescription size={50} className="text-gray-400" />
          <p className="text-gray-500 text-lg mt-3">Please select a script to create report</p>
        </div>
      ) : isRefreshing ? (
        <div className="flex flex-col items-center justify-center w-full h-96">
                        <AutorenewRoundedIcon 
                          className={`w-5 h-5 text-gray-500 ${isRefreshing ? "animate-spin" : ""}`} 
                          fontSize="small"
                        />
          <p className="text-gray-500 text-lg mt-4">Loading Data...</p>
        </div>
      ) : (
        <DataViewTable
          allData={allData}
          selectedTables={selectedTables.map((t) => t.ai_response)}
          globalFilter={globalFilter}
        />
      )}

    </div>
  );
}
