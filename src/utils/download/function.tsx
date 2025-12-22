
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const fetchImageAsBase64 = async (url: string): Promise<string> => {
  const res = await fetch(url);
  const blob = await res.blob();

  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};

export const generatePDF = async (data, mode = "download", fileName = "report"
) => {
  if (!data || !data.rows || data.rows.length === 0) {
    console.warn("No data available for PDF");
    return;
  }


  const user = JSON.parse(localStorage.getItem("ig_user") || "{}");

  const companyName = user?.company_name || "";
  const companyAddress = user?.company_address || "";
  const logoUrl = user?.company_logo_url || "";
  const createdDate = new Date().toLocaleDateString("en-GB");



  const doc = new jsPDF("p", "pt", "a4");


  const pageWidth = doc.internal.pageSize.getWidth();


  const rows = data.rows;
  const columns = data.columns.map((c) => c.column_name);


  // ===== HEADER =====
  const headerStartY = 40;

  // Logo
  if (logoUrl) {
    try {
      const logoBase64 = await fetchImageAsBase64(logoUrl);
      doc.addImage(logoBase64, "JPEG", 40, headerStartY, 50, 40);
    } catch (e) {
      console.warn("Logo load failed");
    }
  }

  // Company name (same line as logo)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(companyName, 100, headerStartY + 25);

  // Company address (auto wrap)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  const addressX = 100;
  const addressY = headerStartY + 42;
  const maxAddressWidth = pageWidth - 160;

  // Split address into wrapped lines
  const addressLines = doc.splitTextToSize(companyAddress, maxAddressWidth);

  // Draw address
  doc.text(addressLines, addressX, addressY);

  // Calculate Y after address
  const addressHeight = addressLines.length * 12;

  // Created date (placed safely below address)
  doc.text(
    `Created On - ${createdDate}`,
    addressX,
    addressY + addressHeight + 4
  );



  // Divider
  const dividerY = addressY + addressHeight + 20;
  doc.line(40, dividerY, pageWidth - 40, dividerY);



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
    window.open(pdfUrl); 
  } else {
    // doc.save("sales-report.pdf"); 
    doc.save(`${fileName}.pdf`);

  }

};
