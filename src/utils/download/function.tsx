import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const fetchImageAsBase64 = async (url: string): Promise<string> => {
  const res = await fetch(url);
  const blob = await res.blob();

  const base64 = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });

  return await cropImageBase64(base64);
};

const cropImageBase64 = (base64: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const { data, width, height } = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

      let minX = width,
        minY = height,
        maxX = 0,
        maxY = 0;

      const isBackground = (r: number, g: number, b: number) =>
        (r + g + b) / 3 > 235;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];

          if (a > 10 && !isBackground(r, g, b)) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }

      if (minX > maxX || minY > maxY) {
        resolve(base64);
        return;
      }

      const cropW = maxX - minX + 1;
      const cropH = maxY - minY + 1;

      const croppedCanvas = document.createElement("canvas");
      const croppedCtx = croppedCanvas.getContext("2d")!;
      croppedCanvas.width = cropW;
      croppedCanvas.height = cropH;

      croppedCtx.drawImage(
        canvas,
        minX,
        minY,
        cropW,
        cropH,
        0,
        0,
        cropW,
        cropH
      );

      resolve(croppedCanvas.toDataURL("image/png"));
    };
  });
};

export const generatePDF = async (
  data,
  chartImageUrls,
  mode = "download",
  fileName = "report",
  previewChartData
) => {
  if (!data || !data.rows || data.rows.length === 0) {
    console.warn("No data available for PDF");
    return;
  }
  console.log("Generating PDF...",chartImageUrls);

  const user = JSON.parse(localStorage.getItem("ig_user") || "{}");

  const companyName = user?.company_name || "";
  const companyAddress = user?.company_address || "";
  const logoUrl = user?.company_logo_url || "";
  const createdDate = new Date().toLocaleDateString("en-GB");

  const columnCount = data.columns.length;

  let orientation: "p" | "l" = "p";
  let pageFormat: "a4" | "a3" = "a4";

  if (columnCount > 6 && columnCount <= 10) {
    orientation = "l"; // A4 landscape
  } else if (columnCount > 10) {
    orientation = "l";
    pageFormat = "a3"; // A3 landscape
  }

  const doc = new jsPDF({
    orientation,
    unit: "pt",
    format: pageFormat,
  });


  const pageWidth = doc.internal.pageSize.getWidth();

  const rows = data.rows;
  const columns = data.columns.map((c) => c.column_name);


  const formatHeader = (headerText: string) => {
    if (!headerText) return "";
    return headerText.replace(/_/g, " ").toUpperCase();
  };
  const headers = data.columns.map(
    (c) => c.header || formatHeader(c.column_name)
  );
  // ===== HEADER =====
  const headerStartY = 40;

  // Logo
  const logoX = 40;
  const logoY = headerStartY;
  const logoW = 50;
  const logoH = 40;

  if (logoUrl) {
    const logoBase64 = await fetchImageAsBase64(logoUrl);
    doc.addImage(logoBase64, "PNG", logoX, logoY, logoW, logoH);
  }

  // Row 1: Company name (VERTICALLY CENTERED with logo)
  const companyFontSize = 16;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(companyFontSize);

  const companyNameY = logoY + logoH / 2 + companyFontSize / 2 - 2; // perfectly centered

  doc.text(companyName, logoX + logoW + 10, companyNameY);

  // Row 2: Address (limited width, not full row)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  const addressX = 38;
  const addressY = logoY + logoH + 8;
  const addressWidth = pageWidth * 0.35;

  const addressLines = doc.splitTextToSize(companyAddress, addressWidth);

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

  const chartImages: string[] = [];

  // 🔥 previewChartData is actually IMAGE URL array now
  for (const imgUrl of chartImageUrls || []) {
    const base64 = await fetchImageAsBase64(imgUrl);
    chartImages.push(base64);
  }

  // ===== CHART IMAGES =====
  let yPos = dividerY + 30;

  const marginX = 40;
  const gapX = 20;
  const gapY = 30;

  const usableWidth = pageWidth - marginX * 2;
  const chartWidth = (usableWidth - gapX) / 2;
  const chartHeight = (chartWidth * 9) / 16;

  let xPos = marginX;

  chartImages.forEach((img, index) => {
    const pageHeight = doc.internal.pageSize.getHeight();

    // Page break
    if (yPos + chartHeight > pageHeight - 40) {
      doc.addPage();
      yPos = 40;
      xPos = marginX;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    // doc.text(`Chart ${index + 1}`, xPos, yPos - 8);

    // const chartTitle = previewChartData?.[index]?.customTitle;
    // doc.text(chartTitle, xPos, yPos - 8);

    doc.addImage(img, "PNG", xPos, yPos, chartWidth, chartHeight);
    // Move position
    if (index % 2 === 0) {
      // first chart in row → move right
      xPos += chartWidth + gapX;
    } else {
      // second chart → new row
      xPos = marginX;
      yPos += chartHeight + gapY;
    }
  });

  /**
   * 🔥 IMPORTANT FIX
   * If last row has only ONE chart, move Y down
   */
  if (chartImages.length % 2 !== 0) {
    yPos += chartHeight + gapY;
  }

  const tableStartY = yPos + 20;
  autoTable(doc, {
    startY: tableStartY,

    head: [headers],
    body: rows.map((r) => columns.map((col) => r[col] ?? "")),

    theme: "grid",
    tableWidth: "auto",
    horizontalPageBreak: true,
    horizontalPageBreakRepeat: headers,

    styles: {
      fontSize: columnCount > 14 ? 7 : 9,
      cellPadding: { top: 6, bottom: 6, left: 5, right: 5 },

      halign: "center",          // 🔥 horizontal center (ALL CELLS)
      valign: "middle",          // 🔥 vertical center (ALL CELLS)

      textColor: [31, 41, 55],
      overflow: "linebreak",

      lineColor: [209, 213, 219],
      lineWidth: 0.5,
    },

    headStyles: {
      fillColor: [243, 244, 246],
      textColor: [61, 91, 129],
      fontStyle: "bold",

      halign: "center",          // 🔥 header horizontal center
      valign: "middle",          // 🔥 header vertical center

      minCellHeight: 32,         // 🔥 fixed header height
    },

    bodyStyles: {
      halign: "center",          // 🔥 body horizontal center
      valign: "middle",          // 🔥 body vertical center
      textColor: [61, 91, 129],
      minCellHeight: 26,         // 🔥 uniform row height
    },

    didParseCell(data) {
      const row = rows[data.row.index];

      // Highlight aggregation rows
      if (row?.__isAggregation) {
        data.cell.styles.fillColor = [243, 246, 250];
        data.cell.styles.fontStyle = "bold";
      }
    },

    didDrawPage() {
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
    const today = new Date();

    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // month is 0-based
    const yyyy = today.getFullYear();

    const dateSuffix = `${dd}${mm}${yyyy}`;

    //Final filename
    doc.save(`${fileName}${dateSuffix}.pdf`);
  }
};
