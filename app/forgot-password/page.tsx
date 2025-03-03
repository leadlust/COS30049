"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle the password reset logic
    console.log("Password reset requested for:", email)
    // For now, we'll just show a success message
    setIsSubmitted(true)
  }

  return (
    <div className="container mx-auto mt-8 max-w-md">
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-200">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                Reset Password
              </Button>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-green-400 mb-4">Password reset link sent to your email!</p>
              <Button onClick={() => router.push("/login")} className="bg-blue-500 hover:bg-blue-600 text-white">
                Back to Login
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <Link href="/login" className="text-sm text-blue-400 hover:text-blue-300">
            Remember your password? Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

