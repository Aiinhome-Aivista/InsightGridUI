import React from "react";
import previewImage from "../../assets/MacBook.svg";

export default function LandingFeatureSection() {
  return (
    <section
      className="
        w-full min-h-screen flex flex-col md:flex-row items-center justify-between
        px-6 md:px-20 relative overflow-hidden
      "
    >
      {/* FLOATING COLOR CONTAINER 1 - TEAL */}
      <div
        className="
          absolute top-10 left-5 md:left-10 w-60 h-60 md:w-96 md:h-96 rounded-full 
          blur-3xl opacity-40 mix-blend-screen bg-[#048951ff]
        "
      ></div>

      {/* FLOATING COLOR CONTAINER 2 - BLUE */}
      <div
        className="
          absolute top-40 -right-28 w-60 h-60 md:w-96 md:h-96 rounded-full 
          blur-3xl mix-blend-screen bg-[#04418fff]
        "
      ></div>

      {/* FLOATING COLOR CONTAINER 3 - PURPLE */}
      <div
        className="
          absolute bottom-[-120px] left-1/4 md:left-1/3 w-60 h-60 md:w-96 md:h-96 rounded-full 
          blur-3xl mix-blend-screen bg-[#322858ff]
        "
      ></div>

      {/* LEFT TEXT CONTENT */}
      <div
        className="
          flex flex-col text-white z-10 
          w-full md:w-[50%] mt-20 md:mt-0 text-center md:text-left
        "
      >
        <h2 className="text-3xl md:text-5xl font-bold leading-snug">
          Transform Your Data <br className="hidden md:block" />
          Into Meaningful Insights
        </h2>

        <p className="mt-6 text-white/80 leading-relaxed text-sm md:text-base mx-auto md:mx-0 w-[95%] md:w-[85%]">
          DataVista is a powerful and intuitive data-intelligence platform that
          helps you explore, analyze, and visualize your uploaded datasets—
          without writing a single line of code. <br /> <br />
          Simply upload your Excel or CSV file and let the system do the work.
        </p>
      </div>

      {/* RIGHT UI PREVIEW IMAGE */}
      <div
        className="
          mt-10 md:mt-0 z-10 flex justify-center md:absolute md:bottom-0 md:right-0
        "
      >
        <img
          src={previewImage}
          alt="dashboard-preview"
          className="w-[300px] sm:w-[450px] md:w-[600px]"
        />
      </div>
    </section>
  );
}
