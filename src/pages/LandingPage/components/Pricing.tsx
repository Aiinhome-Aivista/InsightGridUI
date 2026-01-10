import { useNavigate } from "react-router-dom";
import ConstructionIcon from '@mui/icons-material/Construction';

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6f7f8] dark:bg-[#101922] text-slate-900 dark:text-white p-4">
      <ConstructionIcon style={{ fontSize: 80 }} className="text-[#137fec] mb-6" />
      <h1 className="text-4xl font-bold mb-4 text-center">Under Development</h1>
      <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 text-center max-w-md">
        We are working hard to bring you this feature. Please check back later!
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-[#137fec] text-white rounded-lg font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-[#137fec]/20"
      >
        Back to Home
      </button>
    </div>
  );
}