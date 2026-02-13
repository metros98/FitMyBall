"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ResetPasswordPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your email to reset your password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Password reset functionality requires email service configuration.
              This feature will be available in a future update.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              disabled
              placeholder="your@email.com"
            />
          </div>

          <Button className="w-full" disabled>
            Send Reset Link
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            <Link href="/login" className="underline hover:text-primary">
              Back to login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
