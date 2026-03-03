"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Settings, Shield, Bell, Mail, Key, Database, Globe, Code, Lock, Eye, EyeOff, Check, AlertTriangle,
  Save, RotateCcw, ExternalLink, Zap, ChevronRight, Server, HardDrive, Cpu
} from "lucide-react"

const settingsSections = [
  { id: "account", label: "Account", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
  { id: "api", label: "API Keys", icon: Key },
  { id: "database", label: "Database", icon: Database },
  { id: "advanced", label: "Advanced", icon: Settings },
]

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState("account")
  const [showApiKey, setShowApiKey] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-black text-white mb-1">Settings</h1>
        <p className="text-slate-400">Configure your site and account settings</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-72 flex-shrink-0"
        >
          <div className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-2 sticky top-8">
            <nav className="space-y-1">
              {settingsSections.map((section) => {
                const isActive = activeSection === section.id
                return (
                  <motion.button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-[#00E5FF]/10 to-transparent text-[#00E5FF] border-l-2 border-[#00E5FF]"
                        : "text-slate-400 hover:text-white hover:bg-[#1F2937]/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <section.icon className="h-4 w-4" />
                      <span className="font-medium text-sm">{section.label}</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 transition-transform ${isActive ? "rotate-90" : ""}`} />
                  </motion.button>
                )
              })}
            </nav>
          </div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 space-y-6"
        >
          {activeSection === "account" && (
            <>
              <motion.div variants={itemVariants} className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00E5FF] via-[#8B5CF6] to-[#F59E0B]" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#00E5FF]/20 to-[#8B5CF6]/20 rounded-xl flex items-center justify-center">
                    <Shield className="h-5 w-5 text-[#00E5FF]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Account Settings</h2>
                    <p className="text-sm text-slate-400">Manage your admin account</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Admin Email</label>
                      <input
                        type="email"
                        defaultValue="admin@devport.com"
                        className="w-full h-12 px-4 rounded-xl bg-[#1F2937] border border-[#1F2937] text-white focus:outline-none focus:border-[#00E5FF]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Display Name</label>
                      <input
                        type="text"
                        defaultValue="Admin"
                        className="w-full h-12 px-4 rounded-xl bg-[#1F2937] border border-[#1F2937] text-white focus:outline-none focus:border-[#00E5FF]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#1F2937]">
                    <button className="px-5 py-2.5 bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] text-black font-bold rounded-xl shadow-lg shadow-[#00E5FF]/20 hover:shadow-[#00E5FF]/40 transition-all flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF2D55] to-[#8B5CF6]" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#FF2D55]/20 to-[#8B5CF6]/20 rounded-xl flex items-center justify-center">
                    <HardDrive className="h-5 w-5 text-[#FF2D55]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Danger Zone</h2>
                    <p className="text-sm text-slate-400">Irreversible account actions</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                    <div>
                      <p className="font-medium text-white">Delete Account</p>
                      <p className="text-xs text-slate-500">Permanently delete your account and all data</p>
                    </div>
                    <button className="px-4 py-2 bg-red-500/20 text-red-400 font-medium rounded-lg hover:bg-red-500/30 transition-all">
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {activeSection === "notifications" && (
            <motion.div variants={itemVariants} className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F59E0B] to-[#FF2D55]" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#F59E0B]/20 to-[#FF2D55]/20 rounded-xl flex items-center justify-center">
                  <Bell className="h-5 w-5 text-[#F59E0B]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Notification Preferences</h2>
                  <p className="text-sm text-slate-400">Choose what notifications you receive</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { id: "email_new_message", label: "New contact messages", desc: "Get notified when someone sends a message", enabled: true },
                  { id: "email_new_subscriber", label: "Newsletter signups", desc: "Get notified when someone subscribes", enabled: true },
                  { id: "email_weekly_report", label: "Weekly analytics report", desc: "Receive weekly performance summary", enabled: false },
                  { id: "email_security_alerts", label: "Security alerts", desc: "Important security notifications", enabled: true },
                ].map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between p-4 bg-[#1F2937]/50 rounded-xl">
                    <div>
                      <p className="font-medium text-white">{notification.label}</p>
                      <p className="text-xs text-slate-500">{notification.desc}</p>
                    </div>
                    <button
                      className={`w-14 h-8 rounded-full transition-all relative ${
                        notification.enabled ? "bg-[#00E5FF]" : "bg-[#1F2937]"
                      }`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all ${
                        notification.enabled ? "left-7" : "left-1"
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === "security" && (
            <motion.div variants={itemVariants} className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#10B981] to-[#00E5FF]" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#10B981]/20 to-[#00E5FF]/20 rounded-xl flex items-center justify-center">
                  <Lock className="h-5 w-5 text-[#10B981]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Security Settings</h2>
                  <p className="text-sm text-slate-400">Manage your account security</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="p-4 bg-[#10B981]/10 border border-[#10B981]/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-[#10B981]" />
                    <div>
                      <p className="font-medium text-[#10B981]">Two-Factor Authentication</p>
                      <p className="text-xs text-slate-400">Your account is protected with magic link authentication</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Session Timeout</label>
                  <select className="w-full h-12 px-4 rounded-xl bg-[#1F2937] border border-[#1F2937] text-white focus:outline-none focus:border-[#10B981]">
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="240">4 hours</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-[#1F2937]">
                  <button className="px-5 py-2.5 bg-gradient-to-r from-[#10B981] to-[#00E5FF] text-black font-bold rounded-xl shadow-lg shadow-[#10B981]/20 hover:shadow-[#10B981]/40 transition-all flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "api" && (
            <motion.div variants={itemVariants} className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8B5CF6] to-[#F59E0B]" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6]/20 to-[#F59E0B]/20 rounded-xl flex items-center justify-center">
                  <Key className="h-5 w-5 text-[#8B5CF6]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">API Keys</h2>
                  <p className="text-sm text-slate-400">Manage your API keys for external integrations</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[#1F2937]/50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-white">MongoDB Atlas</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Connected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type={showApiKey ? "text" : "password"}
                      value="••••••••••••••••••••••••••••••••"
                      readOnly
                      className="flex-1 h-10 px-4 rounded-lg bg-[#0D1117] border border-[#1F2937] text-slate-400 text-sm font-mono"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="p-2.5 bg-[#1F2937] text-slate-400 hover:text-white rounded-lg"
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-[#1F2937]/50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-white">Resend (Email)</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Connected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value="••••••••••••••••••••••••••••••••"
                      readOnly
                      className="flex-1 h-10 px-4 rounded-lg bg-[#0D1117] border border-[#1F2937] text-slate-400 text-sm font-mono"
                    />
                    <button className="p-2.5 bg-[#1F2937] text-slate-400 hover:text-white rounded-lg">
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button className="w-full py-3 border-2 border-dashed border-[#1F2937] rounded-xl text-slate-400 hover:text-white hover:border-[#8B5CF6]/50 transition-all flex items-center justify-center gap-2">
                  <Code className="h-4 w-4" />
                  Add New API Key
                </button>
              </div>
            </motion.div>
          )}

          {activeSection === "database" && (
            <motion.div variants={itemVariants} className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00E5FF] to-[#10B981]" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00E5FF]/20 to-[#10B981]/20 rounded-xl flex items-center justify-center">
                  <Database className="h-5 w-5 text-[#00E5FF]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Database</h2>
                  <p className="text-sm text-slate-400">Database connection and status</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-[#1F2937]/50 rounded-xl text-center">
                  <Server className="h-6 w-6 text-[#00E5FF] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">12</p>
                  <p className="text-xs text-slate-500">Collections</p>
                </div>
                <div className="p-4 bg-[#1F2937]/50 rounded-xl text-center">
                  <HardDrive className="h-6 w-6 text-[#8B5CF6] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">2.4 MB</p>
                  <p className="text-xs text-slate-500">Storage Used</p>
                </div>
                <div className="p-4 bg-[#1F2937]/50 rounded-xl text-center">
                  <Cpu className="h-6 w-6 text-[#10B981] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">12ms</p>
                  <p className="text-xs text-slate-500">Avg Latency</p>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full py-3 bg-[#1F2937] text-white font-medium rounded-xl hover:bg-[#2a3544] transition-all flex items-center justify-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Clear Cache
                </button>
                <button className="w-full py-3 bg-[#1F2937] text-white font-medium rounded-xl hover:bg-[#2a3544] transition-all flex items-center justify-center gap-2">
                  <Database className="h-4 w-4" />
                  Export Database
                </button>
              </div>
            </motion.div>
          )}

          {activeSection === "advanced" && (
            <motion.div variants={itemVariants} className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6B7280] to-[#00E5FF]" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#6B7280]/20 to-[#00E5FF]/20 rounded-xl flex items-center justify-center">
                  <Settings className="h-5 w-5 text-[#6B7280]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Advanced Settings</h2>
                  <p className="text-sm text-slate-400">Technical configuration options</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { id: "debug_mode", label: "Debug Mode", desc: "Enable detailed error logging", enabled: false },
                  { id: "maintenance_mode", label: "Maintenance Mode", desc: "Show maintenance page to visitors", enabled: false },
                  { id: "analytics", label: "Analytics Tracking", desc: "Enable Umami analytics", enabled: true },
                ].map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between p-4 bg-[#1F2937]/50 rounded-xl">
                    <div>
                      <p className="font-medium text-white">{setting.label}</p>
                      <p className="text-xs text-slate-500">{setting.desc}</p>
                    </div>
                    <button
                      className={`w-14 h-8 rounded-full transition-all relative ${
                        setting.enabled ? "bg-[#00E5FF]" : "bg-[#1F2937]"
                      }`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all ${
                        setting.enabled ? "left-7" : "left-1"
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
