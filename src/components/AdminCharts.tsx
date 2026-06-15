'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Activity } from 'lucide-react'

interface ChartDataPoint {
  date: string
  label: string // e.g. "Mon"
  value: number
}

interface AdminChartsProps {
  revenueData: ChartDataPoint[]
  checkInData: ChartDataPoint[]
}

export default function AdminCharts({ revenueData, checkInData }: AdminChartsProps) {
  const [hoveredRevIndex, setHoveredRevIndex] = useState<number | null>(null)
  const [hoveredCheckIndex, setHoveredCheckIndex] = useState<number | null>(null)
  const [revTooltip, setRevTooltip] = useState<{ x: number; y: number; val: number; date: string } | null>(null)
  const [checkTooltip, setCheckTooltip] = useState<{ x: number; y: number; val: number; date: string } | null>(null)

  // Revenue Scaling Helpers
  const maxRevenue = Math.max(...revenueData.map((d) => d.value), 1000)
  const revPoints = revenueData.map((d, index) => {
    const x = 50 + (index / (revenueData.length - 1 || 1)) * 420
    const y = 200 - (d.value / maxRevenue) * 160
    return { x, y, ...d }
  })

  // Generate SVG Path for Line and Area
  const linePath = revPoints.reduce((path, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${path} L ${pt.x} ${pt.y}`
  }, '')

  const areaPath = revPoints.length > 0 
    ? `${linePath} L ${revPoints[revPoints.length - 1].x} 200 L ${revPoints[0].x} 200 Z`
    : ''

  // Checkins Scaling Helpers
  const maxCheckIns = Math.max(...checkInData.map((d) => d.value), 5)
  const checkPoints = checkInData.map((d, index) => {
    const x = 50 + (index / (checkInData.length || 1)) * 420 + (420 / checkInData.length) / 2
    const barHeight = (d.value / maxCheckIns) * 160
    const y = 200 - barHeight
    return { x, y, barHeight, ...d }
  })

  const handleRevMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const percentX = (mouseX - 50) / 420
    const index = Math.round(percentX * (revenueData.length - 1))
    const boundedIndex = Math.max(0, Math.min(revenueData.length - 1, index))
    const pt = revPoints[boundedIndex]
    
    setHoveredRevIndex(boundedIndex)
    setRevTooltip({
      x: pt.x,
      y: pt.y,
      val: pt.value,
      date: pt.date
    })
  }

  const handleCheckMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    
    // Find the closest bar
    let closestIndex = 0
    let minDiff = Infinity
    checkPoints.forEach((pt, i) => {
      const diff = Math.abs(mouseX - pt.x)
      if (diff < minDiff) {
        minDiff = diff
        closestIndex = i
      }
    })
    
    const pt = checkPoints[closestIndex]
    setHoveredCheckIndex(closestIndex)
    setCheckTooltip({
      x: pt.x,
      y: pt.y,
      val: pt.value,
      date: pt.date
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-6">
      {/* Revenue Area Graph */}
      <div className="bg-white border border-primary/5 p-6 relative flex flex-col justify-between overflow-hidden">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-accent" /> Weekly Revenue Trend
            </h4>
            <span className="text-[8px] font-black tracking-widest text-emerald-500 bg-emerald-50 px-2 py-0.5 uppercase">
              Live
            </span>
          </div>
        </div>

        <div className="relative w-full h-[220px]">
          <svg
            viewBox="0 0 500 220"
            className="w-full h-full overflow-visible select-none cursor-crosshair"
            onMouseMove={handleRevMouseMove}
            onMouseLeave={() => {
              setHoveredRevIndex(null)
              setRevTooltip(null)
            }}
          >
            {/* Grids */}
            <line x1="50" y1="40" x2="470" y2="40" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
            <line x1="50" y1="120" x2="470" y2="120" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
            <line x1="50" y1="200" x2="470" y2="200" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />

            {/* Gradient Def */}
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Area */}
            {areaPath && (
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                d={areaPath}
                fill="url(#revGrad)"
              />
            )}

            {/* Line */}
            {linePath && (
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                d={linePath}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
              />
            )}

            {/* Guide Line */}
            {hoveredRevIndex !== null && revTooltip && (
              <line
                x1={revTooltip.x}
                y1="40"
                x2={revTooltip.x}
                y2="200"
                stroke="rgba(99, 102, 241, 0.2)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            )}

            {/* Circles */}
            {revPoints.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r={hoveredRevIndex === i ? 6 : 4}
                className="transition-all duration-200"
                fill={hoveredRevIndex === i ? "#6366f1" : "#fff"}
                stroke="#6366f1"
                strokeWidth={hoveredRevIndex === i ? 3 : 2}
              />
            ))}

            {/* X Axis Labels */}
            {revPoints.map((pt, i) => (
              <text
                key={i}
                x={pt.x}
                y="218"
                textAnchor="middle"
                className="text-[9px] font-black fill-slate-400 uppercase tracking-wider"
              >
                {pt.label}
              </text>
            ))}

            {/* Y Axis Labels */}
            <text x="40" y="45" textAnchor="end" className="text-[9px] font-black fill-slate-300">
              ₦{(maxRevenue).toLocaleString()}
            </text>
            <text x="40" y="125" textAnchor="end" className="text-[9px] font-black fill-slate-300">
              ₦{(maxRevenue / 2).toLocaleString()}
            </text>
            <text x="40" y="204" textAnchor="end" className="text-[9px] font-black fill-slate-300">
              ₦0
            </text>
          </svg>

          {/* HTML Floating Tooltip */}
          <AnimatePresence>
            {hoveredRevIndex !== null && revTooltip && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 5 }}
                transition={{ duration: 0.15 }}
                className="absolute z-20 bg-primary text-white border border-white/10 px-3 py-2 pointer-events-none shadow-xl flex flex-col gap-0.5"
                style={{
                  left: `${(revTooltip.x / 500) * 100}%`,
                  top: `${(revTooltip.y / 220) * 100 - 55}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{revTooltip.date}</span>
                <span className="text-xs font-black tracking-tight text-white">₦{revTooltip.val.toLocaleString()}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Checkins Bar Chart */}
      <div className="bg-white border border-primary/5 p-6 relative flex flex-col justify-between overflow-hidden">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-accent" /> Weekly Check-Ins
            </h4>
            <span className="text-[8px] font-black tracking-widest text-accent bg-accent/5 px-2 py-0.5 uppercase">
              Scanners
            </span>
          </div>
        </div>

        <div className="relative w-full h-[220px]">
          <svg
            viewBox="0 0 500 220"
            className="w-full h-full overflow-visible select-none cursor-pointer"
            onMouseMove={handleCheckMouseMove}
            onMouseLeave={() => {
              setHoveredCheckIndex(null)
              setCheckTooltip(null)
            }}
          >
            {/* Grids */}
            <line x1="50" y1="40" x2="470" y2="40" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
            <line x1="50" y1="120" x2="470" y2="120" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
            <line x1="50" y1="200" x2="470" y2="200" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />

            {/* Bars */}
            {checkPoints.map((pt, i) => {
              const barWidth = 24
              return (
                <g key={i}>
                  {/* Background invisible hover catcher */}
                  <rect
                    x={pt.x - barWidth}
                    y="40"
                    width={barWidth * 2}
                    height="160"
                    fill="transparent"
                  />
                  {/* Actual Animated Bar */}
                  <motion.rect
                    initial={{ height: 0, y: 200 }}
                    animate={{ height: pt.barHeight, y: pt.y }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
                    x={pt.x - barWidth / 2}
                    width={barWidth}
                    fill={hoveredCheckIndex === i ? "#6366f1" : "rgba(99, 102, 241, 0.45)"}
                    className="transition-colors duration-150"
                  />
                </g>
              )
            })}

            {/* X Axis Labels */}
            {checkPoints.map((pt, i) => (
              <text
                key={i}
                x={pt.x}
                y="218"
                textAnchor="middle"
                className="text-[9px] font-black fill-slate-400 uppercase tracking-wider"
              >
                {pt.label}
              </text>
            ))}

            {/* Y Axis Labels */}
            <text x="40" y="45" textAnchor="end" className="text-[9px] font-black fill-slate-300">
              {maxCheckIns}
            </text>
            <text x="40" y="125" textAnchor="end" className="text-[9px] font-black fill-slate-300">
              {Math.ceil(maxCheckIns / 2)}
            </text>
            <text x="40" y="204" textAnchor="end" className="text-[9px] font-black fill-slate-300">
              0
            </text>
          </svg>

          {/* HTML Floating Tooltip */}
          <AnimatePresence>
            {hoveredCheckIndex !== null && checkTooltip && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 5 }}
                transition={{ duration: 0.15 }}
                className="absolute z-20 bg-primary text-white border border-white/10 px-3 py-2 pointer-events-none shadow-xl flex flex-col gap-0.5"
                style={{
                  left: `${(checkTooltip.x / 500) * 100}%`,
                  top: `${(checkTooltip.y / 220) * 100 - 55}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{checkTooltip.date}</span>
                <span className="text-xs font-black tracking-tight text-white">{checkTooltip.val} Check-ins</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
