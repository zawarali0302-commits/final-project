import Link from "next/link";
import { Button } from "../ui/button";
import StatCard from "./stat-card";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { UserRole } from "@/app/generated/prisma/enums";

const stats = [
    {
        id: 1,
        value: "100+",
        label: "Institutions",
    },
    {
        id: 2,
        value: "50k+",
        label: "Students",
    },
    {
        id: 3,
        value: "99%",
        label: "Accuracy",
    },
    {
        id: 4,
        value: "24/7",
        label: "Availability",
    }
]

const HeroSection = async () => {
    const clerkUser = await currentUser()
    let showRegisterInstitute = false

    if (clerkUser) {
        const email = clerkUser.primaryEmailAddress?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress

        if (email) {
            const dbUser = await prisma.user.findUnique({
                where: { email },
                select: {
                    role: true,
                    instituteId: true,
                },
            })

            showRegisterInstitute = !(dbUser?.role === UserRole.ADMIN && Boolean(dbUser.instituteId))
        }
    }

    return (
        <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
                <h2 className="text-4xl font-bold leading-tight mb-6">
                    Generate Student Result Cards
                    <span className="block text-gray-500">For Any School or College</span>
                </h2>
                <p className="text-gray-600 mb-8 max-w-xl">
                    A modern platform that helps educational institutions create and
                    manage official student result cards efficiently.
                </p>
                <div className="flex gap-4">
                    {showRegisterInstitute && (
                        <Button asChild>
                            <Link href="/register-institute">Register Your Institute</Link>
                        </Button>
                    )}
                </div>
            </div>


            <ul className="bg-white rounded-3xl shadow-lg p-8 grid grid-cols-2 gap-6 text-center">
                {stats.map(stat => (
                    <li key={stat.id}>
                        <StatCard value={stat.value} label={stat.label} />
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default HeroSection;
