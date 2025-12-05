import { Alert, Snackbar } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Union from "../../assets/Union.svg";
import view_quilt from "../../assets/view_quilt.svg";
import ApiServices from "../../services/ApiServices";

export default function Login() {
  const navigate = useNavigate();
  const [user_email, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification({ open: false, message: "", severity: "info" });

    let res = null;

    try {
      const payload = { user_email, password }; // LoginPayload
      const response = await ApiServices.login(payload);
      res = response.data; // LoginResponse

      if (res.isSuccess) {
        setNotification({
          open: true,
          message: "Login successfully!",
          severity: "success",
        });

        localStorage.setItem("ig_user", JSON.stringify(res.data));

        // setTimeout(() => navigate("/layout/upload", { replace: true }), 1500);
        setTimeout(() => navigate("/dashboard-component", { replace: true }), 1500);


        return;
      }

      setNotification({
        open: true,
        message: res?.message || "Login failed",
        severity: "error",
      });
    } catch (err) {
      setNotification({
        open: true,
        message: err.message || "Network Error",
        severity: "error",
      });
    } finally {
      if (!res?.isSuccess) setLoading(false);
    }
  };

  const handleCloseNotification = () =>
    setNotification((prev) => ({ ...prev, open: false }));


  return (
    <div className="w-full h-screen flex items-center justify-center 
    bg-gradient-to-br from-[#4C6685] via-[#5479A1] to-[#5584C1]
    overflow-hidden relative">
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>

      {/* FLOATING COLOR CONTAINER 1 - TEAL */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full 
          blur-3xl opacity-40 mix-blend-screen bg-[#048951ff]">
      </div>

      {/* FLOATING COLOR CONTAINER 2 - BLUE */}
      <div className="absolute top-20 -right-20 w-96 h-96 rounded-full 
         blur-3xl mix-blend-screen bg-[#04418fff]">
      </div>

      {/* FLOATING COLOR CONTAINER 3 - PURPLE */}
      <div className="absolute -bottom-20 left-1/3 w-96 h-96 rounded-full 
         blur-3xl mix-blend-screen bg-[#322858ff]">
      </div>

      {/* BOTTOM RIGHT CORNER IMAGE */}
      <img
        src={Union}
        alt="cross-pattern"
        className="absolute bottom-0 right-0 w-100"
      />
      <div className="absolute top-8 left-10 flex items-center gap-2 text-white font-semibold text-lg">
        <span className="text-white/80">
          A<span className="text-[#4319C2]">ii</span>nhome |
        </span>
        <span className="font-extrabold text-xl">IG</span>
      </div>
      <div className="flex flex-col items-center w-full h-full pt-24 relative">
        <img
          src={view_quilt}
          alt="cross-pattern"
          className="w-12 mt-20"
        />
        <div className="flex flex-col items-center">
          <h1 className="text-white text-3xl font-bold">InsightGrid</h1>
          <p className="text-white/80 text-sm mt-1">
            Customize Every View. Empower Every Decision.
          </p>
        </div>
        <form onSubmit={handleLogin} className="mt-24 w-80 flex flex-col space-y-4">
          <input
            type="text"
            placeholder="User Name"
            value={user_email}
            onChange={(e) => setUserEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-transparent border border-white/40 text-white outline-none placeholder-white/60"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-transparent border border-white/40 text-white outline-none placeholder-white/60"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-white/40 text-white font-medium hover:bg-white/60 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-white/70 text-xs absolute bottom-12">
          ©2025 Aiihome Technologies Pvt. Ltd. All rights reserved
        </p>
      </div>
    </div>
  );
}