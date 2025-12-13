import { useEffect, useState } from "react";
import DataViewHeader from "./components/ReportDesignerHeader";
import DataViewTable from "./components/ReportDesignerTable";
import { useTheme } from "../../theme";
import ApiServices from "../../services/ApiServices";
import { MdOutlineDescription } from "react-icons/md";
export default function TableView() {
  const { theme } = useTheme();
  const [globalFilter, setGlobalFilter] = useState("");
  const [allData, setAllData] = useState<any>({});
  const [tableOptions, setTableOptions] = useState<any[]>([]);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [reportName, setReportName] = useState("");

  useEffect(() => {
    getSavedQueryResponse();
  }, []);

  const getSavedQueryResponse = async () => {
    try {
      setLoading(true);

      // Get user from localStorage
      const userData = JSON.parse(localStorage.getItem("ig_user"));

      // Extract user_id for created_by
      const createdBy = userData?.user_id;
      const sessionId = userData?.session_id;

      if (!createdBy) {
        console.error("No user_id found in localStorage ig_user.");
        setLoading(false);
        return;
      }

      // Build payload dynamically
      const payload = {
        created_by: createdBy,
        session_id: sessionId,
      };

      //  Call API
      const response = await ApiServices.getSavedQueryResponse(payload);

      // const data = response.data;

      const apiData = response.data.data;
      console.log("dataview response", apiData);

      // setAllData(apiData.tables_data);
      // setTableOptions(apiData.dropdown_options);

      // if (apiData.dropdown_options?.length > 0) {
      //   setSelectedTables([apiData.dropdown_options[0].value]);
      // }
      //       const apiData = response.data.data;

      // console.log("dataview response", apiData);

      // Build dropdown from query_title + ai_response
      const dropdown = apiData.queries?.map((q) => ({
        label: q.query_title,
        value: q.ai_response,
      }));

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
        await handleRunScript(selectedTables[0]);
      } else {
        await getSavedQueryResponse();
      }
    } finally {
      setIsRefreshing(false);
    }
  };
  useEffect(() => {
    if (selectedTables.length > 0) {
      handleRunScript(selectedTables[0]); // 👉 run default SQL
    }
  }, [selectedTables]);

  const handleRunScript = async (sqlQuery: string) => {
    try {
      const payload = { sql_query: sqlQuery };

      const response = await ApiServices.executeSql(payload);
      const api = response.data.data;

      const formatted = {
        [sqlQuery]: {
          title: "SQL Result",
          rows: api.rows,
          columns: api.columns.map((col) => ({ column_name: col })),
          procedure_sql: sqlQuery,
        },
      };

      setAllData(formatted);
    } catch (error) {
      console.error("Execute SQL API Error:", error);
    }
  };

  const handleSaveReport = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("ig_user"));

      const payload = {
        session_id: userData?.session_id,
        created_by: userData?.user_id,
        report_id: `report_${Date.now()}`,
        query_history_id: 1,
        report_name: reportName,
      };

      const response = await ApiServices.report_save(payload);

      console.log("Report saved:", response.data);
    } catch (error) {
      console.error("Save report error:", error);
    }
  };

  return (
    <div className="h-[90%] bg-[#D9D9D91A] rounded-xl m-4 max-w-screen">
      <DataViewHeader
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        selectedTables={selectedTables}
        setSelectedTables={setSelectedTables}
        tableOptions={tableOptions}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onRunScript={handleRunScript}
        reportName={reportName}
        setReportName={setReportName}
        onSaveReport={handleSaveReport}
      />
      {!loading && (!tableOptions || tableOptions.length === 0) ? (
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500 text-lg">No data found</p>
        </div>
      ) : selectedTables.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full h-96">
          <MdOutlineDescription size={50} className="text-gray-400" />
          <p className="text-gray-500 text-lg mt-3">Please select a view</p>
        </div>
      ) : (
        <DataViewTable
          allData={allData}
          selectedTables={selectedTables}
          globalFilter={globalFilter}
        />
      )}
    </div>
  );
}
