import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Map,
  Globe2,
  Package,
  Calendar,
  Upload,
} from "lucide-react";
import FileUploadModal from "../../Modal/FileUploadModal";
import Tippy from "@tippyjs/react";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import { useNavigate } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";
import ApiServices from "../../services/ApiServices";
const RegisterCompany = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const company = location.state?.company;
  console.log("company", company);
  const isEditMode = Boolean(id && company);

  // const isEditMode = () => {
  //     return Boolean(id);
  // };

  const formik = useFormik({
    validateOnMount: false,
    initialValues: {
      id: null,
      created_by: "",
      company_name: "",
      company_email: "",
      phone_number: "",
      company_logo: null,

      area: "",
      city: "",
      district: "",
      state: "",
      country: "",
      pin_code: "",

      subscription_type: "FREE",
      from_date: "",
      to_date: "",
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (!values.company_name)
        errors.company_name = "Company Name is required";
      if (!values.company_email) {
        errors.company_email = "Company Email is required";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.com$/i;
        if (!emailRegex.test(values.company_email)) {
          errors.company_email = "Enter a valid email ending with .com";
        }
      }
      if (!values.phone_number) {
        errors.phone_number = "Phone Number is required";
      }
      //  else {
      //   const phoneRegex = /^[6-9]\d{9}$/;
      //   if (!phoneRegex.test(values.phone_number)) {
      //     errors.phone_number =
      //       "Phone number must be 10 digits and start with 6, 7, 8 or 9";
      //   }
      // }
      // if (!isEditMode && !values.company_logo) errors.company_logo = "Company Logo required";

      if (!values.area) errors.area = "Area is required";
      if (!values.city) errors.city = "City is required";
      if (!values.district) errors.district = "District is required";
      if (!values.state) errors.state = "State is required";
      if (!values.country) errors.country = "Country is required";
      if (!values.pin_code) {
        errors.pin_code = "PIN Code is required";
      } else {
        const pinRegex = /^\d{6}$/;
        if (!pinRegex.test(values.pin_code)) {
          errors.pin_code = "PIN Code must be exactly 6 digits";
        }
      }
      if (!values.from_date) errors.from_date = "From date required";
      if (!values.to_date) errors.to_date = "To date required";
      // ✅ FINAL CORRECT LOGO VALIDATION
      if (!isEditMode && !values.company_logo) {
        errors.company_logo = "Company Logo is required";
      }

      if (values.company_logo) {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        const maxSize = 2 * 1024 * 1024;

        if (!allowedTypes.includes(values.company_logo.type)) {
          errors.company_logo = "Only PNG, JPG or JPEG files are allowed";
        } else if (values.company_logo.size > maxSize) {
          errors.company_logo = "Logo size must be less than 2MB";
        }
      }

      return errors;
    },
    // onSubmit: async (values) => {
    //     const formData = new FormData();

    //     // 🔹 ID (null for create, number for edit)
    //     // if (values.id !== null) {
    //     //     formData.append("id", String(values.id));
    //     // }
    //     formData.append("id", values.id);

    //     // 🔹 CORE FIELDS
    //     formData.append("company_name", values.company_name);
    //     formData.append("company_email", values.company_email);
    //     formData.append("phone_number", values.phone_number);

    //     // 🔹 ADDRESS (combined)
    //     const address = `${values.area}, ${values.city}, ${values.district}, ${values.state}, ${values.country} - ${values.pin_code}`;
    //     formData.append("address", address);

    //     // 🔹 SUBSCRIPTION
    //     formData.append("subscription_type", values.subscription_type);
    //     formData.append("from_date", values.from_date);
    //     formData.append("to_date", values.to_date);

    //     // 🔹 AUDIT FIELDS
    //     formData.append("created_by", JSON.parse(localStorage.getItem("ig_user"))?.user_id);

    //     // 🔹 LOGO
    //     if (values.company_logo) {
    //         formData.append("company_logo", values.company_logo);
    //     }

    //     await fetch("http://127.0.0.1:3008/admin/company_register", {
    //         method: "POST",
    //         body: formData,
    //     });
    // }
    onSubmit: async (values) => {
      await submitCompany(values);
    },
  });
  const submitCompany = async (values: any) => {
    const formData = new FormData();
    // if (isEditMode()) {
    formData.append("id", id);
    // }
    formData.append("company_name", values.company_name);
    formData.append("company_email", values.company_email);
    formData.append("phone_number", values.phone_number);
    // const address = `${values.area}, ${values.city}, ${values.district}, ${values.state}, ${values.country} - ${values.pin_code}`;
    const address = JSON.stringify({
      area: values.area,
      city: values.city,
      district: values.district,
      state: values.state,
      country: values.country,
      pin_code: values.pin_code,
    });
    formData.append("address", address);
    formData.append("subscription_type", values.subscription_type);
    formData.append("from_date", values.from_date);
    formData.append("to_date", values.to_date);
    // formData.append(
    //   "created_by",
    //   JSON.parse(localStorage.getItem("ig_user"))?.user_id
    // );

    if (values.company_logo) {
      formData.append("company_logo", values.company_logo);
    }
    // await fetch("http://127.0.0.1:3008/admin/company_register", {
    //   method: "POST",
    //   body: formData,
    // });
    await ApiServices.adminCompanyRegister(formData);

    navigate("/layout/manage-companies");
  };
  const handleResetForm = () => {
    setIsResetting(true);
    setTimeout(() => {
      formik.resetForm();
      setLogoPreview(null);
      setIsResetting(false);
    }, 400);
  };
  useEffect(() => {
    if (!isEditMode || !company) return;

    let addr = {
      area: "",
      city: "",
      district: "",
      state: "",
      country: "",
      pin_code: "",
    };

    try {
      addr = company.address ? JSON.parse(company.address) : addr;
    } catch {
      console.warn("Invalid address JSON");
    }

    formik.setValues({
      id: company.id,
      created_by: company.created_by || "",
      company_name: company.company_name || "",
      company_email: company.company_email || "",
      phone_number: company.phone_number || "",
      company_logo: null,

      area: addr.area || "",
      city: addr.city || "",
      district: addr.district || "",
      state: addr.state || "",
      country: addr.country || "",
      pin_code: addr.pin_code || "",

      subscription_type: company.subscription_type || "FREE",
      from_date: company.from_date
        ? new Date(company.from_date).toISOString().slice(0, 10)
        : "",
      to_date: company.to_date
        ? new Date(company.to_date).toISOString().slice(0, 10)
        : "",
    });

    if (company.company_logo) {
      setLogoPreview(company.company_logo_url);
    }
  }, [company, isEditMode]);


  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <form onSubmit={formik.handleSubmit}>
        <div className="rounded-xl px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#1C1B1F]">
              Register a Company
            </h2>
            {!isEditMode && (

              <Tippy content="Reset" theme="gray">
                <button
                  type="button"
                  onClick={handleResetForm}
                  disabled={isResetting}
                  className={`
      w-10 h-10 flex items-center justify-center rounded-lg
      border border-[#D9D9D9]
      bg-[#F3F3F3] hover:bg-[#E5E5E5]
      transition-all
      ${isResetting ? "cursor-wait opacity-70" : "cursor-pointer"}
    `}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Company Name {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <Building2
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  name="company_name"
                  value={formik.values.company_name}
                  onChange={formik.handleChange}
                  className="w-full pl-10 py-2 border rounded-lg"
                  placeholder="Zenith Tech Solutions Pvt Ltd"
                />
              </div>
              {formik.touched.company_name && formik.errors.company_name && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.company_name}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">
                Company Email {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  name="company_email"
                  value={formik.values.company_email}
                  onChange={formik.handleChange}
                  className="w-full pl-10 py-2 border rounded-lg"
                  placeholder="support@company.com"
                />
              </div>
              {formik.touched.company_email && formik.errors.company_email && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.company_email}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">
                Phone Number {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  name="phone_number"
                  value={formik.values.phone_number}
                  onChange={formik.handleChange}
                  className="w-full pl-10 py-2 border rounded-lg"
                  placeholder="+91 22 4000 1234"
                />
              </div>
              {formik.touched.phone_number && formik.errors.phone_number && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.phone_number}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">
                Area / Street {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  name="area"
                  value={formik.values.area}
                  onChange={formik.handleChange}
                  className="w-full pl-10 py-2 border rounded-lg"
                  placeholder="EM Block, Sector V"
                />
              </div>
              {formik.touched.area && formik.errors.area && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.area}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">
                City {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <Map
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  name="city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  className="w-full pl-10 py-2 border rounded-lg"
                  placeholder="Kolkata"
                />
              </div>
              {formik.touched.city && formik.errors.city && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.city}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">
                District {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              <input
                name="district"
                value={formik.values.district}
                onChange={formik.handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="North 24 Parganas"
              />
              {formik.touched.district && formik.errors.district && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.district}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">
                State {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              <input
                name="state"
                value={formik.values.state}
                onChange={formik.handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="West Bengal"
              />
              {formik.touched.state && formik.errors.state && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.state}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">
                Country {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <Globe2
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  name="country"
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  className="w-full pl-10 py-2 border rounded-lg"
                  placeholder="India"
                />
              </div>
              {formik.touched.country && formik.errors.country && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.country}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">
                PIN Code {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <Package
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  name="pin_code"
                  value={formik.values.pin_code}
                  onChange={formik.handleChange}
                  className="w-full pl-10 py-2 border rounded-lg"
                  placeholder="700091"
                />
              </div>
              {formik.touched.pin_code && formik.errors.pin_code && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.pin_code}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">
                Subscription Type {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              <select
                name="subscription_type"
                value={formik.values.subscription_type}
                onChange={formik.handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="FREE">FREE</option>
                <option value="PAID">PAID</option>
              </select>
              {formik.touched.subscription_type &&
                formik.errors.subscription_type && (
                  <p className="mt-1 text-xs text-red-500">
                    {formik.errors.subscription_type}
                  </p>
                )}
            </div>
            <div>
              <label className="text-sm font-medium">
                From Date {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="date"
                  name="from_date"
                  min={new Date().toISOString().split("T")[0]}
                  value={formik.values.from_date}
                  onChange={formik.handleChange}
                  className="w-full pl-10 py-2 border rounded-lg"
                />
              </div>
              {formik.touched.from_date && formik.errors.from_date && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.from_date}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">
                To Date {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="date"
                  name="to_date"
                  min={
                    formik.values.from_date
                      ? new Date(
                        new Date(formik.values.from_date).setFullYear(
                          new Date(formik.values.from_date).getFullYear() + 1
                        )
                      )
                        .toISOString()
                        .split("T")[0]
                      : undefined
                  }
                  disabled={!formik.values.from_date}
                  value={formik.values.to_date}
                  onChange={formik.handleChange}
                  className="w-full pl-10 py-2 border rounded-lg"
                />
              </div>
              {formik.touched.to_date && formik.errors.to_date && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.to_date}
                </p>
              )}
            </div>

            {/* Logo */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium">
                Company Logo {!isEditMode && <span className="text-red-500">*</span>}
              </label>

              <div className="flex items-center gap-4 mt-2">
                <FileUploadModal
                  label="Upload Logo"
                  value={formik.values.company_logo}
                  maxSizeMB={2}
                  allowedTypes={["image/png", "image/jpeg", "image/jpg"]}
                  onChange={(file) => {
                    formik.setFieldTouched("company_logo", true);
                    formik.setFieldValue("company_logo", file);

                    if (file) {
                      setLogoPreview(URL.createObjectURL(file));
                    } else {
                      setLogoPreview(null);
                    }
                  }}
                />

                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="logo preview"
                    className="w-16 h-16 object-cover rounded border"
                  />
                )}
              </div>

              {formik.touched.company_logo &&
                typeof formik.errors.company_logo === "string" && (
                  <p className="mt-1 text-xs text-red-500">
                    {formik.errors.company_logo}
                  </p>
                )}
            </div>
          </div>
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
              {isEditMode ? "Update Company" : "Register Company"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterCompany;
