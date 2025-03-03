"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
  }

  return (
    <div className="w-full">
      {/* Gradient only applies to the top */}
      <div className="w-full bg-gradient-to-r from-purple-800/70 to-blue-900/70 py-24 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Have questions or concerns? Fill out the form below and we'll get back to you as soon as possible.
        </p>
      </div>

      {/* Content below is in a container to prevent full width expansion */}
      <div className="container mx-auto px-6 mt-12 max-w-3xl">
        <Card className="bg-gray-900/50 border-gray-800 shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">First Name</label>
                  <Input
                    className="bg-gray-900/90 border-gray-800 text-white"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Last Name</label>
                  <Input
                    className="bg-gray-900/90 border-gray-800 text-white"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Email</label>
                <Input
                  type="email"
                  className="bg-gray-900/90 border-gray-800 text-white"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Subject</label>
                <Input
                  className="bg-gray-900/90 border-gray-800 text-white"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Message</label>
                <Textarea
                  className="bg-gray-900/90 border-gray-800 text-white min-h-[150px]"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Other Ways to Reach Us Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Other Ways to Reach Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-gray-900/50 border-gray-800 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
                <p className="text-gray-300">support@chainswitch.com</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Phone</h3>
                <p className="text-gray-300">+1 (555) 123-4567</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Office</h3>
                <p className="text-gray-300">
                  123 Blockchain Street
                  <br />
                  Tech City, TC 12345
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
