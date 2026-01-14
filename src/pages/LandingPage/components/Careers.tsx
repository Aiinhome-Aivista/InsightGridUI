import { useNavigate } from "react-router-dom";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import MenuIcon from "@mui/icons-material/Menu";
import WorkIcon from '@mui/icons-material/Work';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import PublicIcon from '@mui/icons-material/Public';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PaidIcon from '@mui/icons-material/Paid';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlaceIcon from '@mui/icons-material/Place';

// Mock Data for Jobs
const jobs = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Remote (Global)",
    type: "Full-time",
    tags: ["React", "TypeScript", "D3.js"],
  },
  {
    id: 2,
    title: "Backend Platform Lead",
    department: "Engineering",
    location: "Remote (Americas/EMEA)",
    type: "Full-time",
    tags: ["Node.js", "PostgreSQL", "Redis"],
  },
  {
    id: 3,
    title: "Product Designer",
    department: "Design",
    location: "Remote (Global)",
    type: "Full-time",
    tags: ["Figma", "UI/UX", "System Design"],
  },
  {
    id: 4,
    title: "Account Executive (SaaS)",
    department: "Sales",
    location: "Remote (North America)",
    type: "Full-time",
    tags: ["B2B", "Closing", "Outbound"],
  },
  {
    id: 5,
    title: "Developer Advocate",
    department: "Marketing",
    location: "Remote (Global)",
    type: "Full-time",
    tags: ["Content", "Community", "Events"],
  },
];

const benefits = [
  { icon: <PublicIcon />, title: "Remote-First", desc: "Work from anywhere. We rely on async communication." },
  { icon: <PaidIcon />, title: "Top-Tier Salary & Equity", desc: "We pay above market rates and offer generous stock options." },
  { icon: <FavoriteIcon />, title: "Comprehensive Health", desc: "100% covered medical, dental, and vision for you and dependents." },
  { icon: <LaptopMacIcon />, title: "Home Office Budget", desc: "$2,000 stipend to set up your perfect workspace." },
];

export default function Careers() {
  const navigate = useNavigate();

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
              <a onClick={() => navigate("/careers")} className="text-[#137fec] text-sm font-bold transition-colors cursor-pointer">Careers</a>
              <a onClick={() => navigate("/pricing")} className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-[#137fec] transition-colors cursor-pointer">Pricing</a>
            </nav>
            <div className="flex gap-3">
               <button onClick={() => navigate("/login")} className="rounded-lg h-10 px-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Log in</button>
               <button onClick={() => navigate("/signup")} className="rounded-lg h-10 px-4 bg-[#137fec] text-white text-sm font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-[#137fec]/20">View Roles</button>
            </div>
          </div>
          <button className="md:hidden text-slate-900 dark:text-white"><MenuIcon /></button>
        </div>
      </header>

      <main className="flex-grow">
        
        {/* Hero Section */}
        <section className="pt-20 pb-20 px-4 md:px-10 lg:px-40 bg-white dark:bg-[#101922] text-center border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-4xl mx-auto">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#137fec]/10 text-[#137fec] text-xs font-bold uppercase tracking-wide mb-6">
               <WorkIcon fontSize="small" />
               <span>We are hiring</span>
             </div>
             <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
               Build the future of <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#137fec] to-blue-400">data intelligence.</span>
             </h1>
             <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
               Join a team of curious builders, designers, and problem solvers. We're on a mission to make data accessible to every human on the planet.
             </p>
             <button className="bg-[#137fec] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20">
               View Open Positions
             </button>
          </div>
        </section>

        {/* Culture / Benefits Section */}
        <section className="py-20 px-4 md:px-10 lg:px-40 bg-[#f6f7f8] dark:bg-[#0d141b]">
           <div className="max-w-[1200px] mx-auto">
              <div className="mb-12">
                 <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Why SahajInsights?</h2>
                 <p className="text-slate-600 dark:text-slate-400 max-w-xl">We believe that happy people build the best software. We invest heavily in your wellbeing and growth.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {benefits.map((item, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                       <div className="w-12 h-12 bg-blue-50 dark:bg-slate-900 rounded-xl flex items-center justify-center text-[#137fec] mb-4">
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

        {/* Job Listings Section */}
        <section className="py-20 px-4 md:px-10 lg:px-40 bg-white dark:bg-[#101922]">
           <div className="max-w-[1000px] mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Open Positions</h2>
              
              <div className="space-y-4">
                 {jobs.map((job) => (
                    <div key={job.id} className="group bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-6 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:border-[#137fec] dark:hover:border-[#137fec]">
                       
                       <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#137fec] transition-colors">{job.title}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                             <span className="flex items-center gap-1"><WorkIcon style={{fontSize: 16}}/> {job.department}</span>
                             <span className="flex items-center gap-1"><PlaceIcon style={{fontSize: 16}}/> {job.location}</span>
                             <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">{job.type}</span>
                          </div>
                       </div>

                       <div className="flex items-center gap-4">
                          <div className="hidden md:flex gap-2">
                             {job.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs font-medium border border-slate-200 dark:border-slate-700">
                                   {tag}
                                </span>
                             ))}
                          </div>
                          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 group-hover:bg-[#137fec] group-hover:text-white group-hover:border-[#137fec] transition-all">
                             <ArrowForwardIcon />
                          </div>
                       </div>

                    </div>
                 ))}
              </div>

              {/* General Application */}
              <div className="mt-12 p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Don't see a perfect fit?</h3>
                 <p className="text-slate-600 dark:text-slate-400 mb-6">
                    We are always looking for exceptional talent. If you think you can help us, we want to hear from you.
                 </p>
                 <button className="text-[#137fec] font-bold hover:underline">Send us an open application &rarr;</button>
              </div>

           </div>
        </section>

      </main>

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