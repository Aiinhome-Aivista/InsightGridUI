// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// export const generatePDF = async (data) => {
//   try {
//     if (!data || !data.rows || data.rows.length === 0) {
//       console.warn("No data available for PDF");
//       return;
//     }

//     const rows = data.rows;
//     const columns = data.columns.map((c) => c.column_name);

//     const doc = new jsPDF("p", "pt", "a4");

//     // Header
//     doc.setFontSize(14);
//     doc.text("Student List Report", 40, 30);

//     autoTable(doc, {
//       head: [columns],
//       body: rows.map((r) => columns.map((col) => r[col] ?? "N/A")),
//       startY: 50,
//       margin: { top: 40, bottom: 30 },
//       styles: {
//         fontSize: 9,
//         cellPadding: 4,
//       },
//       headStyles: {
//         fillColor: [79, 70, 229],
//         textColor: [255, 255, 255],
//       },
//       alternateRowStyles: { fillColor: [245, 245, 245] },

//       didDrawPage: (dataArg) => {
//         // Use doc.getNumberOfPages() instead
//         const pageCount = doc.getNumberOfPages();
//         doc.setFontSize(10);
//         doc.text(`Page ${pageCount}`, 40, 20);
//       },
//     });

//     doc.save("students.pdf");
//   } catch (err) {
//     console.error("PDF generation failed:", err);
//   }
// };



import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePDF = (data, mode = "download", fileName = "report"
) => {
  if (!data || !data.rows || data.rows.length === 0) {
    console.warn("No data available for PDF");
    return;
  }


  const doc = new jsPDF("p", "pt", "a4");


  const pageWidth = doc.internal.pageSize.getWidth();

  const rows = data.rows;
  const columns = data.columns.map((c) => c.column_name);










  // ===== HEADER =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  // doc.text("All City Report", 40, 40);
  doc.text(fileName, 40, 40);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  // doc.text("Reporter Name", 40, 58);
  doc.text("Report Name", 40, 58);

  doc.setFont("helvetica", "bold");
  doc.text("13/12/2025", 40, 90);
  doc.setFont("helvetica", "normal");
  doc.text("Created On", 40, 105);

  doc.setFont("helvetica", "bold");
  doc.text("Sonia Khatun", pageWidth - 200, 90);
  doc.setFont("helvetica", "normal");
  doc.text("Reporter", pageWidth - 200, 105);

  // Divider line
  doc.setDrawColor(0);
  doc.line(40, 120, pageWidth - 40, 120);

  // ===== TABLE =====
  autoTable(doc, {
    startY: 140,
    head: [columns],
    body: rows.map((r) => columns.map((col) => r[col] ?? "N/A")),

    styles: {
      fontSize: 9,
      cellPadding: 6,
      overflow: "linebreak",
    },

    headStyles: {
      fillColor: [240, 240, 240],
      textColor: 0,
      fontStyle: "bold",
    },

    alternateRowStyles: {
      fillColor: [248, 248, 248],
    },

    didDrawPage: (dataArg) => {
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(9);
      doc.text(
        `Page ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 20,
        { align: "center" }
      );
    },
  });


  // PREVIEW vs DOWNLOAD
  if (mode === "preview") {
    const pdfUrl = doc.output("bloburl");
    window.open(pdfUrl); //  browser preview
  } else {
    // doc.save("sales-report.pdf"); //  direct download
    doc.save(`${fileName}.pdf`);

  }

};
