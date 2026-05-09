'use client'

import { useState, useEffect } from 'react'
import { Users, Shield, Search, Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users/list')
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'CUSTOMER' : 'ADMIN'
    setUpdating(userId)

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole })
      })

      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to update')
      }
    } catch (err) {
      alert('Network error')
    } finally {
      setUpdating(null)
    }
  }

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase()) || 
    (u.name && u.name.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="admin-page-container">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-4 sm:px-8">
        <div>
          <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black tracking-widest text-accent uppercase mb-6 hover:translate-x-[-4px] transition-transform">
            <ArrowLeft className="w-3 h-3" /> Back to command
          </Link>
          <h1 className="admin-title">
            Member <span className="text-accent italic font-light lowercase">Registry.</span>
          </h1>
          <p className="admin-subtitle">Control access and authority.</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search email or name..." 
            className="w-full pl-12 pr-6 py-4 bg-white border border-primary/5 rounded-none focus:outline-none focus:border-accent transition-all text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-primary/5 editorial-shadow overflow-hidden mx-4 sm:mx-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-primary/5 bg-secondary/30">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Member Details</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Access Tier</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Authority</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Accessing secure registry...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                      No matching records found.
                    </td>
                  </tr>
                ) : filteredUsers.map((user, idx) => (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 flex items-center justify-center text-xs font-black rounded-none border-2 ${
                          user.role === 'ADMIN' ? 'border-accent bg-accent/5 text-accent' : 'border-primary/5 bg-secondary text-primary'
                        }`}>
                          {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-primary uppercase tracking-tight">{user.name || 'Unnamed Member'}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                            <Mail className="w-3 h-3" /> {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[9px] font-black px-3 py-1 tracking-widest uppercase ${
                        user.tier === 'BLACK' ? 'bg-primary text-white shadow-lg' : 'bg-secondary text-primary/40 border border-primary/5'
                      }`}>
                        {user.tier}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-[10px] font-black text-primary tracking-widest uppercase">{user.credits} Credits</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {user.role === 'ADMIN' ? (
                          <div className="flex items-center gap-2 text-accent">
                            <Shield className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Administrator</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-slate-300">
                            <Users className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Standard Member</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => toggleRole(user.id, user.role)}
                        disabled={updating === user.id}
                        className={`px-6 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                          user.role === 'ADMIN' 
                            ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100' 
                            : 'bg-primary text-white hover:bg-accent hover:shadow-xl'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {updating === user.id ? 'Processing...' : user.role === 'ADMIN' ? 'Revoke Auth' : 'Grant Auth'}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
