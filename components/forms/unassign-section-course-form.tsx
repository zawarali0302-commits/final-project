"use client"

import { unassignCourseFromSection } from "@/app/actions/sectionCourse.actions"
import { Button } from "../ui/button"
import { useServerAction } from "@/hook/useServerAction"

interface UnassignSectionCourseFormProps {
    sectionId: string
    sectionCourseId: string
}

const UnassignSectionCourseForm = ({
    sectionId,
    sectionCourseId,
}: UnassignSectionCourseFormProps) => {
    const { execute, isPending } = useServerAction(unassignCourseFromSection)

    return (
        <form action={execute}>
            <input type="hidden" name="sectionCourseId" value={sectionCourseId} />
            <input type="hidden" name="sectionId" value={sectionId} />

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

export default UnassignSectionCourseForm