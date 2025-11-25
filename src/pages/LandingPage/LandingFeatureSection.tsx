import React from "react";
import previewImage from "../../assets/MacBook.svg";

export default function LandingFeatureSection() {
  return (
    <section
      className="w-full h-[600px] flex items-center justify-between 
      px-20 relative overflow-hidden  bg-gradient-to-br from-[#4C6685] via-[#5479A1] to-[#5584C1]"
    >
      {/* Background blur shapes */}
      <div className="absolute top-[-80px] left-[-120px] w-[450px] h-[450px] bg-[#3C5675] blur-[140px] opacity-40 rounded-full"></div>
      <div className="absolute top-[150px] right-[-150px] w-[450px] h-[450px] bg-[#4D70A4] blur-[150px] opacity-40 rounded-full"></div>

      {/* LEFT TEXT CONTENT */}
      <div className="flex flex-col w-[45%] text-white z-10">
        <h2 className="text-4xl font-bold leading-snug">
          Transform Your Data <br /> Into Meaningful Insights
        </h2>

        <p className="mt-6 text-white/80 leading-relaxed text-[15px] w-[90%]">
          DataVista is a powerful and intuitive data-intelligence platform that
          helps you explore, analyze, and visualize your uploaded datasets—
          without writing a single line of code. <br /> <br />
          Simply upload your Excel or CSV file and let the system do the work.
        </p>
      </div>

      {/* RIGHT UI PREVIEW IMAGE */}
      <div className="w-[80%] flex justify-end z-10">
        <img
          src={previewImage}
          alt="dashboard-preview"
          className="w-[520px] rounded-lg shadow-xl"
        />
      </div>
    </section>
  );
}
