import test from "node:test";
import assert from "node:assert/strict";
import { jsPDF } from "jspdf";

test("project brief PDF export retains text, wrapping and Blob output", async () => {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.text("Project Brief: Preview fixture", 20, 20);
  doc.setFontSize(12);
  doc.text("URL: https://example.invalid", 20, 30);
  for (const [title, y] of [["Description", 45], ["Goals", 80], ["Target Audience", 115]]) {
    doc.text(title, 20, y);
    const lines = doc.splitTextToSize("Synthetic project brief content for PDF compatibility validation.", 170);
    assert.ok(lines.length > 0);
    doc.text(lines, 20, y + 10);
  }
  const blob = doc.output("blob");
  assert.equal(blob.type, "application/pdf");
  const pdf = await blob.text();
  assert.ok(pdf.startsWith("%PDF-"));
  assert.ok(pdf.includes("Project Brief: Preview fixture"));
  assert.ok(pdf.includes("%%EOF"));
});
