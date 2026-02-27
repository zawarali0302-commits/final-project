import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const Page = async () => {
    const clerkUser = await currentUser()

    if (!clerkUser?.id) {
        redirect("/sign-in")
    }

    const email = clerkUser.emailAddresses[0].emailAddress

    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            teacher: true,
        },
    })

    if (!user || user.role !== "TEACHER" || !user.teacher) {
        redirect("/")
    }

    // Fetch courses assigned to this teacher
    const courses = await prisma.sectionCourse.findMany({
        where: {
            teacherId: user.teacher.id,
        },
        include: {
            section: true,
            courseOffering: {
                include: {
                    term: {
                        include: {
                            program: true
                        }
                    },
                    course: {
                        include: {
                            department: true
                        }
                    }
                }
            }
        }
    })
    return (
        <div className="max-w-6xl mx-auto space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">My Courses</h1>
                <p className="text-muted-foreground text-lg">
                    Courses assigned to you.
                </p>
            </div>

            {courses.length === 0 ? (
                <div className="bg-muted rounded-xl p-6 text-muted-foreground">
                    No courses assigned yet.
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                        <Card key={course.id} className="hover:shadow-lg transition">
                            <CardHeader>
                                <CardTitle>{course.courseOffering.course.name}</CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p>Code: {course.courseOffering.course.code}</p>
                                    {course.courseOffering.course.department && (
                                        <p>Department: {course.courseOffering.course.department.name}</p>
                                    )}
                                    {course.courseOffering.term.program && (
                                        <p>Program: {course.courseOffering.term.program.name}</p>
                                    )}
                                    {course.courseOffering.term && (
                                        <p>Term: {course.courseOffering.term.name}</p>
                                    )}
                                    {course.section && (
                                        <p>Section: {course.section.name}</p>
                                    )}
                                </div>

                                <Button asChild className="w-full">
                                    <Link href={`/teacher/courses/${course.id}`}>
                                        View Course
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Page