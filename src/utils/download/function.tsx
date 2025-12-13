import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePDF = (data) => {
  if (!data?.rows?.length) {
    console.warn("No data available for PDF");
    return;
  }

  const doc = new jsPDF("p", "pt", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();

  const columns = data.columns.map((c) => c.column_name);
  const rows = data.rows.map((row) =>
    columns.map((col) => row[col] ?? "N/A")
  );

  // ===== HEADER =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Sales Report", 40, 40);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Reporter Name", 40, 58);

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
    body: rows,

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

  doc.save("sales-report.pdf");
};
