"use client"

import type React from "react"

import { useState } from "react"
import DashboardPageLayout from "@/components/dashboard/layout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import BracketsIcon from "@/components/icons/brackets"

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "Analyst",
    email: "analyst@onyxlytics.com",
    username: "analyst_pro",
    bio: "Blockchain data analyst",
    profileImage: "/avatars/user_mati.png",
  })

  const [formData, setFormData] = useState(profile)
  const [isSaved, setIsSaved] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setIsSaved(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profileImage: reader.result as string }))
        setIsSaved(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = () => {
    setProfile(formData)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <DashboardPageLayout
      header={{
        title: "Settings",
        description: "Configure your Onyxlytics preferences and profile",
        icon: BracketsIcon,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5">
                <Bullet />
                USER PROFILE
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center gap-4">
                <img
                  src={formData.profileImage || "/placeholder.svg"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-2 border-accent object-cover"
                />
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <span className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                    CHANGE PROFILE PICTURE
                  </span>
                </label>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-2">FULL NAME</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-accent border border-muted rounded text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-2">USERNAME</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-accent border border-muted rounded text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                    placeholder="Your username"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-2">EMAIL</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-accent border border-muted rounded text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-2">BIO</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-3 bg-accent border border-muted rounded text-sm focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                    placeholder="Tell us about yourself"
                  />
                </div>

                <button
                  onClick={handleSaveProfile}
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-medium rounded transition-colors"
                >
                  {isSaved ? "PROFILE SAVED" : "SAVE PROFILE"}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Data Refresh Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5">
                <Bullet />
                DATA REFRESH
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">REFRESH INTERVAL</label>
                <select className="w-full p-3 bg-accent border border-muted rounded text-sm focus:outline-none focus:border-cyan-400 transition-colors">
                  <option>1 second (Real-time)</option>
                  <option>5 seconds</option>
                  <option>10 seconds</option>
                  <option>30 seconds</option>
                  <option>1 minute</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Query Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5">
                <Bullet />
                QUERY SETTINGS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">AUTO-SAVE QUERIES</label>
                <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">REAL-TIME UPDATES</label>
                <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">SHOW NOTIFICATIONS</label>
                <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Leaderboard Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-sm">
                <Bullet />
                LEADERBOARD
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">RANK</p>
                <p className="text-2xl font-display">#1,247</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">POINTS</p>
                <p className="text-2xl font-display">8,450</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">QUERIES RUN</p>
                <p className="text-2xl font-display">342</p>
              </div>
            </CardContent>
          </Card>

          {/* RPC Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-sm">
                <Bullet />
                RPC ENDPOINT
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground">CURRENT</p>
                <p className="text-xs text-cyan-400 break-all">https://api.mainnet-beta.solana.com</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mt-3">STATUS</p>
                <p className="text-xs text-green-400">CONNECTED</p>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-sm">
                <Bullet />
                ABOUT
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground">VERSION</p>
                <p className="text-sm">1.0.0 MVP</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">NETWORK</p>
                <p className="text-sm">Solana Mainnet</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">LAST UPDATED</p>
                <p className="text-sm">{new Date().toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardPageLayout>
  )
}
