import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import {
  getDisplacementFilter,
  getDisplacementMap,
} from './displacement'

import './liquid-glass.css'

export interface LiquidGlassProps {
  children?: ReactNode
  border?:string

  width?: number
  height?: number

  radius?: number
  depth?: number
  blur?: number
  strength?: number

  chromaticAberration?: number

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
  onClick?:(e?:MouseEvent) => void
}

export function LiquidGlass({
  children,

  width = 200,
  height = 200,
  border,
  onClick,

  radius = 50,
  depth = 10,
  blur = 2,
  strength = 100,

  chromaticAberration = 0,

  backgroundColor =
    'rgba(255, 255, 255, 0.4)',

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
  const glassRef =
    useRef<HTMLDivElement>(null)

  const [clicked, setClicked] =
    useState(false)

  const [responsiveSize, setResponsiveSize] =
    useState({
      width:
        baseWidth ?? width,
      height:
        baseHeight ?? height,
    })

  const actualWidth =
    responsive
      ? responsiveSize.width
      : width

  const actualHeight =
    responsive
      ? responsiveSize.height
      : height

  const actualDepth =
    depth / (clicked ? 0.7 : 1)

  /*
   * Responsive sizing
   */
  useEffect(() => {
    if (!responsive) return

    const update = () => {
      const baseW =
        baseWidth ?? width

      const baseH =
        baseHeight ?? height

      const viewport =
        window.innerWidth

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

    window.addEventListener(
      'resize',
      update
    )

    return () => {
      window.removeEventListener(
        'resize',
        update
      )
    }
  }, [
    responsive,
    baseWidth,
    baseHeight,
    width,
    height,
  ])

  /*
   * Apply glass effect
   */
  const updateGlass = () => {
    const element =
      glassRef.current

    if (!element) return

    let w = actualWidth
    let h = actualHeight

    /*
     * Auto-size
     */
    if (autoSize) {
      const rect =
        element.getBoundingClientRect()

      w = Math.ceil(rect.width)
      h = Math.ceil(rect.height)

      w = Math.max(
        w,
        minWidth,
        50
      )

      h = Math.max(
        h,
        minHeight,
        30
      )
    }

    if (w <= 0 || h <= 0) return

    element.style.borderRadius =
      `${radius}px`

    /*
     * Debug mode
     */
    if (debug) {
      element.style.background =
        `url("${getDisplacementMap({
          width: w,
          height: h,
          radius,
          depth: actualDepth,
        })}")`

      element.style.backdropFilter =
        'none'

      element.style.boxShadow =
        'none'

      return
    }

    /*
     * SVG displacement filter
     */
    const filter =
      getDisplacementFilter({
        width: w,
        height: h,
        radius,
        depth: actualDepth,
        strength,
        chromaticAberration,
      })

    element.style.background =
      backgroundColor

    element.style.backdropFilter = `
      blur(${blur / 2}px)
      url("${filter}")
      blur(${blur}px)
      brightness(1.1)
      saturate(1.5)
    `

    element.style.backdropFilter =
      `
      blur(${blur / 2}px)
      url("${filter}")
      blur(${blur}px)
      brightness(1.1)
      saturate(1.5)
    `

    element.style.boxShadow = `
      1px 1px 1px 0px
      rgba(255,255,255,0.60) inset,

      -1px -1px 1px 0px
      rgba(255,255,255,0.60) inset,

      0px 0px 16px 0px
      rgba(0,0,0,0.04)
    `

    element.style.border = border ??
      '1px solid rgba(255,255,255,0.3)'
  }

  /*
   * Update after layout
   */
  useLayoutEffect(() => {
    const frame =
      requestAnimationFrame(() => {
        updateGlass()
      })

    return () =>
      cancelAnimationFrame(frame)
  }, [
    actualWidth,
    actualHeight,
    actualDepth,
    radius,
    blur,
    strength,
    chromaticAberration,
    backgroundColor,
    debug,
    autoSize,
  ])

  /*
   * Auto-size observer
   */
  useEffect(() => {
    if (!autoSize) return

    const element =
      glassRef.current

    if (!element) return

    const observer =
      new ResizeObserver(() => {
        updateGlass()
      })

    observer.observe(element)

    return () =>
      observer.disconnect()
  }, [autoSize])

  return (
    <div
      ref={glassRef}
      className={[
        'liquid-glass',
        autoSize
          ? 'liquid-glass-auto'
          : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        width: autoSize
          ? undefined
          : actualWidth,

        height: autoSize
          ? undefined
          : actualHeight,

        minWidth:
          autoSize
            ? minWidth || undefined
            : undefined,

        minHeight:
          autoSize
            ? minHeight || undefined
            : undefined,

        ...style,
      }}
      onMouseDown={() =>
        setClicked(true)
      }
      onMouseUp={() =>
        setClicked(false)
      }
      onMouseLeave={() =>
        setClicked(false)
      }
      onTouchStart={() =>
        setClicked(true)
      }
      onTouchEnd={() =>
        setClicked(false)
      }
    >
      <div className="liquid-glass-content">
        {children}
      </div>
    </div>
  )
}