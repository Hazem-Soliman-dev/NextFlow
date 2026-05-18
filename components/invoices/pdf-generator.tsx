"use client"

import jsPDF from "jspdf"
import { format } from "date-fns"

export const generateInvoicePDF = (invoice: any) => {
  const doc = new jsPDF()
  
  // Colors & Fonts
  doc.setFont("helvetica")
  
  // Header
  doc.setFontSize(24)
  doc.setTextColor(99, 102, 241) // Indigo 500
  doc.text("Nexflow Inc.", 14, 25)
  
  doc.setFontSize(10)
  doc.setTextColor(100, 116, 139) // Slate 500
  doc.text("123 Business Avenue", 14, 32)
  doc.text("Suite 100, Tech City", 14, 37)
  doc.text("contact@nexflow.demo", 14, 42)
  
  // Invoice Details
  doc.setFontSize(30)
  doc.setTextColor(200, 200, 200)
  doc.text("INVOICE", 140, 25)
  
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  doc.text(`Invoice No: ${invoice.number}`, 140, 35)
  doc.text(`Issue Date: ${format(new Date(invoice.createdAt), "MMM d, yyyy")}`, 140, 42)
  doc.text(`Due Date: ${format(new Date(invoice.dueDate), "MMM d, yyyy")}`, 140, 49)
  
  // Bill To
  doc.setFontSize(12)
  doc.setTextColor(100, 116, 139)
  doc.text("BILL TO", 14, 65)
  
  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  doc.text(invoice.contact?.name || "", 14, 73)
  
  doc.setFontSize(11)
  if (invoice.contact?.company) doc.text(invoice.contact.company, 14, 80)
  if (invoice.contact?.email) doc.text(invoice.contact.email, 14, invoice.contact?.company ? 87 : 80)

  // Line Items Header
  let y = 110
  doc.setFillColor(241, 245, 249) // Slate 100
  doc.rect(14, y - 6, 182, 10, "F")
  
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text("Description", 16, y)
  doc.text("Qty", 120, y)
  doc.text("Unit Price", 145, y)
  doc.text("Total", 175, y)
  
  // Line Items
  doc.setFont("helvetica", "normal")
  y += 10
  invoice.lineItems?.forEach((item: any) => {
    const desc = item.product?.name || item.description || "Item"
    doc.text(desc.length > 40 ? desc.substring(0, 37) + "..." : desc, 16, y)
    doc.text(item.quantity.toString(), 120, y)
    doc.text(`$${item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 145, y)
    doc.text(`$${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 175, y)
    y += 10
  })

  // Totals
  y += 10
  doc.line(120, y - 5, 196, y - 5) // Line above subtotal
  
  doc.text("Subtotal:", 140, y)
  doc.text(`$${invoice.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 175, y)
  
  y += 8
  doc.text("Tax (10%):", 140, y)
  doc.text(`$${invoice.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 175, y)
  
  y += 10
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(99, 102, 241)
  doc.text("Total Due:", 140, y)
  doc.text(`$${invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 175, y)
  
  // Footer
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(100, 116, 139)
  doc.text("Thank you for your business!", 105, 270, { align: "center" })
  
  doc.save(`${invoice.number}.pdf`)
}
