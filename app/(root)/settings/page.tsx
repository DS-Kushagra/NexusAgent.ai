"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/actions/auth.action";

interface UserPreferences {
  emailNotifications: boolean;
  weeklyReports: boolean;
  streakReminders: boolean;
  interviewSuggestions: boolean;
  reminderHours: number;
}

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  location: string;
  currentRole: string;
  experience: string;
  targetRole: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "profile" | "notifications" | "account"
  >("profile");
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prefsResponse, profileResponse] = await Promise.all([
        fetch("/api/automation/preferences"),
        fetch("/api/user/profile"),
      ]);

      if (prefsResponse.ok) {
        const prefsData = await prefsResponse.json();
        setPreferences(prefsData.preferences);
      }

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfile(profileData.profile);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!preferences) return;

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/automation/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        setMessage("Notification settings saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      setMessage("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        setMessage("Profile updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (
    key: keyof UserPreferences,
    value: boolean | number
  ) => {
    if (!preferences) return;
    setPreferences({ ...preferences, [key]: value });
  };

  const updateProfile = (key: keyof UserProfile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [key]: value });
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Error logging out:", error);
      setMessage("Failed to logout");
      setLoggingOut(false);
    }
  };

  const handleDeleteRequest = async () => {
    if (!deleteReason.trim()) {
      setMessage("Please provide a reason for account deletion");
      return;
    }

    setDeleting(true);
    setMessage("");

    try {
      const response = await fetch("/api/user/delete-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: deleteReason }),
      });

      if (response.ok) {
        setMessage(
          "Account deletion request submitted successfully! You will receive a confirmation email shortly. ✅"
        );
        setShowDeleteModal(false);
        setDeleteReason("");
        setTimeout(() => {
          handleLogout();
        }, 3000);
      } else {
        setMessage("Failed to submit deletion request");
      }
    } catch (error) {
      console.error("Error requesting deletion:", error);
      setMessage("Failed to submit deletion request");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="root-layout max-w-5xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-dark-200 rounded w-1/3" />
          <div className="h-10 bg-dark-200 rounded w-full" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 bg-dark-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!preferences || !profile) {
    return (
      <div className="root-layout max-w-5xl mx-auto">
        <div className="text-center py-12">
          <p className="text-red-400 text-lg mb-4">Failed to load settings</p>
          <Button onClick={fetchData} className="btn-primary">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="root-layout max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your profile and preferences
          </p>
        </div>
        <Button
          onClick={() => router.back()}
          className="bg-dark-300 hover:bg-dark-400 px-6"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </Button>
      </div>

      {/* Message Toast */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-slide-down ${
            message.includes("success") || message.includes("✅")
              ? "bg-green-500/10 border border-green-500/20"
              : "bg-red-500/10 border border-red-500/20"
          }`}
        >
          {message.includes("success") || message.includes("✅") ? (
            <svg
              className="w-5 h-5 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
          <span
            className={
              message.includes("success") || message.includes("✅")
                ? "text-green-400"
                : "text-red-400"
            }
          >
            {message}
          </span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-dark-300">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-4 px-2 font-semibold transition-all relative ${
            activeTab === "profile"
              ? "text-primary-500"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            User Profile
          </div>
          {activeTab === "profile" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`pb-4 px-2 font-semibold transition-all relative ${
            activeTab === "notifications"
              ? "text-primary-500"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            Notifications
          </div>
          {activeTab === "notifications" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("account")}
          className={`pb-4 px-2 font-semibold transition-all relative ${
            activeTab === "account"
              ? "text-primary-500"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Account & Security
          </div>
          {activeTab === "account" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
          )}
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="bg-dark-200 rounded-xl p-6 border border-dark-300 hover:border-primary-500/30 transition-all">
              <label className="block mb-3">
                <span className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Full Name
                </span>
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => updateProfile("name", e.target.value)}
                className="w-full bg-dark-300 border border-dark-400 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div className="bg-dark-200 rounded-xl p-6 border border-dark-300 hover:border-primary-500/30 transition-all">
              <label className="block mb-3">
                <span className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Email Address
                </span>
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => updateProfile("email", e.target.value)}
                className="w-full bg-dark-300 border border-dark-400 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="your@email.com"
              />
            </div>

            {/* Location */}
            <div className="bg-dark-200 rounded-xl p-6 border border-dark-300 hover:border-primary-500/30 transition-all">
              <label className="block mb-3">
                <span className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Location
                </span>
              </label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => updateProfile("location", e.target.value)}
                className="w-full bg-dark-300 border border-dark-400 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            {/* Experience */}
            <div className="bg-dark-200 rounded-xl p-6 border border-dark-300 hover:border-primary-500/30 transition-all">
              <label className="block mb-3">
                <span className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Years of Experience
                </span>
              </label>
              <input
                type="text"
                value={profile.experience}
                onChange={(e) => updateProfile("experience", e.target.value)}
                className="w-full bg-dark-300 border border-dark-400 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="e.g., 0-1, 3-5, 5+"
              />
            </div>

            {/* Current Role */}
            <div className="bg-dark-200 rounded-xl p-6 border border-dark-300 hover:border-primary-500/30 transition-all">
              <label className="block mb-3">
                <span className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Current Role
                </span>
              </label>
              <input
                type="text"
                value={profile.currentRole}
                onChange={(e) => updateProfile("currentRole", e.target.value)}
                className="w-full bg-dark-300 border border-dark-400 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="e.g., Software Engineer"
              />
            </div>

            {/* Target Role */}
            <div className="bg-dark-200 rounded-xl p-6 border border-dark-300 hover:border-primary-500/30 transition-all">
              <label className="block mb-3">
                <span className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Target Role
                </span>
              </label>
              <input
                type="text"
                value={profile.targetRole}
                onChange={(e) => updateProfile("targetRole", e.target.value)}
                className="w-full bg-dark-300 border border-dark-400 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="e.g., Senior Full Stack Developer"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="bg-dark-200 rounded-xl p-6 border border-dark-300 hover:border-primary-500/30 transition-all">
            <label className="block mb-3">
              <span className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Professional Bio
              </span>
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) => updateProfile("bio", e.target.value)}
              rows={4}
              className="w-full bg-dark-300 border border-dark-400 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
              placeholder="Tell us about yourself, your skills, and career goals..."
            />
            <p className="text-xs text-gray-500 mt-2">
              {profile.bio.length} characters
            </p>
          </div>

          {/* Save Profile Button */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              onClick={handleSaveProfile}
              disabled={saving}
              className="btn-primary min-w-[180px] py-6 text-base font-semibold"
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save Profile
                </div>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          {/* Email Notifications */}
          <div className="bg-dark-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">
                  Email Notifications
                </h3>
                <p className="text-sm text-gray-400">
                  Receive general email notifications from NexusAgent
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.emailNotifications}
                  onChange={(e) =>
                    updatePreference("emailNotifications", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-dark-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
          </div>

          {/* Weekly Reports */}
          <div className="bg-dark-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">
                  Weekly Progress Reports
                </h3>
                <p className="text-sm text-gray-400">
                  Get weekly summaries of your interview performance every
                  Monday
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.weeklyReports}
                  onChange={(e) =>
                    updatePreference("weeklyReports", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-dark-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
          </div>

          {/* Streak Reminders */}
          <div className="bg-dark-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">Streak Reminders</h3>
                <p className="text-sm text-gray-400">
                  Get reminded when your practice streak is about to break
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.streakReminders}
                  onChange={(e) =>
                    updatePreference("streakReminders", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-dark-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
          </div>

          {/* Interview Suggestions */}
          <div className="bg-dark-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">
                  AI Interview Suggestions
                </h3>
                <p className="text-sm text-gray-400">
                  Receive personalized interview recommendations weekly
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.interviewSuggestions}
                  onChange={(e) =>
                    updatePreference("interviewSuggestions", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-dark-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
          </div>

          {/* Reminder Hours */}
          <div className="bg-dark-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 mb-4">
                <h3 className="text-lg font-semibold mb-1">
                  Interview Reminder Timing
                </h3>
                <p className="text-sm text-gray-400">
                  How many hours before scheduled interviews should we remind
                  you?
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="48"
                value={preferences.reminderHours}
                onChange={(e) =>
                  updatePreference("reminderHours", parseInt(e.target.value))
                }
                className="flex-1 h-2 bg-dark-300 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
              <span className="text-lg font-bold text-primary-500 min-w-[80px] text-right">
                {preferences.reminderHours} hours
              </span>
            </div>
          </div>

          {/* Save Notifications Button */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              onClick={() => router.push("/")}
              className="bg-dark-300 hover:bg-dark-400 px-8 py-6 text-base"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePreferences}
              disabled={saving}
              className="btn-primary min-w-[180px] py-6 text-base font-semibold"
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  Save Notifications
                </div>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Account & Security Tab */}
      {activeTab === "account" && (
        <div className="space-y-6">
          {/* Logout Section */}
          <div className="bg-dark-200 rounded-xl p-6 border border-dark-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign Out
                </h3>
                <p className="text-sm text-gray-400">
                  Sign out of your account on this device
                </p>
              </div>
              <Button
                onClick={handleLogout}
                disabled={loggingOut}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 min-w-[120px]"
              >
                {loggingOut ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing out...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Delete Account Section */}
          <div className="bg-red-500/5 rounded-xl p-6 border-2 border-red-500/20">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 text-red-400">
                  Delete Account
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Request permanent deletion of your account and all associated
                  data. This action cannot be undone.
                </p>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                  <p className="text-sm text-red-300 font-semibold mb-2">
                    ⚠️ What will be deleted:
                  </p>
                  <ul className="text-sm text-gray-400 space-y-1 ml-4">
                    <li>• Your user profile and personal information</li>
                    <li>• All interview history and feedback</li>
                    <li>• Progress tracking and streak data</li>
                    <li>• Scheduled interviews and preferences</li>
                    <li>• Generated PDF reports</li>
                  </ul>
                </div>
                <Button
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Request Account Deletion
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-200 rounded-2xl max-w-2xl w-full p-8 border-2 border-red-500/30 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-shrink-0 w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-red-400">
                  Request Account Deletion
                </h2>
                <p className="text-gray-400 mt-1">
                  This action is permanent and cannot be undone
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-3">
                <span className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  Please tell us why you want to delete your account
                  <span className="text-red-400">*</span>
                </span>
              </label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                rows={5}
                className="w-full bg-dark-300 border border-dark-400 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none"
                placeholder="e.g., I'm no longer preparing for interviews, the platform doesn't meet my needs, privacy concerns..."
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                {deleteReason.length} characters • Minimum 10 characters
                required
              </p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-400 font-semibold mb-2">
                📧 What happens next:
              </p>
              <ol className="text-sm text-gray-300 space-y-1 ml-4">
                <li>1. Our team will review your request within 24-48 hours</li>
                <li>2. You'll receive a confirmation email with next steps</li>
                <li>
                  3. Your account will be permanently deleted within 30 days
                </li>
                <li>4. All your data will be removed from our systems</li>
              </ol>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteReason("");
                }}
                disabled={deleting}
                className="flex-1 bg-dark-300 hover:bg-dark-400 py-4 text-base"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteRequest}
                disabled={deleting || deleteReason.trim().length < 10}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 text-base font-semibold"
              >
                {deleting ? (
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  "Confirm Deletion Request"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
