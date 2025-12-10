import { useEffect, useRef, useState, useCallback } from 'react'
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection'
import * as tf from '@tensorflow/tfjs-core'
import '@tensorflow/tfjs-backend-webgl'

// --- Singleton Detector ---
// This promise ensures the detector is created only once.
let detectorPromise: Promise<handPoseDetection.HandDetector> | null = null

const createDetector = async (
  options: { 
    modelComplexity?: 0 | 1; 
    maxHands?: number; 
    detectionConfidence?: number; 
    trackingConfidence?: number 
  }
): Promise<handPoseDetection.HandDetector> => {
  await tf.setBackend('webgl')

  const model = handPoseDetection.SupportedModels.MediaPipeHands
  const detectorConfig: handPoseDetection.MediaPipeHandsMediaPipeModelConfig = {
    runtime: 'mediapipe',
    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4',
    modelType: options.modelComplexity === 1 ? 'full' : 'lite',
    maxHands: options.maxHands,
  }
  
  return handPoseDetection.createDetector(model, detectorConfig)
}


// --- Interfaces and Constants ---
export const HAND_LANDMARKS = {
  WRIST: 0, THUMB_CMC: 1, THUMB_MCP: 2, THUMB_IP: 3, THUMB_TIP: 4,
  INDEX_MCP: 5, INDEX_PIP: 6, INDEX_DIP: 7, INDEX_TIP: 8,
  MIDDLE_MCP: 9, MIDDLE_PIP: 10, MIDDLE_DIP: 11, MIDDLE_TIP: 12,
  RING_MCP: 13, RING_PIP: 14, RING_DIP: 15, RING_TIP: 16,
  PINKY_MCP: 17, PINKY_PIP: 18, PINKY_DIP: 19, PINKY_TIP: 20,
} as const

export interface HandKeypoint { x: number; y: number; z?: number; name?: string }
export interface Hand { keypoints: HandKeypoint[]; handedness: 'Left' | 'Right'; score: number }
export interface HandPoseOptions {
  maxHands?: number; flipHorizontal?: boolean; runtime?: 'mediapipe' | 'tfjs';
  modelComplexity?: 0 | 1; detectionConfidence?: number; trackingConfidence?: number;
}
export interface UseHandPoseReturn {
  hands: Hand[]; isLoading: boolean; error: string | null;
  videoRef: React.RefObject<HTMLVideoElement>; canvasRef: React.RefObject<HTMLCanvasElement>;
  isVideoReady: boolean; startDetection: () => void; stopDetection: () => void; isDetecting: boolean;
}

// --- The Hook ---
export const useHandPose = (options: HandPoseOptions = {}): UseHandPoseReturn => {
  const { 
    maxHands = 2, 
    modelComplexity = 1, 
    detectionConfidence = 0.5, 
    trackingConfidence = 0.5 
  } = options

  const [hands, setHands] = useState<Hand[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const detectorRef = useRef<handPoseDetection.HandDetector | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationFrameIdRef = useRef<number | null>(null)

  const stopDetection = useCallback(() => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current)
      animationFrameIdRef.current = null
    }
    setIsDetecting(false)
  }, [])

  const handleResults = useCallback((results: handPoseDetection.Hand[]) => {
    const processedHands: Hand[] = results.map(result => ({
      keypoints: result.keypoints,
      handedness: (result.handedness.charAt(0).toUpperCase() + result.handedness.slice(1)) as 'Left' | 'Right',
      score: result.score,
    }))
    setHands(processedHands)
  }, [])

  const startDetection = useCallback(() => {
    if (!detectorRef.current || !videoRef.current || !isVideoReady) {
      console.warn('Cannot start detection: model or video not ready.')
      return
    }
    if (isDetecting) return

    setIsDetecting(true)
    setError(null)

    const predictionLoop = async () => {
      try {
        if (detectorRef.current && videoRef.current) {
          const predictions = await detectorRef.current.estimateHands(videoRef.current)
          if (predictions) {
            handleResults(predictions)
          }
          animationFrameIdRef.current = requestAnimationFrame(predictionLoop)
        } else {
          stopDetection()
        }
      } catch (err) {
        setError(`Error during detection: ${err}`)
        stopDetection()
      }
    }
    predictionLoop()
  }, [isDetecting, isVideoReady, handleResults, stopDetection])

  const initialize = useCallback(async () => {
    try {
      setError(null)
      setIsLoading(true)

      if (!detectorPromise) {
        detectorPromise = createDetector({ 
          modelComplexity, 
          maxHands, 
          detectionConfidence, 
          trackingConfidence 
        })
      }
      
      detectorRef.current = await detectorPromise
      console.log('Handpose detector is ready.')

    } catch (err) {
      setError(`Failed to initialize handpose detector: ${err}`)
    } finally {
      setIsLoading(false)
    }
  }, [maxHands, modelComplexity, detectionConfidence, trackingConfidence])

  const setupVideo = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false,
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadeddata = () => setIsVideoReady(true)
      }
      streamRef.current = stream
    } catch (err) {
      setError(`Failed to access camera: ${err}`)
    }
  }, [])

  useEffect(() => {
    initialize()
    setupVideo()

    return () => {
      stopDetection()
      // Do NOT dispose of the detector here, as it's a singleton.
      // Only stop the video stream and clean up video element.
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }, [initialize, setupVideo, stopDetection])

  return {
    hands, isLoading, error, videoRef, canvasRef,
    isVideoReady, startDetection, stopDetection, isDetecting,
  }
}
