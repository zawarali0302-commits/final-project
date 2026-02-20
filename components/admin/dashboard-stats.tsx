import prisma from '@/lib/prisma'
import { StatCard } from './stat-card'
import { Users, GraduationCap, FileText, LibraryBig } from "lucide-react"

const statItems = [
    {
        id: 1,
        title: "Students",
        value: 0,
        icon: <Users className="h-5 w-5 text-muted-foreground" />,
    },
    {
        id: 2,
        title: "Teachers",
        value: 0,
        icon: <GraduationCap className="h-5 w-5 text-muted-foreground" />,
    },
    {
        id: 3,
        title: "Programs",
        value: 0,
        icon: <LibraryBig className="h-5 w-5 text-muted-foreground" />,
    },
    {
        id: 4,
        title: "Results Generated",
        value: 0,
        icon: <FileText className="h-5 w-5 text-muted-foreground" />,
    },
]
const DashboardStats = async () => {
    const students = await prisma.student.count()
    const teachers = await prisma.teacher.count()
    const programs = await prisma.program.count()
    const results = await prisma.result.count()


    statItems[1].value = teachers
    statItems[0].value = students
    statItems[2].value = programs
    statItems[3].value = results
    return (
        <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {statItems.map((item) => (
                <li key={item.id}>
                    <StatCard
                        title={item.title}
                        value={item.value}
                        icon={item.icon}
                    />
                </li>
            ))}
        </ul>
    )
}

export default DashboardStats;