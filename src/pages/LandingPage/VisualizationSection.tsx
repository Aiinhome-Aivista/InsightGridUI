import previewImage from "../../assets/Dashboard_preview.svg";

export default function VisualizationSection() {
  return (
    <section className="w-full min-h-screen bg-[#256CC9] py-32 relative overflow-hidden">

      {/* Right blurred dashboard */}
      <img
        src={previewImage}
        alt="visual-preview"
        className="
          absolute right-8 bottom-40 w-[680px] opacity-80 rounded-3xl
          translate-y-10 
        "
        style={{
          maskImage: "linear-gradient(to left, black 60%, transparent 100%)",
        }}
      />

      {/* Content Container */}
      <div className="max-w-[1350px] mx-auto flex items-center pl-10">
        {/* Left Text Column */}
        <div className="w-[55%] text-white">

          <h2 className="text-[46px] font-semibold leading-tight tracking-tight">
            Build beautiful <br /> visualizations instantly.
          </h2>

          {/* Underline highlight */}
          <div className="mt-4 w-16 h-[8px] rounded-full bg-white/95" />

          <p className="mt-10 text-white/85 text-[16px] leading-[29px] pr-10">
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
