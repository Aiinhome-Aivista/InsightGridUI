import { useEffect, useState } from "react";
import DataViewHeader from "./DataViewHeader";
import DataViewTable from "./DataViewTable";
import { useTheme } from "../../../theme";
import ApiServices from "../../../services/ApiServices";
export default function TableView() {
  const { theme } = useTheme();
  const [globalFilter, setGlobalFilter] = useState("");
  const [allData, setAllData] = useState<any>({});
  const [tableOptions, setTableOptions] = useState<any[]>([]);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

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

      // Default select first item
      if (dropdown?.length > 0) {
        setSelectedTables([dropdown[0].value]);
      }
    } catch (err) {
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    console.log("Refreshing...");
  };
  useEffect(() => {
    if (selectedTables.length > 0) {
      handleRunScript(selectedTables[0]); // 👉 run default SQL
    }
  }, [selectedTables]);

  // const handleRunScript = async () => {

  //   try {
  //     const payload = {
  //       sql_query:  ""
  //     };

  //     console.log("Executing SQL Payload:", payload);

  //     const response = await ApiServices.executeSql(payload);
  //   } catch (error) {
  //     console.error("Execute SQL API Error:", error);
  //   } finally {
  //   }
  // };
const handleRunScript = async (sqlQuery: string) => {
  try {
    const payload = {
      sql_query: sqlQuery
    };

    console.log("Executing SQL Payload:", payload);

    const response = await ApiServices.executeSql(payload);
    console.log("Execute SQL API Response:", response); // 👉 PRINT

    return response;
  } catch (error) {
    console.error("Execute SQL API Error:", error);
  }
};


  return (
    <div className="h-full bg-[#D9D9D91A] rounded-xl m-4 max-w-screen">
      <DataViewHeader
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        selectedTables={selectedTables}
        setSelectedTables={setSelectedTables}
        tableOptions={tableOptions}
        onRefresh={handleRefresh}
        onRunScript={handleRunScript} // 👉 ADD THIS
      />
      <DataViewTable
        allData={allData}
        selectedTables={selectedTables}
        globalFilter={globalFilter}
      />
    </div>
  );
}
