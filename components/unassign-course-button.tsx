import { unassignCourseFromSection } from "@/app/actions/sectionCourse.actions"
import { Button } from "./ui/button"
interface UnassignCourseButtonProps {
    sectionId: string
    sectionCourseId: string
}
const UnassignCourseButton = ({sectionId, sectionCourseId}: UnassignCourseButtonProps) => {
    return (
        <form action={unassignCourseFromSection}>
            <input type="hidden" name="sectionCourseId" value={sectionCourseId } />
            <input type="hidden" name="sectionId" value={sectionId} />
            <Button size="sm" variant="destructive" type="submit">
                Unassign
            </Button>
        </form>
    )
}

export default UnassignCourseButton
