"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import Link from "next/link"

type SignupFormData = {
  institutionName: string
  institutionType: string
  location: string
  country?: string
  adminName: string
  adminEmail: string
  password: string
  confirmPassword: string
}

export function SignupForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>()

  const password = watch("password")

  const onSubmit = (data: SignupFormData) => {
    console.log("Optimized Signup Data:", data)
  }

  return (
    <>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Register Your Institution</CardTitle>
          <CardDescription>
            Create an institute account to start generating result cards
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel>Institution Name</FieldLabel>
                <Input
                  placeholder="ABC College"
                  {...register("institutionName", {
                    required: "Institution name is required",
                  })}
                />
                {errors.institutionName && (
                  <FieldDescription className="text-red-500">
                    {errors.institutionName.message}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel>Institution Type</FieldLabel>
                <select
                  {...register("institutionType", { required: true })}
                  className="h-10 w-full rounded-lg border border-input/80 bg-background/80 px-3 py-2 text-sm shadow-sm transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
                >
                  <option value="">Select type</option>
                  <option value="school">School</option>
                  <option value="college">College</option>
                  <option value="university">University</option>
                </select>
              </Field>

              <Field>
                <FieldLabel>Country (Optional)</FieldLabel>
                <Input placeholder="Pakistan" {...register("country")} />
              </Field>

              <Field>
                <FieldLabel>Location</FieldLabel>
                <Input
                  placeholder="Lahore"
                  {...register("location", { required: true })}
                />
              </Field>
              <Field>
                <FieldLabel>Admin Full Name</FieldLabel>
                <Input
                  placeholder="John Doe"
                  {...register("adminName", { required: true })}
                />
              </Field>

              <Field>
                <FieldLabel>Admin Email</FieldLabel>
                <Input
                  type="email"
                  placeholder="admin@college.edu"
                  {...register("adminEmail", { required: true })}
                />
              </Field>

              <Field className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    type="password"
                    {...register("password", {
                      required: true,
                      minLength: 8,
                    })}
                  />
                </Field>

                <Field>
                  <FieldLabel>Confirm Password</FieldLabel>
                  <Input
                    type="password"
                    {...register("confirmPassword", {
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                  />
                </Field>
              </Field>

              <Button type="submit" className="w-full mt-2">
                Create Institution Account
              </Button>

              <FieldDescription className="text-center">
                Already registered?{" "}
                <Link href="/login" className="font-medium underline">
                  Sign in
                </Link>
              </FieldDescription>

            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {/* Legal Text */}
      <FieldDescription className="px-6 text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </>
  )
}
