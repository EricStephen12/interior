'use client'

import { useState, useEffect } from 'react'
import { 
  ClipboardList, Search, Heart, AlertTriangle, CheckCircle2, 
  User, Eye, X, Phone, Mail, Calendar, ShieldCheck, Dumbbell, RefreshCw
} from 'lucide-react'

export default function FitnessProfilesAdmin() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterHealthFlagsOnly, setFilterHealthFlagsOnly] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null)

  const fetchProfiles = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/fitness-profiles?q=${encodeURIComponent(search)}`)
      if (res.ok) {
        const data = await res.json()
        setProfiles(data.profiles || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfiles()
  }, [search])

  const displayedProfiles = filterHealthFlagsOnly
    ? profiles.filter(p => p.currentPainOrInjury || p.doctorAdviceLimit || p.medicalCondition || p.allergies)
    : profiles

  const flaggedCount = profiles.filter(p => p.currentPainOrInjury || p.doctorAdviceLimit || p.medicalCondition || p.allergies).length

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#f20d0d] uppercase tracking-widest font-bold">
            <ClipboardList className="w-4 h-4" />
            Client Onboarding
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Fitness Information Profiles
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review submitted new member registration forms, medical notices, and training goals.
          </p>
        </div>

        <button
          onClick={fetchProfiles}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 rounded-sm self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 border border-slate-200/80 rounded-lg shadow-xs">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Total Profiles</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{profiles.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Submitted onboarding forms</p>
        </div>

        <div className="bg-white p-5 border border-slate-200/80 rounded-lg shadow-xs">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Health / Injury Flags</p>
          <p className={`text-2xl font-black mt-1 ${flaggedCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {flaggedCount}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Members requiring coach attention</p>
        </div>

        <div className="bg-white p-5 border border-slate-200/80 rounded-lg shadow-xs">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Agreement Rate</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">100%</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Signed rules & declarations</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 border border-slate-200/80 rounded-lg shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 rounded-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterHealthFlagsOnly(false)}
            className={`px-3 py-1.5 text-xs font-bold rounded-sm transition-all ${
              !filterHealthFlagsOnly ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({profiles.length})
          </button>
          <button
            onClick={() => setFilterHealthFlagsOnly(true)}
            className={`px-3 py-1.5 text-xs font-bold rounded-sm transition-all ${
              filterHealthFlagsOnly ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚠️ Flagged Only ({flaggedCount})
          </button>
        </div>
      </div>

      {/* Profiles Table / List */}
      <div className="bg-white border border-slate-200/80 rounded-lg overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading fitness profiles…</div>
        ) : displayedProfiles.length === 0 ? (
          <div className="py-20 text-center text-xs text-slate-400">
            {search ? 'No matching fitness profiles found.' : 'No fitness profiles submitted yet.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] font-mono uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Client</th>
                  <th className="py-3 px-4 font-bold">Contact</th>
                  <th className="py-3 px-4 font-bold">Fitness Profile</th>
                  <th className="py-3 px-4 font-bold">Health Status</th>
                  <th className="py-3 px-4 font-bold">Submitted</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {displayedProfiles.map((p) => {
                  const hasHealthFlag = p.currentPainOrInjury || p.doctorAdviceLimit || p.medicalCondition || p.allergies
                  const goals = Array.isArray(p.fitnessGoals) ? p.fitnessGoals : []

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{p.userName}</p>
                        <p className="text-[11px] text-slate-400">
                          {p.gender || 'N/A'} • {p.age ? `${p.age} yrs` : 'Age N/A'}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] space-y-0.5">
                        <p className="text-slate-800">{p.userEmail}</p>
                        {p.phone && <p className="text-slate-500">{p.phone}</p>}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className="inline-block text-[10px] font-mono uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-sm">
                            {p.fitnessLevel || 'Level N/A'}
                          </span>
                          <p className="text-[11px] text-slate-500 truncate max-w-[200px]">
                            {goals.slice(0, 2).join(', ')}{goals.length > 2 ? ` +${goals.length - 2}` : ''}
                          </p>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {hasHealthFlag ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-sm">
                            <AlertTriangle className="w-3 h-3" />
                            Medical Notice
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                            <CheckCircle2 className="w-3 h-3" />
                            Clear
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                        {new Date(p.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedProfile(p)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-900 hover:text-white transition-colors rounded-sm"
                        >
                          <Eye className="w-3 h-3" />
                          View Full
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Full Assessment Detail Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Client Intake Sheet</p>
                <h3 className="text-lg font-bold text-slate-900">{selectedProfile.userName}</h3>
              </div>
              <button
                onClick={() => setSelectedProfile(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              {/* Personal Section */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b pb-1">Personal Details</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div><span className="text-slate-400 block text-[10px]">Email</span>{selectedProfile.userEmail}</div>
                  <div><span className="text-slate-400 block text-[10px]">Phone</span>{selectedProfile.phone || 'N/A'}</div>
                  <div><span className="text-slate-400 block text-[10px]">Gender / Age</span>{selectedProfile.gender || 'N/A'} • {selectedProfile.age || 'N/A'}</div>
                  <div><span className="text-slate-400 block text-[10px]">Height / Weight</span>{selectedProfile.height || 'N/A'} • {selectedProfile.weight || 'N/A'}</div>
                  <div><span className="text-slate-400 block text-[10px]">Fitness Level</span>{selectedProfile.fitnessLevel || 'N/A'}</div>
                  <div><span className="text-slate-400 block text-[10px]">Preferred Time</span>{selectedProfile.preferredTrainingTime || 'Flexible'}</div>
                </div>
              </div>

              {/* Goals */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b pb-1">Fitness Goals</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(selectedProfile.fitnessGoals) ? selectedProfile.fitnessGoals : []).map((g: string, i: number) => (
                    <span key={i} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-sm font-medium">
                      {g}
                    </span>
                  ))}
                </div>
                {selectedProfile.specificGoal && (
                  <p className="mt-2 text-slate-600 bg-slate-50 p-3 rounded border border-slate-100">
                    <strong className="text-slate-900">Specific Objective: </strong>{selectedProfile.specificGoal}
                  </p>
                )}
              </div>

              {/* Health & Medical */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b pb-1">Health & Medical Evaluation</h4>
                <div className="space-y-2">
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                    <span className="font-bold text-slate-800">Current Injury or Pain: </span>
                    {selectedProfile.currentPainOrInjury ? <span className="text-red-600 font-bold">YES — {selectedProfile.painDetails || 'No details'}</span> : 'No'}
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                    <span className="font-bold text-slate-800">Doctor Advice / Physical Limitation: </span>
                    {selectedProfile.doctorAdviceLimit ? <span className="text-red-600 font-bold">YES — {selectedProfile.doctorAdviceDetails || 'No details'}</span> : 'No'}
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                    <span className="font-bold text-slate-800">Medical Condition: </span>
                    {selectedProfile.medicalCondition ? <span className="text-red-600 font-bold">YES — {selectedProfile.medicalDetails || 'No details'}</span> : 'No'}
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                    <span className="font-bold text-slate-800">Current Medication: </span>
                    {selectedProfile.currentMedication ? <span className="text-slate-800">YES — {selectedProfile.medicationDetails || 'No details'}</span> : 'No'}
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                    <span className="font-bold text-slate-800">Allergies: </span>
                    {selectedProfile.allergies ? <span className="text-red-600 font-bold">YES — {selectedProfile.allergyDetails || 'No details'}</span> : 'No'}
                  </div>
                </div>
              </div>

              {/* Signature */}
              <div className="space-y-1 bg-slate-50 p-3 rounded border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-mono">Digital Signature</p>
                <p className="font-bold text-slate-900">{selectedProfile.signatureName || selectedProfile.userName}</p>
                <p className="text-[10px] text-emerald-600">✓ Agreed to Gym Safety Rules & Medical Declaration</p>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-right">
              <button
                onClick={() => setSelectedProfile(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-sm hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
