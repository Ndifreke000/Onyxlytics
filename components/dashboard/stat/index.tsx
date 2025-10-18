"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bullet } from "@/components/ui/bullet"
import { cn } from "@/lib/utils"

interface DashboardStatProps {
  label: string
  value: string
  description?: string
  tag?: string
  icon: React.ElementType
  intent?: "positive" | "negative" | "neutral"
  direction?: "up" | "down"
}

// Custom smooth number animation component (replaces @number-flow/react)
function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    if (displayValue === value) return

    const startValue = displayValue
    const difference = value - startValue
    const duration = 600 // ms
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth animation
      const easeOutQuad = 1 - (1 - progress) * (1 - progress)
      const currentValue = startValue + difference * easeOutQuad

      setDisplayValue(Math.round(currentValue * 100) / 100)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    const frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [value, displayValue])

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  )
}

export default function DashboardStat({ label, value, description, icon, tag, intent, direction }: DashboardStatProps) {
  const Icon = icon

  const parseValue = (val: string) => {
    const match = val.match(/^([^\d.-]*)([+-]?\d*\.?\d+)([^\d]*)$/)

    if (match) {
      const [, prefix, numStr, suffix] = match
      return {
        prefix: prefix || "",
        numericValue: Number.parseFloat(numStr),
        suffix: suffix || "",
        isNumeric: !isNaN(Number.parseFloat(numStr)),
      }
    }

    return {
      prefix: "",
      numericValue: 0,
      suffix: val,
      isNumeric: false,
    }
  }

  const getIntentClassName = () => {
    if (intent === "positive") return "text-success"
    if (intent === "negative") return "text-destructive"
    return "text-muted-foreground"
  }

  const { prefix, numericValue, suffix, isNumeric } = parseValue(value)

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2.5">
          <Bullet />
          {label}
        </CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>

      <CardContent className="bg-accent flex-1 pt-2 md:pt-6 overflow-clip relative">
        <div className="flex items-center">
          <span className="text-4xl md:text-5xl font-display">
            {isNumeric ? <AnimatedNumber value={numericValue} prefix={prefix} suffix={suffix} /> : value}
          </span>
          {tag && (
            <Badge variant="default" className="uppercase ml-3">
              {tag}
            </Badge>
          )}
        </div>

        {description && (
          <div className="justify-between">
            <p className="text-xs md:text-sm font-medium text-muted-foreground tracking-wide">{description}</p>
          </div>
        )}

        {direction && (
          <div className="absolute top-0 right-0 w-14 h-full pointer-events-none overflow-hidden group">
            <div
              className={cn(
                "flex flex-col transition-all duration-500",
                "group-hover:scale-105 group-hover:brightness-110",
                getIntentClassName(),
                direction === "up" ? "animate-marquee-up" : "animate-marquee-down",
              )}
            >
              <div className={cn("flex", direction === "up" ? "flex-col-reverse" : "flex-col")}>
                {Array.from({ length: 6 }, (_, i) => (
                  <Arrow key={i} direction={direction} index={i} />
                ))}
              </div>
              <div className={cn("flex", direction === "up" ? "flex-col-reverse" : "flex-col")}>
                {Array.from({ length: 6 }, (_, i) => (
                  <Arrow key={i} direction={direction} index={i} />
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface ArrowProps {
  direction: "up" | "down"
  index: number
}

const Arrow = ({ direction, index }: ArrowProps) => {
  const staggerDelay = index * 0.15
  const phaseDelay = (index % 3) * 0.8

  return (
    <span
      style={{
        animationDelay: `${staggerDelay + phaseDelay}s`,
        animationDuration: "3s",
        animationTimingFunction: "cubic-bezier(0.4, 0.0, 0.2, 1)",
      }}
      className={cn(
        "text-center text-5xl size-14 font-display leading-none block",
        "transition-all duration-700 ease-out",
        "animate-marquee-pulse",
        "will-change-transform",
      )}
    >
      {direction === "up" ? "↑" : "↓"}
    </span>
  )
}
