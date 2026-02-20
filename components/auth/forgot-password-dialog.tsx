"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useForm } from "react-hook-form"
import { useState } from "react"

type ForgotPasswordFormData = {
  email: string
}

export function ForgotPasswordDialog() {
  const [open, setOpen] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordFormData>()

  const onSubmit = async (data: ForgotPasswordFormData) => {
    console.log("Reset email:", data.email)

    // 👉 Backend call here
    // await fetch("/api/auth/forgot-password", { ... })

    setSuccess(true)

    // Auto close after 2 seconds
    setTimeout(() => {
      setOpen(false)
      setSuccess(false)
      reset()
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <DialogTrigger asChild>
        <button
          type="button"
          className="ml-auto text-sm underline-offset-4 hover:underline"
        >
          Forgot password?
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset your password</DialogTitle>
          <DialogDescription>
            {success
              ? "We’ve sent you a password reset link."
              : "Enter your email address and we’ll send you a reset link."}
          </DialogDescription>
        </DialogHeader>

        {!success ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="admin@institution.edu"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send reset link"}
            </Button>
          </form>
        ) : (
          /* Success state */
          <div className="py-6 text-center text-sm text-green-600 font-medium">
            ✅ Email sent successfully
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
