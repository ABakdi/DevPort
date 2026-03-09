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
        <h1 className="text-3xl font-black mb-1" style={{ color: 'var(--theme-text)' }}>Settings</h1>
        <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Configure your site and account settings</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-72 flex-shrink-0"
        >
          <div className="rounded-2xl p-2 sticky top-8 border" style={{ 
            backgroundColor: 'var(--theme-background)',
            borderColor: 'var(--theme-surface)',
          }}>
            <nav className="space-y-1">
              {settingsSections.map((section) => {
                const isActive = activeSection === section.id
                return (
                  <motion.button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300`}
                    style={{
                      background: isActive
                        ? `linear-gradient(90deg, color-mix(in srgb, var(--theme-primary) 10%, transparent), transparent)` : 'transparent',
                      color: isActive ? 'var(--theme-primary)' : 'var(--theme-text)',
                      borderLeft: isActive ? '2px solid var(--theme-primary)' : '2px solid transparent',
                      opacity: isActive ? 1 : 0.6,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <section.icon className="h-4 w-4" style={{ color: isActive ? 'var(--theme-primary)' : 'var(--theme-text)' }} />
                      <span className="font-medium text-sm">{section.label}</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 transition-transform ${isActive ? "rotate-90" : ""}`} style={{ color: 'var(--theme-text)' }} />
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
              <motion.div variants={itemVariants} className="rounded-2xl p-6 border" style={{ backgroundColor: 'var(--theme-background)', borderColor: 'var(--theme-surface)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--theme-surface)' }}>
                    <Shield className="h-5 w-5" style={{ color: 'var(--theme-primary)' }} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>Account Settings</h2>
                    <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Manage your admin account</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" style={{ color: 'var(--theme-text)', opacity: 0.7 }}>Admin Email</label>
                      <input
                        type="email"
                        defaultValue="admin@devport.com"
                        className="w-full h-12 px-4 rounded-xl border focus:outline-none"
                        style={{ 
                          backgroundColor: 'var(--theme-surface)',
                          borderColor: 'var(--theme-surface)',
                          color: 'var(--theme-text)',
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" style={{ color: 'var(--theme-text)', opacity: 0.7 }}>Display Name</label>
                      <input
                        type="text"
                        defaultValue="Admin"
                        className="w-full h-12 px-4 rounded-xl border focus:outline-none"
                        style={{ 
                          backgroundColor: 'var(--theme-surface)',
                          borderColor: 'var(--theme-surface)',
                          color: 'var(--theme-text)',
                        }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t" style={{ borderColor: 'var(--theme-surface)' }}>
                    <button className="px-5 py-2.5 font-bold rounded-xl shadow-lg transition-all flex items-center gap-2" style={{ 
                      background: 'linear-gradient(90deg, var(--theme-primary), var(--theme-secondary))',
                      color: '#000000',
                      boxShadow: '0 0 20px color-mix(in srgb, var(--theme-primary) 20%, transparent)',
                    }}>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="rounded-2xl p-6 border" style={{ backgroundColor: 'var(--theme-background)', borderColor: 'var(--theme-surface)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--theme-surface)' }}>
                    <HardDrive className="h-5 w-5" style={{ color: '#EF4444' }} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>Danger Zone</h2>
                    <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Irreversible account actions</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <div>
                      <p className="font-medium" style={{ color: 'var(--theme-text)' }}>Delete Account</p>
                      <p className="text-xs" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>Permanently delete your account and all data</p>
                    </div>
                    <button className="px-4 py-2 font-medium rounded-lg transition-all" style={{ 
                      backgroundColor: '#EF4444',
                      color: '#fff',
                      opacity: 0.8,
                    }}>
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {activeSection === "notifications" && (
            <motion.div variants={itemVariants} className="rounded-2xl p-6 border" style={{ backgroundColor: 'var(--theme-background)', borderColor: 'var(--theme-surface)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--theme-surface)' }}>
                  <Bell className="h-5 w-5" style={{ color: 'var(--theme-accent)' }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>Notification Preferences</h2>
                  <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Choose what notifications you receive</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { id: "email_new_message", label: "New contact messages", desc: "Get notified when someone sends a message", enabled: true },
                  { id: "email_new_subscriber", label: "Newsletter signups", desc: "Get notified when someone subscribes", enabled: true },
                  { id: "email_weekly_report", label: "Weekly analytics report", desc: "Receive weekly performance summary", enabled: false },
                  { id: "email_security_alerts", label: "Security alerts", desc: "Important security notifications", enabled: true },
                ].map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--theme-surface)', opacity: 0.5 }}>
                    <div>
                      <p className="font-medium" style={{ color: 'var(--theme-text)' }}>{notification.label}</p>
                      <p className="text-xs" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>{notification.desc}</p>
                    </div>
                    <button
                      className={`w-14 h-8 rounded-full transition-all relative`}
                      style={{
                        backgroundColor: notification.enabled ? 'var(--theme-primary)' : 'var(--theme-surface)',
                      }}
                    >
                      <div className={`absolute top-1 w-6 h-6 rounded-full shadow-lg transition-all ${
                        notification.enabled ? "left-7" : "left-1"
                      }`} style={{ backgroundColor: '#fff' }} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === "security" && (
            <motion.div variants={itemVariants} className="rounded-2xl p-6 border" style={{ backgroundColor: 'var(--theme-background)', borderColor: 'var(--theme-surface)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--theme-surface)' }}>
                  <Lock className="h-5 w-5" style={{ color: '#10B981' }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>Security Settings</h2>
                  <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Manage your account security</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="p-4 rounded-xl border" style={{ backgroundColor: '#10B981', opacity: 0.1, borderColor: '#10B981' }}>
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5" style={{ color: '#10B981' }} />
                    <div>
                      <p className="font-medium" style={{ color: '#10B981' }}>Two-Factor Authentication</p>
                      <p className="text-xs" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Your account is protected with magic link authentication</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--theme-text)', opacity: 0.7 }}>Session Timeout</label>
                  <select className="w-full h-12 px-4 rounded-xl border focus:outline-none" style={{ 
                    backgroundColor: 'var(--theme-surface)', 
                    borderColor: 'var(--theme-surface)', 
                    color: 'var(--theme-text)',
                  }}>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="240">4 hours</option>
                  </select>
                </div>

                <div className="pt-4 border-t" style={{ borderColor: 'var(--theme-surface)' }}>
                  <button className="px-5 py-2.5 font-bold rounded-xl shadow-lg transition-all flex items-center gap-2" style={{ 
                    background: 'linear-gradient(90deg, #10B981, var(--theme-primary))',
                    color: '#000000',
                    boxShadow: '0 0 20px color-mix(in srgb, #10B981 20%, transparent)',
                  }}>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "api" && (
            <motion.div variants={itemVariants} className="rounded-2xl p-6 border" style={{ backgroundColor: 'var(--theme-background)', borderColor: 'var(--theme-surface)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--theme-surface)' }}>
                  <Key className="h-5 w-5" style={{ color: 'var(--theme-secondary)' }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>API Keys</h2>
                  <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Manage your API keys for external integrations</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--theme-surface)', opacity: 0.5 }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>MongoDB Atlas</span>
                    <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: '#10B981', color: '#fff', opacity: 0.2 }}>Connected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type={showApiKey ? "text" : "password"}
                      value="••••••••••••••••••••••••••••••••"
                      readOnly
                      className="flex-1 h-10 px-4 rounded-lg border text-sm font-mono"
                      style={{ 
                        backgroundColor: 'var(--theme-background)', 
                        borderColor: 'var(--theme-surface)',
                        color: 'var(--theme-text)',
                        opacity: 0.6,
                      }}
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="p-2.5 rounded-lg transition-all"
                      style={{ 
                        backgroundColor: 'var(--theme-surface)', 
                        color: 'var(--theme-text)',
                        opacity: 0.6,
                      }}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--theme-surface)', opacity: 0.5 }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>Resend (Email)</span>
                    <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: '#10B981', color: '#fff', opacity: 0.2 }}>Connected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value="••••••••••••••••••••••••••••••••"
                      readOnly
                      className="flex-1 h-10 px-4 rounded-lg border text-sm font-mono"
                      style={{ 
                        backgroundColor: 'var(--theme-background)', 
                        borderColor: 'var(--theme-surface)',
                        color: 'var(--theme-text)',
                        opacity: 0.6,
                      }}
                    />
                    <button className="p-2.5 rounded-lg transition-all" style={{ 
                      backgroundColor: 'var(--theme-surface)', 
                      color: 'var(--theme-text)',
                      opacity: 0.6,
                    }}>
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button className="w-full py-3 border-2 border-dashed rounded-xl transition-all flex items-center justify-center gap-2" style={{ 
                  borderColor: 'var(--theme-surface)', 
                  color: 'var(--theme-text)',
                  opacity: 0.6,
                }}>
                  <Code className="h-4 w-4" />
                  Add New API Key
                </button>
              </div>
            </motion.div>
          )}

          {activeSection === "database" && (
            <motion.div variants={itemVariants} className="rounded-2xl p-6 border" style={{ backgroundColor: 'var(--theme-background)', borderColor: 'var(--theme-surface)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--theme-surface)' }}>
                  <Database className="h-5 w-5" style={{ color: 'var(--theme-primary)' }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>Database</h2>
                  <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Database connection and status</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--theme-surface)', opacity: 0.5 }}>
                  <Server className="h-6 w-6 mx-auto mb-2" style={{ color: 'var(--theme-primary)' }} />
                  <p className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>12</p>
                  <p className="text-xs" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>Collections</p>
                </div>
                <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--theme-surface)', opacity: 0.5 }}>
                  <HardDrive className="h-6 w-6 mx-auto mb-2" style={{ color: 'var(--theme-secondary)' }} />
                  <p className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>2.4 MB</p>
                  <p className="text-xs" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>Storage Used</p>
                </div>
                <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--theme-surface)', opacity: 0.5 }}>
                  <Cpu className="h-6 w-6 mx-auto mb-2" style={{ color: '#10B981' }} />
                  <p className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>12ms</p>
                  <p className="text-xs" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>Avg Latency</p>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full py-3 font-medium rounded-xl transition-all flex items-center justify-center gap-2" style={{ 
                  backgroundColor: 'var(--theme-surface)', 
                  color: 'var(--theme-text)',
                }}>
                  <RotateCcw className="h-4 w-4" />
                  Clear Cache
                </button>
                <button className="w-full py-3 font-medium rounded-xl transition-all flex items-center justify-center gap-2" style={{ 
                  backgroundColor: 'var(--theme-surface)', 
                  color: 'var(--theme-text)',
                }}>
                  <Database className="h-4 w-4" />
                  Export Database
                </button>
              </div>
            </motion.div>
          )}

          {activeSection === "advanced" && (
            <motion.div variants={itemVariants} className="rounded-2xl p-6 border" style={{ backgroundColor: 'var(--theme-background)', borderColor: 'var(--theme-surface)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--theme-surface)' }}>
                  <Settings className="h-5 w-5" style={{ color: 'var(--theme-text)', opacity: 0.6 }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>Advanced Settings</h2>
                  <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Technical configuration options</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { id: "debug_mode", label: "Debug Mode", desc: "Enable detailed error logging", enabled: false },
                  { id: "maintenance_mode", label: "Maintenance Mode", desc: "Show maintenance page to visitors", enabled: false },
                  { id: "analytics", label: "Analytics Tracking", desc: "Enable Umami analytics", enabled: true },
                ].map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--theme-surface)', opacity: 0.5 }}>
                    <div>
                      <p className="font-medium" style={{ color: 'var(--theme-text)' }}>{setting.label}</p>
                      <p className="text-xs" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>{setting.desc}</p>
                    </div>
                    <button
                      className={`w-14 h-8 rounded-full transition-all relative`}
                      style={{
                        backgroundColor: setting.enabled ? 'var(--theme-primary)' : 'var(--theme-surface)',
                      }}
                    >
                      <div className={`absolute top-1 w-6 h-6 rounded-full shadow-lg transition-all ${
                        setting.enabled ? "left-7" : "left-1"
                      }`} style={{ backgroundColor: '#fff' }} />
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
