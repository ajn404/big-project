import React, { useRef, useEffect } from 'react'

interface GeometricShape {
    x: number
    y: number
    size: number
    rotation: number
    rotationSpeed: number
    color: string
    type: 'triangle' | 'square' | 'hexagon' | 'circle'
    pulsePhase: number
}

const GeometricPattern: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number>()
    const shapesRef = useRef<GeometricShape[]>([])
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
            initializeShapes()
        }
        window.addEventListener('resize', resizeCanvas)

        // Mouse tracking
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            mouseRef.current.x = e.clientX - rect.left
            mouseRef.current.y = e.clientY - rect.top
        }
        canvas.addEventListener('mousemove', handleMouseMove)

        // Initialize shapes
        const initializeShapes = () => {
            shapesRef.current = []
            const types: GeometricShape['type'][] = ['triangle', 'square', 'hexagon', 'circle']
            
            for (let i = 0; i < 50; i++) {
                shapesRef.current.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 40 + 10,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.02,
                    color: `hsl(${Math.random() * 360}, 70%, 60%)`,
                    type: types[Math.floor(Math.random() * types.length)],
                    pulsePhase: Math.random() * Math.PI * 2
                })
            }
        }

        resizeCanvas()


        // Draw triangle
        const drawTriangle = (x: number, y: number, size: number, rotation: number) => {
            ctx.save()
            ctx.translate(x, y)
            ctx.rotate(rotation)
            ctx.beginPath()
            ctx.moveTo(0, -size)
            ctx.lineTo(-size * 0.866, size * 0.5)
            ctx.lineTo(size * 0.866, size * 0.5)
            ctx.closePath()
            ctx.restore()
        }

        // Draw square
        const drawSquare = (x: number, y: number, size: number, rotation: number) => {
            ctx.save()
            ctx.translate(x, y)
            ctx.rotate(rotation)
            ctx.fillRect(-size / 2, -size / 2, size, size)
            ctx.strokeRect(-size / 2, -size / 2, size, size)
            ctx.restore()
        }

        // Draw hexagon
        const drawHexagon = (x: number, y: number, size: number, rotation: number) => {
            ctx.save()
            ctx.translate(x, y)
            ctx.rotate(rotation)
            ctx.beginPath()
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI) / 3
                const px = size * Math.cos(angle)
                const py = size * Math.sin(angle)
                if (i === 0) {
                    ctx.moveTo(px, py)
                } else {
                    ctx.lineTo(px, py)
                }
            }
            ctx.closePath()
            ctx.restore()
        }

        // Draw circle
        const drawCircle = (x: number, y: number, size: number) => {
            ctx.beginPath()
            ctx.arc(x, y, size / 2, 0, Math.PI * 2)
        }

        // Draw kaleidoscope pattern
        const drawKaleidoscope = () => {
            const centerX = canvas.width / 2
            const centerY = canvas.height / 2
            const segments = 8
            
            ctx.save()
            ctx.translate(centerX, centerY)
            
            for (let i = 0; i < segments; i++) {
                ctx.save()
                ctx.rotate((i * Math.PI * 2) / segments)
                
                // Create clipping path for each segment
                ctx.beginPath()
                ctx.moveTo(0, 0)
                ctx.arc(0, 0, Math.min(canvas.width, canvas.height) / 2, 0, Math.PI / segments)
                ctx.lineTo(0, 0)
                ctx.clip()
                
                // Draw pattern in this segment
                for (let j = 0; j < 10; j++) {
                    const radius = j * 30 + 20
                    const angle = timeRef.current * 0.01 + j * 0.5
                    const x = radius * Math.cos(angle)
                    const y = radius * Math.sin(angle)
                    const size = 10 + Math.sin(timeRef.current * 0.05 + j) * 5
                    
                    ctx.fillStyle = `hsl(${(timeRef.current + j * 30) % 360}, 70%, 60%)`
                    ctx.globalAlpha = 0.7
                    
                    drawCircle(x, y, size)
                    ctx.fill()
                }
                
                ctx.restore()
            }
            
            ctx.restore()
        }

        // Draw tessellation pattern
        const drawTessellation = () => {
            const tileSize = 60
            const offsetX = (timeRef.current * 0.5) % tileSize
            const offsetY = (timeRef.current * 0.3) % tileSize
            
            for (let x = -tileSize; x < canvas.width + tileSize; x += tileSize) {
                for (let y = -tileSize; y < canvas.height + tileSize; y += tileSize) {
                    const actualX = x + offsetX
                    const actualY = y + offsetY
                    
                    // Mouse influence
                    const dx = actualX - mouseRef.current.x
                    const dy = actualY - mouseRef.current.y
                    const distance = Math.sqrt(dx * dx + dy * dy)
                    const influence = Math.max(0, 1 - distance / 200)
                    
                    const size = tileSize * 0.3 + influence * 20
                    const rotation = timeRef.current * 0.01 + influence * 2
                    const hue = (timeRef.current + distance * 0.5) % 360
                    
                    ctx.fillStyle = `hsla(${hue}, 60%, 50%, ${0.3 + influence * 0.5})`
                    ctx.strokeStyle = `hsla(${hue}, 80%, 70%, 0.8)`
                    ctx.lineWidth = 1 + influence * 2
                    
                    if ((x + y) % (tileSize * 2) === 0) {
                        drawSquare(actualX, actualY, size, rotation)
                    } else {
                        drawTriangle(actualX, actualY, size, rotation)
                    }
                    ctx.fill()
                    ctx.stroke()
                }
            }
        }

        // Animation loop
        const animate = () => {
            timeRef.current += 1

            // Clear with gradient background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
            gradient.addColorStop(0, 'rgba(15, 15, 35, 0.1)')
            gradient.addColorStop(0.5, 'rgba(25, 15, 45, 0.1)')
            gradient.addColorStop(1, 'rgba(15, 25, 35, 0.1)')
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Draw tessellation background
            drawTessellation()

            // Draw kaleidoscope in center
            ctx.globalAlpha = 0.6
            drawKaleidoscope()
            ctx.globalAlpha = 1

            // Draw floating shapes
            shapesRef.current.forEach((shape) => {
                // Update rotation
                shape.rotation += shape.rotationSpeed
                
                // Update pulse
                shape.pulsePhase += 0.05
                const pulse = Math.sin(shape.pulsePhase) * 0.3 + 1
                
                // Mouse attraction
                const dx = mouseRef.current.x - shape.x
                const dy = mouseRef.current.y - shape.y
                const distance = Math.sqrt(dx * dx + dy * dy)
                
                if (distance < 150) {
                    const force = (150 - distance) / 150 * 0.5
                    shape.x += (dx / distance) * force
                    shape.y += (dy / distance) * force
                }
                
                // Gentle drift
                shape.x += Math.sin(timeRef.current * 0.01 + shape.pulsePhase) * 0.5
                shape.y += Math.cos(timeRef.current * 0.008 + shape.pulsePhase) * 0.3
                
                // Wrap around edges
                if (shape.x < -50) shape.x = canvas.width + 50
                if (shape.x > canvas.width + 50) shape.x = -50
                if (shape.y < -50) shape.y = canvas.height + 50
                if (shape.y > canvas.height + 50) shape.y = -50
                
                // Set style
                const alpha = 0.6 + Math.sin(shape.pulsePhase * 2) * 0.2
                ctx.fillStyle = shape.color.replace('60%)', `60%, ${alpha})`)
                ctx.strokeStyle = shape.color.replace('60%)', '80%, 0.9)')
                ctx.lineWidth = 2
                
                // Draw shape
                const size = shape.size * pulse
                switch (shape.type) {
                    case 'triangle':
                        drawTriangle(shape.x, shape.y, size, shape.rotation)
                        ctx.fill()
                        ctx.stroke()
                        break
                    case 'square':
                        drawSquare(shape.x, shape.y, size, shape.rotation)
                        break
                    case 'hexagon':
                        drawHexagon(shape.x, shape.y, size, shape.rotation)
                        ctx.fill()
                        ctx.stroke()
                        break
                    case 'circle':
                        drawCircle(shape.x, shape.y, size)
                        ctx.fill()
                        ctx.stroke()
                        break
                }
            })

            // Draw instructions
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
            ctx.font = '18px Arial'
            ctx.textAlign = 'center'
            ctx.fillText('Move mouse to attract shapes and influence patterns', canvas.width / 2, 50)

            animationRef.current = requestAnimationFrame(animate)
        }

        initializeShapes()
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
            className="w-full h-full cursor-pointer"
            style={{ 
                display: 'block',
                background: 'radial-gradient(circle at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)'
            }}
        />
    )
}

export default GeometricPattern