
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
  const logoX = 40;
  const logoY = headerStartY;
  const logoW = 50;
  const logoH = 40;

  if (logoUrl) {
    const logoBase64 = await fetchImageAsBase64(logoUrl);
    doc.addImage(logoBase64, "JPEG", logoX, logoY, logoW, logoH);
  }

  // Row 1: Company name (VERTICALLY CENTERED with logo)
  const companyFontSize = 16;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(companyFontSize);

  const companyNameY =
    logoY + logoH / 2 + companyFontSize / 2 - 2; // perfectly centered

  doc.text(companyName, logoX + logoW + 10, companyNameY);


  // Row 2: Address (limited width, not full row)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  const addressX = 40;              // start from left
  const addressY = logoY + logoH + 8;
  const addressWidth = 300;         // 👈 LIMIT WIDTH HERE

  const addressLines = doc.splitTextToSize(
    companyAddress,
    addressWidth
  );

  doc.text(addressLines, addressX, addressY);


  // Row 3: Created date (below address)
  const lineHeight = 12;
  const addressHeight = addressLines.length * lineHeight;

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
    window.open(pdfUrl); //  browser preview
  } else {
    // doc.save("sales-report.pdf"); //  direct download
    doc.save(`${fileName}.pdf`);

  }

};
