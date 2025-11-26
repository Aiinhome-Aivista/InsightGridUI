import previewImage from "../../assets/Dashboard_preview.svg"; 

export default function VisualizationSection() {
  return (
    <section className="w-full bg-[#1F63CE] py-28 relative overflow-hidden">

      {/* Right blurred dashboard */}
      <img
        src={previewImage}
        alt="visual-preview"
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[750px] opacity-60 blur-[1px] rounded-3xl"
      />

      {/* Content Container */}
      <div className="max-w-[1250px] mx-auto flex items-center">
        {/* Left Text Column */}
        <div className="w-[50%] text-white">

          <h2 className="text-4xl font-semibold leading-snug">
            Build beautiful <br /> visualizations instantly.
          </h2>

          {/* Underline Highlight */}
          <div className="mt-3 w-16 h-2 rounded-full bg-white/90" />

          <p className="mt-8 text-white/90 text-[16px] leading-relaxed">
            From any column, simply click Insight to view smart, data-aware
            graph suggestions—text columns automatically offer bar charts, pie
            charts, column charts, and tree maps; numeric columns suggest
            histograms, scatter plots, box plots, and KPI summaries; and date
            columns present options like line charts, area charts, and calendar
            heatmaps—ensuring your app always recommends the most meaningful
            chart type based on the data.
          </p>
        </div>
      </div>
    </section>
  );
}
