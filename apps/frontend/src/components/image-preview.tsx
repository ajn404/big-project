import React, { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@workspace/ui-components'
import { cn } from '@/lib/utils'

interface ImagePreviewProps {
  isOpen: boolean
  onClose: () => void
  currentIndex: number
  images: Array<{ src: string; alt: string }>
  onPrevious: () => void
  onNext: () => void
}

export function ImagePreview({
  isOpen,
  onClose,
  currentIndex,
  images,
  onPrevious,
  onNext
}: ImagePreviewProps) {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hasDragged, setHasDragged] = useState(false)
  
  // 直接DOM操作相关
  const imageRef = useRef<HTMLImageElement>(null)
  const currentScaleRef = useRef<number>(1)
  const animationFrame = useRef<number | null>(null)
  

  const currentImage = images[currentIndex]

  // 重置变换状态
  const resetTransform = useCallback(() => {
    setScale(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
    currentScaleRef.current = 1
    // 直接更新DOM
    if (imageRef.current) {
      imageRef.current.style.transform = `translate(0px, 0px) scale(1) rotate(0deg)`
    }
  }, [])

  // 当图片切换时重置变换
  useEffect(() => {
    if (isOpen) {
      resetTransform()
      // 清除动画帧
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
        animationFrame.current = null
      }
    }
  }, [currentIndex, isOpen, resetTransform])

  // 键盘事件处理
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          onPrevious()
          break
        case 'ArrowRight':
          onNext()
          break
        case 'ArrowUp':
          onPrevious()
          break
        case 'ArrowDown':
          onNext()
          break
        case '+':
        case '=':
          e.preventDefault()
          const oldScaleUp = currentScaleRef.current
          const newScaleUp = Math.min(oldScaleUp * 1.2, 5)
          if (newScaleUp === oldScaleUp) break
          
          currentScaleRef.current = newScaleUp
          
          // 计算缩放中心调整 (以屏幕中心为基准)
          const scaleRatioUp = newScaleUp / oldScaleUp
          const newXUp = position.x * scaleRatioUp
          const newYUp = position.y * scaleRatioUp
          
          if (imageRef.current) {
            imageRef.current.style.transform = `translate(${newXUp}px, ${newYUp}px) scale(${newScaleUp}) rotate(${rotation}deg)`
          }
          setScale(newScaleUp)
          setPosition({ x: newXUp, y: newYUp })
          break
        case '-':
          e.preventDefault()
          const oldScaleDown = currentScaleRef.current
          const newScaleDown = Math.max(oldScaleDown / 1.2, 0.1)
          if (newScaleDown === oldScaleDown) break
          
          currentScaleRef.current = newScaleDown
          
          // 计算缩放中心调整 (以屏幕中心为基准)
          const scaleRatioDown = newScaleDown / oldScaleDown
          const newXDown = position.x * scaleRatioDown
          const newYDown = position.y * scaleRatioDown
          
          if (imageRef.current) {
            imageRef.current.style.transform = `translate(${newXDown}px, ${newYDown}px) scale(${newScaleDown}) rotate(${rotation}deg)`
          }
          setScale(newScaleDown)
          setPosition({ x: newXDown, y: newYDown })
          break
        case '0':
          e.preventDefault()
          resetTransform()
          break
        case 'r':
        case 'R':
          e.preventDefault()
          setRotation(r => r + 90)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onPrevious, onNext, resetTransform])

  // 鼠标拖拽事件
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setHasDragged(false)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && imageRef.current) {
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y
      
      // 检测是否真的移动了（防止微小的鼠标抖动）
      const deltaX = Math.abs(newX - position.x)
      const deltaY = Math.abs(newY - position.y)
      if (deltaX > 3 || deltaY > 3) {
        setHasDragged(true)
      }
      
      // 直接更新DOM，使用当前实际的缩放和旋转值
      const currentScale = currentScaleRef.current
      imageRef.current.style.transform = `translate(${newX}px, ${newY}px) scale(${currentScale}) rotate(${rotation}deg)`
      
      // 批量更新React状态
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
      
      animationFrame.current = requestAnimationFrame(() => {
        setPosition({ x: newX, y: newY })
        animationFrame.current = null
      })
    }
  }, [isDragging, dragStart, rotation, position.x, position.y])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // 直接DOM操作的滚轮缩放（以鼠标为中心）
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    
    if (!imageRef.current) return
    
    // 使用更小的缩放增量
    const scaleFactor = 1.02
    const delta = e.deltaY > 0 ? 1 / scaleFactor : scaleFactor
    const oldScale = currentScaleRef.current
    const newScale = Math.max(0.1, Math.min(5, oldScale * delta))
    
    if (newScale === oldScale) return
    
    currentScaleRef.current = newScale
    
    // 获取容器和鼠标位置信息
    const container = imageRef.current.parentElement
    if (!container) return
    
    const containerRect = container.getBoundingClientRect()
    const mouseX = e.clientX - containerRect.left - containerRect.width / 2
    const mouseY = e.clientY - containerRect.top - containerRect.height / 2
    
    // 获取当前变换值
    const currentTransform = imageRef.current.style.transform
    const transformMatch = currentTransform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)\s*scale\(([-\d.]+)\)\s*rotate\(([-\d.]+)deg\)/)
    
    let translateX = position.x
    let translateY = position.y
    let rotateValue = rotation
    
    if (transformMatch) {
      translateX = parseFloat(transformMatch[1]) || position.x
      translateY = parseFloat(transformMatch[2]) || position.y
      rotateValue = parseFloat(transformMatch[4]) || rotation
    }
    
    // 计算缩放中心调整
    const scaleRatio = newScale / oldScale
    const deltaX = mouseX - translateX
    const deltaY = mouseY - translateY
    const newTranslateX = translateX + deltaX * (1 - scaleRatio)
    const newTranslateY = translateY + deltaY * (1 - scaleRatio)
    
    imageRef.current.style.transform = `translate(${newTranslateX}px, ${newTranslateY}px) scale(${newScale}) rotate(${rotateValue}deg)`
    
    // 批量更新React状态，减少重渲染
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current)
    }
    
    animationFrame.current = requestAnimationFrame(() => {
      setScale(newScale)
      setPosition({ x: newTranslateX, y: newTranslateY })
      animationFrame.current = null
    })
  }, [position.x, position.y, rotation])

  // 添加滚轮事件监听器
  useEffect(() => {
    if (!isOpen) return

    const containerElement = document.querySelector('.image-preview-container') as HTMLElement
    if (containerElement) {
      containerElement.addEventListener('wheel', handleWheel, { passive: false })
      return () => {
        containerElement.removeEventListener('wheel', handleWheel)
        // 清理动画帧
        if (animationFrame.current) {
          cancelAnimationFrame(animationFrame.current)
          animationFrame.current = null
        }
      }
    }
  }, [isOpen, handleWheel, currentIndex])


  if (!isOpen || !currentImage) return null

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* 工具栏 */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <div className="bg-black/60 rounded-lg p-2 text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
        <div className="flex items-center gap-1 bg-black/60 rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
            onClick={() => {
              const oldScale = currentScaleRef.current
              const newScale = Math.min(oldScale * 1.2, 5)
              if (newScale === oldScale) return
              
              currentScaleRef.current = newScale
              
              // 计算缩放中心调整 (以屏幕中心为基准)
              const scaleRatio = newScale / oldScale
              const newX = position.x * scaleRatio
              const newY = position.y * scaleRatio
              
              if (imageRef.current) {
                imageRef.current.style.transform = `translate(${newX}px, ${newY}px) scale(${newScale}) rotate(${rotation}deg)`
              }
              setScale(newScale)
              setPosition({ x: newX, y: newY })
            }}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
            onClick={() => {
              const oldScale = currentScaleRef.current
              const newScale = Math.max(oldScale / 1.2, 0.1)
              if (newScale === oldScale) return
              
              currentScaleRef.current = newScale
              
              // 计算缩放中心调整 (以屏幕中心为基准)
              const scaleRatio = newScale / oldScale
              const newX = position.x * scaleRatio
              const newY = position.y * scaleRatio
              
              if (imageRef.current) {
                imageRef.current.style.transform = `translate(${newX}px, ${newY}px) scale(${newScale}) rotate(${rotation}deg)`
              }
              setScale(newScale)
              setPosition({ x: newX, y: newY })
            }}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
            onClick={() => setRotation(r => r + 90)}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
            onClick={resetTransform}
          >
            1:1
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 h-8 w-8 p-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* 导航按钮 */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12 p-0 z-10"
            onClick={onPrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12 p-0 z-10"
            onClick={onNext}
            disabled={currentIndex === images.length - 1}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* 图片容器 */}
      <div className="relative flex items-center justify-center max-w-full max-h-full p-16 image-preview-container">
        <img
          ref={imageRef}
          src={currentImage.src}
          alt={currentImage.alt}
          className={cn(
            "max-w-none max-h-none select-none image-preview-img cursor-move"
          )}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            transformOrigin: 'center'
          }}
          onMouseDown={handleMouseDown}
          onClick={(e) => {
            e.stopPropagation()
            // 如果刚刚进行了拖拽，不执行点击放大
            if (hasDragged) {
              return
            }
            
            if (currentScaleRef.current <= 1) {
              const oldScale = currentScaleRef.current
              const newScale = 2
              currentScaleRef.current = newScale
              
              // 计算缩放中心调整 (以屏幕中心为基准)
              const scaleRatio = newScale / oldScale
              const newX = position.x * scaleRatio
              const newY = position.y * scaleRatio
              
              if (imageRef.current) {
                imageRef.current.style.transform = `translate(${newX}px, ${newY}px) scale(${newScale}) rotate(${rotation}deg)`
              }
              setScale(newScale)
              setPosition({ x: newX, y: newY })
            }
          }}
          draggable={false}
        />
      </div>

      {/* 帮助提示 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 rounded-lg p-3 text-white text-xs text-center space-y-1">
        <div>ESC: 退出 | ↑↓←→: 切换图片 | 滚轮/+/-: 缩放 | R: 旋转 | 0: 重置</div>
        <div>点击图片: 放大 | 拖拽: 移动图片</div>
      </div>
    </div>,
    document.body
  )
}