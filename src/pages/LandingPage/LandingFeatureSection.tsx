import React from "react";
import previewImage from "../../assets/MacBook.svg";

export default function LandingFeatureSection() {
  return (
    <section
  className="
    w-full min-h-screen relative overflow-hidden
    flex flex-col md:flex-row items-center justify-between
    px-6 md:px-20
    text-white
  "
>
      {/* ---- LEFT CONTENT ---- */}
      <div
        className="
          z-10 w-full md:w-[50%]
          mt-24 md:mt-0
          text-center md:text-left
        "
      >
        <h2 className="text-4xl md:text-5xl font-bold leading-snug">
          Transform Your Data <br className="hidden md:block" />
          Into Meaningful Insights
        </h2>

        <p
          className="
            mt-6 text-white/80 leading-relaxed
            text-base md:text-lg
            w-[95%] md:w-[80%] mx-auto md:mx-0
          "
        >
          DataVista is a powerful and intuitive data-intelligence platform that
          helps you explore, analyze, and visualize your uploaded datasets—
          without writing a single line of code. <br /><br />
          Simply upload your Excel or CSV file and let the system do the work.
        </p>
      </div>

      {/* ---- RIGHT MOCKUP IMAGE ---- */}
      <div
        className="
          z-10 flex justify-center
          md:absolute md:bottom-0 md:right-0
        "
      >
        <img
          src={previewImage}
          alt="dashboard-preview"
          className="w-[320px] sm:w-[450px] md:w-[680px]"
        />
      </div>
    </section>
  );
}
