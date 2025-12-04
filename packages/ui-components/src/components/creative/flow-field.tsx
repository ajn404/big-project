import React, { useRef, useEffect } from 'react'

interface FlowParticle {
    x: number
    y: number
    prevX: number
    prevY: number
    vx: number
    vy: number
    alpha: number
    hue: number
}

// Simple noise function (simplified Perlin noise)
const noise = (x: number, y: number, time: number): number => {
    return Math.sin(x * 0.01 + time * 0.002) * Math.cos(y * 0.01 + time * 0.003) * 0.5 + 0.5
}

const FlowField: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number>()
    const particlesRef = useRef<FlowParticle[]>([])
    const timeRef = useRef(0)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)

        // Initialize particles
        const initParticles = () => {
            particlesRef.current = []
            for (let i = 0; i < 800; i++) {
                particlesRef.current.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    prevX: 0,
                    prevY: 0,
                    vx: 0,
                    vy: 0,
                    alpha: Math.random() * 0.5 + 0.2,
                    hue: Math.random() * 360
                })
            }
        }
        initParticles()

        // Get flow direction at position
        const getFlowDirection = (x: number, y: number, time: number): { angle: number; magnitude: number } => {
            const noiseValue1 = noise(x, y, time)
            const noiseValue2 = noise(x + 1000, y + 1000, time)
            
            const angle = noiseValue1 * Math.PI * 4
            const magnitude = noiseValue2 * 2
            
            return { angle, magnitude }
        }

        // Animation loop
        const animate = () => {
            timeRef.current += 1

            // Semi-transparent background for trailing effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.02)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Update and draw particles
            particlesRef.current.forEach((particle, index) => {
                // Store previous position
                particle.prevX = particle.x
                particle.prevY = particle.y

                // Get flow direction
                const flow = getFlowDirection(particle.x, particle.y, timeRef.current)
                
                // Update velocity based on flow
                const flowForce = 0.1
                particle.vx += Math.cos(flow.angle) * flow.magnitude * flowForce
                particle.vy += Math.sin(flow.angle) * flow.magnitude * flowForce

                // Apply some damping
                particle.vx *= 0.99
                particle.vy *= 0.99

                // Update position
                particle.x += particle.vx
                particle.y += particle.vy

                // Update hue for color cycling
                particle.hue = (particle.hue + 0.5) % 360

                // Wrap around edges
                if (particle.x < 0) particle.x = canvas.width
                if (particle.x > canvas.width) particle.x = 0
                if (particle.y < 0) particle.y = canvas.height
                if (particle.y > canvas.height) particle.y = 0

                // Draw particle trail
                ctx.globalAlpha = particle.alpha
                ctx.strokeStyle = `hsla(${particle.hue}, 80%, 60%, ${particle.alpha})`
                ctx.lineWidth = 1
                ctx.beginPath()
                ctx.moveTo(particle.prevX, particle.prevY)
                ctx.lineTo(particle.x, particle.y)
                ctx.stroke()

                // Occasionally draw a glow effect
                if (index % 10 === 0) {
                    ctx.shadowColor = `hsla(${particle.hue}, 100%, 50%, 0.5)`
                    ctx.shadowBlur = 3
                    ctx.fillStyle = `hsla(${particle.hue}, 100%, 60%, ${particle.alpha * 0.3})`
                    ctx.beginPath()
                    ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2)
                    ctx.fill()
                    ctx.shadowBlur = 0
                }
            })

            ctx.globalAlpha = 1

            // Draw flow field visualization (optional - shows the actual field)
            if (timeRef.current % 120 === 0) {
                ctx.globalAlpha = 0.1
                const step = 30
                for (let x = 0; x < canvas.width; x += step) {
                    for (let y = 0; y < canvas.height; y += step) {
                        const flow = getFlowDirection(x, y, timeRef.current)
                        const endX = x + Math.cos(flow.angle) * flow.magnitude * 10
                        const endY = y + Math.sin(flow.angle) * flow.magnitude * 10
                        
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
                        ctx.lineWidth = 1
                        ctx.beginPath()
                        ctx.moveTo(x, y)
                        ctx.lineTo(endX, endY)
                        ctx.stroke()
                    }
                }
                ctx.globalAlpha = 1
            }

            // Draw title
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
            ctx.font = '18px Arial'
            ctx.textAlign = 'center'
            ctx.fillText('Flow Field Visualization', canvas.width / 2, 50)

            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
            window.removeEventListener('resize', resizeCanvas)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full bg-black"
            style={{ display: 'block' }}
        />
    )
}

export default FlowField