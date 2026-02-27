"use client"

import { unassignCourseFromTerm } from "@/app/actions/courseOffering.actions"
import { Button } from "../ui/button"
import { useServerAction } from "@/hook/useServerAction"

interface UnassignTermCourseFormProps {
    termId: string
    courseOfferingId: string
}

const UnassignTermCourseForm = ({
    termId, courseOfferingId
}: UnassignTermCourseFormProps) => {
    const { execute, isPending } = useServerAction(unassignCourseFromTerm)

    return (
        <form action={execute}>
            <input type="hidden" name="courseOfferingId" value={courseOfferingId} />
            <input type="hidden" name="termId" value={termId} />

            <Button
                size="sm"
                variant="destructive"
                type="submit"
                disabled={isPending}
            >
                {isPending ? "Removing..." : "Unassign"}
            </Button>
        </form>
    )
}

export default UnassignTermCourseForm