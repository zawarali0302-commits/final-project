import { UserRole } from '@/app/generated/prisma/enums'
import prisma from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { Button } from './ui/button'
import Link from 'next/link'

const DashboardButton = async () => {
    const clerkUser = await currentUser()
    if (!clerkUser?.id) return null // or show generic header

    // fetch user from DB by clerkId
    const dbUser = await prisma.user.findUnique({
        where: { email: clerkUser.emailAddresses[0].emailAddress },
    })

    const clerkRole = clerkUser.publicMetadata?.role as string | undefined

    const role = dbUser?.role || (clerkRole === "super-admin" ? UserRole.SUPER_ADMIN : undefined)

    const dashboardHref =
        role === UserRole.ADMIN
            ? "/admin"
            : role === UserRole.TEACHER
                ? "/teacher"
                : role === UserRole.SUPER_ADMIN
                    ? "/super-admin"
                    : "/"
    return (
        <Button asChild>
            <Link href={dashboardHref}>
                Dashboard
            </Link>
        </Button>

    )
}

export default DashboardButton
