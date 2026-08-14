export interface DisplacementMapOptions {
  width: number
  height: number
  radius: number
  depth: number
}

export interface DisplacementFilterOptions
  extends DisplacementMapOptions {
  strength?: number
  chromaticAberration?: number
}

export function getDisplacementMap({
  width,
  height,
  radius,
  depth,
}: DisplacementMapOptions): string {
  const svg = `
    <svg
      width="${width}"
      height="${height}"
      viewBox="0 0 ${width} ${height}"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        .mix {
          mix-blend-mode: screen;
        }
      </style>

      <defs>
        <linearGradient
          id="Y"
          x1="0"
          x2="0"
          y1="${Math.ceil((radius / height) * 15)}%"
          y2="${Math.floor(
            100 - (radius / height) * 15
          )}%"
        >
          <stop offset="0%" stop-color="#0F0" />
          <stop offset="100%" stop-color="#000" />
        </linearGradient>

        <linearGradient
          id="X"
          x1="${Math.ceil((radius / width) * 15)}%"
          x2="${Math.floor(
            100 - (radius / width) * 15
          )}%"
          y1="0"
          y2="0"
        >
          <stop offset="0%" stop-color="#F00" />
          <stop offset="100%" stop-color="#000" />
        </linearGradient>
      </defs>

      <rect
        x="0"
        y="0"
        width="${width}"
        height="${height}"
        fill="#808080"
      />

      <g filter="blur(2px)">
        <rect
          x="0"
          y="0"
          width="${width}"
          height="${height}"
          fill="#000080"
        />

        <rect
          x="0"
          y="0"
          width="${width}"
          height="${height}"
          fill="url(#Y)"
          class="mix"
        />

        <rect
          x="0"
          y="0"
          width="${width}"
          height="${height}"
          fill="url(#X)"
          class="mix"
        />

        <rect
          x="${depth}"
          y="${depth}"
          width="${Math.max(1, width - 2 * depth)}"
          height="${Math.max(1, height - 2 * depth)}"
          fill="#808080"
          rx="${radius}"
          ry="${radius}"
          filter="blur(${depth}px)"
        />
      </g>
    </svg>
  `

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export function getDisplacementFilter({
  width,
  height,
  radius,
  depth,
  strength = 100,
  chromaticAberration = 0,
}: DisplacementFilterOptions): string {
  const displacementMapUrl =
    getDisplacementMap({
      width,
      height,
      radius,
      depth,
    })

  const svg = `
    <svg
      width="${width}"
      height="${height}"
      viewBox="0 0 ${width} ${height}"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter
          id="displace"
          color-interpolation-filters="sRGB"
        >
          <feImage
            x="0"
            y="0"
            width="${width}"
            height="${height}"
            href="${displacementMapUrl}"
            result="displacementMap"
          />

          <!-- RED -->
          <feDisplacementMap
            in="SourceGraphic"
            in2="displacementMap"
            scale="${strength + chromaticAberration * 2}"
            xChannelSelector="R"
            yChannelSelector="G"
          />

          <feColorMatrix
            type="matrix"
            values="
              1 0 0 0 0
              0 0 0 0 0
              0 0 0 0 0
              0 0 0 1 0
            "
            result="displacedR"
          />

          <!-- GREEN -->
          <feDisplacementMap
            in="SourceGraphic"
            in2="displacementMap"
            scale="${strength + chromaticAberration}"
            xChannelSelector="R"
            yChannelSelector="G"
          />

          <feColorMatrix
            type="matrix"
            values="
              0 0 0 0 0
              0 1 0 0 0
              0 0 0 0 0
              0 0 0 1 0
            "
            result="displacedG"
          />

          <!-- BLUE -->
          <feDisplacementMap
            in="SourceGraphic"
            in2="displacementMap"
            scale="${strength}"
            xChannelSelector="R"
            yChannelSelector="G"
          />

          <feColorMatrix
            type="matrix"
            values="
              0 0 0 0 0
              0 0 0 0 0
              0 0 1 0 0
              0 0 0 1 0
            "
            result="displacedB"
          />

          <feBlend
            in="displacedR"
            in2="displacedG"
            mode="screen"
            result="rg"
          />

          <feBlend
            in="rg"
            in2="displacedB"
            mode="screen"
          />
        </filter>
      </defs>
    </svg>
  `

  return `data:image/svg+xml;utf8,${encodeURIComponent(
    svg
  )}#displace`
}