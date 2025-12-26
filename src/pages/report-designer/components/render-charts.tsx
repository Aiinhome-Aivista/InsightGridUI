import ChartCard from "./chart-card";
import BarChartGraph from "./bar-chart-graph";
import PieChartGraph from "./pie-chart-graph";
import type { ChartConfig } from "./ReportDesignerTable";
import MixedChartGraph from "./mixed-chart-graph";
import BubbleChartGraph from "./bubble-chart-graph";
import WaterfallChartGraph from "./waterfall-chart-graph";
import BoxPlotGraph from "./box-plot-graph";

interface RenderChartsProps {
  charts: ChartConfig[];
  onRemoveChart: (id: string) => void;
}

export default function RenderCharts({ charts, onRemoveChart }: RenderChartsProps) {

  const renderChart = (chart: ChartConfig) => {
    switch (chart.type) {

      case "bar":
        return (
          <ChartCard
            key={chart.id}
            title={`Bar Chart: ${chart.xAxis}`}
            description={`Count of ${chart.yAxis}`}
            onRemove={() => onRemoveChart(chart.id)}
          >
            <BarChartGraph config={chart} />
          </ChartCard>
        );

      case "pie":
        return (
          <ChartCard
            key={chart.id}
            title={`Pie Chart: ${chart.xAxis}`}
            description={`Distribution of ${chart.yAxis}`}
            onRemove={() => onRemoveChart(chart.id)}
          >
            <PieChartGraph config={chart} />
          </ChartCard>
        );

      case "kpi":
        return (
          <ChartCard
            key={chart.id}
            title="KPI"
            description={`Count of ${chart.value}`}
            onRemove={() => onRemoveChart(chart.id)}
          >
            <div className="text-4xl font-bold text-center py-12">
              {chart.rows.length}
            </div>
          </ChartCard>
        );

      case "mixed":
        return (
          <ChartCard
            key={chart.id}
            title={`Mixed Chart: ${chart.xAxis}`}
            description={`Multiple metrics`}
            onRemove={() => onRemoveChart(chart.id)}
          >
            <MixedChartGraph config={chart} />
          </ChartCard>
        );

      case "bubble":
        return (
          <ChartCard
            key={chart.id}
            title="Bubble Chart"
            description={`${chart.xAxis} vs ${chart.yAxis}`}
            onRemove={() => onRemoveChart(chart.id)}
          >
            <BubbleChartGraph config={chart} />
          </ChartCard>
        );

      case "waterfall":
        return (
          <ChartCard
            key={chart.id}
            title="Waterfall Chart"
            description={`Change over ${chart.xAxis}`}
            onRemove={() => onRemoveChart(chart.id)}
          >
            <WaterfallChartGraph config={chart} />
          </ChartCard>
        );

      case "box":
        return (
          <ChartCard
            key={chart.id}
            title="Box Plot"
            description={`Distribution of ${chart.value}`}
            onRemove={() => onRemoveChart(chart.id)}
          >
            <BoxPlotGraph config={chart} />
          </ChartCard>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex gap-6 flex-wrap">
      {charts.map(renderChart)}
    </div>
  );
}

