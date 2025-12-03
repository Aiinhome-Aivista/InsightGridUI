import { colors } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import Union from "../../assets/Union.svg";
import LandingFeatureSection from "./LandingFeatureSection";
import VisualizationSection from "./VisualizationSection";
import LandingDashboard from "./LandingDashboard";
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
export default function LandingPage() {
  const navigate = useNavigate();
  return (
     <>
    <div
      className="w-full min-h-screen bg-gradient-to-br from-[#4C6685] via-[#5479A1] to-[#5584C1] 
      overflow-hidden relative"
    >
      <div
        className="w-full h-[900px] flex items-center justify-center relative"
      >
      <div
        className="absolute top-10 left-10 w-96 h-96 rounded-full 
          blur-3xl opacity-40 mix-blend-screen bg-[#048951ff]"
      ></div>

      {/* FLOATING COLOR CONTAINER 2 - BLUE */}
      <div
        className="absolute top-20 -right-20 w-96 h-96 rounded-full 
         blur-3xl mix-blend-screen bg-[#04418fff]"
      ></div>

      {/* FLOATING COLOR CONTAINER 3 - PURPLE */}
      <div
        className="absolute -bottom-20 left-1/3 w-96 h-96 rounded-full 
         blur-3xl mix-blend-screen bg-[#322858ff]"
      ></div>

      {/* BOTTOM RIGHT CORNER IMAGE */}
      <img
        src={Union}
        alt="cross-pattern"
        className="absolute bottom-0 right-0 w-100"
      />

      {/* TOP LEFT CORNER LOGO */}
      <div className="absolute top-8 left-10 flex items-center gap-2 text-white font-semibold text-lg">
        <span className="text-white/80">
          A<span className="text-[#4319C2]">ii</span>nhome |
        </span>
        <span className="font-extrabold text-xl">IG</span>
      </div>

      <div className="flex flex-col items-center mt-8">
        <h1 className="text-white text-4xl font-bold tracking-wide">
          InsightGrid
        </h1>
        <p className="text-white/80 mt-2 text-sm tracking-wide">
          Customize Every View. Empower Every Decision.
        </p>

        {/* BUTTON */}
        <button
          onClick={() => navigate("/login")}
          className="mt-10 bg-white/40 hover:bg-white/60 text-white 
          px-6 py-2 rounded-md font-medium backdrop-blur-sm transition flex items-center gap-2"
        >
          Create your first Insight
          <ArrowForwardOutlinedIcon sx={{ fontSize: 22 }} />
        </button>
        </div>
      </div>
      <LandingFeatureSection />
    </div>
    <VisualizationSection />
    <LandingDashboard />
   </>
  );
}
