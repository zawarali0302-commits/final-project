import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import React from 'react'

const page =async () => {
    const clerkUser = await currentUser()
    if (!clerkUser?.id) return null // or show generic header

    const user = await prisma.user.findUnique({
        where: { email: clerkUser.emailAddresses[0].emailAddress },
    })
    return (
        <div>
            teacher page for {clerkUser.fullName} - {user?.email} - {user?.role}
        </div>
    )
}

export default page
