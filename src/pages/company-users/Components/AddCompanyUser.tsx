import React, { useEffect, useState } from 'react'
import { useFormik } from "formik";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { POST_APIS, BASE_URL } from "../../../../connection";
import Tippy from "@tippyjs/react";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import ApiServices from "../../../services/ApiServices";

function AddCompanyUser() {
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const user = location.state?.user;
  const isEditMode = Boolean(id && user);

  const companyCodeFromLS =
    JSON.parse(localStorage.getItem("ig_user") || "{}")?.company_code || "";
  const [errorModal, setErrorModal] = useState({
    open: false,
    message: "",
  });
  const formik = useFormik({
    initialValues: {
      company_code: companyCodeFromLS,
      user_name: "",
      user_email: "",
      user_password: "",

      phone_number: "",
      area: "",
      city: "",
      district: "",
      state: "",
      country: "",
      pin_code: "",
    },

    validate: (values) => {
      const errors: Record<string, string> = {};
      if (!isEditMode && !values.user_name) {
        errors.user_name = "User Name is required";
      }

      if (!values.user_email) {
        errors.user_email = "User Email is required";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.com$/i;
        if (!emailRegex.test(values.user_email)) {
          errors.user_email = "Enter a valid email ending with .com";
        }
      }

      if (!isEditMode) {
        if (!values.user_password) {
          errors.user_password = "Password is required";
        } else if (values.user_password.length < 6) {
          errors.user_password = "Password must be at least 6 characters";
        }
      }


      if (!values.phone_number)
        errors.phone_number = "Phone Number is required";

      if (!values.area) errors.area = "Area is required";
      if (!values.city) errors.city = "City is required";
      if (!values.district) errors.district = "District is required";
      if (!values.state) errors.state = "State is required";
      if (!values.country) errors.country = "Country is required";

      if (!values.pin_code) {
        errors.pin_code = "PIN Code is required";
      } else if (!/^\d{6}$/.test(values.pin_code)) {
        errors.pin_code = "PIN Code must be 6 digits";
      }

      return errors;
    },

    onSubmit: async (values) => {
      await submitCompanyAdmin(values);
    },
  });
  const submitCompanyAdmin = async (values: any) => {
    const payload = {
      id: null,
      company_code: values.company_code,
      user_name: values.user_name,
      user_email: values.user_email,
      user_password: values.user_password,
      created_by: JSON.parse(localStorage.getItem("ig_user") || "{}")?.user_id,

      phone_number: values.phone_number,
      address: {
        area: values.area,
        city: values.city,
        district: values.district,
        state: values.state,
        country: values.country,
        pin_code: values.pin_code,
      },
    };

    if (isEditMode && user?.id) {
      payload.id = user.id;
    }
    try {
      const res = await ApiServices.companyUserRegister(payload);

      if (res?.data?.isSuccess) {
        navigate(-1); // back to list
      } else {
        alert(res?.data?.message || "Failed to create admin");
      }
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        "Server error while creating company admin";

      setErrorModal({
        open: true,
        message: msg,
      });
    }
    navigate(-1);
  };

  const handleResetForm = () => {
    setIsResetting(true);
    setTimeout(() => {
      formik.resetForm();
      setIsResetting(false);
    }, 400);
  };
  useEffect(() => {
    if (!isEditMode || !user) return;

    let addr = {
      area: "",
      city: "",
      district: "",
      state: "",
      country: "",
      pin_code: "",
    };

    try {
      addr = user.address ? JSON.parse(user.address) : addr;
    } catch (e) {
      console.warn("Invalid address JSON");
    }

    formik.setValues({
      company_code: companyCodeFromLS,
      user_name: user.user_name || user.full_name || "",
      user_email: user.user_email || user.email || "",
      user_password: "", // ❌ edit mode এ blank
      phone_number: user.phone_number || "",

      area: addr.area || "",
      city: addr.city || "",
      district: addr.district || "",
      state: addr.state || "",
      country: addr.country || "",
      pin_code: addr.pin_code || "",
    });
  }, [isEditMode, user]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <form onSubmit={formik.handleSubmit}>
        <div className="rounded-xl px-6 py-4">
          <h2 className="text-xl font-semibold mb-6">
          </h2>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold mb-6">
              Add User
            </h2>
            {!isEditMode && (

              <Tippy content="Reset" theme="gray">
                <button
                  type="button"
                  onClick={handleResetForm}
                  disabled={isResetting}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg border border-[#D9D9D9] bg-[#F3F3F3] hover:bg-[#E5E5E5] transition-all${isResetting ? "cursor-wait opacity-70" : "cursor-pointer"}`}
                >
                  <AutorenewRoundedIcon
                    className={`w-5 h-5 text-gray-600 ${isResetting ? "animate-spin" : ""
                      }`}
                    fontSize="small"
                  />
                </button>
              </Tippy>
            )}
          </div>

          {/* Company Code */}
          <div className="mb-4">
            <label className="text-sm font-medium">
              Company Code
            </label>

            <input
              type="text"
              name="company_code"
              value={formik.values.company_code}
              
              onChange={formik.handleChange}
              className="w-full px-4 py-2 border rounded-lg mt-1 cursor-not-allowed"
              disabled={true}

            />
          </div>


          {/* Admin Name */}
          <div className="mb-4">
            <label className="text-sm font-medium">
              User Name {!isEditMode && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              name="user_name"
              value={formik.values.user_name}
              disabled={isEditMode}
              onChange={formik.handleChange}
              placeholder="Enter User Name"
              className={`w-full px-4 py-2 border rounded-lg mt-1 
    ${isEditMode ? "bg-gray-100 cursor-not-allowed" : ""}
  `}
            />
            {formik.touched.user_name && formik.errors.user_name && (
              <p className="text-xs text-red-500 mt-1">
                {formik.errors.user_name}
              </p>
            )}
          </div>

          {/* User Email */}
          <div className="mb-4">
            <label className="text-sm font-medium">
              User Email {!isEditMode && <span className="text-red-500">*</span>}
            </label>
            <input
              type="email"
              name="user_email"
              value={formik.values.user_email}
              disabled={isEditMode}
              onChange={formik.handleChange}
              className={`w-full px-4 py-2 border rounded-lg mt-1 
    ${isEditMode ? "bg-gray-100 cursor-not-allowed" : ""}
  `} placeholder="admin@company.com"
            />
            {formik.touched.user_email && formik.errors.user_email && (
              <p className="text-xs text-red-500 mt-1">
                {formik.errors.user_email}
              </p>
            )}
          </div>

          {/* User Password */}
          {!isEditMode && (
            <div className="mb-6">
              <label className="text-sm font-medium">
                Password {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              <input
                type="password"
                name="user_password"
                value={formik.values.user_password}
                onChange={formik.handleChange}
                className="w-full px-4 py-2 border rounded-lg mt-1"
                placeholder="Enter Password"
              />
              {formik.touched.user_password &&
                formik.errors.user_password && (
                  <p className="text-xs text-red-500 mt-1">
                    {formik.errors.user_password}
                  </p>
                )}
            </div>
          )}
          <div className="mb-4">
            <label className="text-sm font-medium">
              Phone Number {!isEditMode && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              name="phone_number"
              value={formik.values.phone_number}
              onChange={formik.handleChange}
              className="w-full px-4 py-2 border rounded-lg mt-1"
              placeholder="Enter Phone Number"
            />
            {formik.touched.phone_number && formik.errors.phone_number && (
              <p className="text-xs text-red-500 mt-1">
                {formik.errors.phone_number}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Area {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              <input
                name="area"
                value={formik.values.area}
                onChange={formik.handleChange}
                className="w-full px-4 py-2 border rounded-lg mt-1"
                placeholder="Area / Street"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                City {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              <input
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                className="w-full px-4 py-2 border rounded-lg mt-1"
                placeholder="City"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                District {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              <input
                name="district"
                value={formik.values.district}
                onChange={formik.handleChange}
                className="w-full px-4 py-2 border rounded-lg mt-1"
                placeholder="District"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                State {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              <input
                name="state"
                value={formik.values.state}
                onChange={formik.handleChange}
                className="w-full px-4 py-2 border rounded-lg mt-1"
                placeholder="State"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Country {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              <input
                name="country"
                value={formik.values.country}
                onChange={formik.handleChange}
                className="w-full px-4 py-2 border rounded-lg mt-1"
                placeholder="Country"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                PIN Code {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              <input
                name="pin_code"
                value={formik.values.pin_code}
                onChange={formik.handleChange}
                className="w-full px-4 py-2 border rounded-lg mt-1"
                placeholder="700091"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="w-full flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isEditMode ? "Update User" : " Create User"}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}
export default AddCompanyUser
