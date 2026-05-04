import prisma from '@/lib/prisma'
import { Users, Shield, CreditCard, Calendar } from 'lucide-react'

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      checkIns: {
        orderBy: { date: 'desc' },
        take: 1
      },
      _count: {
        select: { checkIns: true }
      }
    }
  })

  return (
    <div className="p-4 sm:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-primary uppercase font-display">
            The <span className="text-accent italic font-light lowercase">Members.</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm">Manage member access, tiers, and credits.</p>
        </div>
        <div className="flex items-center gap-2 bg-secondary px-4 py-2">
          <Users className="w-4 h-4 text-accent" />
          <span className="text-[10px] font-black tracking-widest text-primary uppercase">{users.length} Total Members</span>
        </div>
      </div>

      {/* Members Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-primary/5 bg-secondary/10">
              <th className="px-4 sm:px-8 py-4 sm:py-6 text-[10px] font-black uppercase tracking-widest text-primary">Member</th>
              <th className="px-4 sm:px-8 py-4 sm:py-6 text-[10px] font-black uppercase tracking-widest text-primary">Tier</th>
              <th className="px-4 sm:px-8 py-4 sm:py-6 text-[10px] font-black uppercase tracking-widest text-primary">Credits</th>
              <th className="px-4 sm:px-8 py-4 sm:py-6 text-[10px] font-black uppercase tracking-widest text-primary">Check-ins</th>
              <th className="px-4 sm:px-8 py-4 sm:py-6 text-[10px] font-black uppercase tracking-widest text-primary">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium">
                  No members yet. They&apos;ll show up once they sign up.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-white/50 transition-colors group">
                  <td className="px-4 sm:px-8 py-4 sm:py-6">
                    <div>
                      <p className="text-sm font-bold text-primary group-hover:text-accent transition-colors">{user.name || 'Unnamed'}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{user.email}</p>
                      <p className="text-[9px] text-slate-300 font-mono mt-0.5">{user.memberId}</p>
                    </div>
                  </td>
                  <td className="px-4 sm:px-8 py-4 sm:py-6">
                    <span className={`text-[9px] font-black px-3 py-1 uppercase tracking-widest ${
                      user.tier === 'BLACK' ? 'bg-primary text-white' :
                      user.tier === 'NONE' ? 'bg-slate-100 text-slate-400' :
                      'bg-accent/10 text-accent'
                    }`}>
                      {user.tier}
                    </span>
                  </td>
                  <td className="px-4 sm:px-8 py-4 sm:py-6">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-accent" />
                      <span className="text-sm font-bold text-primary tabular-nums">{user.credits}</span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-8 py-4 sm:py-6">
                    <span className="text-sm font-bold text-primary tabular-nums">{user._count.checkIns}</span>
                  </td>
                  <td className="px-4 sm:px-8 py-4 sm:py-6">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
