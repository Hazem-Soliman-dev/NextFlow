"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const AvatarContext = React.createContext<{
  hasImage: boolean
  setHasImage: (val: boolean) => void
}>({
  hasImage: false,
  setHasImage: () => {},
})

function Avatar({ className, ...props }: React.ComponentProps<"div">) {
  const [hasImage, setHasImage] = React.useState(false)

  return (
    <AvatarContext.Provider value={{ hasImage, setHasImage }}>
      <div
        data-slot="avatar"
        className={cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted border border-border/10",
          className
        )}
        {...props}
      />
    </AvatarContext.Provider>
  )
}

function AvatarImage({
  className,
  src,
  alt,
  ...props
}: React.ComponentProps<"img">) {
  const { setHasImage } = React.useContext(AvatarContext)
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    if (!src || typeof src !== "string") {
      Promise.resolve().then(() => {
        setLoaded(false)
        setHasImage(false)
      })
      return
    }
    
    let active = true
    const img = new Image()
    img.src = src
    img.onload = () => {
      if (active) {
        setLoaded(true)
        setHasImage(true)
      }
    }
    img.onerror = () => {
      if (active) {
        setLoaded(false)
        setHasImage(false)
      }
    }
    
    return () => {
      active = false
    }
  }, [src, setHasImage])

  if (!src || !loaded) return null

  return (
    <img
      src={src}
      alt={alt}
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { hasImage } = React.useContext(AvatarContext)

  if (hasImage) return null

  return (
    <div
      data-slot="avatar-fallback"
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500 font-semibold text-xs border border-indigo-500/20",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
