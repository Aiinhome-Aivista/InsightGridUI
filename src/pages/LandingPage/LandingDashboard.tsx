import React from "react";

// Import SVG icons
import DragIcon from "../../assets/drag_indicator.svg";
import PinchIcon from "../../assets/pinch_zoom_in.svg";
import ArchiveIcon from "../../assets/archive.svg";
import DownloadIcon from "../../assets/download_2.svg";

export default function LandingDashboard() {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col font-sans text-[#6C6C6C]">
      
      {/* MAIN CONTENT 
          - pt-32 / pb-20: Vertical spacing adjustments
      */}
      <div className="flex-grow flex flex-col justify-center px-8 lg:px-16 pt-32 pb-20">
        
        {/* CENTERED CONTAINER */}
        <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row items-start justify-center gap-20 lg:gap-32">

          {/* --- LEFT: ICON GRID --- 
              (Kept the 'Diamond' layout) 
          */}
          <div className="grid grid-cols-2 gap-6 opacity-80 shrink-0 mt-8">
            {/* Left Col (Lower) */}
            <div className="flex flex-col gap-6 pt-12">
              <div className="w-24 h-24 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] rounded-2xl flex items-center justify-center hover:-translate-y-1 transition-transform">
                <img src={PinchIcon} alt="Pinch" className="w-9 opacity-60" />
              </div>
              <div className="w-24 h-24 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] rounded-2xl flex items-center justify-center hover:-translate-y-1 transition-transform">
                <img src={DownloadIcon} alt="Download" className="w-8 opacity-60" />
              </div>
            </div>

            {/* Right Col (Higher) */}
            <div className="flex flex-col gap-6">
              <div className="w-24 h-24 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] rounded-2xl flex items-center justify-center hover:-translate-y-1 transition-transform">
                <img src={DragIcon} alt="Drag" className="w-8 opacity-60" />
              </div>
              <div className="w-24 h-24 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] rounded-2xl flex items-center justify-center hover:-translate-y-1 transition-transform">
                <img src={ArchiveIcon} alt="Archive" className="w-7 opacity-60" />
              </div>
            </div>
          </div>

          {/* --- RIGHT: TEXT CONTENT --- */}
          <div className="max-w-2xl flex flex-col pt-4">
            
            {/* TITLE ROW */}
            <div className="flex items-center gap-6 mb-5">
              {/* Grey Dash */}
              <span className="shrink-0 w-10 h-[6px] bg-gray-300 rounded-full"></span>
              {/* Bold Title */}
              <h2 className="text-3xl lg:text-[32px] font-bold text-gray-500 tracking-tight leading-tight">
                Create Your Own Dynamic Dashboard
              </h2>
            </div>

            {/* PARAGRAPH ROW 
                - pl-28 lg:pl-32: Indents the text to start under the word "Own"
                - pr-8: Ensures the text block doesn't hit the far right edge
            */}
            <div className="pl-6 lg:pl-32 pr-4 lg:pr-12">
              <p className="text-[#9CA3AF] text-[15px] leading-8 font-normal text-left">
                Build powerful, personalized dashboards by mixing and matching charts, tables, 
                and metrics. Easily resize elements, drag and drop components, save multiple 
                custom views, and export or share your insights with others. Ideal for business 
                analytics, inventory tracking, sales insights, marketing performance, and 
                operational monitoring.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-full border-t border-gray-100 py-14 px-8 lg:px-24">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-gray-400 text-sm mb-12 font-medium">
            <div className="flex flex-col gap-4">
              <a href="#" className="hover:text-gray-600 transition-colors">About Us</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Features</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Pricing</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Documentation</a>
            </div>
            <div className="flex flex-col gap-4">
              <a href="#" className="hover:text-gray-600 transition-colors">Support</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Terms & Conditions</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Contact</a>
            </div>
            <div className="flex flex-col gap-4">
              <a href="#" className="hover:text-gray-600 transition-colors">Contact</a>
              <a href="#" className="hover:text-gray-600 transition-colors">FAQ</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Blog</a>
            </div>
          </div>
          
          <p className="text-gray-300 text-xs">
            ©2020 Aiihome Technologies Pvt. Ltd. All rights reserved
          </p>
        </div>
      </footer>

    </div>
  );
}