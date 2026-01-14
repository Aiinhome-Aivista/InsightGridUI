import { useNavigate } from "react-router-dom";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';

export default function TermsOfServiceVariant2() {
  const navigate = useNavigate();

  const sections = [
    {
      id: "1",
      title: "Acceptance of Terms",
      content: "By accessing or using Sahajinsights ('the Service'), you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service."
    },
    {
      id: "2",
      title: "Accounts & Registration",
      content: "You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party."
    },
    {
      id: "3",
      title: "Intellectual Property",
      content: "The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property ofSahajinsights and its licensors."
    },
    {
      id: "4",
      title: "Termination",
      content: "We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms."
    },
    {
      id: "5",
      title: "Limitation of Liability",
      content: "In no event shallSahajinsights be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses."
    },
    {
      id: "6",
      title: "Governing Law",
      content: "These Terms shall be governed and construed in accordance with the laws of Delaware, United States, without regard to its conflict of law provisions."
    }
  ];

  return (
    <div className="bg-white dark:bg-[#101922] font-sans text-slate-900 dark:text-white overflow-x-hidden min-h-screen flex flex-col">
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
        <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-20 py-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* LEFT COLUMN: Sticky Info & Nav */}
            <div className="lg:col-span-4 relative">
              <div className="lg:sticky lg:top-32 space-y-8">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                    Terms of <br /><span className="text-[#137fec]">Service</span>
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 font-mono text-sm">
                    Effective Date: January 14, 2026
                  </p>
                </div>
                
                <hr className="border-slate-200 dark:border-slate-800" />

                <nav className="hidden lg:block">
                  <h3 className="uppercase text-xs font-bold text-slate-400 mb-4 tracking-wider">On this page</h3>
                  <ul className="space-y-3">
                    {sections.map((section, idx) => (
                      <li key={section.id}>
                        <a 
                          href={`#section-${section.id}`} 
                          className="group flex items-center gap-3 text-slate-600 dark:text-slate-400 hover:text-[#137fec] transition-colors text-sm font-medium"
                        >
                          <span className="flex items-center justify-center w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 text-xs group-hover:bg-[#137fec] group-hover:text-white transition-colors">
                            {idx + 1}
                          </span>
                          {section.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>

            {/* RIGHT COLUMN: Content */}
            <div className="lg:col-span-8 lg:border-l lg:border-slate-100 lg:dark:border-slate-800 lg:pl-12">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-12">
                  Welcome to Sahajinsights. Please read these terms carefully. By using our services, you agree to be bound by these terms, which establish a contractual relationship between you andSahajinsights Inc.
                </p>

                <div className="space-y-16">
                  {sections.map((section, idx) => (
                    <div key={section.id} id={`section-${section.id}`} className="scroll-mt-32 group">
                      <div className="flex items-baseline gap-4 mb-4">
                        <span className="text-2xl font-black text-slate-200 dark:text-slate-700 group-hover:text-[#137fec]/20 transition-colors">
                          0{idx + 1}
                        </span>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">
                          {section.title}
                        </h2>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 leading-7">
                        {section.content}
                      </p>
                    </div>
                  ))}
                </div>
{/* 
                <div className="mt-20 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Questions regarding legal matters?</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
                    We are happy to answer any questions you have regarding our Terms of Service or Privacy Policy.
                  </p>
                
                </div> */}

              </div>
            </div>
          </div>
        </div>
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