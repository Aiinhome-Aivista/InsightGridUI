// import { useNavigate } from "react-router-dom";
// import ConstructionIcon from '@mui/icons-material/Construction';

// export default function Pricing() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6f7f8] dark:bg-[#101922] text-slate-900 dark:text-white p-4">
//       <ConstructionIcon style={{ fontSize: 80 }} className="text-[#7CA1F3] mb-6" />
//       <h1 className="text-4xl font-bold mb-4 text-center">Under Development</h1>
//       <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 text-center max-w-md">
//         We are working hard to bring you this feature. Please check back later!
//       </p>
//       <button
//         onClick={() => navigate("/")}
//         className="px-6 py-3 bg-[#7CA1F3] text-white rounded-lg font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-[#137fec]/20"
//       >
//         Back to Home
//       </button>
//     </div>
//   );
// } 

import { useNavigate } from "react-router-dom";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import MenuIcon from "@mui/icons-material/Menu";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CreditCardOffIcon from "@mui/icons-material/CreditCardOff";

export default function Pricing() {
  const navigate = useNavigate();

  const tiers = [
    {
      name: "Starter",
      price: "$0",
      desc: "Perfect for individuals exploring data.",
      features: ["1 User", "5 Data Sources", "Basic Charts", "7-day Data Retention"],
      cta: "Start for Free",
      highlight: true,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/mo",
      desc: "For analysts and small teams needing power.",
      features: ["5 Users", "Unlimited Sources", "AI Insights (Beta)", "Export to PDF/PNG", "Priority Support"],
      cta: "Get Started",
      highlight: false,
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "Scalable solutions for large organizations.",
      features: ["Unlimited Users", "SSO & Advanced Security", "Dedicated Success Manager", "On-premise Deployment", "Custom API Access"],
      cta: "Contact Sales",
      highlight: false,
    },
  ];

  return (
    <div className="bg-[#f6f7f8] dark:bg-[#101922] font-sans text-slate-900 dark:text-white overflow-x-hidden min-h-full flex flex-col">
      <header className="fixed top-0 z-50 w-full border-b border-[#e7edf3] dark:border-slate-800 bg-white/80 dark:bg-[#101922]/90 backdrop-blur-md">
             <div className="px-4 md:px-10 lg:px-40 py-3 flex items-center justify-between">
               <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/")}>
                 <div className="size-8 text-[#137fec] flex items-center justify-center rounded-lg bg-[#137fec]/10">
                   <AnalyticsIcon className="text-2xl" />
                 </div>
                 <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">SahajInsights</h2>
               </div>
               <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
                 <nav className="flex items-center gap-8">
                   <a onClick={() => navigate("/resources")} className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-[#137fec] transition-colors cursor-pointer">Resources</a>
                   <a onClick={() => navigate("/pricing")} className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-[#137fec] transition-colors cursor-pointer">Pricing</a>
                   <a onClick={() => navigate("/faq")} className="text-[#137fec] text-sm font-bold transition-colors cursor-pointer">FAQ</a>
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
        {/* Pricing Hero */}
        <section className="py-10 px-4 md:px-10 lg:px-40 text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-6">
            Simple, transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#137fec] to-blue-400">pricing</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Start for free, upgrade as you grow. No hidden fees or surprise charges.
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="pb-24 px-4 md:px-10 lg:px-40 flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1200px] w-full items-start">
            {tiers.map((tier, index) => (
              <div 
                key={index}
                className={`relative bg-white dark:bg-slate-800 rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-1
                  ${tier.highlight 
                    ? "border-[#137fec] shadow-2xl shadow-[#137fec]/10 ring-1 ring-[#137fec] z-10 scale-105" 
                    : "border-slate-200 dark:border-slate-700 shadow-xl"
                  }`}
              >
                {tier.highlight && (
                   <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#137fec] text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                     Most Popular
                   </div>
                )}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">{tier.price}</span>
                  {tier.period && <span className="text-slate-500 font-medium">{tier.period}</span>}
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 min-h-[40px]">{tier.desc}</p>
                
                <button 
                  onClick={() => tier.name === "Starter" && navigate("/login")}
                  className={`w-full h-12 rounded-lg font-bold text-sm mb-8 transition-colors
                  ${tier.highlight 
                    ? "bg-[#137fec] text-white hover:bg-blue-600 shadow-lg shadow-[#137fec]/20" 
                    : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}>
                  {tier.cta}
                </button>

                <ul className="space-y-4">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircleIcon className={`text-lg ${tier.highlight ? "text-[#137fec]" : "text-slate-400"}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
                    Company
                  </h4>
                  <a
                    className="text-slate-500 dark:text-slate-400 hover:text-[#137fec] text-sm cursor-pointer"
                    onClick={() => navigate("/about")}
                  >
                    About
                  </a>
                  <a
                    className="text-slate-500 dark:text-slate-400 hover:text-[#137fec] text-sm cursor-pointer"
                    onClick={() => navigate("/contact")}
                  >
                    Contact us
                  </a>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
                    Support
                  </h4>
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