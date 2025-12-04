import React, { useRef, useEffect } from 'react'

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    size: number
    color: string
    life: number
    maxLife: number
}

const ParticleSystem: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number>()
    const particlesRef = useRef<Particle[]>([])
    const mouseRef = useRef({ x: 0, y: 0, isDown: false })

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

        // Mouse events
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            mouseRef.current.x = e.clientX - rect.left
            mouseRef.current.y = e.clientY - rect.top
        }

        const handleMouseDown = () => {
            mouseRef.current.isDown = true
        }

        const handleMouseUp = () => {
            mouseRef.current.isDown = false
        }

        canvas.addEventListener('mousemove', handleMouseMove)
        canvas.addEventListener('mousedown', handleMouseDown)
        canvas.addEventListener('mouseup', handleMouseUp)

        // Create particle
        const createParticle = (x: number, y: number): Particle => {
            const angle = Math.random() * Math.PI * 2
            const speed = Math.random() * 3 + 1
            const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7']
            
            return {
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 8 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1,
                maxLife: Math.random() * 60 + 30
            }
        }

        // Animation loop
        const animate = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Create particles on mouse interaction
            if (mouseRef.current.isDown) {
                for (let i = 0; i < 3; i++) {
                    particlesRef.current.push(
                        createParticle(
                            mouseRef.current.x + (Math.random() - 0.5) * 20,
                            mouseRef.current.y + (Math.random() - 0.5) * 20
                        )
                    )
                }
            }

            // Auto-generate particles
            if (Math.random() < 0.02) {
                particlesRef.current.push(
                    createParticle(
                        Math.random() * canvas.width,
                        Math.random() * canvas.height
                    )
                )
            }

            // Update and draw particles
            particlesRef.current = particlesRef.current.filter(particle => {
                // Update position
                particle.x += particle.vx
                particle.y += particle.vy
                
                // Apply gravity and friction
                particle.vy += 0.1
                particle.vx *= 0.99
                particle.vy *= 0.99

                // Update life
                particle.life -= 1 / particle.maxLife

                // Mouse attraction
                const dx = mouseRef.current.x - particle.x
                const dy = mouseRef.current.y - particle.y
                const distance = Math.sqrt(dx * dx + dy * dy)
                
                if (distance < 100) {
                    const force = (100 - distance) / 100 * 0.5
                    particle.vx += (dx / distance) * force
                    particle.vy += (dy / distance) * force
                }

                // Draw particle
                if (particle.life > 0) {
                    ctx.globalAlpha = particle.life
                    ctx.fillStyle = particle.color
                    ctx.beginPath()
                    ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2)
                    ctx.fill()

                    // Add glow effect
                    ctx.shadowColor = particle.color
                    ctx.shadowBlur = 10
                    ctx.beginPath()
                    ctx.arc(particle.x, particle.y, particle.size * particle.life * 0.5, 0, Math.PI * 2)
                    ctx.fill()
                    ctx.shadowBlur = 0
                }

                return particle.life > 0 && 
                       particle.x > -50 && particle.x < canvas.width + 50 &&
                       particle.y > -50 && particle.y < canvas.height + 50
            })

            ctx.globalAlpha = 1

            // Draw instructions
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
            ctx.font = '18px Arial'
            ctx.textAlign = 'center'
            ctx.fillText('Click and drag to create particles', canvas.width / 2, 50)

            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
            window.removeEventListener('resize', resizeCanvas)
            canvas.removeEventListener('mousemove', handleMouseMove)
            canvas.removeEventListener('mousedown', handleMouseDown)
            canvas.removeEventListener('mouseup', handleMouseUp)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full bg-black cursor-crosshair"
            style={{ display: 'block' }}
        />
    )
}

export default ParticleSystem