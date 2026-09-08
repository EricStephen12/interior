'use client'

import React, { useState } from 'react'
import { Printer, Check } from 'lucide-react'

interface PrintReceiptButtonProps {
  className?: string
}

export default function PrintReceiptButton({ className = '' }: PrintReceiptButtonProps) {
  const [printed, setPrinted] = useState(false)

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
      setPrinted(true)
      setTimeout(() => setPrinted(false), 3000)
    }
  }

  return (
    <button
      type="button"
      onClick={handlePrint}
      id="print-receipt-btn"
      title="Print or Save as PDF (Ctrl + P)"
      className={`inline-flex items-center gap-2 bg-[#f20d0d] hover:bg-red-700 active:scale-95 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-red-600/20 cursor-pointer select-none print:hidden ${className}`}
    >
      {printed ? (
        <>
          <Check className="w-4 h-4 text-white animate-in zoom-in-50 duration-200" />
          <span>Printed / Saved</span>
        </>
      ) : (
        <>
          <Printer className="w-4 h-4 text-white" />
          <span>Print / Save as PDF</span>
        </>
      )}
    </button>
  )
}
