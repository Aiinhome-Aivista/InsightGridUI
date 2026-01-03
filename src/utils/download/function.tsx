import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";


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

      const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);

      let minX = width, minY = height, maxX = 0, maxY = 0;

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

      croppedCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);

      resolve(croppedCanvas.toDataURL("image/png"));
    };
  });
};




export const generatePDF = async (data, mode = "download", fileName = "report", chartImages: string[] = []
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
    doc.addImage(logoBase64, "PNG", logoX, logoY, logoW, logoH);

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

  const addressX = 38;
  const addressY = logoY + logoH + 8;
  const addressWidth = pageWidth * 0.35;

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
  // autoTable(doc, {
  //   startY: 140,
  //   head: [columns],
  //   body: rows.map((r) => columns.map((col) => r[col] ?? "N/A")),

  //   styles: {
  //     fontSize: 9,
  //     cellPadding: 6,
  //     overflow: "linebreak",
  //   },

  //   headStyles: {
  //     fillColor: [240, 240, 240],
  //     textColor: 0,
  //     fontStyle: "bold",
  //   },

  //   alternateRowStyles: {
  //     fillColor: [248, 248, 248],
  //   },

  //   didDrawPage: (dataArg) => {
  //     const pageCount = doc.getNumberOfPages();
  //     doc.setFontSize(9);
  //     doc.text(
  //       `Page ${pageCount}`,
  //       pageWidth / 2,
  //       doc.internal.pageSize.getHeight() - 20,
  //       { align: "center" }
  //     );
  //   },
  // });
  autoTable(doc, {
    startY: 140,
    head: [columns],
    body: rows.map((r) => columns.map((col) => r[col] ?? "")),

    styles: {
      fontSize: 9,
      cellPadding: 6,
      textColor: [31, 41, 55]
    },

    headStyles: {
      fillColor: [240, 240, 240],
      fontStyle: "bold"
    },

    didParseCell(data) {
      const rowIndex = data.row.index;
      const row = rows[rowIndex];

      if (row?.__isAggregation) {
        data.cell.styles.fillColor = [243, 246, 250]; // light highlight
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
    }
  });

  // ===== CHART IMAGES =====
  let yPos = (doc as any).lastAutoTable.finalY + 30;

  for (let i = 0; i < chartImages.length; i++) {
    const img = chartImages[i];

    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();

    const imgWidth = pageWidth - 80;
    const imgHeight = (imgWidth * 9) / 16; // safe ratio

    if (yPos + imgHeight > pageHeight) {
      doc.addPage();
      yPos = 40;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`Chart ${i + 1}`, 40, yPos - 10);

    doc.addImage(img, "PNG", 40, yPos, imgWidth, imgHeight);

    yPos += imgHeight + 30;
  }


  // PREVIEW vs DOWNLOAD
  if (mode === "preview") {
    const pdfUrl = doc.output("bloburl");
    window.open(pdfUrl); //  browser preview
  } else {
    // doc.save("sales-report.pdf"); //  direct download
    doc.save(`${fileName}.pdf`);

  }

};