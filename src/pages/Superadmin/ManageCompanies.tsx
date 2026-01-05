import Tippy from '@tippyjs/react'
import React, { useEffect, useState } from 'react'
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import { MdOutlineHourglassEmpty } from "react-icons/md";
import ProductDataTable from '../query-designer/components/DataTable';
import { useNavigate } from "react-router-dom";
import ApiServices from "../../services/ApiServices";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
function ManageCompanies() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companies, setCompanies] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState({
    global: { value: "", matchMode: FilterMatchMode.CONTAINS },
  });
  const navigate = useNavigate();
  useEffect(() => {
    fetchCompanies();
  }, []);
  const columns = [
    {
      field: "company_name",
      header: "Company Name",
      sortable: true,
    },
    {
      field: "company_email",
      header: "Company Email",
      sortable: true,
    },
    {
      field: "phone_number",
      header: "Company Phone",
    },
    {
      field: "address",
      header: "Company Address",
      body: (row: any) => (
        <div className="max-w-[260px] truncate text-xs" title={row.address}>
          {row.address}
        </div>
      ),
    },
  ];


  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ApiServices.getAllCompanies();
      if (response?.data?.isSuccess) {
        setCompanies(response.data.data);
      } else {
        setError(response?.data?.message || "Failed to fetch companies");
      }
    } catch (e) {
      console.error(e);
      setError("Failed to fetch companies");
    } finally {
      setIsLoading(false);
    }
  };

  const actionBodyTemplate = (row: any) => (
    <div className="flex justify-end gap-2">
      <button
        className="p-1 rounded hover:bg-blue-100 text-blue-600"
        onClick={() => {
          navigate(`/layout/register-company/${row.id}`, {
            state: { company: row }
          });
        }}
      >
        <EditOutlinedIcon fontSize="small" />
      </button>

      <button
        className="p-1 rounded hover:bg-red-100 text-red-600"
        onClick={() => {
          if (window.confirm("Are you sure you want to delete this company?")) {
            deleteCompany(row.id);
          }
        }}
      >
        <DeleteOutlineOutlinedIcon fontSize="small" />
      </button>
    </div>
  );
  const deleteCompany = async (companyId: number) => {
    console.log('delete call')
    try {
      const payload = {
        company_id: companyId,
        deleted_by: JSON.parse(localStorage.getItem("ig_user") || "{}")?.user_id,
      };

      await ApiServices.adminCompanyDelete(payload);
      fetchCompanies();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };


  const handleRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    setGlobalFilter("");

    await fetchCompanies();

    setIsRefreshing(false);
  };
  return (
    <div className="mx-auto px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-8">
          <div>
            <h1 className="text-xl font-semibold text-[#1C1B1F] leading-tight">Manage Companies</h1>
            <p className="text-[12px] text-[#888585] mt-1 whitespace-nowrap">
              Start by registering your first company using  Companies.

            </p>
          </div>
          <button
            className="bg-blue-400 hover:bg-blue-700 h-10 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center"
            style={{
              width: '130px',
              height: '45px',
            }}
            onClick={() => navigate("/layout/register-company")}

          >
            Register Company
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400 group-focus-within:text-[#5433FF] transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Global Search"
              value={filters.global.value}
              onChange={(e) =>
                setFilters({
                  global: {
                    value: e.target.value,
                    matchMode: FilterMatchMode.CONTAINS,
                  },
                })
              }
              className="pl-10 pr-4 py-2 border border-[#D9D9D9] rounded-lg h-10 text-sm
             bg-gray-50 focus:bg-white focus:ring-1 focus:ring-[#5433FF]"
              style={{ width: "568px" }}
            />

          </div>
          <Tippy content="Refresh" theme="gray">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`
      w-10 h-10 flex items-center justify-center rounded-lg
      border border-[#D9D9D9] bg-[#D9D9D9]
      ${isRefreshing ? "opacity-70 cursor-wait" : "cursor-pointer"}
    `}
            >
              <AutorenewRoundedIcon
                className={`w-5 h-5 text-gray-500 ${isRefreshing ? "animate-spin" : ""}`}
                fontSize="small"
              />
            </button>
          </Tippy>

        </div>
      </div>
      <DataTable
        value={companies}
        paginator
        rows={5}
        filters={filters}
        globalFilterFields={[
          "company_name",
          "company_email",
          "phone_number",
          "address",
        ]}
        stripedRows
        emptyMessage="No companies found"
        className="custom-table"
      >
        {columns.map((col) => (
          <Column
            key={col.field}
            field={col.field}
            header={col.header}
            sortable={col.sortable}
            body={col.body}
          />
        ))}
        <Column
          header="Action"
          body={actionBodyTemplate}
          style={{ width: "120px", textAlign: "right" }}
        />
      </DataTable>


    </div>
  )
}

export default ManageCompanies
