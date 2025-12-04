import React, { useRef, useEffect } from 'react'

const WaveAnimation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number>()
    const timeRef = useRef(0)
    const mouseRef = useRef({ x: 0, y: 0 })

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

        // Mouse tracking
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            mouseRef.current.x = e.clientX - rect.left
            mouseRef.current.y = e.clientY - rect.top
        }
        canvas.addEventListener('mousemove', handleMouseMove)

        // Draw wave
        const drawWave = (
            yOffset: number, 
            amplitude: number, 
            frequency: number, 
            phase: number, 
            color: string, 
            lineWidth: number = 2
        ) => {
            ctx.strokeStyle = color
            ctx.lineWidth = lineWidth
            ctx.beginPath()
            
            const step = 2
            for (let x = 0; x <= canvas.width; x += step) {
                // Mouse influence
                const mouseDistance = Math.abs(mouseRef.current.x - x)
                const mouseInfluence = Math.max(0, 1 - mouseDistance / 200) * 50
                
                const y = yOffset + 
                         amplitude * Math.sin((x * frequency) + phase) +
                         mouseInfluence * Math.sin((x * 0.02) + timeRef.current * 0.1)
                
                if (x === 0) {
                    ctx.moveTo(x, y)
                } else {
                    ctx.lineTo(x, y)
                }
            }
            ctx.stroke()
        }

        // Draw interference pattern
        const drawInterferencePattern = () => {
            const imageData = ctx.createImageData(canvas.width, canvas.height)
            const data = imageData.data
            
            const centerX = canvas.width / 2
            const centerY = canvas.height / 2
            
            for (let x = 0; x < canvas.width; x += 2) {
                for (let y = 0; y < canvas.height; y += 2) {
                    // Distance from center
                    const dx = x - centerX
                    const dy = y - centerY
                    const distance = Math.sqrt(dx * dx + dy * dy)
                    
                    // Multiple wave sources
                    const wave1 = Math.sin(distance * 0.03 - timeRef.current * 0.05)
                    const wave2 = Math.sin((distance + timeRef.current * 2) * 0.02)
                    
                    // Mouse interaction
                    const mouseDx = x - mouseRef.current.x
                    const mouseDy = y - mouseRef.current.y
                    const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy)
                    const mouseWave = Math.sin(mouseDistance * 0.05 - timeRef.current * 0.1) * 
                                     Math.max(0, 1 - mouseDistance / 150)
                    
                    const combined = (wave1 + wave2 + mouseWave) / 3
                    const intensity = Math.abs(combined) * 255
                    
                    const index = (y * canvas.width + x) * 4
                    
                    // Color based on wave value
                    if (combined > 0) {
                        data[index] = intensity * 0.2     // R
                        data[index + 1] = intensity * 0.6 // G
                        data[index + 2] = intensity       // B
                    } else {
                        data[index] = intensity           // R
                        data[index + 1] = intensity * 0.4 // G
                        data[index + 2] = intensity * 0.2 // B
                    }
                    data[index + 3] = Math.min(255, intensity * 0.5) // A
                }
            }
            
            ctx.putImageData(imageData, 0, 0)
        }

        // Draw circular waves
        const drawCircularWaves = () => {
            const centerX = canvas.width / 2
            const centerY = canvas.height / 2
            const maxRadius = Math.min(canvas.width, canvas.height) / 2
            
            for (let radius = 10; radius < maxRadius; radius += 20) {
                const wave = Math.sin(radius * 0.1 - timeRef.current * 0.05)
                const alpha = Math.max(0, wave) * 0.3
                
                ctx.strokeStyle = `hsla(${(radius + timeRef.current * 2) % 360}, 70%, 60%, ${alpha})`
                ctx.lineWidth = 2
                ctx.beginPath()
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
                ctx.stroke()
            }
            
            // Mouse ripples
            if (mouseRef.current.x > 0 && mouseRef.current.y > 0) {
                for (let i = 0; i < 5; i++) {
                    const radius = (timeRef.current * 3 + i * 30) % 200
                    const alpha = Math.max(0, 1 - radius / 200) * 0.5
                    
                    ctx.strokeStyle = `hsla(200, 100%, 70%, ${alpha})`
                    ctx.lineWidth = 3
                    ctx.beginPath()
                    ctx.arc(mouseRef.current.x, mouseRef.current.y, radius, 0, Math.PI * 2)
                    ctx.stroke()
                }
            }
        }

        // Animation loop
        const animate = () => {
            timeRef.current += 1

            // Clear canvas with fade effect
            ctx.fillStyle = 'rgba(10, 15, 25, 0.1)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Draw interference pattern
            drawInterferencePattern()

            // Draw multiple wave layers
            const centerY = canvas.height / 2
            
            // Layer 1: Main sine waves
            for (let i = 0; i < 5; i++) {
                const yOffset = centerY + i * 30 - 60
                const amplitude = 20 + i * 5
                const frequency = 0.01 + i * 0.002
                const phase = timeRef.current * 0.02 + i * Math.PI / 3
                const hue = (timeRef.current + i * 60) % 360
                
                drawWave(
                    yOffset, 
                    amplitude, 
                    frequency, 
                    phase, 
                    `hsla(${hue}, 70%, 60%, 0.7)`,
                    2 + i * 0.5
                )
            }

            // Layer 2: Circular waves
            drawCircularWaves()

            // Draw frequency spectrum visualization
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
            const barWidth = canvas.width / 64
            for (let i = 0; i < 64; i++) {
                const frequency = i * 0.1
                const amplitude = Math.abs(Math.sin(frequency + timeRef.current * 0.05)) * 
                                Math.abs(Math.cos(frequency * 2 + timeRef.current * 0.03))
                const height = amplitude * 100
                
                ctx.fillStyle = `hsla(${i * 6}, 60%, 50%, 0.6)`
                ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 1, height)
            }

            // Draw instructions
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
            ctx.font = '18px Arial'
            ctx.textAlign = 'center'
            ctx.fillText('Move mouse to create ripples and influence waves', canvas.width / 2, 50)

            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
            window.removeEventListener('resize', resizeCanvas)
            canvas.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair"
            style={{ 
                display: 'block',
                background: 'linear-gradient(45deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
            }}
        />
    )
}

export default WaveAnimation