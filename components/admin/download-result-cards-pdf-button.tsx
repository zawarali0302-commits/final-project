"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface PdfRow {
  no: number
  rollNo: string
  name: string
  marks: Array<number | string>
  totalMark: number
  obtainedMark: number
}

interface DownloadResultCardsPdfButtonProps {
  fileName: string
  eventLabel: string
  subjects: string[]
  rows: PdfRow[]
}

export default function DownloadResultCardsPdfButton({
  fileName,
  eventLabel,
  subjects,
  rows,
}: DownloadResultCardsPdfButtonProps) {
  const handleDownload = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    })

    doc.setFontSize(12)
    doc.text("Result Cards", 40, 36)
    doc.setFontSize(10)
    doc.text(eventLabel, 40, 52)
    doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 66)

    const tableHead = [
      ["No", "Roll No", "Name", ...subjects, "Total Mark", "Obtained Mark"],
    ]

    const tableBody = rows.map((row) => [
      row.no,
      row.rollNo,
      row.name,
      ...row.marks,
      row.totalMark,
      row.obtainedMark,
    ])

    autoTable(doc, {
      head: tableHead,
      body: tableBody,
      startY: 80,
      styles: {
        fontSize: 8,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [30, 41, 59],
      },
      margin: { left: 24, right: 24, bottom: 24 },
      tableWidth: "auto",
    })

    doc.save(fileName)
  }

  return (
    <Button type="button" variant="outline" onClick={handleDownload}>
      <Download className="mr-2 h-4 w-4" />
      Download PDF
    </Button>
  )
}
