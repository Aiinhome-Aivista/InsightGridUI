import React, { useState } from 'react'
import { useFormik } from "formik";
import { useNavigate } from 'react-router-dom';
import { POST_APIS, BASE_URL } from "../../../../connection";
import { Dropdown } from 'primereact/dropdown';
import Tippy from "@tippyjs/react";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
function AddCompanyUser() {
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();
  const isEditMode = false
  // Boolean(id && company);
  const countries = [
    { name: 'Australia', code: 'AU' },
    { name: 'Brazil', code: 'BR' },
    { name: 'China', code: 'CN' },
    { name: 'Egypt', code: 'EG' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'India', code: 'IN' },
    { name: 'Japan', code: 'JP' },
    { name: 'Spain', code: 'ES' },
    { name: 'United States', code: 'US' }
  ];

  const formik = useFormik({
    initialValues: {
      company_code: "",
      admin_name: "",
      admin_email: "",
      admin_password: "",

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

      if (!values.company_code) {
        errors.company_code = "Company Code is required";
      }

      if (!values.admin_name) {
        errors.admin_name = "Admin Name is required";
      }

      if (!values.admin_email) {
        errors.admin_email = "Admin Email is required";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.com$/i;
        if (!emailRegex.test(values.admin_email)) {
          errors.admin_email = "Enter a valid email ending with .com";
        }
      }

      if (!values.admin_password) {
        errors.admin_password = "Password is required";
      } else if (values.admin_password.length < 6) {
        errors.admin_password = "Password must be at least 6 characters";
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
      company_code: values.company_code,
      admin_name: values.admin_name,
      admin_email: values.admin_email,
      admin_password: values.admin_password,
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

    console.log("FINAL PAYLOAD =>", payload);

    // 🔜 later API
    // await fetch(POST_APIS.add_company_admin, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });

    navigate(-1);
  };

  const handleResetForm = () => {
    setIsResetting(true);
    setTimeout(() => {
      formik.resetForm();
      setIsResetting(false);
    }, 400);
  };
  // useEffect(() => {
  //   if (!isEditMode || !company) return;
  //   if (formik.values.company_name) return;

  //   // const address = company.address || "";
  //   // const parts = address.split(",");
  //   // const pin = address.split("-")[1]?.trim() || "";
  //   let addr = {
  //     area: "",
  //     city: "",
  //     district: "",
  //     state: "",
  //     country: "",
  //     pin_code: "",
  //   };

  //   try {
  //     addr = company.address ? JSON.parse(company.address) : addr;
  //   } catch (e) {
  //     console.warn("Invalid address JSON");
  //   }

  //   formik.setValues({
  //     id: company.id,
  //     created_by: company.created_by || "",

  //     company_name: company.company_name || "",
  //     company_email: company.company_email || "",
  //     phone_number: company.phone_number || "",
  //     company_logo: null,

  //     area: addr.area || "",
  //     city: addr.city || "",
  //     district: addr.district || "",
  //     state: addr.state || "",
  //     country: addr.country || "",
  //     pin_code: addr.pin_code || "",

  //     subscription_type: company.subscription_type || "FREE",

  //     from_date: company.from_date
  //       ? new Date(company.from_date).toISOString().slice(0, 10)
  //       : "",
  //     to_date: company.to_date
  //       ? new Date(company.to_date).toISOString().slice(0, 10)
  //       : "",
  //   });

  //   if (company.company_logo) {
  //     setLogoPreview(`${BASE_URL}${company.company_logo}`);
  //   }
  // }, [isEditMode, company]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <form onSubmit={formik.handleSubmit}>
        <div className="rounded-xl px-6 py-4">
          <h2 className="text-xl font-semibold mb-6">
          </h2>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold mb-6">
              Add Company Admin
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
              Company Code <span className="text-red-500">*</span>
            </label>

            <Dropdown
              value={formik.values.company_code}
              options={countries}
              optionLabel="code"
              optionValue="code"
              placeholder="Select Company Code"
              filter
              onChange={(e) =>
                formik.setFieldValue("company_code", e.value)
              }
              className={`w-full mt-1 border rounded-lg h-[42px] flex items-centerbg-white`}
              panelClassName="rounded-lg bg-white"
            />

            {formik.touched.company_code && formik.errors.company_code && (
              <p className="text-xs text-red-500 mt-1">
                {formik.errors.company_code}
              </p>
            )}
          </div>


          {/* Admin Name */}
          <div className="mb-4">
            <label className="text-sm font-medium">
              Admin Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="admin_name"
              value={formik.values.admin_name}
              onChange={formik.handleChange}
              className="w-full px-4 py-2 border rounded-lg mt-1"
              placeholder="Enter Admin Name"
            />
            {formik.touched.admin_name && formik.errors.admin_name && (
              <p className="text-xs text-red-500 mt-1">
                {formik.errors.admin_name}
              </p>
            )}
          </div>

          {/* Admin Email */}
          <div className="mb-4">
            <label className="text-sm font-medium">
              Admin Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="admin_email"
              value={formik.values.admin_email}
              onChange={formik.handleChange}
              className="w-full px-4 py-2 border rounded-lg mt-1"
              placeholder="admin@company.com"
            />
            {formik.touched.admin_email && formik.errors.admin_email && (
              <p className="text-xs text-red-500 mt-1">
                {formik.errors.admin_email}
              </p>
            )}
          </div>

          {/* Admin Password */}
          <div className="mb-6">
            <label className="text-sm font-medium">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="admin_password"
              value={formik.values.admin_password}
              onChange={formik.handleChange}
              className="w-full px-4 py-2 border rounded-lg mt-1"
              placeholder="Enter Password"
            />
            {formik.touched.admin_password &&
              formik.errors.admin_password && (
                <p className="text-xs text-red-500 mt-1">
                  {formik.errors.admin_password}
                </p>
              )}
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium">
              Phone Number <span className="text-red-500">*</span>
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
                Area <span className="text-red-500">*</span>
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
                City <span className="text-red-500">*</span>
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
                District <span className="text-red-500">*</span>
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
                State <span className="text-red-500">*</span>
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
                Country <span className="text-red-500">*</span>
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
                PIN Code <span className="text-red-500">*</span>
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
              {isEditMode ? "Update Admin" : " Create Admin"}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}
export default AddCompanyUser
