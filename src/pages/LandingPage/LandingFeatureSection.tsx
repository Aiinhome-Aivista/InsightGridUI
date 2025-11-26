import React from "react";
import previewImage from "../../assets/MacBook.svg";

export default function LandingFeatureSection() {
  return (
    <section
      className="w-full h-[600px] flex items-center justify-between px-20 relative"
    >
      {/* FLOATING COLOR CONTAINER 1 - TEAL */}
      <div
        className="absolute top-10 left-10 w-96 h-96 rounded-full 
          blur-3xl opacity-40 mix-blend-screen bg-[#048951ff]"
      ></div>

      {/* FLOATING COLOR CONTAINER 2 - BLUE */}
      <div
        className="absolute top-25 -right-20 w-96 h-96 rounded-full 
         blur-3xl mix-blend-screen bg-[#04418fff]"
      ></div>

      {/* FLOATING COLOR CONTAINER 3 - PURPLE */}
      <div
        className="absolute -bottom-20 left-1/3 w-96 h-96 rounded-full 
         blur-3xl mix-blend-screen bg-[#322858ff]"
      ></div>
      {/* LEFT TEXT CONTENT */}
      <div className="flex flex-col w-[50%] text-white z-10 mb-28">
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
      <div className="absolute bottom-0 right-0 z-10 ">
        <img
          src={previewImage}
          alt="dashboard-preview"
          className="w-[600px]"
        />
      </div>
    </section>
  );
}
