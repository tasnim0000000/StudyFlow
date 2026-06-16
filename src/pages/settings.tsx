import { useState } from 'react'
import { Bell, Lock, Palette, Shield, User } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/providers/auth-provider'
import { useTheme } from '@/providers/theme-provider'

export function SettingsPage() {
  const { user, updateProfile, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [name, setName] = useState(user?.name ?? '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile({ name })
      toast.success('Profile updated successfully')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-container max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Alerts
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" /> Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your name and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-2xl font-bold text-primary">
                  {name.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Display Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input value={user?.email ?? ''} disabled className="opacity-60" />
                </div>
              </div>
              <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary-dark">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>Manage your account session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" onClick={() => signOut()} className="w-full sm:w-auto">
                Sign Out of All Devices
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Choose your preferred colour mode</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {(['light', 'dark'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { if (theme !== t) toggleTheme() }}
                    className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-all ${theme === t ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40'}`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${t === 'light' ? 'bg-amber-100' : 'bg-slate-800'}`}>
                      {t === 'light' ? '☀️' : '🌙'}
                    </div>
                    <div className="text-left">
                      <p className="font-medium capitalize">{t} Mode</p>
                      <p className="text-xs text-muted-foreground">{t === 'light' ? 'Bright & clear' : 'Easy on the eyes'}</p>
                    </div>
                    {theme === t && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Colour Accents</CardTitle>
              <CardDescription>The bold pastel palette used throughout the app</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {[
                  { name: 'Violet', color: '#8B5CF6' },
                  { name: 'Pink', color: '#F472B6' },
                  { name: 'Coral', color: '#FCA5A5' },
                  { name: 'Sky', color: '#93C5FD' },
                  { name: 'Mint', color: '#6EE7B7' },
                  { name: 'Amber', color: '#FCD34D' },
                ].map((c) => (
                  <div key={c.name} className="flex flex-col items-center gap-1">
                    <div className="h-8 w-8 rounded-full border-2 border-white shadow-md" style={{ background: c.color }} />
                    <span className="text-xs text-muted-foreground">{c.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control what alerts you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Deadline reminders', desc: 'Get reminded 24 hours before tasks are due', default: true },
                { label: 'Assignment alerts', desc: 'Notifications for upcoming assignment submissions', default: true },
                { label: 'Study session end', desc: 'Alert when a scheduled study session ends', default: false },
                { label: 'Weekly summary', desc: 'Productivity report every Monday morning', default: true },
              ].map((n) => (
                <div key={n.label} className="flex items-center justify-between rounded-xl border border-border p-4">
                  <div>
                    <p className="font-medium text-sm">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer">
                    <input type="checkbox" defaultChecked={n.default} className="sr-only peer" onChange={() => toast.info('Notification settings saved')} />
                    <div className="peer h-6 w-11 rounded-full bg-muted peer-checked:bg-primary transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all peer-checked:after:translate-x-5" />
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" /> Change Password
              </CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Current Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div>
                <Label>New Password</Label>
                <Input type="password" placeholder="At least 8 characters" />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <Input type="password" placeholder="Repeat new password" />
              </div>
              <Button className="bg-primary hover:bg-primary-dark" onClick={() => toast.info('Password change requires Supabase connection')}>
                Update Password
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions — proceed with caution</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={() => toast.error('Account deletion requires Supabase connection')}>
                Delete My Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
