import { createAutoRegisterComponent, CATEGORIES } from '../../auto-register'
import { useState, useRef, useEffect } from "react"

function SVGLineVisualizer() {
    const [x1, setX1] = useState(50)
    const [y1, setY1] = useState(80)
    const [x2, setX2] = useState(200)
    const [y2, setY2] = useState(200)

    const audioContextRef = useRef<AudioContext | null>(null)

    useEffect(() => {
        // Initialize Web Audio API
        if (typeof window !== "undefined" && !audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        }
    }, [])

    const playSound = (value: number) => {
        if (!audioContextRef.current) return

        const audioContext = audioContextRef.current
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        // Map slider value (0-280) to frequency (200-800 Hz)
        const frequency = 200 + (value / 280) * 600
        oscillator.frequency.value = frequency
        oscillator.type = "sine"

        // Short beep
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.05)
    }

    const handleSliderChange = (setter: (value: number) => void, value: number) => {
        setter(value)
        playSound(value)
    }

    const svgCode = `<svg width="280" height="280">
  <line
    x1="${x1}"
    y1="${y1}"
    x2="${x2}"
    y2="${y2}"
    stroke="oklch(0.9 0.3 164)"
    strokeWidth="5"
  />
</svg>`

    return (
        <div className=" bg-black text-white p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Grid and Code Display */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* SVG Grid Visualization */}
                    <div className="border-2 border-white/20 rounded-lg p-6 bg-black relative">
                        <svg width="100%" height="100%" viewBox="0 0 560 560" className="w-full">
                            {/* Grid pattern */}
                            <defs>
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                                </pattern>
                            </defs>
                            <rect width="560" height="560" fill="url(#grid)" />

                            {/* Guide lines */}
                            <line
                                x1={x1 * 2}
                                y1="0"
                                x2={x1 * 2}
                                y2="560"
                                stroke="white"
                                strokeWidth="2"
                                strokeDasharray="8,8"
                                opacity="0.5"
                            />
                            <line
                                x1="0"
                                y1={y1 * 2}
                                x2="560"
                                y2={y1 * 2}
                                stroke="white"
                                strokeWidth="2"
                                strokeDasharray="8,8"
                                opacity="0.5"
                            />
                            <line
                                x1={x2 * 2}
                                y1="0"
                                x2={x2 * 2}
                                y2="560"
                                stroke="white"
                                strokeWidth="2"
                                strokeDasharray="8,8"
                                opacity="0.5"
                            />
                            <line
                                x1="0"
                                y1={y2 * 2}
                                x2="560"
                                y2={y2 * 2}
                                stroke="white"
                                strokeWidth="2"
                                strokeDasharray="8,8"
                                opacity="0.5"
                            />

                            {/* The main line */}
                            <line x1={x1 * 2} y1={y1 * 2} x2={x2 * 2} y2={y2 * 2} stroke="oklch(0.9 0.3 164)" strokeWidth="10" />

                            {/* Point markers */}
                            <circle cx={x1 * 2} cy={y1 * 2} r="8" fill="white" />
                            <circle cx={x2 * 2} cy={y2 * 2} r="8" fill="white" />

                            {/* Labels */}
                            <text x={x1 * 2 - 30} y={y1 * 2 - 20} fill="#fbbf24" fontSize="32" fontWeight="bold">
                                x1
                            </text>
                            <text x={x1 * 2 + 20} y={y1 * 2 - 40} fill="white" fontSize="32">
                                y1
                            </text>
                            <text x={x2 * 2 - 30} y={y2 * 2 + 50} fill="white" fontSize="32">
                                x2
                            </text>
                            <text x={x2 * 2 + 20} y={y2 * 2 - 20} fill="white" fontSize="32">
                                y2
                            </text>
                        </svg>
                    </div>

                    {/* Code Display */}
                    <div className="border-2 border-white/20 rounded-lg p-8 bg-[#1a1a1a] font-mono">
                        <pre className="text-lg leading-relaxed">
                            <span className="text-[#ec4899]">{`<svg`}</span>
                            <span className="text-[#ec4899]">{` width=`}</span>
                            <span className="text-[#fbbf24]">{`"280"`}</span>
                            <span className="text-[#ec4899]">{` height=`}</span>
                            <span className="text-[#fbbf24]">{`"280"`}</span>
                            <span className="text-[#ec4899]">{`>`}</span>
                            {"\n  "}
                            <span className="text-[#ec4899]">{`<line`}</span>
                            {"\n    "}
                            <span className="text-[#ec4899]">x1=</span>
                            <span className="text-[#fbbf24]">{`"${x1}"`}</span>
                            {"\n    "}
                            <span className="text-[#ec4899]">y1=</span>
                            <span className="text-[#fbbf24]">{`"${y1}"`}</span>
                            {"\n    "}
                            <span className="text-[#ec4899]">x2=</span>
                            <span className="text-[#fbbf24]">{`"${x2}"`}</span>
                            {"\n    "}
                            <span className="text-[#ec4899]">y2=</span>
                            <span className="text-[#fbbf24]">{`"${y2}"`}</span>
                            {"\n    "}
                            <span className="text-[#ec4899]">stroke=</span>
                            <span className="text-[#fbbf24]">{`"oklch(0.9 0.3 164)"`}</span>
                            {"\n    "}
                            <span className="text-[#ec4899]">strokeWidth=</span>
                            <span className="text-[#fbbf24]">{`"5"`}</span>
                            {"\n  "}
                            <span className="text-[#ec4899]">{`/>`}</span>
                            {"\n"}
                            <span className="text-[#ec4899]">{`</svg>`}</span>
                        </pre>
                    </div>
                </div>

                {/* Sliders */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* x1 Slider */}
                    <div className="space-y-4">
                        <div className="flex items-baseline gap-4">
                            <label className="text-[#fbbf24] font-bold text-2xl">x1:</label>
                            <span className="text-white text-2xl">{x1}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="280"
                            value={x1}
                            onChange={(e) => handleSliderChange(setX1, Number(e.target.value))}
                            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-x1"
                        />
                    </div>

                    {/* y1 Slider */}
                    <div className="space-y-4">
                        <div className="flex items-baseline gap-4">
                            <label className="text-[#fbbf24] font-bold text-2xl">y1:</label>
                            <span className="text-white text-2xl">{y1}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="280"
                            value={y1}
                            onChange={(e) => handleSliderChange(setY1, Number(e.target.value))}
                            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-y1"
                        />
                    </div>

                    {/* x2 Slider */}
                    <div className="space-y-4">
                        <div className="flex items-baseline gap-4">
                            <label className="text-[#fbbf24] font-bold text-2xl">x2:</label>
                            <span className="text-white text-2xl">{x2}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="280"
                            value={x2}
                            onChange={(e) => handleSliderChange(setX2, Number(e.target.value))}
                            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-x2"
                        />
                    </div>

                    {/* y2 Slider */}
                    <div className="space-y-4">
                        <div className="flex items-baseline gap-4">
                            <label className="text-[#fbbf24] font-bold text-2xl">y2:</label>
                            <span className="text-white text-2xl">{y2}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="280"
                            value={y2}
                            onChange={(e) => handleSliderChange(setY2, Number(e.target.value))}
                            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-y2"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export const SVGLineVisualizerV0 = createAutoRegisterComponent({
    id: 'SVGLineVisualizer',
    name: 'SVGLineVisualizer',
    description: 'Component description',
    category: CATEGORIES.UI,
    template: `:::react{component="SVGLineVisualizer"}\nContent\n:::`,
})(SVGLineVisualizer)