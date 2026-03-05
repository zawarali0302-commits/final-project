import { UserRole } from '@/app/generated/prisma/enums'
import { getDashboardUserByEmail } from '@/prisma/user.service'
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import { Button } from './ui/button'

const getMetadataRole = (role: unknown): UserRole | undefined => {
    const value = String(role ?? '').trim().toLowerCase().replace(/[_\s]/g, '-')
    if (value === 'super-admin' || value === 'superadmin') return UserRole.SUPER_ADMIN
    if (value === 'admin') return UserRole.ADMIN
    if (value === 'teacher') return UserRole.TEACHER
    return undefined
}

const DashboardButton = async () => {
    const clerkUser = await currentUser()
    if (!clerkUser) {
        return null
    }

    const email = clerkUser.primaryEmailAddress?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress

    const metadataRole = getMetadataRole(clerkUser.publicMetadata?.role)

    const dbUser = email ? await getDashboardUserByEmail(email) : null

    // Super admin can be metadata-only without DB row.
    const role = dbUser?.role ?? metadataRole

    const canShowDashboard =
        role === UserRole.SUPER_ADMIN ||
        (role === UserRole.ADMIN && Boolean(dbUser?.instituteId)) ||
        (role === UserRole.TEACHER && Boolean(dbUser?.teacher))

    if (!canShowDashboard) {
        return null
    }

    const dashboardHref =
        role === UserRole.ADMIN
            ? '/admin'
            : role === UserRole.TEACHER
                ? '/teacher'
                : '/super-admin'

    return (
        <Button asChild>
            <Link href={dashboardHref}>Dashboard</Link>
        </Button>
    )
}

export default DashboardButton
