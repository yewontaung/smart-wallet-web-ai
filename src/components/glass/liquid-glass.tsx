import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import { cn } from '../../utils/cn'

import {
  getDisplacementFilter,
  getDisplacementMap,
} from './displacement'

import './liquid-glass.css'

const TAILWIND_BG_PATTERN = /\bbg-/

export interface LiquidGlassProps {
  children?: ReactNode
  border?: string

  /** Explicit pixel width. Omit to size via Tailwind `w-*` classes. */
  width?: number
  /** Explicit pixel height. Omit to size via Tailwind `h-*` classes. */
  height?: number

  radius?: number
  depth?: number
  blur?: number
  strength?: number

  chromaticAberration?: number

  /** Inline background color. Omit when using Tailwind `bg-*` classes. */
  backgroundColor?: string

  debug?: boolean

  responsive?: boolean

  baseWidth?: number
  baseHeight?: number

  autoSize?: boolean

  minWidth?: number
  minHeight?: number

  className?: string
  style?: CSSProperties
  onClick?: (e?: React.MouseEvent<HTMLDivElement>) => void
}

export function LiquidGlass({
  children,

  width,
  height,
  border,
  onClick,

  radius = 50,
  depth = 10,
  blur = 2,
  strength = 100,

  chromaticAberration = 0,

  backgroundColor = 'rgba(255, 255, 255, 0.4)',

  debug = false,

  responsive = false,

  baseWidth,
  baseHeight,

  autoSize = false,

  minWidth = 0,
  minHeight = 0,

  className,
  style,
}: LiquidGlassProps) {
  const glassRef = useRef<HTMLDivElement>(null)

  const [clicked, setClicked] = useState(false)

  const [responsiveSize, setResponsiveSize] = useState({
    width: baseWidth ?? width ?? 0,
    height: baseHeight ?? height ?? 0,
  })

  const hasExplicitWidth = width !== undefined
  const hasExplicitHeight = height !== undefined
  const usesTailwindSizing =
    !autoSize && (!hasExplicitWidth || !hasExplicitHeight)
  const usesTailwindBackground = TAILWIND_BG_PATTERN.test(className ?? '')

  const actualWidth = responsive ? responsiveSize.width : width
  const actualHeight = responsive ? responsiveSize.height : height

  const actualDepth = depth / (clicked ? 0.7 : 1)

  useEffect(() => {
    if (!responsive) return

    const update = () => {
      const baseW = baseWidth ?? width ?? 0
      const baseH = baseHeight ?? height ?? 0

      const viewport = window.innerWidth

      let scale = 1

      if (viewport < 480) {
        scale = 0.6
      } else if (viewport < 768) {
        scale = 0.8
      } else if (viewport < 1024) {
        scale = 0.9
      }

      setResponsiveSize({
        width: Math.round(baseW * scale),
        height: Math.round(baseH * scale),
      })
    }

    update()

    window.addEventListener('resize', update)

    return () => {
      window.removeEventListener('resize', update)
    }
  }, [responsive, baseWidth, baseHeight, width, height])

  const updateGlass = useCallback(() => {
    const element = glassRef.current

    if (!element) return

    let w = actualWidth ?? 0
    let h = actualHeight ?? 0

    if (autoSize || usesTailwindSizing) {
      const rect = element.getBoundingClientRect()

      w = Math.ceil(rect.width)
      h = Math.ceil(rect.height)

      w = Math.max(w, minWidth, autoSize ? 50 : 1)
      h = Math.max(h, minHeight, autoSize ? 30 : 1)
    }

    if (w <= 0 || h <= 0) return

    element.style.borderRadius = `${radius}px`

    if (debug) {
      element.style.background = `url("${getDisplacementMap({
        width: w,
        height: h,
        radius,
        depth: actualDepth,
      })}")`
      element.style.backdropFilter = 'none'
      element.style.setProperty('-webkit-backdrop-filter', 'none')
      element.style.boxShadow = 'none'
      return
    }

    const filter = getDisplacementFilter({
      width: w,
      height: h,
      radius,
      depth: actualDepth,
      strength,
      chromaticAberration,
    })

    const backdrop = `
      blur(${blur / 2}px)
      url("${filter}")
      blur(${blur}px)
      brightness(1.1)
      saturate(1.5)
    `

    if (!usesTailwindBackground) {
      element.style.background = backgroundColor
    }

    element.style.backdropFilter = backdrop
    element.style.setProperty('-webkit-backdrop-filter', backdrop)

    element.style.boxShadow = `
      1px 1px 1px 0px
      rgba(255,255,255,0.60) inset,

      -1px -1px 1px 0px
      rgba(255,255,255,0.60) inset,

      0px 0px 16px 0px
      rgba(0,0,0,0.04)
    `

    element.style.border =
      border ?? '1px solid rgba(255,255,255,0.3)'
  }, [
    actualWidth,
    actualHeight,
    actualDepth,
    radius,
    blur,
    strength,
    chromaticAberration,
    backgroundColor,
    border,
    debug,
    autoSize,
    usesTailwindSizing,
    usesTailwindBackground,
    minWidth,
    minHeight,
  ])

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      updateGlass()
    })

    return () => cancelAnimationFrame(frame)
  }, [updateGlass])

  useEffect(() => {
    if (!autoSize && !usesTailwindSizing) return

    const element = glassRef.current

    if (!element) return

    const observer = new ResizeObserver(() => {
      updateGlass()
    })

    observer.observe(element)

    return () => observer.disconnect()
  }, [autoSize, usesTailwindSizing, updateGlass])

  const inlineSize: CSSProperties = {}

  if (hasExplicitWidth && !autoSize) {
    inlineSize.width = responsive ? actualWidth : width
  }

  if (hasExplicitHeight && !autoSize) {
    inlineSize.height = responsive ? actualHeight : height
  }

  if (autoSize) {
    if (minWidth > 0) inlineSize.minWidth = minWidth
    if (minHeight > 0) inlineSize.minHeight = minHeight
  }

  return (
    <div
      ref={glassRef}
      className={cn(
        'liquid-glass',
        autoSize && 'liquid-glass-auto',
        className,
      )}
      style={{
        ...inlineSize,
        ...style,
      }}
      onClick={onClick}
      onMouseDown={() => setClicked(true)}
      onMouseUp={() => setClicked(false)}
      onMouseLeave={() => setClicked(false)}
      onTouchStart={() => setClicked(true)}
      onTouchEnd={() => setClicked(false)}
    >
      <div className="liquid-glass-content">{children}</div>
    </div>
  )
}
