import { useEffect, useState, useRef } from "react";
import {
  X,
  Plus,
  Book,
  Search,
  Trash2,
  ArrowLeft,
  Users,
  Mail,
} from "lucide-react";
import ApiServices from "../../services/ApiServices";
import { useNavigate } from "react-router-dom";
import { useLocation, useParams } from "react-router-dom";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import { WEEK_DAYS } from "../../utils/download/helper";
import { Dropdown } from "primereact/dropdown";
const ReportSchedulerForm = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [addingEmail, setAddingEmail] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isAddressBookOpen, setIsAddressBookOpen] = useState(false);
  const [selectedAddressBook, setSelectedAddressBook] = useState<number | null>(
    null,
  );
  const [newEmailForBook, setNewEmailForBook] = useState("");
  const [newAddressBookName, setNewAddressBookName] = useState("");
  const [isCreatingNewBook, setIsCreatingNewBook] = useState(false);
  const [creatingBook, setCreatingBook] = useState(false);
  const [scheduleNameError, setScheduleNameError] = useState("");
  const [reportSchedule, setReportSchedule] = useState({
    scheduleId: null, //  ADD করো
    scheduleName: "",
    reportName: "",
    toInput: "",
    ccInput: "",
    to: [],
    cc: [],
    toSuggestions: [],
    ccSuggestions: [],
    // mailTitle: "",
    // mailBody: "",
    frequency: "",
    selectedDays: "",
    scheduleTime: "",
  });

  const [activeInputs, setActiveInputs] = useState({
    to: false,
    cc: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const [dropdownData, setDropdownData] = useState<
    { label: string; value: string }[]
  >([]);
  const [addressBooks, setAddressBooks] = useState<
    { id: number; name: string; emails: string[] }[]
  >([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // route param (optional)
  const isEditMode = Boolean(reportSchedule.scheduleId);
  const originalScheduleRef = useRef<any>(null);
  const existingScheduleNames: string[] = location.state?.scheduleNames || [];

  const selectedBook = addressBooks.find(
    (book) => book.id === selectedAddressBook,
  );

  const addressBookOptions = addressBooks.map((book) => ({
    label: `${book.name} (${book.emails.length} emails)`,
    value: book.id,
  }));

  const frequencyOptions = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
  ];

  useEffect(() => {
    // 🔹 EDIT MODE: state দিয়ে আসলে
    // if (location.state?.schedule) {
    //   const s = location.state.schedule;

    //   setReportSchedule({
    //     scheduleId: s.id,
    //     scheduleName: s.schedule_name || "",
    //     reportName: s.report_id || "",

    //     to: JSON.parse(s.recipient_to || "[]"),
    //     cc: JSON.parse(s.recipient_cc || "[]"),

    //     toInput: "",
    //     ccInput: "",
    //     toSuggestions: [],
    //     ccSuggestions: [],

    //     mailTitle: s.mail_title || "",
    //     mailBody: s.mail_body || "",
    //     frequency: s.frequency || "",
    //     selectedDays: s.selected_days || "",
    //     scheduleTime: s.schedule_time || "",
    //   });

    //   return;
    // }
    if (location.state?.schedule) {
      const s = location.state.schedule;

      const initialData = {
        scheduleId: s.id,
        scheduleName: s.schedule_name || "",
        reportName: s.report_id || "",
        to: JSON.parse(s.recipient_to || "[]"),
        cc: JSON.parse(s.recipient_cc || "[]"),
        toInput: "",
        ccInput: "",
        toSuggestions: [],
        ccSuggestions: [],
        // mailTitle: s.mail_title || "",
        // mailBody: s.mail_body || "",
        frequency: s.frequency || "",
        selectedDays: s.selected_days || "",
        scheduleTime: s.schedule_time || "",
      };

      originalScheduleRef.current = initialData;
      setReportSchedule(initialData);
      return;
    }
    // 🔹 ADD MODE (new)
    setReportSchedule((prev) => ({
      ...prev,
      scheduleId: null,
    }));
  }, [location.state, id]);

  useEffect(() => {
    fetchReportsDropdown();
    fetchAddressBooks();
  }, []);

  const fetchAddressBooks = async () => {
    try {
      const user = getUserContext();
      if (!user?.session_id || !user?.user_id) return;

      const payload = {
        created_by: user.user_id,
        session_id: user.session_id,
      };

      const res = await ApiServices.addressBookList(payload);

      if (res?.data?.isSuccess) {
        const books = (res.data.data || []).map((b) => ({
          ...b,
          emails: Array.isArray(b.emails)
            ? b.emails
            : JSON.parse(b.emails || "[]"),
        }));

        setAddressBooks(books);
      }
    } catch (err) {
      console.error("Address book load failed", err);
    }
  };

  const getUserContext = () => {
    try {
      const raw = localStorage.getItem("ig_user");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const fetchReportsDropdown = async () => {
    try {
      const user = getUserContext();

      const payload = {
        created_by: user?.user_id || null,
        session_id: user?.session_id || null,
      };

      const res = await ApiServices.reportsDropdown(payload);

      if (res?.data?.isSuccess) {
        setDropdownData(res.data.data);
      }
    } catch (error) {
      console.error("Failed to load reports dropdown", error);
    }
  };

  // Get all unique emails from all address books
  const getAllEmails = (): string[] => {
    const allEmails = new Set<string>();
    addressBooks.forEach((book) => {
      book.emails.forEach((email) => allEmails.add(email));
    });
    return Array.from(allEmails);
  };

  // Get suggestions including both emails and address books
  const getSuggestions = (
    input: string,
  ): { type: string; value: string; id?: number }[] => {
    if (!input) return [];

    const suggestions: { type: string; value: string; id?: number }[] = [];
    const lowerInput = input.toLowerCase();

    // Add matching emails
    const allEmails = getAllEmails();
    allEmails.forEach((email) => {
      if (email.toLowerCase().includes(lowerInput)) {
        suggestions.push({ type: "email", value: email });
      }
    });

    // Add matching address books
    addressBooks.forEach((book) => {
      if (book.name.toLowerCase().includes(lowerInput)) {
        suggestions.push({
          type: "addressBook",
          value: book.name,
          id: book.id,
        });
      }
    });

    return suggestions;
  };

  // Handle email input change
  const handleEmailInputChange = (field: "to" | "cc", value: string) => {
    const suggestions = getSuggestions(value);
    setReportSchedule({
      ...reportSchedule,
      [`${field}Input`]: value,
      [`${field}Suggestions`]: suggestions,
    });
  };

  // Add email or address book to the field
  const handleAddItem = (field, item) => {
    if (item.type === "email") {
      // Add single email
      if (!reportSchedule[field].includes(item.value)) {
        setReportSchedule({
          ...reportSchedule,
          [field]: [...reportSchedule[field], item.value],
          [`${field}Input`]: "",
          [`${field}Suggestions`]: [],
        });

        // Add to recent searches if not already there
        if (
          !recentSearches.includes(item.value) &&
          !getAllEmails().includes(item.value)
        ) {
          setRecentSearches([item.value, ...recentSearches]);
        }
      }
    } else if (item.type === "addressBook") {
      // Add all emails from the address book
      const book = addressBooks.find((b) => b.id === item.id);
      if (book) {
        const newEmails = book.emails.filter(
          (email) => !reportSchedule[field].includes(email),
        );
        setReportSchedule({
          ...reportSchedule,
          [field]: [...reportSchedule[field], ...newEmails],
          [`${field}Input`]: "",
          [`${field}Suggestions`]: [],
        });
      }
    }
    setActiveInputs({ ...activeInputs, [field]: false });
  };

  // Remove email chip
  const handleRemoveEmailChip = (field, email) => {
    setReportSchedule({
      ...reportSchedule,
      [field]: reportSchedule[field].filter((e) => e !== email),
    });
  };

  // Handle adding email to selected address book from recent searches
  const handleAddToAddressBook = async (email: string) => {
    if (!selectedAddressBook) return;

    try {
      const user = getUserContext();
      const payload = {
        address_book_id: selectedAddressBook,
        email,
        created_by: user.user_id,
        session_id: user.session_id,
      };

      const res = await ApiServices.addressBookEmailAdd(payload);

      if (res?.data?.isSuccess) {
        fetchAddressBooks(); // 🔥 single source of truth
      }
    } catch (err) {
      console.error("Add to address book failed", err);
    }
  };

  // Handle removing from recent searches
  const handleRemoveFromRecentSearches = (email) => {
    setRecentSearches(recentSearches.filter((e) => e !== email));
  };

  // Handle adding email to selected address book
  const handleAddEmailToBook = async () => {
    if (!newEmailForBook || !selectedAddressBook) return;

    try {
      setAddingEmail(true);

      const user = getUserContext();
      const payload = {
        address_book_id: selectedAddressBook,
        email: newEmailForBook,
        created_by: user.user_id,
        session_id: user.session_id,
      };

      const res = await ApiServices.addressBookEmailAdd(payload);

      // ✅ SUCCESS
      if (res?.data?.isSuccess) {
        setNewEmailForBook("");
        fetchAddressBooks();
      }
    } catch (err: any) {
      // 🔥🔥 THIS IS WHERE 409 IS HANDLED 🔥🔥
      if (err?.response?.status === 409) {
        alert(err.response.data.message);
        // "Email already exists in this address book"
        return;
      }

      console.error("Add email failed", err);
    } finally {
      setAddingEmail(false);
    }
  };
  // Handle creating new address book
  const handleCreateAddressBook = async () => {
    if (!newAddressBookName.trim()) return;

    try {
      setCreatingBook(true);

      const user = getUserContext();
      const payload = {
        name: newAddressBookName.trim(),
        created_by: user.user_id,
        session_id: user.session_id,
      };

      const res = await ApiServices.addressBookCreate(payload);

      if (res?.data?.isSuccess) {
        setNewAddressBookName("");
        setIsCreatingNewBook(false);
        fetchAddressBooks();
      }
    } catch (err) {
      console.error("Create address book failed", err);
    } finally {
      setCreatingBook(false);
    }
  };

  // Handle removing email from address book
  const handleRemoveFromBook = async (bookId: number, email: string) => {
    try {
      const user = getUserContext();
      const payload = {
        address_book_id: bookId,
        email,
        created_by: user.user_id,
        session_id: user.session_id,
      };

      const res = await ApiServices.addressBookEmailRemove(payload);

      if (res?.data?.isSuccess) {
        fetchAddressBooks(); // 🔥 refresh
      }
    } catch (err) {
      console.error("Remove email failed", err);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      const user = getUserContext();
      if (!user) return;

      const payload = {
        schedule_id: reportSchedule.scheduleId, // ⭐ null = ADD | value = EDIT
        session_id: user.session_id,
        created_by: user.user_id,
        schedule_name: reportSchedule.scheduleName,
        report_id: reportSchedule.reportName,
        // mail_title: reportSchedule.mailTitle,
        // mail_body: reportSchedule.mailBody,
        to: reportSchedule.to,
        cc: reportSchedule.cc,
        schedule_time: reportSchedule.scheduleTime,
        frequency: reportSchedule.frequency,
        selected_days: reportSchedule.selectedDays,
        is_active: true,
      };

      const res = await ApiServices.saveReportScheduler(payload);

      if (res?.data?.isSuccess) {
        navigate(-1); // optional
      }
    } catch (err) {
      console.error("Save schedule failed", err);
      // alert("Failed to save schedule");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetForm = () => {
    if (isResetting) return;

    setIsResetting(true);

    setTimeout(() => {
      if (isEditMode && originalScheduleRef.current) {
        // 🔄 Reset to original EDIT data
        setReportSchedule({
          ...originalScheduleRef.current,
          toInput: "",
          ccInput: "",
          toSuggestions: [],
          ccSuggestions: [],
        });
      } else {
        // 🆕 Reset CREATE form
        setReportSchedule({
          scheduleId: null,
          scheduleName: "",
          reportName: "",
          toInput: "",
          ccInput: "",
          to: [],
          cc: [],
          toSuggestions: [],
          ccSuggestions: [],
          // mailTitle: "",
          // mailBody: "",
          frequency: "",
          selectedDays: "",
          scheduleTime: "",
        });
      }

      // 🔥 Reset UI-only states
      setActiveInputs({ to: false, cc: false });
      setSelectedAddressBook(null);
      setNewEmailForBook("");
      setIsCreatingNewBook(false);

      setIsResetting(false);
    }, 400);
  };

  const toggleWeekDay = (day: string) => {
    const currentDays = reportSchedule.selectedDays
      ? reportSchedule.selectedDays.split(",").map((d) => d.trim())
      : [];

    const updatedDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];

    setReportSchedule({
      ...reportSchedule,
      selectedDays: updatedDays.join(", "),
    });
  };

  return (
    <div className="mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {isEditMode ? "Edit Schedule" : "Create Schedule"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Configure your report schedule settings
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddressBookOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all px-6 py-2.5 flex items-center gap-2"
          >
            <Book size={16} />
            Address Book
          </button>
          {!isEditMode && (
            <button
              type="button"
              onClick={handleResetForm}
              disabled={isResetting}
              className={`w-10 h-10 flex items-center justify-center rounded-lg border border-[#D9D9D9] bg-[#F3F3F3] hover:bg-[#E5E5E5] transition-all
  ${isResetting ? "cursor-wait opacity-70" : "cursor-pointer"}`}
            >
              <AutorenewRoundedIcon
                className={`w-5 h-5 text-gray-600 ${
                  isResetting ? "animate-spin" : ""
                }`}
                fontSize="small"
              />
            </button>
          )}
        </div>
      </div>

      {/* Report Form */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="col-span-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Schedule Name
          </label>
          <input
            type="text"
            value={reportSchedule.scheduleName}
            // onChange={(e) =>
            //   setReportSchedule({
            //     ...reportSchedule,
            //     scheduleName: e.target.value,
            //   })
            // }
            onChange={(e) => {
              const value = e.target.value;
              const normalized = value.toLowerCase().trim();

              const isDuplicate =
                existingScheduleNames
                  .map((n) => n.toLowerCase().trim())
                  .includes(normalized) &&
                normalized !==
                  originalScheduleRef.current?.scheduleName
                    ?.toLowerCase()
                    .trim();

              setScheduleNameError(
                isDuplicate ? "Schedule name already exists" : "",
              );

              setReportSchedule({
                ...reportSchedule,
                scheduleName: value,
              });
            }}
            placeholder="Enter schedule name"
            className={`w-full px-3 py-2 border rounded-lg
    ${
      scheduleNameError
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    }`}
            // className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {scheduleNameError && (
            <p className="text-red-500 text-xs mt-1">{scheduleNameError}</p>
          )}
        </div>
        {/* Report Name */}
        {/* <div className="mb-4 mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Name
          </label>
          <select
            value={reportSchedule.reportName}
            onChange={(e) =>
              setReportSchedule({
                ...reportSchedule,
                reportName: e.target.value,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select a report</option>
            {dropdownData.map((reportItem) => (
              <option key={reportItem.value} value={reportItem.value}>
                {reportItem.label}
              </option>
            ))}
          </select>
        </div> */}
        {/* Report Name – Searchable PrimeReact Dropdown */}
        <div className="mb-4 mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Name
          </label>

          <Dropdown
            value={reportSchedule.reportName || null}
            options={dropdownData}
            optionLabel="label"
            optionValue="value"
            placeholder="Select Report"
            filter
            filterPlaceholder="Search report..."
            appendTo="self"
            onChange={(e) =>
              setReportSchedule({
                ...reportSchedule,
                reportName: e.value,
              })
            }
            className="
      w-full h-10 text-sm
      rounded-xl
      flex items-center justify-between
      transition-all duration-200
      bg-white
      border focus:outline-none focus:ring-1 focus:ring-[#5433FF]
    "
            panelClassName="
      bg-white rounded-xl border border-gray-100 overflow-hidden text-sm
    "
            pt={{
              root: { className: "cursor-pointer" },

              input: {
                className: `
          text-sm font-medium text-gray-700
          px-3 py-2 h-full flex items-center
          overflow-hidden text-ellipsis whitespace-nowrap
        `,
              },

              trigger: {
                className:
                  "w-8 flex items-center justify-center text-gray-400 shrink-0",
              },

              /* 🔍 Search styling */
              filterContainer: {
                className: "px-3 py-2 border-b border-gray-100",
              },

              filterInput: {
                className: `
          w-full
          pl-10 pr-3 py-2
          text-sm
          border border-gray-200
          rounded-lg
          focus:ring-1 focus:ring-[#5433FF]
          outline-none
        `,
              },

              list: { className: "p-1" },

              item: ({ context }: any) => ({
                className: `
          px-3 py-2 rounded-xl cursor-pointer transition-colors mb-0.5
          ${
            context.selected
              ? "bg-gray-100 font-semibold text-gray-900"
              : "hover:bg-gray-50 text-gray-700"
          }
        `,
              }),

              itemLabel: { className: "font-medium" },
            }}
          />
        </div>

        {/* Mail Fields and Schedule */}
        <div className="grid grid-cols-12 gap-4">
          {/* To Field */}
          <div className="col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To
            </label>
            <div className="relative">
              <div className="w-full min-h-[42px] px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                <div className="flex flex-wrap gap-2">
                  {reportSchedule.to.map((email, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                    >
                      {email}
                      <button
                        onClick={() => handleRemoveEmailChip("to", email)}
                        className="hover:text-blue-900"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <div className="relative flex-1 min-w-[120px]">
                    <div className="flex items-center">
                      <Search size={14} className="text-gray-400 mr-1" />
                      <input
                        type="text"
                        value={reportSchedule.toInput}
                        onChange={(e) =>
                          handleEmailInputChange("to", e.target.value)
                        }
                        onFocus={() =>
                          setActiveInputs({ ...activeInputs, to: true })
                        }
                        onKeyPress={(e) => {
                          if (
                            e.key === "Enter" &&
                            reportSchedule.toInput.trim()
                          ) {
                            e.preventDefault();
                            const email = reportSchedule.toInput.trim();
                            if (!reportSchedule.to.includes(email)) {
                              setReportSchedule({
                                ...reportSchedule,
                                to: [...reportSchedule.to, email],
                                toInput: "",
                                toSuggestions: [],
                              });
                              // Add to recent searches if not already there
                              if (
                                !recentSearches.includes(email) &&
                                !getAllEmails().includes(email)
                              ) {
                                setRecentSearches([email, ...recentSearches]);
                              }
                            } else {
                              setReportSchedule({
                                ...reportSchedule,
                                toInput: "",
                                toSuggestions: [],
                              });
                            }
                            setActiveInputs({ ...activeInputs, to: false });
                          }
                        }}
                        placeholder="Search email or address book..."
                        className="flex-1 outline-none text-sm"
                      />
                    </div>
                    {activeInputs.to &&
                      reportSchedule.toSuggestions.length > 0 && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-auto">
                          {reportSchedule.toSuggestions.map((item, idx) => (
                            <div
                              key={idx}
                              onClick={() => handleAddItem("to", item)}
                              className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm flex items-center justify-between"
                            >
                              <span>{item.value}</span>
                              {item.type === "addressBook" ? (
                                <Users size={14} className="text-purple-500" />
                              ) : (
                                <Mail size={14} className="text-gray-400" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CC Field */}
          <div className="col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CC
            </label>
            <div className="relative">
              <div className="w-full min-h-[42px] px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                <div className="flex flex-wrap gap-2">
                  {reportSchedule.cc.map((email, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs"
                    >
                      {email}
                      <button
                        onClick={() => handleRemoveEmailChip("cc", email)}
                        className="hover:text-green-900"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <div className="relative flex-1 min-w-[100px]">
                    <div className="flex items-center">
                      <Search size={14} className="text-gray-400 mr-1" />
                      <input
                        type="text"
                        value={reportSchedule.ccInput}
                        onChange={(e) =>
                          handleEmailInputChange("cc", e.target.value)
                        }
                        onFocus={() =>
                          setActiveInputs({ ...activeInputs, cc: true })
                        }
                        onKeyPress={(e) => {
                          if (
                            e.key === "Enter" &&
                            reportSchedule.ccInput.trim()
                          ) {
                            e.preventDefault();
                            const email = reportSchedule.ccInput.trim();
                            if (!reportSchedule.cc.includes(email)) {
                              setReportSchedule({
                                ...reportSchedule,
                                cc: [...reportSchedule.cc, email],
                                ccInput: "",
                                ccSuggestions: [],
                              });
                              // Add to recent searches if not already there
                              if (
                                !recentSearches.includes(email) &&
                                !getAllEmails().includes(email)
                              ) {
                                setRecentSearches([email, ...recentSearches]);
                              }
                            } else {
                              setReportSchedule({
                                ...reportSchedule,
                                ccInput: "",
                                ccSuggestions: [],
                              });
                            }
                            setActiveInputs({ ...activeInputs, cc: false });
                          }
                        }}
                        placeholder="Search email or address book..."
                        className="flex-1 outline-none text-sm"
                      />
                    </div>
                    {activeInputs.cc &&
                      reportSchedule.ccSuggestions.length > 0 && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-auto">
                          {reportSchedule.ccSuggestions.map((item, idx) => (
                            <div
                              key={idx}
                              onClick={() => handleAddItem("cc", item)}
                              className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm flex items-center justify-between"
                            >
                              <span>{item.value}</span>
                              {item.type === "addressBook" ? (
                                <Users size={14} className="text-purple-500" />
                              ) : (
                                <Mail size={14} className="text-gray-400" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Frequency */}
          {/* <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequency
            </label>
            <select
              value={reportSchedule.frequency}
              onChange={(e) => {
                const value = e.target.value;

                setReportSchedule({
                  ...reportSchedule,
                  frequency: value,
                  selectedDays: value === "daily" ? "" : reportSchedule.selectedDays,
                });
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select frequency</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>

          </div> */}
          {/* Frequency – PrimeReact Dropdown */}
          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequency
            </label>

            <Dropdown
              value={reportSchedule.frequency || null}
              options={frequencyOptions}
              optionLabel="label"
              optionValue="value"
              placeholder="Select Frequency"
              filter
              filterPlaceholder="Search frequency..."
              appendTo="self"
              onChange={(e) => {
                const value = e.value;

                setReportSchedule({
                  ...reportSchedule,
                  frequency: value,
                  selectedDays:
                    value === "daily" ? "" : reportSchedule.selectedDays,
                });
              }}
              className="
      w-full h-10 text-sm
      rounded-xl
      flex items-center justify-between
      transition-all duration-200
      bg-white
      border focus:outline-none focus:ring-1 focus:ring-[#5433FF]
    "
              panelClassName="
      bg-white rounded-xl border border-gray-100 overflow-hidden text-sm
    "
              pt={{
                root: { className: "cursor-pointer" },
                input: {
                  className: `
          text-sm font-medium text-gray-700
          px-3 py-2 h-full flex items-center
          overflow-hidden text-ellipsis whitespace-nowrap
        `,
                },
                trigger: {
                  className:
                    "w-8 flex items-center justify-center text-gray-400 shrink-0",
                },
                filterContainer: {
                  className: "px-3 py-2 ",
                },

                list: { className: "p-1" },
                item: ({ context }: any) => ({
                  className: `
          px-3 py-2 rounded-xl cursor-pointer transition-colors mb-0.5
          ${
            context.selected
              ? "bg-gray-100 font-semibold text-gray-900"
              : "hover:bg-gray-50 text-gray-700"
          }
        `,
                }),
                itemLabel: { className: "font-medium" },
              }}
            />
          </div>

          {/* Mail Title */}
          {/* <div className="col-span-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mail Title
            </label>
            <input
              type="text"
              value={reportSchedule.mailTitle}
              onChange={(e) =>
                setReportSchedule({
                  ...reportSchedule,
                  mailTitle: e.target.value,
                })
              }
              placeholder="Enter mail subject"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div> */}

          {/* Selected Days */}
          {/* <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selected Days
            </label>
            <input
              type="text"
              value={reportSchedule.selectedDays}
              onChange={(e) =>
                setReportSchedule({
                  ...reportSchedule,
                  selectedDays: e.target.value,
                })
              }
              placeholder="Monday, Thursday"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div> */}
          {/* WEEKLY – Multi-day selector */}
          {reportSchedule.frequency === "weekly" && (
            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Days
              </label>

              <div className="flex flex-wrap gap-2">
                {WEEK_DAYS.map((day) => {
                  const isSelected = reportSchedule.selectedDays
                    .split(",")
                    .map((d) => d.trim())
                    .includes(day);

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleWeekDay(day)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all
              ${
                isSelected
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* MONTHLY – Native Calendar */}
          {reportSchedule.frequency === "monthly" && (
            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>

              <input
                type="date"
                onChange={(e) => {
                  const day = new Date(e.target.value).getDate();
                  setReportSchedule({
                    ...reportSchedule,
                    selectedDays: String(day),
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <p className="text-xs text-gray-500 mt-2">
                Only the day will be used (every month)
              </p>
            </div>
          )}

          {/* Schedule Time */}
          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule Time
            </label>
            <input
              type="time"
              value={reportSchedule.scheduleTime}
              onChange={(e) =>
                setReportSchedule({
                  ...reportSchedule,
                  scheduleTime: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Mail Body */}
          {/* <div className="col-span-12">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mail Body
            </label>
            <textarea
              value={reportSchedule.mailBody}
              onChange={(e) =>
                setReportSchedule({
                  ...reportSchedule,
                  mailBody: e.target.value,
                })
              }
              placeholder="Enter mail body..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div> */}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className={`px-6 py-2 rounded-lg transition-all text-white flex items-center gap-2
    ${isSaving ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}
  `}
        >
          {isSaving && (
            <AutorenewRoundedIcon className="animate-spin" fontSize="small" />
          )}

          {isEditMode ? "Edit Schedule" : "Save Schedule"}
        </button>
      </div>

      {/* Address Book Modal */}
      {isAddressBookOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Address Book Manager
              </h2>
              <button
                onClick={() => setIsAddressBookOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {/* Address Book Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Address Book
                </label>
                <div className="flex gap-2">
                  <Dropdown
                    value={selectedAddressBook || null}
                    options={addressBookOptions}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Choose an address book"
                    filter
                    filterPlaceholder="Search address book..."
                    appendTo="self"
                    onChange={(e) => setSelectedAddressBook(e.value)}
                    className="
    flex-1 h-10 text-sm
    rounded-xl
    flex items-center justify-between
    transition-all duration-200
    bg-white
    border focus:outline-none focus:ring-1 focus:ring-[#5433FF]
  "
                    panelClassName="
    bg-white rounded-xl border border-gray-100 overflow-hidden text-sm
  "
                    pt={{
                      root: { className: "cursor-pointer" },

                      input: {
                        className: `
        text-sm font-medium text-gray-700
        px-3 py-2 h-full flex items-center
        overflow-hidden text-ellipsis whitespace-nowrap
      `,
                      },

                      trigger: {
                        className:
                          "w-8 flex items-center justify-center text-gray-400 shrink-0",
                      },

                      /* 🔍 Search box styling */
                      filterContainer: {
                        className: "px-3 py-2 border-b border-gray-100",
                      },

                      filterInput: {
                        className: `
        w-full
        pl-10 pr-3 py-2
        text-sm
        border border-gray-200
        rounded-lg
        focus:ring-1 focus:ring-[#5433FF]
        outline-none
      `,
                      },

                      list: { className: "p-1" },

                      item: ({ context }: any) => ({
                        className: `
        px-3 py-2 rounded-xl cursor-pointer transition-colors mb-0.5
        ${
          context.selected
            ? "bg-gray-100 font-semibold text-gray-900"
            : "hover:bg-gray-50 text-gray-700"
        }
      `,
                      }),

                      itemLabel: { className: "font-medium" },
                    }}
                  />

                  <button
                    onClick={() => setIsCreatingNewBook(true)}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 transition-all flex items-center gap-2"
                  >
                    <Plus size={16} />
                    New
                  </button>
                </div>
              </div>

              {/* Create New Address Book */}
              {isCreatingNewBook && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Create New Address Book
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAddressBookName}
                      onChange={(e) => setNewAddressBookName(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleCreateAddressBook()
                      }
                      placeholder="Enter address book name"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                      onClick={handleCreateAddressBook}
                      disabled={creatingBook}
                      className={`px-6 py-2 rounded-lg transition-all text-white
${creatingBook ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}
`}
                    >
                      {creatingBook ? "Creating..." : "Create"}
                    </button>
                    <button
                      onClick={() => {
                        setIsCreatingNewBook(false);
                        setNewAddressBookName("");
                      }}
                      className="border border-gray-300 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Add Email to Selected Book */}
              {selectedAddressBook && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Email to "{selectedBook?.name}"
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={newEmailForBook}
                      onChange={(e) => setNewEmailForBook(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddEmailToBook()
                      }
                      placeholder="Enter email address"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                      onClick={handleAddEmailToBook}
                      disabled={addingEmail}
                      className={`rounded-lg px-6 py-2 text-white transition-all
    ${addingEmail ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}
  `}
                    >
                      {addingEmail ? "Adding..." : "Add"}
                    </button>
                  </div>
                </div>
              )}

              {/* Recent Searches */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Recent Searches
                </h3>
                <div className="border border-gray-200 rounded-lg">
                  {recentSearches.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No recent searches
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {recentSearches.map((email, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 hover:bg-gray-50"
                        >
                          <span className="text-sm text-gray-700">{email}</span>
                          <div className="flex items-center gap-2">
                            {selectedAddressBook && (
                              <button
                                onClick={() => handleAddToAddressBook(email)}
                                className="text-blue-600 hover:text-blue-700 p-1"
                                title="Add to selected address book"
                              >
                                <Plus size={16} />
                              </button>
                            )}
                            <button
                              onClick={() =>
                                handleRemoveFromRecentSearches(email)
                              }
                              className="text-red-600 hover:text-red-700 p-1"
                              title="Remove from recent searches"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Address Book Emails */}
              {selectedBook && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Emails in "{selectedBook.name}"
                  </h3>
                  <div className="border border-gray-200 rounded-lg">
                    {selectedBook.emails.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No emails in this address book yet
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {(Array.isArray(selectedBook.emails)
                          ? selectedBook.emails
                          : []
                        ).map((email, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 hover:bg-gray-50"
                          >
                            <span className="text-sm text-gray-700">
                              {email}
                            </span>
                            <button
                              onClick={() =>
                                handleRemoveFromBook(selectedBook.id, email)
                              }
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setIsAddressBookOpen(false)}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportSchedulerForm;
