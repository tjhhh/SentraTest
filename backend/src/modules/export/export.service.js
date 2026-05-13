const { Document, Packer, Paragraph } = require("docx");
const JSZip = require("jszip");
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");

const { createExportRecord } = require("./export.repository");

function bufferFromPdf(payload) {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.text(JSON.stringify(payload, null, 2));
    doc.end();
  });
}

async function bufferFromDocx(payload) {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [new Paragraph(JSON.stringify(payload, null, 2))],
    }],
  });

  return Packer.toBuffer(doc);
}

async function bufferFromZip(payload) {
  const zip = new JSZip();
  zip.file("playwright.spec.js", "// generated script\nconsole.log('playwright');");
  zip.file("payload.json", JSON.stringify(payload, null, 2));
  return zip.generateAsync({ type: "nodebuffer" });
}

async function bufferFromXlsx(payload) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Test Cases");

  // Set column widths
  worksheet.columns = [
    { header: "Test Case ID", key: "id", width: 12 },
    { header: "Test Case Name", key: "case", width: 20 },
    { header: "Mock Input", key: "input", width: 35 },
    { header: "Expected Output", key: "expected", width: 35 },
    { header: "Notes", key: "notes", width: 25 },
    { header: "Status", key: "status", width: 12 },
  ];

  // Style header row
  worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF4F46E5" }, // Indigo color
  };
  worksheet.getRow(1).alignment = { horizontal: "center", vertical: "center" };

  // Add test cases
  if (Array.isArray(payload.testCases)) {
    payload.testCases.forEach((testCase) => {
      worksheet.addRow({
        id: testCase.id || "",
        case: testCase.case || "",
        input: testCase.input || "",
        expected: testCase.expected || "",
        notes: testCase.notes || "",
        status: testCase.status || "Pending",
      });
    });
  }

  // Add metadata sheet
  const metaSheet = workbook.addWorksheet("Metadata");
  metaSheet.columns = [
    { header: "Property", key: "property", width: 20 },
    { header: "Value", key: "value", width: 40 },
  ];
  metaSheet.getRow(1).font = { bold: true };
  metaSheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF4F46E5" },
  };
  metaSheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };

  metaSheet.addRow({ property: "Method", value: payload.method || "Unknown" });
  metaSheet.addRow({ property: "Generated At", value: payload.timestamp || new Date().toISOString() });
  metaSheet.addRow({ property: "Test Case Count", value: payload.testCaseCount || 0 });

  return workbook.xlsx.writeBuffer();
}

async function exportByFormat({ userId, format, payload, defaultFileName = "export" }) {
  const lower = format.toLowerCase();
  const extension = lower;
  const fileName = `${defaultFileName}.${extension}`;
  let fileBuffer;

  if (format === "JSON") {
    fileBuffer = Buffer.from(JSON.stringify(payload, null, 2));
  } else if (format === "PDF") {
    fileBuffer = await bufferFromPdf(payload);
  } else if (format === "DOCX") {
    fileBuffer = await bufferFromDocx(payload);
  } else if (format === "XLSX") {
    fileBuffer = await bufferFromXlsx(payload);
  } else if (format === "ZIP") {
    fileBuffer = await bufferFromZip(payload);
  } else {
    const err = new Error("Unsupported export format");
    err.status = 400;
    throw err;
  }

  await createExportRecord({
    userId,
    format,
    fileName,
    meta: { size: fileBuffer.length },
  });

  const contentTypeByFormat = {
    PDF: "application/pdf",
    DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ZIP: "application/zip",
    JSON: "application/json",
  };

  return {
    fileName,
    contentType: contentTypeByFormat[format] || "application/octet-stream",
    base64: fileBuffer.toString("base64"),
  };
}

module.exports = { exportByFormat };
