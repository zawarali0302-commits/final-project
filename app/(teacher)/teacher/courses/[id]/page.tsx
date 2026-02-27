import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CourseDetailPageProps {
    params: {
        id: string
    }
}

const CourseDetailPage = async ({ params }: CourseDetailPageProps) => {
    const { id } = params
    const clerkUser = await currentUser()
    if (!clerkUser?.id) redirect("/sign-in")

    const email = clerkUser.emailAddresses[0].emailAddress

    const user = await prisma.user.findUnique({
        where: { email },
        include: { teacher: true },
    })

    if (!user || user.role !== "TEACHER" || !user.teacher) redirect("/")

    const teacherId = user.teacher.id

    // 1️⃣ Get all sections of this course assigned to this teacher
    const sectionCourses = await prisma.sectionCourse.findMany({
        where: {
            teacherId,
            courseOffering: {
                course: {
                    id: id,
                },
            }
        },
        include: {
            section: {
                include: {
                    exams: true, // exams in this section
                },
            },
            courseOffering: {
                include: {
                    course: {
                        include: {
                            department: true,
                        },
                    },
                },
            },
        },
    })

    if (!sectionCourses || sectionCourses.length === 0) {
        notFound()
    }

    // 2️⃣ Flatten exams per section with status
    const examsWithSections = sectionCourses.flatMap((sc) =>
        sc.section.exams.map((exam) => ({
            exam,

            section: sc.section,
            courseOffering: sc.courseOffering,
        }))
    )

    return (
        <div className="max-w-6xl mx-auto space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">{sectionCourses[0].courseOffering.course.name}</h1>
                <p className="text-muted-foreground">
                    Course Code: {sectionCourses[0].courseOffering.course.code} • Department: {sectionCourses[0].courseOffering.course.department.name}
                </p>
            </div>

            {/* Sections & Exams */}
            <div className="space-y-6">
                {sectionCourses.map((sc) => (
                    <div key={sc.section.id}>
                        <h2 className="text-xl font-semibold">Section {sc.section.name}</h2>

                        {sc.section.exams.length === 0 ? (
                            <div className="bg-muted rounded-xl p-4 text-muted-foreground">
                                No exams assigned to this section yet.
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-2">
                                {sc.section.exams.map((exam) => {
                                    // Check if teacher has submitted results for this exam
                                    // This can be further improved by counting Results entries for all enrolled students
                                    const isLocked = false // placeholder if you add isLocked logic
                                    return (
                                        <Card key={exam.id} className="hover:shadow-lg transition">
                                            <CardHeader>
                                                <CardTitle>{exam.title}</CardTitle>
                                            </CardHeader>

                                            <CardContent className="space-y-3">
                                                <div className="text-sm text-muted-foreground space-y-1">
                                                    <p>Type: {exam.type}</p>
                                                    <p>Total Marks: {exam.totalMarks}</p>
                                                    <p>Status: {isLocked ? "Locked" : "Open"}</p>
                                                </div>

                                                <Button asChild className="w-full" disabled={isLocked}>
                                                    <Link
                                                        href={`/teacher/courses/${sc.courseOffering.course.id}/sections/${sc.section.id}/exams/${exam.id}`}
                                                    >
                                                        {isLocked ? "Locked" : "Enter Marks"}
                                                    </Link>
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CourseDetailPage