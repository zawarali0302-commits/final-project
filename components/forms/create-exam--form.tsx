"use client"

import { createExam } from "@/app/actions/exam.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useServerAction } from "@/hook/useServerAction"

interface Props {
    sections: any[]
    courseOfferings: any[]
}

const CreateExamForm = ({ sections, courseOfferings }: Props) => {
    const { execute, isPending } = useServerAction(createExam)

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Create Exam</h1>

            <form action={execute} className="space-y-4">

                <div>
                    <label>Section</label>
                    <select name="sectionId" className="w-full border p-2 rounded" required>
                        <option value="">Select Section</option>
                        {sections.map((section) => (
                            <option key={section.id} value={section.id}>
                                {section.term.program.name} –
                                {section.term.academicYear.name} –
                                {section.term.name} –
                                Section {section.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Course</label>
                    <select name="courseOfferingId" className="w-full border p-2 rounded" required>
                        <option value="">Select Course</option>
                        {courseOfferings.map((offering) => (
                            <option key={offering.id} value={offering.id}>
                                {offering.course.name} ({offering.term.name})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Title</label>
                    <Input name="title" required />
                </div>

                <div>
                    <label>Type</label>
                    <select name="type" className="w-full border p-2 rounded">
                        <option value="MID">Mid</option>
                        <option value="FINAL">Final</option>
                        <option value="QUIZ">Quiz</option>
                        <option value="ASSIGNMENT">Assignment</option>
                    </select>
                </div>

                <div>
                    <label>Date</label>
                    <Input type="date" name="date" required />
                </div>

                <div>
                    <label>Total Marks</label>
                    <Input type="number" name="totalMarks" required />
                </div>

                <Button type="submit" className="w-full">
                    {isPending ? "Creating..." : "Create"}
                </Button>
            </form>
        </div>
    )
}

export default CreateExamForm