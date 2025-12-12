// import { useState } from "react";
// import DataViewHeader from "./components/DataViewHeader";
// import DataViewTable from "./components/DataViewTable";
// import { useTheme } from "../../theme";

// const allData = {
//   sales_data: [
//     { sales: "Python", product: "10 mints", customer: "17/10/2025", purchase: "Active" },
//     { sales: "SQL", product: "22 mints", customer: "11/10/2025", purchase: "Active" },
//     { sales: "JAVA", product: "7 mints", customer: "13/10/2025", purchase: "Active" },
//   ],
//   product_details: [
//     { sales: "T-Shirt", product: "Fashion", customer: "John Doe", purchase: "Active" },
//     { sales: "Laptop", product: "Electronics", customer: "Jane Smith", purchase: "Inactive" },
//   ],
//   customer_info: [
//     { sales: "USA", product: "New York", customer: "Michael", purchase: "Active" },
//     { sales: "Canada", product: "Toronto", customer: "Sarah", purchase: "Active" },
//   ]
// };

// const tableOptions = [
//   { label: "Sales Data", value: "sales_data" },
//   { label: "Product Details", value: "product_details" },
//   { label: "Customer Info", value: "customer_info" },
// ];

// export default function TableView() {
//   const { theme } = useTheme();
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [selectedTables, setSelectedTables] = useState<string[]>(["sales_data"]);

//   return (
//     <div className="h-full bg-[#D9D9D91A] rounded-xl m-5 max-w-screen">
//       <DataViewHeader
//         globalFilter={globalFilter}
//         setGlobalFilter={setGlobalFilter}
//         onRefresh={function (): void {
//           throw new Error("Function not implemented.");
//         }}
//         selectedTables={selectedTables}
//         setSelectedTables={setSelectedTables}
//         tableOptions={tableOptions}
//       />
//       <DataViewTable
//         allData={allData}
//         selectedTables={selectedTables}
//         globalFilter={globalFilter}
//       />
//     </div>
//   );
// }



//  TableView.tsx — FULL DYNAMIC VERSION

import { useEffect, useState } from "react";
import DataViewHeader from "./DataViewHeader";
import DataViewTable from "./DataViewTable";
import { useTheme } from "../../../theme";
import ApiServices from "../../../services/ApiServices";

// MOCK API RESPONSE (same structure as backend)
// const mockApiResponse = {
//   tables: {
//     paid_orders: {
//       title: "Paid Orders",
//       procedure_sql: "DELIMITER $$ ... END $$",
//       columns: [
//         "category",
//         "customer_id",
//         "order_date",
//         "order_id",
//         "order_status",
//         "payment_method",
//         "payment_status",
//         "product_id",
//         "product_name",
//         "quantity",
//         "total_amount",
//         "unit_price"
//       ],
//       rows: [
//         {
//           category: "Furniture",
//           customer_id: "CUST174",
//           order_date: "2025-01-24",
//           order_id: "ORD0002",
//           order_status: "Pending",
//           payment_method: "UPI",
//           payment_status: "Paid",
//           product_id: "P302",
//           product_name: "Standing Desk",
//           quantity: "5",
//           total_amount: "24443.5",
//           unit_price: "4888.7"
//         }
//       ],
//       chart_suggestions: ["bar", "pie", "bubble", "mixed", "box"],
//       insights: [
//         "Furniture category has the highest total amount spent.",
//         "UPI is the most frequent payment method.",
//         "Delivered status is most common."
//       ]
//     },

//     electronics_orders: {
//       title: "Electronics Orders",
//       procedure_sql: "DELIMITER $$ ... END $$",
//       columns: ["category", "customer_id", "..."],
//       rows: [{ "...": "..." }],
//       chart_suggestions: ["bar", "pie", "box", "kpi"],
//       insights: [
//         "There are 54 electronics orders.",
//         "Credit Card is the most frequent payment method.",
//         "Delivered status is most common for electronics."
//       ]
//     }
//   },

//   dropdown_options: [
//     { label: "Paid Orders", value: "paid_orders" },
//     { label: "Electronics Orders", value: "electronics_orders" }
//   ]
// };


export default function TableView() {
  const { theme } = useTheme();

  // Inputs
  const [globalFilter, setGlobalFilter] = useState("");

  // Dynamic data from mock API
  const [allData, setAllData] = useState<any>({});
  const [tableOptions, setTableOptions] = useState<any[]>([]);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTableData();
  }, []);


  // Fetch data from API
  const fetchTableData = async () => {
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
        session_id: sessionId
      };

      //  Call API
      const response = await ApiServices.getChatHistory(payload);

      // const data = response.data;

      const apiData = response.data.data;
      console.log("dataview response", apiData);

      // setAllData(apiData.tables);
      setTableOptions(apiData.tables_dropdown);

      if (apiData.dropdown_options?.length > 0) {
        setSelectedTables([apiData.tables_dropdown[0].value]);
      }

    } catch (err) {
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };


  // Load initial data
  // useEffect(() => {
  //   setAllData(mockApiResponse.tables);
  //   setTableOptions(mockApiResponse.dropdown_options);

  //   // Default selection
  //   setSelectedTables([mockApiResponse.dropdown_options[0].value]);
  // }, []);

  const handleRefresh = () => {
    console.log("Refreshing...");
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


      />
      <DataViewTable
        allData={allData}
        selectedTables={selectedTables}
        globalFilter={globalFilter}
      />
    </div>
  );
}