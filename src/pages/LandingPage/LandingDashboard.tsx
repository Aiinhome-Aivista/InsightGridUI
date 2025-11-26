import React from "react";
import { FiMaximize2, FiGrid, FiDownload, FiUpload } from "react-icons/fi";

export default function LandingDashboard() {
  return (
    <div className="w-full bg-white flex flex-col">

      {/* MAIN SECTION */}
      <div className="w-full min-h-screen flex justify-center items-center px-24">
        <div className="flex items-start gap-32">

          {/* LEFT ICON STACK */}
          <div className="grid grid-cols-2 gap-6">
            <div className="w-24 h-24 bg-white shadow-md rounded-xl flex items-center justify-center">
              <FiMaximize2 className="text-[#8D8D8D] text-xl" />
            </div>
            <div className="w-24 h-24 bg-white shadow-md rounded-xl flex items-center justify-center">
              <FiGrid className="text-[#8D8D8D] text-xl" />
            </div>
            <div className="w-24 h-24 bg-white shadow-md rounded-xl flex items-center justify-center">
              <FiUpload className="text-[#8D8D8D] text-xl" />
            </div>
            <div className="w-24 h-24 bg-white shadow-md rounded-xl flex items-center justify-center">
              <FiDownload className="text-[#8D8D8D] text-xl" />
            </div>
          </div>

          {/* TITLE + DESCRIPTION */}
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-4">
              <span className="inline-block w-10 h-[6px] bg-gray-400 rounded-full"></span>
              <h2 className="text-[28px] font-semibold text-[#6C6C6C]">
                Create Your Own Dynamic Dashboard
              </h2>
            </div>

            <p className="text-[#8E8E8E] text-[15px] leading-7">
              Build powerful, personalized dashboards by mixing and matching
              charts, tables, and metrics. Easily resize elements, drag and drop
              components, save multiple custom views, and export or share your
              insights with others. Ideal for business analytics, inventory
              tracking, sales insights, marketing performance, and operational
              monitoring.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-full border-t py-10 px-20 grid grid-cols-3 text-[#8E8E8E] text-sm">
        <div className="flex flex-col gap-3">
          <a href="#">About Us</a>
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">Documentation</a>
        </div>

        <div className="flex flex-col gap-3">
          <a href="#">Support</a>
          <a href="#">Terms & Conditions</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Contact</a>
        </div>

        <div className="flex flex-col gap-3">
          <a href="#">Contact</a>
          <a href="#">FAQ</a>
          <a href="#">Blog</a>
        </div>
      </footer>

      <p className="px-20 text-[#BDBDBD] text-xs pb-6">
        ©2020 Aiihome Technologies Pvt. Ltd. All rights reserved
      </p>
    </div>
  );
}
