import { useNavigate } from "react-router-dom";
import ConstructionIcon from '@mui/icons-material/Construction';

export default function Resources() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6f7f8] dark:bg-[#101922] text-slate-900 dark:text-white p-4">
      <ConstructionIcon style={{ fontSize: 80 }} className="text-[#7CA1F3] mb-6" />
      <h1 className="text-4xl font-bold mb-4 text-center">Under Development</h1>
      <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 text-center max-w-md">
        We are working hard to bring you this feature. Please check back later!
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-[#7CA1F3] text-white rounded-lg font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-[#137fec]/20"
      >
        Back to Home
      </button>
    </div>
  );
} 


// import { useNavigate } from "react-router-dom";
// import AnalyticsIcon from "@mui/icons-material/Analytics";
// import MenuIcon from "@mui/icons-material/Menu";
// import ArticleIcon from '@mui/icons-material/Article';
// import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
// import DownloadIcon from '@mui/icons-material/Download';

// export default function Resources() {
//   const navigate = useNavigate();

//   const resources = [
//     {
//       category: "Guide",
//       title: "The Ultimate Guide to Data Cleaning",
//       excerpt: "Learn the 5-step process to prepare your raw CSVs for flawless visualization.",
//       icon: <ArticleIcon />,
//       color: "bg-blue-100 text-blue-600"
//     },
//     {
//       category: "Video",
//       title: "Building Dashboards in Under 5 Minutes",
//       excerpt: "Watch how a senior analyst sets up a full KPI board using InsightGrid.",
//       icon: <PlayCircleOutlineIcon />,
//       color: "bg-purple-100 text-purple-600"
//     },
//     {
//       category: "Whitepaper",
//       title: "State of Data Analytics 2026",
//       excerpt: "Industry trends, salary benchmarks, and tool adoption rates for this year.",
//       icon: <DownloadIcon />,
//       color: "bg-green-100 text-green-600"
//     },
//     {
//       category: "Tutorial",
//       title: "Connecting PostgreSQL Databases",
//       excerpt: "A technical deep-dive into secure connections and query optimization.",
//       icon: <ArticleIcon />,
//       color: "bg-orange-100 text-orange-600"
//     },
//     {
//       category: "Case Study",
//       title: "How TechCorp Saved 20h/Week",
//       excerpt: "See how automating weekly reports changed their workflow forever.",
//       icon: <ArticleIcon />,
//       color: "bg-blue-100 text-blue-600"
//     },
//     {
//       category: "Template",
//       title: "Marketing ROI Dashboard Kit",
//       excerpt: "Download this pre-built template to track ad spend vs conversion.",
//       icon: <DownloadIcon />,
//       color: "bg-pink-100 text-pink-600"
//     },
//   ];

//   return (
//     <div className="bg-[#f6f7f8] dark:bg-[#101922] font-sans text-slate-900 dark:text-white overflow-x-hidden min-h-screen flex flex-col">
//        {/* --- HEADER --- */}
//        <header className="sticky top-0 z-50 w-full border-b border-[#e7edf3] dark:border-slate-800 bg-white/80 dark:bg-[#101922]/90 backdrop-blur-md">
//         <div className="px-4 md:px-10 lg:px-40 py-3 flex items-center justify-between">
//           <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/")}>
//             <div className="size-8 text-[#137fec] flex items-center justify-center rounded-lg bg-[#137fec]/10">
//               <AnalyticsIcon className="text-2xl" />
//             </div>
//             <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">InsightGrid</h2>
//           </div>
//           <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
//             <nav className="flex items-center gap-8">
//               <a onClick={() => navigate("/resources")} className="text-[#137fec] text-sm font-bold transition-colors cursor-pointer">Resources</a>
//               <a onClick={() => navigate("/pricing")} className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-[#137fec] transition-colors cursor-pointer">Pricing</a>
//               <a onClick={() => navigate("/faq")} className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-[#137fec] transition-colors cursor-pointer">FAQ</a>
//             </nav>
//             <div className="flex gap-3">
//                <button onClick={() => navigate("/login")} className="rounded-lg h-10 px-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Log in</button>
//                <button onClick={() => navigate("/signup")} className="rounded-lg h-10 px-4 bg-[#137fec] text-white text-sm font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-[#137fec]/20">Start for free</button>
//             </div>
//           </div>
//           <button className="md:hidden text-slate-900 dark:text-white"><MenuIcon /></button>
//         </div>
//       </header>

//       <main className="flex-grow px-4 md:px-10 lg:px-40 py-16">
//         <div className="w-full max-w-[1200px] mx-auto">
//             {/* Hero */}
//             <div className="text-center max-w-2xl mx-auto mb-16">
//                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#137fec]/10 text-[#137fec] text-xs font-bold uppercase tracking-wide mb-4">
//                    <span>Library</span>
//                 </div>
//                 <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
//                     Learn to master your <span className="text-[#137fec]">data</span>
//                 </h1>
//                 <p className="text-lg text-slate-600 dark:text-slate-400">
//                     Tutorials, guides, and whitepapers to help you build better dashboards and make faster decisions.
//                 </p>
//             </div>

//             {/* Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {resources.map((item, idx) => (
//                     <div key={idx} className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer">
//                         <div className="h-48 bg-slate-100 dark:bg-slate-900 relative overflow-hidden">
//                              {/* Placeholder pattern for image */}
//                             <div className="absolute inset-0 bg-gradient-to-tr from-slate-200/50 to-transparent dark:from-slate-800/50"></div>
//                             <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
//                                 <AnalyticsIcon style={{ fontSize: 100 }} />
//                             </div>
//                             <div className="absolute top-4 left-4">
//                                 <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${item.color}`}>
//                                     {item.icon} <span className="ml-1">{item.category}</span>
//                                 </span>
//                             </div>
//                         </div>
//                         <div className="p-6 flex flex-col flex-grow">
//                             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#137fec] transition-colors">
//                                 {item.title}
//                             </h3>
//                             <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 flex-grow">
//                                 {item.excerpt}
//                             </p>
//                             <div className="flex items-center text-[#137fec] font-bold text-sm">
//                                 Read more &rarr;
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//       </main>

//       {/* --- FOOTER --- */}
//       <footer className="py-12 bg-slate-50 dark:bg-[#0d141b] border-t border-slate-200 dark:border-slate-800">
//          <div className="px-4 md:px-10 lg:px-40 text-center md:text-left">
//             <p className="text-slate-400 dark:text-slate-600 text-sm">© 2026 InsightGrid Inc.</p>
//          </div>
//       </footer>
//     </div>
//   );
// }