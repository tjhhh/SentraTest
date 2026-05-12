const { Document, Packer, Paragraph } = require("docx");
const JSZip = require("jszip");
const PDFDocument = require("pdfkit");

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
