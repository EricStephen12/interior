'use client'

import React, { useRef, useEffect } from 'react'
import { Bold, Italic, List, Link as LinkIcon, Heading2, Maximize2, Minimize2 } from 'lucide-react'

interface RichTextEditorProps {
    value: string
    onChange: (val: string) => void
    placeholder?: string
    label?: string
}

export default function RichTextEditor({ value, onChange, placeholder, label }: RichTextEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [isExpanded, setIsExpanded] = React.useState(false)

    const applyFormat = (prefix: string, suffix: string = prefix) => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const text = textarea.value
        const selected = text.substring(start, end)
        const before = text.substring(0, start)
        const after = text.substring(end)

        const newValue = `${before}${prefix}${selected}${suffix}${after}`
        onChange(newValue)

        // Reset focus and selection
        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(start + prefix.length, end + prefix.length)
        }, 0)
    }

    // Auto-resize logic
    useEffect(() => {
        const textarea = textareaRef.current
        if (textarea && !isExpanded) {
            textarea.style.height = 'auto'
            textarea.style.height = `${textarea.scrollHeight}px`
        }
    }, [value, isExpanded])

    return (
        <div className={`flex flex-col border border-gray-200 rounded-xl overflow-hidden transition-all bg-white ${isExpanded ? 'fixed inset-4 z-[100] shadow-2xl' : 'relative shadow-sm'}`}>
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-1">
                    <button type="button" onClick={() => applyFormat('**')} className="p-2 hover:bg-gray-200 rounded transition-colors" title="Bold"><Bold className="w-4 h-4" /></button>
                    <button type="button" onClick={() => applyFormat('_')} className="p-2 hover:bg-gray-200 rounded transition-colors" title="Italic"><Italic className="w-4 h-4" /></button>
                    <button type="button" onClick={() => applyFormat('## ')} className="p-2 hover:bg-gray-200 rounded transition-colors" title="Heading"><Heading2 className="w-4 h-4" /></button>
                    <button type="button" onClick={() => applyFormat('- ')} className="p-2 hover:bg-gray-200 rounded transition-colors" title="List"><List className="w-4 h-4" /></button>
                    <button type="button" onClick={() => applyFormat('[', '](url)')} className="p-2 hover:bg-gray-200 rounded transition-colors" title="Link"><LinkIcon className="w-4 h-4" /></button>
                </div>
                <button 
                    type="button" 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 hover:bg-gray-200 rounded transition-colors text-gray-400 hover:text-gray-900"
                >
                    {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
            </div>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full p-6 text-gray-800 text-sm leading-relaxed focus:outline-none bg-white transition-all ${isExpanded ? 'flex-1 resize-none' : 'min-h-[200px] resize-y'}`}
            />
            {isExpanded && (
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Screen Editor Mode</p>
                    <button onClick={() => setIsExpanded(false)} className="text-[10px] font-black text-accent uppercase tracking-widest hover:text-primary">Exit Fullscreen</button>
                </div>
            )}
        </div>
    )
}
