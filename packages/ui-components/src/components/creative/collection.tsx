import React, { useState } from 'react'
import { createAutoRegisterComponent, CATEGORIES } from '../../auto-register'

// Import demo components
import ParticleSystem from './particle-system'
import FlowField from './flow-field'
import FractalTree from './fractal-tree'
import WaveAnimation from './wave-animation'
import GeometricPattern from './geometric-pattern'
import RadialOrbitalTimelineDemo from './radial-orbital-timeline-demo'

interface Demo {
    id: string
    title: string
    description: string
    component: React.ComponentType
    thumbnail?: string
}

const demos: Demo[] = [
    {
        id: 'particle-system',
        title: 'Particle System',
        description: 'Interactive particle physics simulation with mouse interaction',
        component: ParticleSystem
    },
    {
        id: 'flow-field',
        title: 'Flow Field',
        description: 'Perlin noise-based flow field visualization',
        component: FlowField
    },
    {
        id: 'fractal-tree',
        title: 'Fractal Tree',
        description: 'Recursive fractal tree generation with animated growth',
        component: FractalTree
    },
    {
        id: 'wave-animation',
        title: 'Wave Animation',
        description: 'Sine wave patterns with color interpolation',
        component: WaveAnimation
    },
    {
        id: 'geometric-pattern',
        title: 'Geometric Pattern',
        description: 'Dynamic geometric patterns with morphing shapes',
        component: GeometricPattern
    },
    {
        id: 'radial-orbital-timeline',
        title: 'Orbital Timeline',
        description: 'Interactive orbital timeline with connected nodes and animations',
        component: RadialOrbitalTimelineDemo
    }
]

interface CreativeCollectionProps {
    children?: React.ReactNode
}

function CreativeCollection({ children }: CreativeCollectionProps) {
    const [selectedDemo, setSelectedDemo] = useState<Demo | null>(null)

    const openFullscreen = (demo: Demo) => {
        setSelectedDemo(demo)
    }

    const closeFullscreen = () => {
        setSelectedDemo(null)
    }

    return (
        <div className="w-full">
            {/* Demo Grid */}
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-2">Creative Programming Demos</h1>
                <p className="text-gray-600 mb-6">Explore interactive creative coding experiments</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {demos.map((demo) => (
                        <div
                            key={demo.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-200 border border-gray-200"
                            onClick={() => openFullscreen(demo)}
                        >
                            <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                                <div className="text-white text-lg font-semibold">
                                    Preview
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-xl font-semibold mb-2">{demo.title}</h3>
                                <p className="text-gray-600 text-sm">{demo.description}</p>
                                <button
                                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        openFullscreen(demo)
                                    }}
                                >
                                    View Demo
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fullscreen Modal */}
            {selectedDemo && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 bg-gray-900 text-white">
                        <div>
                            <h2 className="text-xl font-semibold">{selectedDemo.title}</h2>
                            <p className="text-sm text-gray-300">{selectedDemo.description}</p>
                        </div>
                        <button
                            onClick={closeFullscreen}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                        >
                            ✕ Close
                        </button>
                    </div>
                    
                    {/* Demo Content */}
                    <div className="flex-1 overflow-hidden">
                        <selectedDemo.component />
                    </div>
                </div>
            )}

            {children}
        </div>
    )
}

export default createAutoRegisterComponent({
    id: 'CreativeCollection',
    name: 'CreativeCollection',
    description: 'A collection of interactive creative programming demos',
    category: CATEGORIES.CREATIVE,
    template: `:::react{component="CreativeCollection"}\n:::\n`,
})(CreativeCollection)