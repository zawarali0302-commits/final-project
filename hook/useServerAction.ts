"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type ActionResponse = {
  success: boolean
  message: string
}

export function useServerAction<T>(
  action: (data: T) => Promise<ActionResponse>,
  options?: {
    redirectTo?: string
    onSuccess?: () => void
  }
) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const execute = (data: T) => {
    startTransition(async () => {
      const res = await action(data)

      if (res.success) {
        toast.success(res.message, { position: "top-right" })

        options?.onSuccess?.()

        if (options?.redirectTo) {
          router.push(options.redirectTo)
        }
      } else {
        toast.error(res.message, { position: "top-right" })
      }
    })
  }

  return { execute, isPending }
}