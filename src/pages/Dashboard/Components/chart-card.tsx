
import AnimatedToggleButton from '../../../Modal/components/animated-toggle-button';
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import BarChartIcon from "@mui/icons-material/BarChart";

// ==================== TYPES ====================
interface ChartCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onRemove?: () => void;
}

// ==================== GLOBAL REUSABLE CHART CARD ====================
export default function ChartCard({ title, description, children, onRemove }: ChartCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 w-full max-w-md max-h-[350px] flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        <div className="flex gap-2">
          <AnimatedToggleButton
            options={[
              { icon: <GridViewRoundedIcon />, value: 'opt1' },
              { icon: <BarChartIcon />, value: 'opt2' }
            ]}

            width="auto"
            height="auto"
            buttonPadding="0.2rem 0.3rem"
            backgroundColor="#f3f4f6"
            activeBackgroundColor="#ffffff"
            textColor="#6b7280"
            activeTextColor="#111827"
            iconSize="0.6rem"
            iconPosition="left"
            mode="icon" // 'icon' | 'text' | 'both'
          />

        </div>
      </div>
      {children}
    </div>
  );
}