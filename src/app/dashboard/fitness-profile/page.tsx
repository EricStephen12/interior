'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { 
  ArrowLeft, ArrowRight, CheckCircle2, User, Heart, Dumbbell, 
  ShieldCheck, ClipboardList, ChevronRight
} from 'lucide-react'

const STEPS = [
  { id: 1, label: 'Personal Info', icon: User },
  { id: 2, label: 'Membership', icon: ClipboardList },
  { id: 3, label: 'Fitness Goals', icon: Dumbbell },
  { id: 4, label: 'Health Info', icon: Heart },
  { id: 5, label: 'Gym Rules', icon: ShieldCheck },
]

const FITNESS_GOALS = [
  'Weight Loss', 'Muscle Building', 'Strength Training', 'Body Toning',
  'General Fitness', 'Improved Endurance', 'Improved Flexibility',
  'Body Recomposition', 'Sports Performance',
]

function RadioGroup({ name, options, value, onChange }: {
  name: string; options: string[]; value: string; onChange: (v: string) => void
}) {
  return (
    <div className="flex gap-3 flex-wrap">
      {options.map(opt => (
        <label key={opt} className={`flex items-center gap-2 px-4 py-2.5 border cursor-pointer transition-all text-sm font-medium ${
          value === opt
            ? 'bg-primary text-white border-primary'
            : 'bg-white border-slate-200 text-slate-700 hover:border-primary/40'
        }`}>
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="sr-only"
          />
          {opt}
        </label>
      ))}
    </div>
  )
}

function YesNoField({ label, yesNoValue, onYesNo, detail, onDetail, detailLabel }: {
  label: string; yesNoValue: boolean | null; onYesNo: (v: boolean) => void;
  detail: string; onDetail: (v: string) => void; detailLabel: string;
}) {
  return (
    <div className="space-y-3 pb-5 border-b border-slate-100 last:border-0 last:pb-0">
      <p className="text-sm font-medium text-slate-800 leading-relaxed">{label}</p>
      <RadioGroup
        name={label}
        options={['Yes', 'No']}
        value={yesNoValue === null ? '' : yesNoValue ? 'Yes' : 'No'}
        onChange={(v) => onYesNo(v === 'Yes')}
      />
      {yesNoValue && (
        <textarea
          placeholder={detailLabel}
          value={detail}
          onChange={e => onDetail(e.target.value)}
          rows={2}
          className="w-full border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary/50 resize-none"
        />
      )}
    </div>
  )
}

function FormInput({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">{label}</label>
      <input
        {...props}
        className="w-full border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary/50 bg-white"
      />
    </div>
  )
}

const GYM_RULES = [
  'I will follow all Sharers Gym rules and instructions from gym staff.',
  'I will use gym equipment properly and return equipment after use.',
  'I will not intentionally drop or misuse weights/equipment.',
  'I will respect other members, staff, and the gym facility.',
  'I understand that I exercise at my own risk and will inform gym management of any health condition, injury, or limitation that may affect my participation.',
  'I understand that membership fees are subject to the gym\'s payment and membership terms.',
  'I will observe the gym\'s opening and closing hours.',
  'I understand that management reserves the right to take appropriate action where gym rules are repeatedly violated.',
]

