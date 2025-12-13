// downloadView.tsx
import React from "react";
import { generatePDF } from "./function";

const DownloadView = ({ data }) => {
  const safeRows = data?.rows ?? [];
  const safeColumns = data?.columns ?? [];

  return (
    <div style={{ padding: 20 }}>
      <button
        onClick={() => generatePDF(data)}
        style={{
          padding: "10px 16px",
          background: "#4F46E5",
          color: "white",
          border: "none",
          borderRadius: 6,
        }}
      >
        Download PDF
      </button>

      {safeRows.length === 0 && (
        <p style={{ color: "red", marginTop: 10 }}>
          No student data available.
        </p>
      )}
    </div>
  );
};

export default DownloadView;
