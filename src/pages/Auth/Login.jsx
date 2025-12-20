import { Alert, Snackbar } from "@mui/material";
import React, { useState, useEffect } from "react";
import Union from "../../assets/Union.svg";
import view_quilt from "../../assets/view_quilt.svg";
import ApiServices from "../../services/ApiServices";
import { useAuth } from "./AuthContext";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
export default function Login() {
  const { login } = useAuth();
  const [user_email, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [companyCode, setCompanyCode] = useState("");
  const [companyCodeError, setCompanyCodeError] = useState("");
  const currentYear = getCurrentYear();

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const generateCaptcha = () => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptchaCode(code);
  };
  useEffect(() => {
    generateCaptcha();
  }, []);
  const handleLogin = async (e) => {
    e.preventDefault();
    if (captchaInput !== captchaCode) {
      setNotification({
        open: true,
        message: "Invalid CAPTCHA code",
        severity: "error",
      });
      generateCaptcha();
      setCaptchaInput("");
      return;
    }
    setLoading(true);
    setNotification({ open: false, message: "", severity: "info" });
    let res = null;
    try {
      const payload = { user_email, password, company_code: companyCode };
      const response = await ApiServices.login(payload);
      res = response.data; // LoginResponse
      console.log("Login Response:", res);

      if (res.isSuccess) {
        setNotification({
          open: true,
          message: "Login successfully!",
          severity: "success",
        });

        setTimeout(() => login(res.data), 1500);
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

  // const isFormValid =
  //   user_email.trim() !== "" &&
  //   password.trim() !== "" &&
  //   captchaInput.trim() !== "" &&
  //   !loading &&
  //   !emailError;

  const isFormValid =
    user_email.trim() !== "" &&
    password.trim() !== "" &&
    companyCode.trim() !== "" &&
    captchaInput.trim() !== "" &&
    !loading &&
    !emailError &&
    !companyCodeError;

  function getCurrentYear() {
    return new Date().getFullYear();
  }


  const handleCloseNotification = () =>
    setNotification((prev) => ({ ...prev, open: false }));

  return (
    <div
      className="w-full h-screen flex items-center justify-center 
    bg-gradient-to-br from-[#4C6685] via-[#5479A1] to-[#5584C1]
    overflow-hidden relative"
    >
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
      <div
        className="absolute top-10 left-10 w-96 h-96 rounded-full 
          blur-3xl opacity-40 mix-blend-screen bg-[#048951ff]"
      ></div>
      <div
        className="absolute top-20 -right-20 w-96 h-96 rounded-full 
         blur-3xl mix-blend-screen bg-[#04418fff]"
      ></div>
      <div
        className="absolute -bottom-20 left-1/3 w-96 h-96 rounded-full 
         blur-3xl mix-blend-screen bg-[#322858ff]"
      ></div>
      <img
        src={Union}
        alt="cross-pattern"
        className="absolute bottom-0 right-0 w-[800px]"
      />
      <div className="absolute top-8 left-10 flex items-center gap-2 text-white font-semibold text-lg">
        <span className="text-white/80">
          A<span className="text-[#4319C2]">ii</span>nhome |
        </span>
        <span className="font-extrabold text-xl">IG</span>
      </div>
      <div className="flex flex-col items-center w-full h-full relative">
        <img src={view_quilt} alt="cross-pattern" className="w-12 mt-20" />
        <div className="flex flex-col items-center">
          <h1 className="text-white text-3xl font-bold">InsightGrid</h1>
          <p className="text-white/80 text-sm mt-1">
            Customize Every View. Empower Every Decision.
          </p>
        </div>
        <form
          onSubmit={handleLogin}
          className="mt-16 w-80 flex flex-col space-y-4"
        >
          <div className="w-full">
            <input
              type="text"
              placeholder="User Email"
              value={user_email}
              onChange={(e) => {
                const val = e.target.value;
                setUserEmail(val);
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (val && !emailRegex.test(val)) {
                  setEmailError("Enter a valid User Email");
                } else {
                  setEmailError("");
                }
              }}
              className={`w-full px-4 py-2 rounded-md bg-transparent border ${emailError ? "border-red-400" : "border-white/40"
                } text-white outline-none placeholder-white/60`}
            />
            {emailError && (
              <p className="text-red-400 text-xs mt-1 ml-1">{emailError}</p>
            )}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 pr-10 rounded-md bg-transparent border border-white/40 text-white outline-none placeholder-white/60"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
            >
              {showPassword ? (
                <VisibilityOff fontSize="small" />
              ) : (
                <Visibility fontSize="small" />
              )}
            </button>
          </div>

          <div className="w-full">
            <input
              type="text"
              placeholder="Company Code"
              value={companyCode}
              onChange={(e) => {
                const val = e.target.value.toUpperCase();
                setCompanyCode(val);

                // example validation: min 3 chars, alphanumeric only
                const codeRegex = /^[A-Z0-9]{3,}$/;
                if (val && !codeRegex.test(val)) {
                  setCompanyCodeError(
                    "Company Code must be at least 3 characters (A–Z, 0–9)"
                  );
                } else {
                  setCompanyCodeError("");
                }
              }}
              className={`w-full px-4 py-2 rounded-md bg-transparent border ${companyCodeError ? "border-red-400" : "border-white/40"
                } text-white outline-none placeholder-white/60`}
            />

            {companyCodeError && (
              <p className="text-red-400 text-xs mt-1 ml-1">
                {companyCodeError}
              </p>
            )}
          </div>


          <div className="flex items-center gap-2">
            <div
              className="flex-1 bg-white/20 text-white text-center font-bold tracking-widest py-2 rounded-md select-none"
              style={{ fontFamily: "monospace", fontSize: "1.2rem" }}
            >
              {captchaCode}
            </div>
            <button
              type="button"
              onClick={generateCaptcha}
              className="p-2 bg-white/20 rounded-md text-white hover:bg-white/30 transition"
            >
              <AutorenewRoundedIcon fontSize="small" />
            </button>
          </div>

          <input
            type="text"
            placeholder="Enter CAPTCHA"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-transparent border border-white/40 text-white outline-none placeholder-white/60"
          />

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-2 rounded-md font-medium transition
    ${isFormValid
                ? "bg-white/40 text-white hover:bg-white/60"
                : "bg-white/20 text-white/50 cursor-not-allowed"
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
        <p className="text-white/70 text-xs absolute bottom-14">
          ©{currentYear} Aiinhome Technologies Pvt. Ltd. All rights reserved
        </p>
      </div>
    </div>
  );
}
