'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'
import {
  Download,
  Flame,
  Globe,
  Loader2,
  Palette,
  RefreshCw,
  Sparkles,
  Type,
} from 'lucide-react'
import { saveLogoAction } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Preset = {
  id: string
  name: string
  topColor: string
  midColor: string
  bottomColor: string
  sideColor: string
  outlineColor: string
  glowColor: string
  subColor: string
}

const PRESETS: Preset[] = [
  {
    id: 'reverie',
    name: 'Amethyst (Reverie)',
    topColor: '#ffffff',
    midColor: '#c084fc',
    bottomColor: '#7e22ce',
    sideColor: '#3b0764',
    outlineColor: '#120524',
    glowColor: '#a855f7',
    subColor: '#e9d5ff',
  },
  {
    id: 'gold',
    name: 'Imperial Gold',
    topColor: '#fffbeb',
    midColor: '#fbbf24',
    bottomColor: '#b45309',
    sideColor: '#451a03',
    outlineColor: '#1c0a00',
    glowColor: '#f59e0b',
    subColor: '#fef3c7',
  },
  {
    id: 'diamond',
    name: 'Diamond Ice',
    topColor: '#f0fdfa',
    midColor: '#38bdf8',
    bottomColor: '#0369a1',
    sideColor: '#082f49',
    outlineColor: '#02131e',
    glowColor: '#0284c7',
    subColor: '#bae6fd',
  },
  {
    id: 'crimson',
    name: 'Nether Crimson',
    topColor: '#fff1f2',
    midColor: '#f87171',
    bottomColor: '#b91c1c',
    sideColor: '#450a0a',
    outlineColor: '#1c0202',
    glowColor: '#ef4444',
    subColor: '#fecaca',
  },
  {
    id: 'emerald',
    name: 'Emerald Forest',
    topColor: '#f0fdf4',
    midColor: '#34d399',
    bottomColor: '#047857',
    sideColor: '#022c22',
    outlineColor: '#01140f',
    glowColor: '#10b981',
    subColor: '#a7f3d0',
  },
  {
    id: 'midnight',
    name: 'Midnight Neon',
    topColor: '#ffffff',
    midColor: '#818cf8',
    bottomColor: '#4338ca',
    sideColor: '#1e1b4b',
    outlineColor: '#09081f',
    glowColor: '#6366f1',
    subColor: '#c7d2fe',
  },
]

