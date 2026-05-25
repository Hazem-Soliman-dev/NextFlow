"use client"

import React from "react"

interface HScrollContainerProps {
  children: React.ReactNode
  label?: string
}

export function HScrollContainer({ children, label }: HScrollContainerProps) {
  return (
    <div className="ag-hscroll-wrap" role="region" aria-label={label || "Horizontal scroll list"}>
      <div className="ag-hscroll">
        {children}
      </div>
    </div>
  )
}
