import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import StorageIcon from "@mui/icons-material/Storage";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import TableChartIcon from "@mui/icons-material/TableChart";
import CampaignIcon from "@mui/icons-material/Campaign";
import DeveloperModeIcon from "@mui/icons-material/DeveloperMode";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// Mock Data for Integrations
const integrationsData = [
  { id: 1, name: "PostgreSQL", category: "Database", icon: <StorageIcon fontSize="large" />, desc: "Direct read-only connection to your production DB.", popular: true },
  { id: 2, name: "Google Sheets", category: "Files", icon: <TableChartIcon fontSize="large" />, desc: "Live sync with your spreadsheets in the cloud.", popular: true },
  { id: 3, name: "MySQL", category: "Database", icon: <StorageIcon fontSize="large" />, desc: "Connect local or cloud MySQL instances securely.", popular: false },
  { id: 4, name: "Salesforce", category: "CRM", icon: <CloudQueueIcon fontSize="large" />, desc: "Visualize pipeline health and lead conversion rates.", popular: true },
  { id: 5, name: "Google Analytics 4", category: "Marketing", icon: <CampaignIcon fontSize="large" />, desc: "Pull web traffic and conversion events instantly.", popular: false },
  { id: 6, name: "MongoDB", category: "Database", icon: <StorageIcon fontSize="large" />, desc: "Visualize NoSQL document collections effortlessly.", popular: false },
  { id: 7, name: "Excel Upload", category: "Files", icon: <TableChartIcon fontSize="large" />, desc: "Drag and drop .xlsx files for quick analysis.", popular: false },
  { id: 8, name: "HubSpot", category: "CRM", icon: <CloudQueueIcon fontSize="large" />, desc: "Track marketing campaigns and deal stages.", popular: false },
  { id: 9, name: "Snowflake", category: "Database", icon: <StorageIcon fontSize="large" />, desc: "Enterprise warehousing data at scale.", popular: true },
  { id: 10, name: "GitHub", category: "Developer", icon: <DeveloperModeIcon fontSize="large" />, desc: "Track PR velocity and issue resolution times.", popular: false },
  { id: 11, name: "Stripe", category: "Finance", icon: <CloudQueueIcon fontSize="large" />, desc: "Real-time revenue, MRR, and churn dashboards.", popular: true },
  { id: 12, name: "Shopify", category: "E-commerce", icon: <CloudQueueIcon fontSize="large" />, desc: "Monitor sales, inventory, and cart abandonment.", popular: false },
];

const categories = ["All", "Database", "Files", "CRM", "Marketing", "Developer"];

export default function Integrations() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter Logic
  const filteredIntegrations = integrationsData.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
              <a onClick={() => navigate("/features")} className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-[#137fec] transition-colors cursor-pointer">Features</a>
              <a onClick={() => navigate("/integrations")} className="text-[#137fec] text-sm font-bold transition-colors cursor-pointer">Integrations</a>
              <a onClick={() => navigate("/pricing")} className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-[#137fec] transition-colors cursor-pointer">Pricing</a>
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
        <section className="bg-white dark:bg-[#101922] pt-20 pb-12 px-4 border-b border-slate-100 dark:border-slate-800">
           <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">
                 Connect your favorite <br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#137fec] to-blue-400">tools & databases.</span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
                 SahajInsights plays nice with the stack you already use. Centralize your data in minutes, not months.
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-lg mx-auto mb-12">
                 <input 
                    type="text" 
                    placeholder="Search integrations (e.g., Salesforce, MySQL)..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-14 pl-14 pr-6 rounded-2xl bg-[#f6f7f8] dark:bg-slate-900 border border-transparent focus:border-[#137fec] focus:ring-4 focus:ring-[#137fec]/10 outline-none text-slate-900 dark:text-white text-lg transition-all shadow-inner"
                 />
                 <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-2xl" />
              </div>
           </div>
        </section>

        {/* Integrations Grid Section */}
        <section className="py-12 px-4 md:px-10 lg:px-40 bg-[#f6f7f8] dark:bg-[#0d141b]">
           <div className="max-w-[1200px] mx-auto">
              
              {/* Filter Tabs */}
              <div className="flex flex-wrap justify-center gap-2 mb-12">
                 {categories.map((cat) => (
                    <button
                       key={cat}
                       onClick={() => setActiveCategory(cat)}
                       className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-200
                          ${activeCategory === cat 
                             ? "bg-[#137fec] text-white shadow-lg shadow-blue-500/30" 
                             : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                          }
                       `}
                    >
                       {cat}
                    </button>
                 ))}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredIntegrations.map((item) => (
                    <div key={item.id} className="group bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-[#137fec] dark:hover:border-[#137fec] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden">
                       
                       {/* Popular Badge */}
                       {item.popular && (
                          <div className="absolute top-4 right-4 bg-orange-100 dark:bg-orange-900/30 text-orange-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                             Popular
                          </div>
                       )}

                       <div className="w-14 h-14 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 mb-6 group-hover:text-[#137fec] transition-colors border border-slate-100 dark:border-slate-800">
                          {item.icon}
                       </div>
                       
                       <div className="mb-4">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{item.name}</h3>
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{item.category}</span>
                       </div>
                       
                       <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 min-h-[40px]">
                          {item.desc}
                       </p>

                       <button className="w-full py-2.5 rounded-lg border-2 border-slate-100 dark:border-slate-700 font-bold text-sm text-slate-600 dark:text-slate-300 group-hover:bg-[#137fec] group-hover:border-[#137fec] group-hover:text-white transition-all">
                          Connect
                       </button>
                    </div>
                 ))}
              </div>

              {/* Empty State */}
              {filteredIntegrations.length === 0 && (
                 <div className="text-center py-20">
                    <p className="text-slate-500 text-lg">No integrations found matching "{searchQuery}".</p>
                 </div>
              )}

           </div>
        </section>

        {/* Request Integration CTA */}
        <section className="py-20 bg-white dark:bg-[#101922] border-t border-slate-100 dark:border-slate-800">
           <div className="max-w-3xl mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Don't see what you need?</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
                 We build new connectors every week based on user requests. Tell us what tool you need to visualize.
              </p>
              <button className="inline-flex items-center gap-2 text-[#137fec] font-bold text-lg hover:underline decoration-2 underline-offset-4">
                 Request an Integration <ArrowForwardIcon fontSize="small" />
              </button>
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