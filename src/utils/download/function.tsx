import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePDF = async (data) => {
  try {
    if (!data || !data.rows || data.rows.length === 0) {
      console.warn("No data available for PDF");
      return;
    }

    const rows = data.rows;
    const columns = data.columns.map((c) => c.column_name);

    const doc = new jsPDF("p", "pt", "a4");

    // Header
    doc.setFontSize(14);
    doc.text("Student List Report", 40, 30);

    autoTable(doc, {
      head: [columns],
      body: rows.map((r) => columns.map((col) => r[col] ?? "N/A")),
      startY: 50,
      margin: { top: 40, bottom: 30 },
      styles: {
        fontSize: 9,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: [255, 255, 255],
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },

      didDrawPage: (dataArg) => {
        // Use doc.getNumberOfPages() instead
        const pageCount = doc.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(`Page ${pageCount}`, 40, 20);
      },
    });

    doc.save("students.pdf");
  } catch (err) {
    console.error("PDF generation failed:", err);
  }
};
