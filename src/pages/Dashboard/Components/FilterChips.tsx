import CancelIcon from "@mui/icons-material/Cancel";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";

interface FilterChipsProps {
  onAdd?: () => void;
  onRemove?: (chip: string) => void;
}
export default function FilterChips({ onAdd, onRemove }: FilterChipsProps) {
    const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 mb-6">
<span
        className="bg-gray-100 px-4 py-2 rounded-lg text-sm text-gray-700 border border-gray-200 cursor-pointer hover:bg-gray-200"
        onClick={() => navigate("/layout/sql")}
      >
        SQL
      </span>

      <span
        className="bg-gray-100 px-4 py-2 rounded-lg text-sm text-gray-700 border border-gray-200 cursor-pointer hover:bg-gray-200"
        onClick={() => navigate("/layout/filter")}
      >
        Filter
      </span>


      <span className="bg-gray-100 px-4 py-2 rounded-lg text-sm text-gray-700 border border-gray-200">
        <AddCircleIcon
          className="w-5 h-5 cursor-pointer"
          onClick={onAdd}
          sx={{
            transition: "color 0.2s ease-in-out",
            "&:hover": { color: "#2C2E42" },
          }}
        />
      </span>

      <span className="flex items-center bg-gray-100 px-4 py-2 rounded-lg text-sm text-gray-700 border border-gray-200 gap-2">
        Product Filter
        <CancelIcon
          className="w-5 h-5 cursor-pointer"
          onClick={() => onRemove?.("Product Filter")}
          sx={{
            transition: "color 0.2s ease-in-out",
            "&:hover": { color: "#2C2E42" },
          }}
        />
      </span>

    </div>
  );
}
