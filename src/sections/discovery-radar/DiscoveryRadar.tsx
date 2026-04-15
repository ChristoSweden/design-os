import { useState } from 'react'

interface NearbyMember {
  id: string
  displayName: string
  headline: string
  intent: string
  distanceMeters: number
  matchedDimension: 'interest' | 'intent' | 'event' | 'proximity'
  matchScore: number
}

const SAMPLE_MEMBERS: NearbyMember[] = [
  {
    id: 'u_arien',
    displayName: 'Arien Vasquez',
    headline: 'Embedded ML for forestry · Stockholm',
    intent: 'Looking for data engineers comfortable with edge inference + raster pipelines.',
    distanceMeters: 38,
    matchedDimension: 'intent',
    matchScore: 92,
  },
  {
    id: 'u_priya',
    displayName: 'Priya Natarajan',
    headline: 'Designer at a bird-ID startup',
    intent: 'Accessible mobile UX in low-bandwidth environments.',
    distanceMeters: 71,
    matchedDimension: 'interest',
    matchScore: 88,
  },
  {
    id: 'u_idris',
    displayName: 'Idris Karimov',
    headline: 'Founder · last-mile delivery',
    intent: 'Geospatial routing + driver UX.',
    distanceMeters: 154,
    matchedDimension: 'interest',
    matchScore: 81,
  },
  {
    id: 'u_mei',
    displayName: 'Mei Rodriguez',
    headline: 'Solo dev, fintech infra',
    intent: "Here for the stream-processing workshop — say hi.",
    distanceMeters: 220,
    matchedDimension: 'event',
    matchScore: 76,
  },
  {
    id: 'u_jonas',
    displayName: 'Jonas Lindqvist',
    headline: 'Researcher · forest biodiversity',
    intent: 'Citizen-science + sensor networks.',
    distanceMeters: 412,
    matchedDimension: 'interest',
    matchScore: 71,
  },
  {
    id: 'u_sara',
    displayName: 'Sara Achebe',
    headline: 'Recruiter, climate-tech',
    intent: 'Hiring senior backend engineers for marine monitoring.',
    distanceMeters: 690,
    matchedDimension: 'intent',
    matchScore: 64,
  },
  {
    id: 'u_li',
    displayName: 'Li Hennessy',
    headline: 'PhD student, urban acoustics',
    intent: 'Real-time DSP on phones.',
    distanceMeters: 880,
    matchedDimension: 'interest',
    matchScore: 58,
  },
  {
    id: 'u_ravi',
    displayName: 'Ravi Marsh',
    headline: 'Conf speaker, ML fairness',
    intent: 'Speaking at the workshop tomorrow.',
    distanceMeters: 1100,
    matchedDimension: 'event',
    matchScore: 53,
  },
]

const RINGS = [
  { meters: 50, label: '50m' },
  { meters: 250, label: '250m' },
  { meters: 1000, label: '1km' },
  { meters: 2000, label: '2km' },
]

function ringRadiusForDistance(meters: number, maxMeters: number): number {
  // Logarithmic so close-range members don't pile up at the centre.
  const t = Math.log10(1 + meters) / Math.log10(1 + maxMeters)
  return Math.min(0.92, Math.max(0.08, t))
}

function colorForScore(score: number): string {
  if (score >= 85) return '#f59e0b' // amber-500
  if (score >= 70) return '#fb923c' // orange-400
  if (score >= 55) return '#14b8a6' // teal-500
  return '#a8a29e' // stone-400
}

function angleForId(id: string, index: number): number {
  // Stable pseudo-angle so two re-renders place the same dot in the same place.
  let h = 0
  for (let i = 0; i < id.length; i += 1) {
    h = (h * 31 + id.charCodeAt(i)) | 0
  }
  return ((Math.abs(h) + index * 137) % 360) * (Math.PI / 180)
}

