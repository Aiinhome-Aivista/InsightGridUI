import { useState } from "react";

const ReportSchedulerForm = () => {
  // Sample report names for dropdown
  const reportNames = [
    "Sales Report",
    "Inventory Report",
    "Customer Analytics",
    "Financial Summary",
    "Performance Dashboard"
  ];

  // Sample email options
  const availableEmails = [
    "abc@gmail.com",
    "xyz@ymail.com",
    "user@company.com",
    "admin@company.com",
    "john@example.com",
    "jane@example.com"
  ];

  const [reports, setReports] = useState([
    { 
      id: 1, 
      reportName: "",
      to: [],
      cc: [],
      days: "", 
      time: "" 
    }
  ]);

  const [openDropdowns, setOpenDropdowns] = useState({});

  const handleAddReport = () => {
    const newReport = {
      id: reports.length + 1,
      reportName: "",
      to: [],
      cc: [],
      days: "",
      time: ""
    };
    setReports([...reports, newReport]);
  };

  const handleRemoveReport = (id) => {
    if (reports.length > 1) {
      setReports(reports.filter(report => report.id !== id));
    }
  };

  const handleReportNameChange = (id, value) => {
    setReports(reports.map(report => 
      report.id === id ? { ...report, reportName: value } : report
    ));
  };

  const toggleEmail = (reportId, field, email) => {
    setReports(reports.map(report => {
      if (report.id === reportId) {
        const currentEmails = report[field];
        const newEmails = currentEmails.includes(email)
          ? currentEmails.filter(e => e !== email)
          : [...currentEmails, email];
        return { ...report, [field]: newEmails };
      }
      return report;
    }));
  };

  const toggleDropdown = (reportId, field) => {
    const key = `${reportId}-${field}`;
    setOpenDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleDaysChange = (id, value) => {
    setReports(reports.map(report => 
      report.id === id ? { ...report, days: value } : report
    ));
  };

  const handleTimeChange = (id, value) => {
    setReports(reports.map(report => 
      report.id === id ? { ...report, time: value } : report
    ));
  };

  const handleSubmit = () => {
    console.log("Reports:", reports);
    alert("Schedule saved! Check console for details.");
  };

  return (
    <div className="mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Create Schedule
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure your report schedule settings
          </p>
        </div>
        
        <button
          onClick={handleAddReport}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all px-6 py-2.5"
        >
          Add Report
        </button>
      </div>

      {/* Reports List */}
      <div className="space-y-6">
        {reports.map((report, index) => (
          <div key={report.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            {/* Header with Remove Button */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700">
                Report #{index + 1}
              </h3>
              {reports.length > 1 && (
                <button
                  onClick={() => handleRemoveReport(report.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              )}
            </div>

            {/* Report Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Name
              </label>
              <select
                value={report.reportName}
                onChange={(e) => handleReportNameChange(report.id, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select a report</option>
                {reportNames.map((name, idx) => (
                  <option key={idx} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mail Fields and Schedule */}
            <div className="grid grid-cols-12 gap-4">
              {/* To */}
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <div className="relative">
                  <div
                    onClick={() => toggleDropdown(report.id, 'to')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg cursor-pointer bg-white hover:border-gray-400 min-h-[42px] flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-700">
                      {report.to.length > 0 ? `${report.to.length} selected` : 'Select emails'}
                    </span>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {openDropdowns[`${report.id}-to`] && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-auto">
                      {availableEmails.map((email, idx) => (
                        <label
                          key={idx}
                          className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={report.to.includes(email)}
                            onChange={() => toggleEmail(report.id, 'to', email)}
                            className="mr-2"
                          />
                          <span className="text-sm">{email}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* CC */}
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CC
                </label>
                <div className="relative">
                  <div
                    onClick={() => toggleDropdown(report.id, 'cc')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg cursor-pointer bg-white hover:border-gray-400 min-h-[42px] flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-700">
                      {report.cc.length > 0 ? `${report.cc.length} selected` : 'Select emails'}
                    </span>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {openDropdowns[`${report.id}-cc`] && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-auto">
                      {availableEmails.map((email, idx) => (
                        <label
                          key={idx}
                          className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={report.cc.includes(email)}
                            onChange={() => toggleEmail(report.id, 'cc', email)}
                            className="mr-2"
                          />
                          <span className="text-sm">{email}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              

              {/* Days */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Days
                </label>
                <input
                  type="text"
                  value={report.days}
                  onChange={(e) => handleDaysChange(report.id, e.target.value)}
                  placeholder="Mon, Wed"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Time */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={report.time}
                  onChange={(e) => handleTimeChange(report.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Selected Emails Display */}
            {(report.to.length > 0 || report.cc.length > 0) && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-700 mb-2">Selected Recipients:</p>
                {report.to.length > 0 && (
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">To:</span> {report.to.join(', ')}
                  </p>
                )}
                {report.cc.length > 0 && (
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">CC:</span> {report.cc.join(', ')}
                  </p>
                )}
                
              </div>
            )}
          </div>
        ))}
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
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
        >
          Save Schedule
        </button>
      </div>
    </div>
  );
};

export default ReportSchedulerForm;