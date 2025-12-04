import React, { useRef, useEffect, useState } from 'react'

interface Branch {
    x1: number
    y1: number
    x2: number
    y2: number
    generation: number
    angle: number
    length: number
    thickness: number
}

const FractalTree: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number>()
    const [isGrowing, setIsGrowing] = useState(false)
    const [growth, setGrowth] = useState(0)
    const branchesRef = useRef<Branch[]>([])
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

        // Generate fractal tree
        const generateTree = () => {
            branchesRef.current = []
            const startX = canvas.width / 2
            const startY = canvas.height - 50
            const initialLength = 120
            
            // Create trunk
            const trunk: Branch = {
                x1: startX,
                y1: startY,
                x2: startX,
                y2: startY - initialLength,
                generation: 0,
                angle: -Math.PI / 2, // pointing up
                length: initialLength,
                thickness: 8
            }
            branchesRef.current.push(trunk)
            
            // Generate branches recursively
            const createBranches = (parent: Branch, depth: number) => {
                if (depth > 8) return
                
                const newLength = parent.length * 0.7
                const thickness = Math.max(1, parent.thickness * 0.7)
                
                // Wind influence based on mouse position
                const windInfluence = (mouseRef.current.x - canvas.width / 2) / canvas.width * 0.3
                
                // Left branch
                const leftAngle = parent.angle - Math.PI / 6 - windInfluence
                const leftBranch: Branch = {
                    x1: parent.x2,
                    y1: parent.y2,
                    x2: parent.x2 + Math.cos(leftAngle) * newLength,
                    y2: parent.y2 + Math.sin(leftAngle) * newLength,
                    generation: depth,
                    angle: leftAngle,
                    length: newLength,
                    thickness: thickness
                }
                branchesRef.current.push(leftBranch)
                
                // Right branch
                const rightAngle = parent.angle + Math.PI / 6 + windInfluence
                const rightBranch: Branch = {
                    x1: parent.x2,
                    y1: parent.y2,
                    x2: parent.x2 + Math.cos(rightAngle) * newLength,
                    y2: parent.y2 + Math.sin(rightAngle) * newLength,
                    generation: depth,
                    angle: rightAngle,
                    length: newLength,
                    thickness: thickness
                }
                branchesRef.current.push(rightBranch)
                
                createBranches(leftBranch, depth + 1)
                createBranches(rightBranch, depth + 1)
            }
            
            createBranches(trunk, 1)
        }

        // Draw branch
        const drawBranch = (branch: Branch, growthProgress: number) => {
            const progress = Math.min(1, Math.max(0, growthProgress - branch.generation * 0.1))
            if (progress <= 0) return

            const currentX2 = branch.x1 + (branch.x2 - branch.x1) * progress
            const currentY2 = branch.y1 + (branch.y2 - branch.y1) * progress

            // Color based on generation
            const hue = 30 + branch.generation * 20 // Brown to green
            const saturation = Math.max(20, 80 - branch.generation * 8)
            const lightness = Math.max(20, 60 - branch.generation * 3)
            
            ctx.strokeStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`
            ctx.lineWidth = branch.thickness * progress
            ctx.lineCap = 'round'
            
            ctx.beginPath()
            ctx.moveTo(branch.x1, branch.y1)
            ctx.lineTo(currentX2, currentY2)
            ctx.stroke()

            // Add leaves to terminal branches
            if (branch.generation > 6 && progress > 0.8 && Math.random() < 0.3) {
                ctx.fillStyle = `hsl(${120 + Math.random() * 60}, 60%, 40%)`
                ctx.beginPath()
                ctx.arc(currentX2 + Math.random() * 6 - 3, currentY2 + Math.random() * 6 - 3, 2, 0, Math.PI * 2)
                ctx.fill()
            }
        }

        // Animation loop
        const animate = () => {
            ctx.fillStyle = 'rgba(15, 25, 35, 0.1)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            if (isGrowing) {
                setGrowth(prev => {
                    const newGrowth = prev + 0.02
                    if (newGrowth >= 1.5) {
                        setIsGrowing(false)
                        return 1.5
                    }
                    return newGrowth
                })
            }

            // Draw all branches
            branchesRef.current.forEach(branch => {
                drawBranch(branch, growth)
            })

            // Draw ground
            ctx.fillStyle = '#2d3748'
            ctx.fillRect(0, canvas.height - 30, canvas.width, 30)

            // Instructions
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
            ctx.font = '18px Arial'
            ctx.textAlign = 'center'
            ctx.fillText('Move mouse to influence wind • Click to regrow', canvas.width / 2, 50)
            
            // Start button
            if (!isGrowing && growth < 1) {
                ctx.fillStyle = 'rgba(66, 153, 225, 0.8)'
                ctx.fillRect(canvas.width / 2 - 50, 70, 100, 30)
                ctx.fillStyle = 'white'
                ctx.font = '14px Arial'
                ctx.fillText('Start Growing', canvas.width / 2, 90)
            }

            animationRef.current = requestAnimationFrame(animate)
        }

        // Click handler
        const handleClick = () => {
            if (!isGrowing) {
                generateTree()
                setGrowth(0)
                setIsGrowing(true)
            }
        }
        canvas.addEventListener('click', handleClick)

        // Initial generation
        generateTree()
        setTimeout(() => setIsGrowing(true), 500)

        animate()

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
            window.removeEventListener('resize', resizeCanvas)
            canvas.removeEventListener('mousemove', handleMouseMove)
            canvas.removeEventListener('click', handleClick)
        }
    }, [isGrowing, growth])

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full cursor-pointer"
            style={{ 
                display: 'block',
                background: 'linear-gradient(to bottom, #1a202c 0%, #2d3748 100%)'
            }}
        />
    )
}

export default FractalTree