import { useState } from "react";
import DataViewHeader from "./components/DataViewHeader";
import DataViewTable from "./components/DataViewTable";
import { useTheme } from "../../theme";

const allData = {
  sales_data: [
    { sales: "Python", product: "10 mints", customer: "17/10/2025", purchase: "Active" },
    { sales: "SQL", product: "22 mints", customer: "11/10/2025", purchase: "Active" },
    { sales: "JAVA", product: "7 mints", customer: "13/10/2025", purchase: "Active" },
  ],
  product_details: [
    { sales: "T-Shirt", product: "Fashion", customer: "John Doe", purchase: "Active" },
    { sales: "Laptop", product: "Electronics", customer: "Jane Smith", purchase: "Inactive" },
  ],
  customer_info: [
    { sales: "USA", product: "New York", customer: "Michael", purchase: "Active" },
    { sales: "Canada", product: "Toronto", customer: "Sarah", purchase: "Active" },
  ]
};

const tableOptions = [
  { label: "Sales Data", value: "sales_data" },
  { label: "Product Details", value: "product_details" },
  { label: "Customer Info", value: "customer_info" },
];

export default function TableView() {
  const { theme } = useTheme();
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedTables, setSelectedTables] = useState<string[]>(["sales_data"]);

  return (
    <div className="h-full bg-[#D9D9D91A] rounded-xl m-5 max-w-screen">
      <DataViewHeader
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        onRefresh={function (): void {
          throw new Error("Function not implemented.");
        }}
        selectedTables={selectedTables}
        setSelectedTables={setSelectedTables}
        tableOptions={tableOptions}
      />
      <DataViewTable
        allData={allData}
        selectedTables={selectedTables}
        globalFilter={globalFilter}
      />
    </div>
  );
}