export function LogoMaker() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPending, startTransition] = useTransition()

  // Text inputs
  const [primaryText, setPrimaryText] = useState('REVERIE')
  const [subText, setSubText] = useState('SMP')
  const [showSub, setShowSub] = useState(true)

  // Styling inputs
  const [selectedPreset, setSelectedPreset] = useState('reverie')
  const [fontFamily, setFontFamily] = useState('Impact')
  const [fontSize, setFontSize] = useState(130)
  const [depth, setDepth] = useState(20)
  const [depthAngle, setDepthAngle] = useState(65) // degrees
  const [outlineWidth, setOutlineWidth] = useState(12)
  const [glowSize, setGlowSize] = useState(30)
  const [darkBackground, setDarkBackground] = useState(true)

  // Colors
  const [topColor, setTopColor] = useState('#ffffff')
  const [midColor, setMidColor] = useState('#c084fc')
  const [bottomColor, setBottomColor] = useState('#7e22ce')
  const [sideColor, setSideColor] = useState('#3b0764')
  const [outlineColor, setOutlineColor] = useState('#120524')
  const [glowColor, setGlowColor] = useState('#a855f7')
  const [subColor, setSubColor] = useState('#e9d5ff')

  // Apply preset
  const applyPreset = (preset: Preset) => {
    setSelectedPreset(preset.id)
    setTopColor(preset.topColor)
    setMidColor(preset.midColor)
    setBottomColor(preset.bottomColor)
    setSideColor(preset.sideColor)
    setOutlineColor(preset.outlineColor)
    setGlowColor(preset.glowColor)
    setSubColor(preset.subColor)
  }

  // Draw 3D Text on Canvas
  const renderLogo = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear transparent
    ctx.clearRect(0, 0, width, height)

    // Center coordinates
    const centerX = width / 2
    const centerY = showSub && subText.trim() ? height / 2 - 30 : height / 2

    const title = primaryText.trim().toUpperCase()
    if (!title) return

    ctx.save()
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const rad = (depthAngle * Math.PI) / 180
    const stepX = Math.cos(rad)
    const stepY = Math.sin(rad)

    // 1. Draw Glow behind the text
    if (glowSize > 0) {
      ctx.save()
      ctx.font = `900 ${fontSize}px ${fontFamily}, "Arial Black", sans-serif`
      ctx.shadowColor = glowColor
      ctx.shadowBlur = glowSize
      ctx.fillStyle = glowColor
      ctx.fillText(title, centerX, centerY)
      ctx.restore()
    }

    // 2. Draw 3D Extrusion Side Layers (from back to front)
    ctx.font = `900 ${fontSize}px ${fontFamily}, "Arial Black", sans-serif`
    ctx.lineJoin = 'miter'
    ctx.miterLimit = 2

    for (let i = depth; i >= 1; i--) {
      const ox = stepX * i
      const oy = stepY * i
      const ratio = i / depth

      // Side stroke for solid extrusion volume
      ctx.lineWidth = outlineWidth
      ctx.strokeStyle = outlineColor
      ctx.strokeText(title, centerX + ox, centerY + oy)

      // Gradient shading on side layers: darker as it gets farther from front face
      ctx.fillStyle = sideColor
      ctx.fillText(title, centerX + ox, centerY + oy)

      // Add a dark shade layer on deep parts
      if (ratio > 0.4) {
        ctx.fillStyle = `rgba(0, 0, 0, ${ratio * 0.45})`
        ctx.fillText(title, centerX + ox, centerY + oy)
      }
    }

    // 3. Front Face Outline
    ctx.lineWidth = outlineWidth
    ctx.strokeStyle = outlineColor
    ctx.strokeText(title, centerX, centerY)

    // 4. Front Face Gradient
    const gradient = ctx.createLinearGradient(0, centerY - fontSize * 0.55, 0, centerY + fontSize * 0.45)
    gradient.addColorStop(0, topColor)
    gradient.addColorStop(0.35, midColor)
    gradient.addColorStop(0.85, bottomColor)
    gradient.addColorStop(1, sideColor)

    ctx.fillStyle = gradient
    ctx.fillText(title, centerX, centerY)

    // 5. Specular Inner Highlight / Bevel shine
    ctx.lineWidth = Math.max(1.5, outlineWidth * 0.2)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)'
    ctx.strokeText(title, centerX, centerY)

    // 6. Subtitle (e.g. "SMP")
    if (showSub && subText.trim()) {
      const sub = subText.trim().toUpperCase()
      const subY = centerY + fontSize * 0.58 + 24
      const subSize = Math.max(24, Math.round(fontSize * 0.32))

      ctx.font = `900 ${subSize}px ${fontFamily}, "Arial Black", sans-serif`

      // 3D side for subtitle
      const subDepth = Math.max(4, Math.round(depth * 0.45))
      for (let s = subDepth; s >= 1; s--) {
        const sox = stepX * s
        const soy = stepY * s
        ctx.lineWidth = Math.max(4, outlineWidth * 0.5)
        ctx.strokeStyle = outlineColor
        ctx.strokeText(sub, centerX + sox, subY + soy)

        ctx.fillStyle = sideColor
        ctx.fillText(sub, centerX + sox, subY + soy)
      }

      // Subtitle Front Outline
      ctx.lineWidth = Math.max(4, outlineWidth * 0.5)
      ctx.strokeStyle = outlineColor
      ctx.strokeText(sub, centerX, subY)

      // Subtitle Front Gradient
      const subGrad = ctx.createLinearGradient(0, subY - subSize * 0.5, 0, subY + subSize * 0.5)
      subGrad.addColorStop(0, '#ffffff')
      subGrad.addColorStop(0.4, subColor)
      subGrad.addColorStop(1, bottomColor)

      ctx.fillStyle = subGrad
      ctx.fillText(sub, centerX, subY)

      // Subtitle inner shine
      ctx.lineWidth = 1.2
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.strokeText(sub, centerX, subY)
    }

    ctx.restore()
  }, [
    primaryText,
    subText,
    showSub,
    fontFamily,
    fontSize,
    depth,
    depthAngle,
    outlineWidth,
    glowSize,
    topColor,
    midColor,
    bottomColor,
    sideColor,
    outlineColor,
    glowColor,
    subColor,
  ])

  useEffect(() => {
    renderLogo()
  }, [renderLogo])

  // Download high-resolution PNG
  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `${primaryText.toLowerCase().replace(/\s+/g, '-')}-logo.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    toast.success('Downloaded transparent 3D logo PNG!')
  }

  // Save directly as website logo (/images/reverie-logo.png)
  const handleSaveAsSiteLogo = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const base64 = canvas.toDataURL('image/png')

    startTransition(async () => {
      const res = await saveLogoAction(base64)
      if (res?.ok) {
        toast.success(res.message)
      } else {
        toast.error(res?.message ?? 'Failed to update website logo.')
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Sparkles className="size-5 text-primary" /> 3D Text &amp; Logo Maker
          </h2>
          <p className="text-xs text-muted-foreground">
            Generate high-res 3D Minecraft server title logos. Download as transparent PNG or apply directly as your site logo.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-xs font-semibold"
          >
            <Download className="size-4" /> Download .PNG
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isPending}
            onClick={handleSaveAsSiteLogo}
            className="flex items-center gap-1.5 bg-brand text-xs font-semibold text-primary-foreground shadow-md hover:opacity-95"
          >
            {isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Globe className="size-3.5" /> Set as Website Logo
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Live Preview Canvas Container */}
      <div className="relative overflow-hidden rounded-xl border border-border shadow-lg">
        <div className="flex items-center justify-between border-b border-border bg-card/90 px-4 py-2.5 backdrop-blur text-xs">
          <span className="font-semibold text-foreground flex items-center gap-2">
            <Flame className="size-3.5 text-orange-400" /> Live Canvas (1322 &times; 493)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDarkBackground((v) => !v)}
              className="rounded border border-border/80 px-2 py-1 text-[11px] text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              {darkBackground ? 'Toggle Checkerboard' : 'Toggle Dark Preview'}
            </button>
            <button
              type="button"
              onClick={() => {
                applyPreset(PRESETS[0])
                setPrimaryText('REVERIE')
                setSubText('SMP')
                setFontSize(130)
                setDepth(20)
              }}
              className="rounded border border-border/80 px-2 py-1 text-[11px] text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center gap-1"
            >
              <RefreshCw className="size-3" /> Reset
            </button>
          </div>
        </div>

        <div
          className={`flex min-h-[280px] w-full items-center justify-center p-6 ${
            darkBackground
              ? 'bg-[#0b0910]'
              : 'bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] bg-zinc-950'
          }`}
        >
          <canvas
            ref={canvasRef}
            width={1322}
            height={493}
            className="h-auto max-h-[260px] w-full max-w-[700px] object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Preset Theme Picker */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
          <Palette className="size-3.5" /> Color &amp; Style Presets
        </Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {PRESETS.map((p) => {
            const isSelected = selectedPreset === p.id
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p)}
                className={`flex flex-col items-center gap-1.5 rounded-lg border p-2.5 text-center transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary'
                    : 'border-border bg-card hover:border-primary/40'
                }`}
              >
                <div
                  className="size-5 rounded-full border border-white/20 shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${p.topColor}, ${p.midColor} 50%, ${p.bottomColor})`,
                  }}
                />
                <span className="text-xs font-medium text-foreground">{p.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Custom Control Panels */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left: Text & Typography */}
        <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-2.5">
            <Type className="size-4 text-primary" /> Text &amp; Dimensions
          </h3>

          <div className="space-y-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="logo-primary" className="text-xs">
                Main Title Text
              </Label>
              <Input
                id="logo-primary"
                value={primaryText}
                onChange={(e) => setPrimaryText(e.target.value)}
                placeholder="REVERIE"
                className="font-bold tracking-wide"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <Label htmlFor="logo-sub" className="text-xs">
                Subtitle Text (Optional)
              </Label>
              <button
                type="button"
                onClick={() => setShowSub((v) => !v)}
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                {showSub ? 'Disable Subtitle' : 'Enable Subtitle'}
              </button>
            </div>

            {showSub && (
              <Input
                id="logo-sub"
                value={subText}
                onChange={(e) => setSubText(e.target.value)}
                placeholder="SMP"
                className="font-bold tracking-wide"
              />
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="logo-font" className="text-xs">
                  Font Family
                </Label>
                <select
                  id="logo-font"
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="Impact">Impact (Classic Bold)</option>
                  <option value="Arial Black">Arial Black (Wide)</option>
                  <option value="Trebuchet MS">Trebuchet MS</option>
                  <option value="system-ui">System UI (Modern)</option>
                  <option value="Courier New">Monospace (Blocky)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="logo-size" className="text-xs">
                    Font Size
                  </Label>
                  <span className="text-[11px] text-muted-foreground">{fontSize}px</span>
                </div>
                <input
                  id="logo-size"
                  type="range"
                  min="60"
                  max="180"
                  step="2"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: 3D Depth, Extrusion & Colors */}
        <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-2.5">
            <Sparkles className="size-4 text-primary" /> 3D Extrusion &amp; Shading
          </h3>

          <div className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="logo-depth" className="text-xs">
                    3D Depth
                  </Label>
                  <span className="text-[11px] text-muted-foreground">{depth}px</span>
                </div>
                <input
                  id="logo-depth"
                  type="range"
                  min="2"
                  max="40"
                  value={depth}
                  onChange={(e) => setDepth(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer accent-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="logo-angle" className="text-xs">
                    Extrusion Angle
                  </Label>
                  <span className="text-[11px] text-muted-foreground">{depthAngle}&deg;</span>
                </div>
                <input
                  id="logo-angle"
                  type="range"
                  min="0"
                  max="180"
                  value={depthAngle}
                  onChange={(e) => setDepthAngle(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer accent-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="logo-outline" className="text-xs">
                    Black Outline
                  </Label>
                  <span className="text-[11px] text-muted-foreground">{outlineWidth}px</span>
                </div>
                <input
                  id="logo-outline"
                  type="range"
                  min="0"
                  max="24"
                  value={outlineWidth}
                  onChange={(e) => setOutlineWidth(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer accent-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="logo-glow" className="text-xs">
                    Ambient Glow
                  </Label>
                  <span className="text-[11px] text-muted-foreground">{glowSize}px</span>
                </div>
                <input
                  id="logo-glow"
                  type="range"
                  min="0"
                  max="60"
                  value={glowSize}
                  onChange={(e) => setGlowSize(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer accent-primary"
                />
              </div>
            </div>

            {/* Custom Color Pickers */}
            <div className="border-t border-border pt-3">
              <Label className="text-[11px] font-semibold text-muted-foreground mb-2 block">
                Custom Color Adjustments
              </Label>
              <div className="grid grid-cols-4 gap-2 text-[10px]">
                <label className="flex flex-col items-center gap-1 cursor-pointer">
                  <span>Face Top</span>
                  <input
                    type="color"
                    value={topColor}
                    onChange={(e) => setTopColor(e.target.value)}
                    className="size-7 rounded cursor-pointer border border-border bg-transparent p-0"
                  />
                </label>
                <label className="flex flex-col items-center gap-1 cursor-pointer">
                  <span>Face Mid</span>
                  <input
                    type="color"
                    value={midColor}
                    onChange={(e) => setMidColor(e.target.value)}
                    className="size-7 rounded cursor-pointer border border-border bg-transparent p-0"
                  />
                </label>
                <label className="flex flex-col items-center gap-1 cursor-pointer">
                  <span>Face Base</span>
                  <input
                    type="color"
                    value={bottomColor}
                    onChange={(e) => setBottomColor(e.target.value)}
                    className="size-7 rounded cursor-pointer border border-border bg-transparent p-0"
                  />
                </label>
                <label className="flex flex-col items-center gap-1 cursor-pointer">
                  <span>3D Sides</span>
                  <input
                    type="color"
                    value={sideColor}
                    onChange={(e) => setSideColor(e.target.value)}
                    className="size-7 rounded cursor-pointer border border-border bg-transparent p-0"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
