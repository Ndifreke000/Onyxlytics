"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bullet } from "@/components/ui/bullet"
import { cn } from "@/lib/utils"
import { parseNumericValue } from "@/lib/format-utils"

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
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (Math.abs(displayValue - value) < 0.01) return

    const startValue = displayValue
    const difference = value - startValue
    const duration = 800 // ms
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Smooth easing function
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const currentValue = startValue + difference * easeOutCubic

      setDisplayValue(currentValue)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        animationRef.current = null
      }
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [value, displayValue])

  const formatDisplayValue = (val: number) => {
    if (val >= 1000) {
      return Math.round(val).toLocaleString()
    }
    return Math.round(val * 100) / 100
  }

  return (
    <span className="tabular-nums">
      {prefix}
      {formatDisplayValue(displayValue)}
      {suffix}
    </span>
  )
}

export default function DashboardStat({ label, value, description, icon, tag, intent, direction }: DashboardStatProps) {
  const Icon = icon

  const getIntentClassName = () => {
    if (intent === "positive") return "text-success"
    if (intent === "negative") return "text-destructive"
    return "text-muted-foreground"
  }

  const { prefix, numericValue, suffix, isNumeric } = parseNumericValue(value)

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2.5 text-sm">
          <Bullet />
          {label}
        </CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>

      <CardContent className="bg-accent flex-1 pt-2 md:pt-6 overflow-hidden relative">
        <div className="flex items-center min-w-0">
          <div className="text-3xl md:text-4xl lg:text-5xl font-display truncate min-w-0 flex-1">
            {isNumeric ? (
              <AnimatedNumber value={numericValue} prefix={prefix} suffix={suffix} />
            ) : (
              <span className="truncate block">{value}</span>
            )}
          </div>
          {tag && (
            <Badge variant="default" className="uppercase ml-2 text-xs shrink-0">
              {tag}
            </Badge>
          )}
        </div>

        {description && (
          <div className="mt-2">
            <p className="text-xs md:text-sm font-medium text-muted-foreground tracking-wide truncate">
              {description}
            </p>
          </div>
        )}

        {direction && (
          <div className="absolute top-0 right-0 w-12 h-full pointer-events-none overflow-hidden group">
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
                  <Arrow key={i + 6} direction={direction} index={i} />
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
  const staggerDelay = index * 0.12
  const phaseDelay = (index % 3) * 0.6

  return (
    <span
      style={{
        animationDelay: `${staggerDelay + phaseDelay}s`,
        animationDuration: "2.5s",
        animationTimingFunction: "cubic-bezier(0.4, 0.0, 0.2, 1)",
      }}
      className={cn(
        "text-center text-4xl size-12 font-display leading-none block",
        "transition-all duration-500 ease-out",
        "animate-marquee-pulse",
        "will-change-transform",
      )}
    >
      {direction === "up" ? "↑" : "↓"}
    </span>
  )
}
