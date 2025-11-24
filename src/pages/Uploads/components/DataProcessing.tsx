import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface Props {
  fileName: string;
}

export default function DataProcessing({ fileName }: Props) {
  return (
    <div className="mt-6">
      <label className="block text-sm font-medium mb-2">Data Processing</label>

      <div className="flex items-center justify-between bg-[#F1F1F1] rounded-lg p-4 w-full">

        <div className="text-sm font-semibold text-black">{fileName}</div>

        <div className="flex items-center gap-12">

          {/* Step 1 — Completed */}
          <div className="flex flex-col items-center text-gray-600">
            <CheckCircleIcon className="text-gray-500" />
            <span className="text-xs mt-1">Table Extraction</span>
          </div>

          {/* Step 2 — Completed */}
          <div className="flex flex-col items-center text-gray-600">
            <CheckCircleIcon className="text-gray-500" />
            <span className="text-xs mt-1">Column Extraction</span>
          </div>

          {/* Step 3 — Pending */}
          <div className="flex flex-col items-center text-gray-600">
            <RadioButtonUncheckedIcon className="text-gray-500" />
            <span className="text-xs mt-1">Data Mapping</span>
          </div>
        </div>

        <ArrowForwardIosIcon className="text-gray-600" />
      </div>
    </div>
  );
}
