import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ImageInfo {
  src: string
  alt: string
}

interface ImageContextType {
  images: ImageInfo[]
  currentIndex: number
  isPreviewOpen: boolean
  addImage: (image: ImageInfo) => number
  openPreview: (index: number) => void
  closePreview: () => void
  goToPrevious: () => void
  goToNext: () => void
  clearImages: () => void
}

const ImageContext = createContext<ImageContextType | null>(null)

export function useImageContext() {
  const context = useContext(ImageContext)
  if (!context) {
    throw new Error('useImageContext must be used within an ImageProvider')
  }
  return context
}

interface ImageProviderProps {
  children: ReactNode
}

export function ImageProvider({ children }: ImageProviderProps) {
  const [images, setImages] = useState<ImageInfo[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const addImage = React.useCallback((image: ImageInfo): number => {
    let index = -1
    setImages(prev => {
      const existingIndex = prev.findIndex(img => img.src === image.src)
      if (existingIndex !== -1) {
        index = existingIndex
        return prev
      }
      index = prev.length
      return [...prev, image]
    })
    
    // 返回图片的索引
    return index !== -1 ? index : 0
  }, [])

  const openPreview = React.useCallback((index: number) => {
    setCurrentIndex(index)
    setIsPreviewOpen(true)
  }, [])

  const closePreview = React.useCallback(() => {
    setIsPreviewOpen(false)
  }, [])

  const goToPrevious = React.useCallback(() => {
    setCurrentIndex(prev => {
      if (prev > 0) return prev - 1
      return images.length - 1 // 循环到最后一张
    })
  }, [images.length])

  const goToNext = React.useCallback(() => {
    setCurrentIndex(prev => {
      if (prev < images.length - 1) return prev + 1
      return 0 // 循环到第一张
    })
  }, [images.length])

  const clearImages = React.useCallback(() => {
    setImages([])
    setCurrentIndex(0)
    setIsPreviewOpen(false)
  }, [])

  const value: ImageContextType = {
    images,
    currentIndex,
    isPreviewOpen,
    addImage,
    openPreview,
    closePreview,
    goToPrevious,
    goToNext,
    clearImages
  }

  return (
    <ImageContext.Provider value={value}>
      {children}
    </ImageContext.Provider>
  )
}