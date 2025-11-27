import ChartCard from "./chart-card";
import PieChartGraph from "./pie-chart-graph";
import WaterfallChartGraph from "./waterfall-chart-graph";

interface RenderChartsProps {
    selectedCharts: string[];
    onRemoveChart: (chartType: string) => void;
}

export default function RenderCharts({ selectedCharts, onRemoveChart }: RenderChartsProps) {
    const renderChart = (chartType: string) => {
        switch (chartType) {
            case 'pie':
                return (
                    <ChartCard
                        key={chartType}
                        title="Product Details"
                        description="This table is showing all product details"
                        onRemove={() => onRemoveChart(chartType)}
                    >
                        <PieChartGraph />
                    </ChartCard>
                );
            case 'waterfall':
                return (
                    <ChartCard
                        key={chartType}
                        title="Waterfall Analysis"
                        description="Financial performance breakdown with cumulative impact"
                        onRemove={() => onRemoveChart(chartType)}
                    >
                        <WaterfallChartGraph />
                    </ChartCard>
                );


            default:
                return null;
        }
    };

    return (
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {selectedCharts.map(chartType => renderChart(chartType))}
        </div>
    );
}