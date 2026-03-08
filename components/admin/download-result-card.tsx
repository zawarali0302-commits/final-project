"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface TranscriptSubjectRow {
    subject: string
    totalMarks: number
    obtainedMarks: number
    percentage: number
    grade: string
    status: string
}

interface TranscriptRecord {
    academicYear: string
    examType: string
    term: string
    totalMarks: number
    obtainedMarks: number
    percentage: number
    grade: string
    gpa: number
    subjects: TranscriptSubjectRow[]
}

interface TranscriptStudentInfo {
    institute: string
    name: string
    rollNo: string
    program: string
    session: string
    section: string
}

interface DownloadResultCardProps {
    fileName: string
    student: TranscriptStudentInfo
    records: TranscriptRecord[]
    overall: {
        totalMarks: number
        obtainedMarks: number
        percentage: number
        grade: string
    }
}

export default function DownloadResultCard({
    fileName,
    student,
    records,
    overall,
}: DownloadResultCardProps) {
    const handleDownload = () => {
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "pt",
            format: "a4",
        })
        const docWithTable = doc as jsPDF & { lastAutoTable?: { finalY: number } }
        const pageWidth = doc.internal.pageSize.getWidth()

        let y = 40

        doc.setFontSize(16)
        doc.text(student.institute, pageWidth / 2, y, { align: "center" })
        y += 22

        doc.setFontSize(13)
        doc.text("Official Academic Transcript", pageWidth / 2, y, { align: "center" })
        y += 20

        doc.setFontSize(10)
        doc.text(`Name: ${student.name}`, 40, y)
        doc.text(`Roll No: ${student.rollNo}`, 300, y)
        y += 14
        doc.text(`Program: ${student.program}`, 40, y)
        doc.text(`Session: ${student.session}`, 300, y)
        y += 14
        doc.text(`Section: ${student.section}`, 40, y)
        // doc.text(`Generated: ${new Date().toLocaleString()}`, 300, y)
        // y += 20
        // doc.text(
        //     `Overall: ${overall.obtainedMarks}/${overall.totalMarks} | ${overall.percentage}% | Grade ${overall.grade}`,
        //     40,
        //     y
        // )
        y += 16

        for (let index = 0; index < records.length; index += 1) {
            const record = records[index]
            if (index > 0 && y > 700) {
                doc.addPage()
                y = 40
            }

            //     doc.setFontSize(11)
            //     doc.text(`${record.academicYear} | ${record.examType} | ${record.term}`, 40, y)
            //     y += 14
            //     doc.setFontSize(10)
            //     doc.text(
            //         `Summary: ${record.obtainedMarks}/${record.totalMarks} | ${record.percentage}% | Grade ${record.grade} | GPA ${record.gpa}`,
            //         40,
            //         y
            //     )
            //     y += 8

            autoTable(doc, {
                head: [["Subject", "Total", "Obtained", "%", "Grade", "Status"]],
                body: record.subjects.map((subject) => [
                    subject.subject,
                    subject.totalMarks,
                    subject.obtainedMarks,
                    subject.percentage,
                    subject.grade,
                    subject.status,
                ]),
                startY: y,
                styles: {
                    fontSize: 9,
                    cellPadding: 4,
                },
                headStyles: {
                    fillColor: [30, 41, 59],
                },
                margin: { left: 24, right: 24, bottom: 24 },
            })


            y = (docWithTable.lastAutoTable?.finalY ?? y + 120) + 20
        }

        doc.text(`Obtained Marks: ${overall.obtainedMarks}`, 40, y)
        y += 14
        doc.text(`Total Marks: ${overall.totalMarks}`, 40, y)
        y += 14
        doc.text(`Percentage: ${overall.percentage}`, 40, y)
        y += 14
        doc.text(`Grade: ${overall.grade}`, 40, y)
        y += 14

        doc.text(`Generated: ${new Date().toLocaleString()}`, 400, y)
        y += 20
        // doc.text(
        //     `Overall: ${overall.obtainedMarks}/${overall.totalMarks} | ${overall.percentage}% | Grade ${overall.grade}`,
        //     40,
        //     y
        // )
        
        doc.save(fileName)
    }

    return (
        <Button type="button" variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
        </Button>
    )
}

