"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useServerAction } from "@/hook/useServerAction"
import { computeResultsForExamEvent } from "@/app/actions/result.actions"

interface ComputeResultsButtonProps {
  examEventId: string
  disabled?: boolean
}

export default function ComputeResultsButton({
  examEventId,
  disabled = false,
}: ComputeResultsButtonProps) {
  const router = useRouter()
  const { execute, isPending } = useServerAction(computeResultsForExamEvent, {
    onSuccess: () => {
      router.refresh()
    },
  })

  return (
    <Button
      type="button"
      disabled={disabled || isPending}
      onClick={() => execute(examEventId)}
    >
      {isPending ? "Computing..." : "Compute Results"}
    </Button>
  )
}
