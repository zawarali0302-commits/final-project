import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getUserWithTeacherByEmail } from "@/prisma/user.service"
import { getSectionCoursesByTeacherId } from "@/prisma/sectionCourse.service"

const Page = async () => {
    const clerkUser = await currentUser()

    if (!clerkUser?.id) {
        redirect("/sign-in")
    }

    const email = clerkUser.emailAddresses[0].emailAddress

    const user = await getUserWithTeacherByEmail(email)

    if (!user || user.role !== "TEACHER" || !user.teacher) {
        redirect("/")
    }

    const courses = await getSectionCoursesByTeacherId(user.teacher.id)
    return (
        <div className="mx-auto max-w-6xl space-y-8">
            <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                <div className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-7">
                    <h1 className="text-2xl font-semibold sm:text-3xl">My Courses</h1>
                    <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                        Courses assigned to you.
                    </p>
                </div>
            </section>

            {courses.length === 0 ? (
                <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground shadow-sm">
                    No courses assigned yet.
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                        <Card key={course.id} className="border-border/70 bg-card/90 py-0 transition hover:-translate-y-1 hover:shadow-md">
                            <CardHeader>
                                <CardTitle>{course.courseOffering.course.name}</CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="space-y-1 text-sm text-muted-foreground">
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
