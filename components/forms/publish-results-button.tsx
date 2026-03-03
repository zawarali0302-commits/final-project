"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useServerAction } from "@/hook/useServerAction"
import { setResultsPublishedForExamEvent } from "@/app/actions/result.actions"

interface PublishResultsButtonProps {
  examEventId: string
  published: boolean
  disabled?: boolean
}

export default function PublishResultsButton({
  examEventId,
  published,
  disabled = false,
}: PublishResultsButtonProps) {
  const router = useRouter()
  const { execute, isPending } = useServerAction(setResultsPublishedForExamEvent, {
    onSuccess: () => {
      router.refresh()
    },
  })

  return (
    <Button
      type="button"
      variant={published ? "default" : "destructive"}
      disabled={disabled || isPending}
      onClick={() => execute({ examEventId, published })}
    >
      {isPending ? "Updating..." : published ? "Publish Results" : "Unpublish Results"}
    </Button>
  )
}