export default function FitnessProfilePage() {
  const { user } = useUser()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  // Form state
  const [form, setForm] = useState({
    // Personal
    dateOfBirth: '',
    age: '',
    gender: '',
    phone: user?.primaryPhoneNumber?.phoneNumber || '',

    // Membership
    membershipType: '',
    membershipStartDate: '',
    preferredTrainingTime: '',

    // Goals
    fitnessGoals: [] as string[],
    specificGoal: '',

    // Health
    exercisedBefore: null as boolean | null,
    exerciseHistory: '',
    currentPainOrInjury: null as boolean | null,
    painDetails: '',
    doctorAdviceLimit: null as boolean | null,
    doctorAdviceDetails: '',
    medicalCondition: null as boolean | null,
    medicalDetails: '',
    currentMedication: null as boolean | null,
    medicationDetails: '',
    allergies: null as boolean | null,
    allergyDetails: '',

    // Fitness details
    height: '',
    weight: '',
    fitnessLevel: '',

    // Rules
    rulesAgreed: [] as number[],
    agreedToDeclaration: false,
    signatureName: '',
  })

  const set = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }))
  const toggleGoal = (g: string) => {
    setForm(f => ({
      ...f,
      fitnessGoals: f.fitnessGoals.includes(g)
        ? f.fitnessGoals.filter(x => x !== g)
        : [...f.fitnessGoals, g]
    }))
  }
  const toggleRule = (i: number) => {
    setForm(f => ({
      ...f,
      rulesAgreed: f.rulesAgreed.includes(i)
        ? f.rulesAgreed.filter(x => x !== i)
        : [...f.rulesAgreed, i]
    }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await fetch('/api/fitness-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          agreedToRules: form.rulesAgreed.length === GYM_RULES.length,
          agreedToDeclaration: form.agreedToDeclaration,
        }),
      })
      setDone(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-black text-primary mb-2 uppercase tracking-wide">Profile Complete</h2>
          <p className="text-sm text-slate-500">Welcome to Sharers Gym. Redirecting you to your dashboard…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f6fa] pt-20 sm:pt-28 pb-16 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-8 bg-[#f20d0d]" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#f20d0d]">Sharers Gym</p>
              <h1 className="text-2xl font-black text-primary leading-tight">New Client Registration</h1>
            </div>
          </div>
          <p className="text-sm text-slate-500 ml-4 pl-3">
            Complete this form so we can provide a safe and personalised training experience.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-1">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const isActive = step === s.id
            const isDone = step > s.id
            return (
              <div key={s.id} className="flex items-center gap-1 flex-shrink-0">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                  isActive ? 'bg-primary text-white' : isDone ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-slate-400'
                }`}>
                  {isDone ? <CheckCircle2 className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.id}</span>
                </div>
                {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />}
              </div>
            )
          })}
        </div>

        {/* Form Card */}
        <div className="bg-white border border-slate-200 p-6 sm:p-8">

          {/* ── STEP 1: Personal Info ── */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 pb-3 border-b border-slate-100">
                1. Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Date of Birth" type="date" value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} />
                <FormInput label="Age" type="number" placeholder="e.g. 28" value={form.age} onChange={e => set('age', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Gender</label>
                <RadioGroup name="gender" options={['Male', 'Female']} value={form.gender} onChange={v => set('gender', v)} />
              </div>
              <FormInput label="Phone Number" type="tel" placeholder="+234 000 000 0000" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
          )}

          {/* ── STEP 2: Membership ── */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 pb-3 border-b border-slate-100">
                2. Membership Information
              </h2>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Membership Type</label>
                <RadioGroup
                  name="membershipType"
                  options={['Regular', 'VIP', 'Personal Training', 'Session / Pay-As-You-Go']}
                  value={form.membershipType}
                  onChange={v => set('membershipType', v)}
                />
              </div>
              <FormInput label="Membership Start Date" type="date" value={form.membershipStartDate} onChange={e => set('membershipStartDate', e.target.value)} />
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Preferred Training Time</label>
                <RadioGroup
                  name="preferredTrainingTime"
                  options={['Morning', 'Afternoon', 'Evening']}
                  value={form.preferredTrainingTime}
                  onChange={v => set('preferredTrainingTime', v)}
                />
              </div>
            </div>
          )}

          {/* ── STEP 3: Fitness Goals ── */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 pb-3 border-b border-slate-100">
                3. Fitness Goals
              </h2>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Select your main goals <span className="text-slate-400 font-normal normal-case tracking-normal">(choose all that apply)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {FITNESS_GOALS.map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleGoal(g)}
                      className={`px-3.5 py-2 text-xs font-semibold border transition-all ${
                        form.fitnessGoals.includes(g)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-primary/40'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Describe your specific goal <span className="font-normal normal-case">(optional)</span>
                </label>
                <textarea
                  placeholder="Tell us more about what you want to achieve…"
                  value={form.specificGoal}
                  onChange={e => set('specificGoal', e.target.value)}
                  rows={3}
                  className="w-full border border-slate-200 px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:border-primary/50 resize-none"
                />
              </div>

              {/* Fitness Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <FormInput label="Height" placeholder="e.g. 5'10 or 178cm" value={form.height} onChange={e => set('height', e.target.value)} />
                <FormInput label="Weight" placeholder="e.g. 75kg" value={form.weight} onChange={e => set('weight', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Current Fitness Level</label>
                <RadioGroup
                  name="fitnessLevel"
                  options={['Beginner', 'Intermediate', 'Advanced']}
                  value={form.fitnessLevel}
                  onChange={v => set('fitnessLevel', v)}
                />
              </div>
            </div>
          )}

          {/* ── STEP 4: Health Info ── */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 pb-3 border-b border-slate-100">
                4. Fitness & Health Information
              </h2>
              <YesNoField
                label="Have you exercised regularly before?"
                yesNoValue={form.exercisedBefore}
                onYesNo={v => set('exercisedBefore', v)}
                detail={form.exerciseHistory}
                onDetail={v => set('exerciseHistory', v)}
                detailLabel="If yes, for how long and what type of exercise?"
              />
              <YesNoField
                label="Are you currently experiencing any pain, injury, or physical limitation?"
                yesNoValue={form.currentPainOrInjury}
                onYesNo={v => set('currentPainOrInjury', v)}
                detail={form.painDetails}
                onDetail={v => set('painDetails', v)}
                detailLabel="Please explain…"
              />
              <YesNoField
                label="Have you ever been advised by a doctor or healthcare professional to avoid or limit physical exercise?"
                yesNoValue={form.doctorAdviceLimit}
                onYesNo={v => set('doctorAdviceLimit', v)}
                detail={form.doctorAdviceDetails}
                onDetail={v => set('doctorAdviceDetails', v)}
                detailLabel="Please provide details…"
              />
              <YesNoField
                label="Do you have any medical condition that may affect your ability to exercise?"
                yesNoValue={form.medicalCondition}
                onYesNo={v => set('medicalCondition', v)}
                detail={form.medicalDetails}
                onDetail={v => set('medicalDetails', v)}
                detailLabel="Please specify…"
              />
              <YesNoField
                label="Are you currently taking any medication that may affect your exercise or physical activity?"
                yesNoValue={form.currentMedication}
                onYesNo={v => set('currentMedication', v)}
                detail={form.medicationDetails}
                onDetail={v => set('medicationDetails', v)}
                detailLabel="Please specify…"
              />
              <YesNoField
                label="Do you have any allergies we should be aware of?"
                yesNoValue={form.allergies}
                onYesNo={v => set('allergies', v)}
                detail={form.allergyDetails}
                onDetail={v => set('allergyDetails', v)}
                detailLabel="Please specify…"
              />
            </div>
          )}

          {/* ── STEP 5: Gym Rules + Declaration ── */}
          {step === 5 && (
            <div className="space-y-5">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 pb-3 border-b border-slate-100">
                5. Gym Rules & Declaration
              </h2>
              <div className="space-y-3">
                {GYM_RULES.map((rule, i) => (
                  <label key={i} className={`flex items-start gap-3 p-3 border cursor-pointer transition-all ${
                    form.rulesAgreed.includes(i) ? 'bg-slate-50 border-primary/20' : 'bg-white border-slate-100'
                  }`}>
                    <div className={`w-5 h-5 mt-0.5 flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                      form.rulesAgreed.includes(i) ? 'bg-primary border-primary' : 'border-slate-300'
                    }`}>
                      {form.rulesAgreed.includes(i) && (
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <input type="checkbox" className="sr-only" checked={form.rulesAgreed.includes(i)} onChange={() => toggleRule(i)} />
                    <span className="text-sm text-slate-700 leading-relaxed">{rule}</span>
                  </label>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">Client Declaration</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  I confirm that the information I have provided in this form is accurate and complete to the best of my knowledge. 
                  I understand that I am responsible for informing Sharers Gym management of any change in my health or physical condition that may affect my ability to exercise safely.
                </p>
                <FormInput
                  label="Full Name (Signature)"
                  placeholder="Type your full legal name"
                  value={form.signatureName}
                  onChange={e => set('signatureName', e.target.value)}
                />
                <label className="flex items-start gap-3 cursor-pointer">
                  <div className={`w-5 h-5 mt-0.5 flex-shrink-0 border-2 flex items-center justify-center ${
                    form.agreedToDeclaration ? 'bg-primary border-primary' : 'border-slate-300'
                  }`}>
                    {form.agreedToDeclaration && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <input type="checkbox" className="sr-only" checked={form.agreedToDeclaration} onChange={e => set('agreedToDeclaration', e.target.checked)} />
                  <span className="text-sm text-slate-700">
                    I agree to the client declaration above and confirm all information is accurate.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
            {step > 1 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting || !form.agreedToDeclaration || !form.signatureName || form.rulesAgreed.length < GYM_RULES.length}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Submit Registration
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Step {step} of {STEPS.length} — Your information is kept private and secure.
        </p>
      </div>
    </div>
  )
}
