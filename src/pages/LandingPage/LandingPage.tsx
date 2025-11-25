import { colors } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import Union from "../../assets/Union.svg";
import view_quilt from "../../assets/view_quilt.svg";
export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div
      className="w-full h-screen flex items-center justify-center 
    bg-gradient-to-br from-[#4C6685] via-[#5479A1] to-[#5584C1]
    overflow-hidden relative"
    >
      {/* FLOATING COLOR CONTAINER 1 - TEAL */}
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

      {/* MAIN WRAPPER */}
      <div className="flex flex-col items-center w-full h-full pt-24 relative">
        {/* ICON + TITLE */}
        <img src={view_quilt} alt="cross-pattern" className="w-12 mt-20" />
        <div className="flex flex-col items-center">
          <h1 className="text-white text-3xl font-bold">InsightGrid</h1>
          <p className="text-white/80 text-sm mt-1">
            Customize Every View. Empower Every Decision.
          </p>
        </div>
      </div>
    </div>
  );
}
