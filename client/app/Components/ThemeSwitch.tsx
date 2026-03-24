"use client"

import { Moon, Sun } from "lucide-react"

type Props = {
  checked: boolean
  onChange: (val: boolean) => void
}

export default function ThemeSwitch({ checked, onChange }: Props) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`
        relative w-14 h-8 rounded-full transition-all duration-300
        ${checked ? "bg-zinc-800 shadow-[0_0_12px_rgba(255,255,255,0.3)]" : "bg-blue-400"}
      `}
    >
      
      <div
        className={`
          absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center
          bg-white transition-all duration-300
          ${checked ? "translate-x-6" : "translate-x-0"}
        `}
      >
        {checked ? (
          <Moon className="w-4 h-4 text-black" />
        ) : (
          <Sun className="w-4 h-4 text-yellow-500" />
        )}
      </div>
    </button>
  )
}