export default function DiscoveryRadar() {
  const [maxMeters, setMaxMeters] = useState<number>(2000)
  const [selected, setSelected] = useState<NearbyMember | null>(null)
  const [incognito, setIncognito] = useState(false)

  const visible = SAMPLE_MEMBERS.filter((m) => m.distanceMeters <= maxMeters)

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans">
      {/* Top app bar */}
      <header className="px-5 pt-6 pb-3 flex items-center justify-between border-b border-stone-800/60 backdrop-blur sticky top-0 z-10 bg-stone-950/85">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-amber-400/80">
            Gravity
          </p>
          <h1 className="text-xl font-serif text-stone-50 mt-0.5">Discovery</h1>
        </div>
        <button
          type="button"
          onClick={() => setIncognito((v) => !v)}
          className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
            incognito
              ? 'bg-amber-500 text-stone-950 border-amber-500'
              : 'bg-transparent text-stone-300 border-stone-700 hover:border-stone-500'
          }`}
        >
          {incognito ? 'Incognito on' : 'Go incognito'}
        </button>
      </header>

      {/* Radar */}
      <main className="px-5 pt-8 pb-32">
        <div className="relative aspect-square w-full max-w-md mx-auto">
          {/* Concentric rings */}
          {RINGS.map((ring) => {
            const t = ringRadiusForDistance(ring.meters, 2000)
            return (
              <div
                key={ring.meters}
                className="absolute rounded-full border border-stone-800"
                style={{
                  left: `${50 - t * 50}%`,
                  top: `${50 - t * 50}%`,
                  width: `${t * 100}%`,
                  height: `${t * 100}%`,
                  borderColor:
                    ring.meters <= maxMeters
                      ? 'rgba(251, 191, 36, 0.18)'
                      : 'rgba(120, 113, 108, 0.15)',
                }}
              >
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-stone-500 bg-stone-950 px-1">
                  {ring.label}
                </span>
              </div>
            )
          })}

          {/* Centre puck (you) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-serif text-base ${
                incognito
                  ? 'bg-stone-900 text-stone-500 border-stone-700'
                  : 'bg-amber-500 text-stone-950 border-amber-300 shadow-[0_0_24px_rgba(251,191,36,0.55)]'
              }`}
              aria-label="You (centre of radar)"
            >
              You
            </div>
          </div>

          {/* Member dots */}
          {visible.map((m, i) => {
            const t = ringRadiusForDistance(m.distanceMeters, 2000)
            const angle = angleForId(m.id, i)
            const x = 50 + Math.cos(angle) * t * 50
            const y = 50 + Math.sin(angle) * t * 50
            const isSelected = selected?.id === m.id
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelected(isSelected ? null : m)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group ${
                  isSelected ? 'z-20' : 'z-10'
                }`}
                style={{ left: `${x}%`, top: `${y}%` }}
                aria-label={`${m.displayName}, ${m.distanceMeters}m away, match ${m.matchScore}`}
              >
                <span
                  className={`block rounded-full transition-transform ${
                    isSelected ? 'scale-150' : 'group-hover:scale-125'
                  }`}
                  style={{
                    width: 14,
                    height: 14,
                    backgroundColor: colorForScore(m.matchScore),
                    boxShadow: `0 0 0 ${isSelected ? 4 : 2}px ${colorForScore(m.matchScore)}33`,
                    opacity: incognito ? 0.35 : 1,
                  }}
                />
              </button>
            )
          })}
        </div>

        {/* Radius slider */}
        <div className="mt-10 max-w-md mx-auto">
          <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
            <span>Radius</span>
            <span>{maxMeters >= 1000 ? `${(maxMeters / 1000).toFixed(1)}km` : `${maxMeters}m`}</span>
          </div>
          <input
            type="range"
            min={50}
            max={2000}
            step={50}
            value={maxMeters}
            onChange={(e) => setMaxMeters(Number(e.currentTarget.value))}
            className="w-full mt-2 accent-amber-500"
            aria-label="Search radius"
          />
          <p className="mt-2 text-xs text-stone-500">
            {visible.length} {visible.length === 1 ? 'person' : 'people'} on Gravity within range
          </p>
        </div>

        {/* Sample members list (mirrors the radar) */}
        <ul className="mt-8 max-w-md mx-auto divide-y divide-stone-800/70 border border-stone-800/70 rounded-2xl overflow-hidden">
          {visible.slice(0, 6).map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => setSelected(m)}
                className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                  selected?.id === m.id ? 'bg-stone-900' : 'hover:bg-stone-900/60'
                }`}
              >
                <span
                  className="mt-1 w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: colorForScore(m.matchScore) }}
                />
                <span className="flex-1 min-w-0">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="font-medium text-stone-100 truncate">
                      {m.displayName}
                    </span>
                    <span className="text-[11px] font-mono text-stone-500 shrink-0">
                      {m.distanceMeters < 1000 ? `${m.distanceMeters}m` : `${(m.distanceMeters / 1000).toFixed(1)}km`}
                    </span>
                  </span>
                  <span className="block text-xs text-stone-400 truncate">
                    {m.headline}
                  </span>
                  <span className="inline-block mt-1.5 text-[10px] uppercase tracking-wider text-amber-400/80">
                    {m.matchedDimension} · {m.matchScore}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </main>

      {/* Selected intro pane */}
      {selected && (
        <div className="fixed inset-x-0 bottom-16 z-30 px-4">
          <div className="max-w-md mx-auto bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.18em] text-amber-400/80">
                  {selected.matchedDimension} match · {selected.matchScore}
                </p>
                <h2 className="text-lg font-serif text-stone-50 mt-0.5 truncate">
                  {selected.displayName}
                </h2>
                <p className="text-xs text-stone-400 truncate">{selected.headline}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-stone-500 hover:text-stone-200 text-xl leading-none px-2"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <p className="mt-3 text-sm text-stone-300 leading-relaxed">
              {selected.intent}
            </p>
            <button
              type="button"
              className="mt-4 w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-medium text-sm rounded-xl py-2.5 transition-colors"
            >
              Send intro about {selected.matchedDimension}
            </button>
          </div>
        </div>
      )}

      {/* Bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-stone-800 bg-stone-950/95 backdrop-blur">
        <ul className="max-w-md mx-auto grid grid-cols-4 text-[11px] text-stone-500">
          {[
            { label: 'Discovery', active: true },
            { label: 'Connections' },
            { label: 'Messages' },
            { label: 'Profile' },
          ].map((t) => (
            <li key={t.label}>
              <button
                type="button"
                className={`w-full py-3 flex flex-col items-center gap-1 ${
                  t.active ? 'text-amber-400' : 'text-stone-500 hover:text-stone-300'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    t.active ? 'bg-amber-400' : 'bg-stone-700'
                  }`}
                />
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
