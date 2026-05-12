const Papa = require('papaparse');
const PDFDocument = require('pdfkit');

/**
 * Export test cases to CSV
 * @param {Array} testCases 
 * @returns {string}
 */
function exportToCSV(testCases) {
  const data = testCases.map(tc => ({
    'Test ID': tc.id,
    'Test Name': tc.name,
    'Input': JSON.stringify(tc.input),
    'Expected Output': tc.expectedOutput,
    'Boundary Type': tc.boundaryType,
    'Category': tc.category,
  }));

  return Papa.unparse(data);
}

/**
 * Export test cases to PDF
 * @param {string} requirement 
 * @param {Array} testCases 
 * @returns {Promise<Buffer>}
 */
async function exportToPDF(requirement, testCases) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Title
    doc.fontSize(20).text('Boundary Value Analysis (BVA) Report', { align: 'center' });
    doc.moveDown();

    // Requirement
    doc.fontSize(12).font('Helvetica-Bold').text('Functional Requirement:');
    doc.fontSize(10).font('Helvetica').text(requirement);
    doc.moveDown();

    // Stats
    doc.fontSize(12).font('Helvetica-Bold').text('Summary Statistics:');
    doc.fontSize(10).font('Helvetica').text(`Total Test Cases: ${testCases.length}`);
    doc.text(`Boundary Cases: ${testCases.filter(tc => tc.category === 'boundary').length}`);
    doc.text(`Valid Cases: ${testCases.filter(tc => tc.category === 'valid').length}`);
    doc.text(`Invalid Cases: ${testCases.filter(tc => tc.category === 'invalid').length}`);
    doc.moveDown();

    // Table Header
    doc.fontSize(12).font('Helvetica-Bold').text('Generated Test Cases:');
    doc.moveDown(0.5);

    testCases.forEach((tc, index) => {
      if (doc.y > 700) doc.addPage();
      
      doc.fontSize(10).font('Helvetica-Bold').text(`${index + 1}. ${tc.name}`);
      doc.fontSize(9).font('Helvetica').text(`ID: ${tc.id}`);
      doc.text(`Input: ${JSON.stringify(tc.input)}`);
      doc.text(`Expected Output: ${tc.expectedOutput}`);
      doc.text(`Type: ${tc.boundaryType} | Category: ${tc.category}`);
      doc.moveDown(0.5);
    });

    doc.end();
  });
}

module.exports = {
  exportToCSV,
  exportToPDF,
};
