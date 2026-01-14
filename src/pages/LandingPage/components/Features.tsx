import { useNavigate } from "react-router-dom";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import MenuIcon from "@mui/icons-material/Menu";
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CableIcon from '@mui/icons-material/Cable';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import SecurityIcon from '@mui/icons-material/Security';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import BoltIcon from '@mui/icons-material/Bolt';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CodeIcon from '@mui/icons-material/Code';

export default function Features() {
  const navigate = useNavigate();

  const detailedFeatures = [
    {
      title: "Universal Data Connectors",
      subtitle: "Bring your data home",
      description: "Stop wrestling with CSV imports. Connect directly to your PostgreSQL, MySQL, or MongoDB databases. We also support live syncing with Google Sheets and Excel Online.",
      icon: <CableIcon className="text-4xl text-[#137fec]" />,
      imageVisual: (
        <div className="w-full h-full bg-slate-100 dark:bg-slate-900 rounded-lg p-6 relative overflow-hidden flex flex-col gap-3 border border-slate-200 dark:border-slate-700">
           {/* Abstract Connector UI */}
           <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded shadow-sm">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">PSQL</div>
                 <span className="text-sm font-bold dark:text-white">Production DB</span>
              </div>
              <div className="text-xs text-green-500 font-bold flex items-center gap-1">● Connected</div>
           </div>
           <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded shadow-sm opacity-60">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs">XL</div>
                 <span className="text-sm font-bold dark:text-white">Sales Q4.xlsx</span>
              </div>
              <div className="text-xs text-slate-400 font-bold flex items-center gap-1">Syncing...</div>
           </div>
           <CableIcon className="absolute -bottom-4 -right-4 text-9xl text-slate-200 dark:text-slate-800 opacity-20" />
        </div>
      )
    },
    {
      title: "Drag & Drop Builder",
      subtitle: "Visualizations made simple",
      description: "You don't need to know SQL to build professional dashboards. Our intuitive drag-and-drop interface lets you create bar charts, line graphs, and pivot tables in seconds.",
      icon: <DashboardCustomizeIcon className="text-4xl text-[#137fec]" />,
      imageVisual: (
        <div className="w-full h-full bg-slate-100 dark:bg-slate-900 rounded-lg p-4 relative overflow-hidden border border-slate-200 dark:border-slate-700 flex gap-4">
           {/* Sidebar */}
           <div className="w-16 bg-white dark:bg-slate-800 rounded h-full flex flex-col items-center py-4 gap-3 shadow-sm">
              <div className="w-8 h-8 rounded bg-blue-50 dark:bg-slate-700"></div>
              <div className="w-8 h-8 rounded bg-blue-50 dark:bg-slate-700"></div>
              <div className="w-8 h-8 rounded bg-[#137fec] shadow-lg shadow-blue-500/30"></div>
           </div>
           {/* Canvas */}
           <div className="flex-1 bg-white dark:bg-slate-800 rounded h-full p-4 shadow-sm border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center">
              <div className="text-slate-400 text-sm font-medium">Drop Chart Here</div>
           </div>
        </div>
      )
    },
    {
      title: "Sahaj AI Analyst",
      subtitle: "Insights without the effort",
      description: "Ask questions in plain English like 'Show me revenue by region for last month' and watch as Sahaj AI generates the chart and highlights the anomalies for you automatically.",
      icon: <AutoFixHighIcon className="text-4xl text-[#137fec]" />,
      imageVisual: (
        <div className="w-full h-full bg-gradient-to-br from-[#137fec] to-purple-600 rounded-lg p-1 relative overflow-hidden shadow-xl">
           <div className="bg-white dark:bg-[#101922] w-full h-full rounded flex flex-col p-6">
              <div className="flex items-center gap-2 mb-4">
                 <AutoFixHighIcon className="text-[#137fec]" />
                 <span className="text-sm font-bold text-slate-500">Sahaj AI</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg rounded-tl-none mb-4 text-sm text-slate-600 dark:text-slate-300">
                 Based on your data, revenue dropped 15% in the East region due to lower inventory levels.
              </div>
              <div className="mt-auto h-2 bg-slate-100 dark:bg-slate-800 rounded overflow-hidden">
                 <div className="h-full w-2/3 bg-gradient-to-r from-[#137fec] to-purple-500 animate-pulse"></div>
              </div>
           </div>
        </div>
      )
    }
  ];

  const gridFeatures = [
    { title: "Team Collaboration", desc: "Comment directly on charts and @mention colleagues.", icon: <GroupAddIcon /> },
    { title: "Enterprise Security", desc: "SOC2 Type II compliant with Role-Based Access Control.", icon: <SecurityIcon /> },
    { title: "Real-time Updates", desc: "Set refresh intervals down to the minute.", icon: <BoltIcon /> },
    { title: "Export Anywhere", desc: "Download as PDF, PNG, or raw CSV data.", icon: <CloudDownloadIcon /> },
    { title: "Embedded Analytics", desc: "Embed dashboards into your own product via iframe.", icon: <CodeIcon /> },
    { title: "Mobile Ready", desc: "Dashboards that adapt to any screen size automatically.", icon: <DashboardCustomizeIcon /> },
  ];

  return (
    <div className="bg-[#f6f7f8] dark:bg-[#101922] font-sans text-slate-900 dark:text-white overflow-x-hidden min-h-screen flex flex-col">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 w-full border-b border-[#e7edf3] dark:border-slate-800 bg-white/80 dark:bg-[#101922]/90 backdrop-blur-md">
        <div className="px-4 md:px-10 lg:px-40 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/")}>
            <div className="size-8 text-[#137fec] flex items-center justify-center rounded-lg bg-[#137fec]/10">
              <AnalyticsIcon className="text-2xl" />
            </div>
            <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">SahajInsights</h2>
          </div>
          <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
            <nav className="flex items-center gap-8">
              <a onClick={() => navigate("/features")} className="text-[#137fec] text-sm font-bold transition-colors cursor-pointer">Features</a>
              <a onClick={() => navigate("/pricing")} className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-[#137fec] transition-colors cursor-pointer">Pricing</a>
              <a onClick={() => navigate("/resources")} className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-[#137fec] transition-colors cursor-pointer">Resources</a>
            </nav>
            <div className="flex gap-3">
               <button onClick={() => navigate("/login")} className="rounded-lg h-10 px-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Log in</button>
               <button onClick={() => navigate("/signup")} className="rounded-lg h-10 px-4 bg-[#137fec] text-white text-sm font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-[#137fec]/20">Start for free</button>
            </div>
          </div>
          <button className="md:hidden text-slate-900 dark:text-white"><MenuIcon /></button>
        </div>
      </header>

      <main className="flex-grow">
        
        {/* Hero Section */}
        <section className="pt-20 pb-20 px-4 md:px-10 lg:px-40 text-center bg-white dark:bg-[#101922]">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#137fec]/10 text-[#137fec] text-xs font-bold uppercase tracking-wide mb-6">
               <BoltIcon fontSize="small" />
               <span>Power meets Simplicity</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
               Everything you need to <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#137fec] to-blue-400">master your data.</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
               SahajInsights isn't just a visualization tool. It's a complete data operating system designed to take you from raw input to actionable intelligence in minutes.
            </p>
          </div>
        </section>

        {/* Detailed Features (Zig-Zag Layout) */}
        <section className="py-20 px-4 md:px-10 lg:px-40 bg-[#f6f7f8] dark:bg-[#0d141b]">
           <div className="max-w-[1200px] mx-auto space-y-24">
              {detailedFeatures.map((feature, idx) => (
                 <div key={idx} className={`flex flex-col lg:flex-row gap-12 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                    
                    {/* Text Content */}
                    <div className="flex-1 space-y-6">
                       <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center">
                          {feature.icon}
                       </div>
                       <div>
                          <h3 className="text-[#137fec] font-bold uppercase tracking-wide text-sm mb-2">{feature.subtitle}</h3>
                          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">{feature.title}</h2>
                          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                             {feature.description}
                          </p>
                       </div>
                       <button className="text-[#137fec] font-bold hover:underline flex items-center gap-2">
                          Learn more <span className="text-xl">&rarr;</span>
                       </button>
                    </div>

                    {/* Visual Content */}
                    <div className="flex-1 w-full aspect-[4/3] max-w-lg">
                       <div className="w-full h-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 p-2 border border-slate-200 dark:border-slate-700 transform hover:scale-[1.02] transition-transform duration-500">
                          {feature.imageVisual}
                       </div>
                    </div>

                 </div>
              ))}
           </div>
        </section>

        {/* Feature Grid */}
        <section className="py-24 px-4 md:px-10 lg:px-40 bg-white dark:bg-[#101922]">
           <div className="max-w-[1200px] mx-auto">
              <div className="text-center mb-16">
                 <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">And so much more...</h2>
                 <p className="text-slate-600 dark:text-slate-400">Built for speed, security, and scalability.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {gridFeatures.map((item, idx) => (
                    <div key={idx} className="p-6 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-[#137fec] dark:hover:border-[#137fec] bg-slate-50 dark:bg-slate-900 transition-all duration-300 group">
                       <div className="text-slate-400 group-hover:text-[#137fec] transition-colors mb-4">
                          {item.icon}
                       </div>
                       <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                       <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {item.desc}
                       </p>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-slate-900 dark:bg-slate-950 text-white relative overflow-hidden">
           {/* Abstract Background Elements */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-[#137fec] rounded-full blur-[120px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full blur-[100px] opacity-20 -translate-x-1/2 translate-y-1/2"></div>

           <div className="px-4 md:px-10 lg:px-40 relative z-10 text-center">
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
                 Start analyzing in minutes.
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                 Join 10,000+ analysts who trust SahajInsights to tell their data stories. 
                 No credit card required for the free tier.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <button 
                    onClick={() => navigate("/signup")}
                    className="bg-[#137fec] text-white h-14 px-8 rounded-xl font-bold text-lg hover:bg-blue-600 transition-all shadow-xl shadow-blue-900/20"
                 >
                    Get Started for Free
                 </button>
                 <button 
                    onClick={() => navigate("/pricing")}
                    className="bg-slate-800 text-white h-14 px-8 rounded-xl font-bold text-lg hover:bg-slate-700 transition-all border border-slate-700"
                 >
                    View Pricing
                 </button>
              </div>
           </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
     <footer className="py-12 bg-slate-50 dark:bg-[#0d141b] border-t border-slate-200 dark:border-slate-800">
          <div className="px-4 md:px-10 lg:px-40 flex justify-center">
            <div className="w-full max-w-[960px] flex flex-col md:flex-row justify-between gap-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <AnalyticsIcon className="text-[#137fec]" />
                  <span className="font-bold text-lg">SahajInsights</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
                  Empowering teams to make data-driven decisions without the
                  technical overhead.
                </p>
                <p className="text-slate-400 dark:text-slate-600 text-sm mt-4">© 2026 SahajInsights Inc.</p>
              </div>
              <div className="flex flex-wrap gap-12 md:gap-20">
                <div className="flex flex-col gap-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
                    Product
                  </h4>
                  <a
                    className="text-slate-500 dark:text-slate-400 hover:text-[#137fec] text-sm cursor-pointer"
                    onClick={() => navigate("/features")}
                  >
                    Features
                  </a>
                  <a
                    className="text-slate-500 dark:text-slate-400 hover:text-[#137fec] text-sm cursor-pointer"
                    onClick={() => navigate("/integrations")}
                  >
                    Integrations
                  </a>
                  {/* <a
                    className="text-slate-500 dark:text-slate-400 hover:text-[#137fec] text-sm cursor-pointer"
                    onClick={() => navigate("/pricing")}
                  >
                    Pricing
                  </a> */}
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
                    Company
                  </h4>
                  <a
                    className="text-slate-500 dark:text-slate-400 hover:text-[#137fec] text-sm cursor-pointer"
                    onClick={() => navigate("/about")}
                  >
                    About
                  </a>
                  {/* <a
                    className="text-slate-500 dark:text-slate-400 hover:text-[#137fec] text-sm cursor-pointer"
                    onClick={() => navigate("/blog")}
                  >
                    Blog
                  </a> */}
                  <a
                    className="text-slate-500 dark:text-slate-400 hover:text-[#137fec] text-sm cursor-pointer"
                    onClick={() => navigate("/careers")}
                  >
                    Careers
                  </a>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
                    Support
                  </h4>
                  {/* <a
                    className="text-slate-500 dark:text-slate-400 hover:text-[#137fec] text-sm cursor-pointer"
                    onClick={() => navigate("/help-center")}
                  >
                    Help Center
                  </a> */}
                  <a
                    className="text-slate-500 dark:text-slate-400 hover:text-[#137fec] text-sm cursor-pointer"
                    onClick={() => navigate("/privacy-policy")}
                  >
                    Privacy Policy
                  </a>
                  <a
                    className="text-slate-500 dark:text-slate-400 hover:text-[#137fec] text-sm cursor-pointer"
                    onClick={() => navigate("/terms-of-service")}
                  >
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
    </div>
  );
}