import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createAutoRegisterComponent, CATEGORIES } from '../../auto-register'
import { useHandPose, HAND_LANDMARKS, Hand } from '../../hooks/useHandPose'

// Gesture control component powered by Hand-Pose recognition

interface GestureControlProps {
  children?: React.ReactNode
}

type GestureType = 'idle' | 'point' | 'grab' | 'release'

interface GestureEvent {
  type: GestureType
  position: { x: number; y: number }
  timestamp: number
  confidence: number
}

const getDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }): number => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
}

// 平滑位置处理，减少抖动
const smoothPosition = (
  current: { x: number; y: number },
  previous: { x: number; y: number },
  smoothingFactor: number = 0.3
): { x: number; y: number } => {
  return {
    x: previous.x + (current.x - previous.x) * smoothingFactor,
    y: previous.y + (current.y - previous.y) * smoothingFactor,
  }
}

// 归一化坐标转换为屏幕坐标（考虑水平翻转）
const normalizedToScreen = (
  normalized: { x: number; y: number },
  screenWidth: number,
  screenHeight: number,
  flipHorizontal: boolean = true
): { x: number; y: number } => {
  return {
    x: flipHorizontal ? (1 - normalized.x) * screenWidth : normalized.x * screenWidth,
    y: normalized.y * screenHeight,
  }
}

// Function to draw keypoints and skeleton
const drawHand = (ctx: CanvasRenderingContext2D, hand: Hand) => {
  const keypoints = hand.keypoints

  // Draw keypoints
  ctx.fillStyle = '#4ade80' // Green
  for (const keypoint of keypoints) {
    ctx.beginPath()
    ctx.arc(keypoint.x * ctx.canvas.width, keypoint.y * ctx.canvas.height, 5, 0, 2 * Math.PI)
    ctx.fill()
  }

  // Draw skeleton
  const connections = [
    [HAND_LANDMARKS.WRIST, HAND_LANDMARKS.THUMB_CMC],
    [HAND_LANDMARKS.THUMB_CMC, HAND_LANDMARKS.THUMB_MCP],
    [HAND_LANDMARKS.THUMB_MCP, HAND_LANDMARKS.THUMB_IP],
    [HAND_LANDMARKS.THUMB_IP, HAND_LANDMARKS.THUMB_TIP],
    [HAND_LANDMARKS.WRIST, HAND_LANDMARKS.INDEX_MCP],
    [HAND_LANDMARKS.INDEX_MCP, HAND_LANDMARKS.INDEX_PIP],
    [HAND_LANDMARKS.INDEX_PIP, HAND_LANDMARKS.INDEX_DIP],
    [HAND_LANDMARKS.INDEX_DIP, HAND_LANDMARKS.INDEX_TIP],
    [HAND_LANDMARKS.WRIST, HAND_LANDMARKS.MIDDLE_MCP],
    [HAND_LANDMARKS.MIDDLE_MCP, HAND_LANDMARKS.MIDDLE_PIP],
    [HAND_LANDMARKS.MIDDLE_PIP, HAND_LANDMARKS.MIDDLE_DIP],
    [HAND_LANDMARKS.MIDDLE_DIP, HAND_LANDMARKS.MIDDLE_TIP],
    [HAND_LANDMARKS.WRIST, HAND_LANDMARKS.RING_MCP],
    [HAND_LANDMARKS.RING_MCP, HAND_LANDMARKS.RING_PIP],
    [HAND_LANDMARKS.RING_PIP, HAND_LANDMARKS.RING_DIP],
    [HAND_LANDMARKS.RING_DIP, HAND_LANDMARKS.RING_TIP],
    [HAND_LANDMARKS.WRIST, HAND_LANDMARKS.PINKY_MCP],
    [HAND_LANDMARKS.PINKY_MCP, HAND_LANDMARKS.PINKY_PIP],
    [HAND_LANDMARKS.PINKY_PIP, HAND_LANDMARKS.PINKY_DIP],
    [HAND_LANDMARKS.PINKY_DIP, HAND_LANDMARKS.PINKY_TIP],
    [HAND_LANDMARKS.INDEX_MCP, HAND_LANDMARKS.MIDDLE_MCP],
    [HAND_LANDMARKS.MIDDLE_MCP, HAND_LANDMARKS.RING_MCP],
    [HAND_LANDMARKS.RING_MCP, HAND_LANDMARKS.PINKY_MCP],
  ]

  ctx.strokeStyle = 'white'
  ctx.lineWidth = 2
  for (const connection of connections) {
    const start = keypoints[connection[0]]
    const end = keypoints[connection[1]]
    if (start && end) {
      ctx.beginPath()
      ctx.moveTo(start.x * ctx.canvas.width, start.y * ctx.canvas.height)
      ctx.lineTo(end.x * ctx.canvas.width, end.y * ctx.canvas.height)
      ctx.stroke()
    }
  }
}


function GestureControlInstant({ children }: GestureControlProps) {
  const [currentGesture, setCurrentGesture] = useState<GestureEvent | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [gestureHistory, setGestureHistory] = useState<GestureEvent[]>([])
  const [objects, setObjects] = useState([
    { id: '1', x: 300, y: 200, width: 80, height: 80, color: '#ff6b6b', label: 'Red Box' },
    { id: '2', x: 500, y: 200, width: 80, height: 80, color: '#4ecdc4', label: 'Cyan Box' },
    { id: '3', x: 400, y: 350, width: 80, height: 80, color: '#45b7d1', label: 'Blue Box' },
  ])

  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedObject, setSelectedObject] = useState<string | null>(null)
  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 })
  const [debugInfo, setDebugInfo] = useState({
    pinchDistance: 0,
    threshold: 0,
    grabCount: 0,
    releaseCount: 0,
    rawIndexX: 0,
    rawIndexY: 0,
    rawThumbX: 0,
    rawThumbY: 0
  })

  const isGrabbingRef = useRef(false)
  const dragObjectOffsetRef = useRef({ x: 0, y: 0 })
  const smoothedPositionRef = useRef({ x: -100, y: -100 })
  const lastGestureTimeRef = useRef(0)
  const gestureStabilityRef = useRef({ grabCount: 0, releaseCount: 0 })

  const {
    hands, isLoading: isHandPoseLoading, error: handPoseError,
    videoRef, canvasRef, isVideoReady,
    startDetection, stopDetection, isDetecting,
  } = useHandPose({
    flipHorizontal: true,
    modelComplexity: 1,
    maxHands: 2, // 增加到2只手
    detectionConfidence: 0.5, // 降低检测置信度阈值
    trackingConfidence: 0.3 // 降低跟踪置信度
  })

  const addGesture = useCallback((type: GestureType, position: { x: number; y: number }, confidence = 0.9) => {
    const gesture: GestureEvent = { type, position, timestamp: Date.now(), confidence }
    setCurrentGesture(gesture)
    setGestureHistory(prev => [gesture, ...prev.slice(0, 9)])
    setTimeout(() => setCurrentGesture(null), 1500)
  }, [])

  const startDemo = useCallback(() => {
    setIsActive(true)
    startDetection()
  }, [startDetection])

  const stopDemo = useCallback(() => {
    setIsActive(false)
    stopDetection()
  }, [stopDetection])

  // Effect for processing hand data
  useEffect(() => {
    console.log(`DEBUG: hands.length = ${hands.length}, isActive = ${isActive}`)

    if (!isActive) {
      setDebugInfo(prev => ({ ...prev, pinchDistance: 0, grabCount: 0, releaseCount: 0 }))
      return
    }

    if (hands.length === 0) {
      setDebugInfo(prev => ({
        ...prev,
        pinchDistance: 0,
        grabCount: 0,
        releaseCount: 0,
        rawIndexX: 0,
        rawIndexY: 0,
        rawThumbX: 0,
        rawThumbY: 0
      }))
      return
    }

    const hand = hands[0]
    const container = containerRef.current
    if (!container) return

    console.log(`DEBUG: Hand detected - Score: ${hand.score}, Keypoints: ${hand.keypoints.length}`)

    // 降低置信度要求
    if (hand.score < 0.3) return

    const indexTip = hand.keypoints[HAND_LANDMARKS.INDEX_TIP]
    const thumbTip = hand.keypoints[HAND_LANDMARKS.THUMB_TIP]

    if (!indexTip || !thumbTip) {
      console.log('DEBUG: Missing keypoints')
      return
    }

    console.log(`DEBUG: IndexTip: (${indexTip.x}, ${indexTip.y}), ThumbTip: (${thumbTip.x}, ${thumbTip.y})`)

    const { clientWidth, clientHeight } = container

    // 修复坐标转换 - 确保使用正确的标准化坐标 (0-1范围)
    const cursorX = (1 - indexTip.x) * clientWidth // 水平翻转
    const cursorY = indexTip.y * clientHeight

    setCursorPosition({ x: cursorX, y: cursorY })

    // 使用标准化坐标计算距离
    const pinchDistance = Math.sqrt(
      Math.pow(indexTip.x - thumbTip.x, 2) +
      Math.pow(indexTip.y - thumbTip.y, 2)
    )

    const grabThreshold = 0.08 // 放宽阈值
    const isCurrentlyGrabbing = pinchDistance < grabThreshold

    console.log(`DEBUG: pinchDistance = ${pinchDistance}, threshold = ${grabThreshold}, grabbing = ${isCurrentlyGrabbing}`)

    // 更新调试信息
    setDebugInfo({
      pinchDistance,
      threshold: grabThreshold,
      grabCount: isCurrentlyGrabbing ? 1 : 0,
      releaseCount: isCurrentlyGrabbing ? 0 : 1,
      rawIndexX: indexTip.x,
      rawIndexY: indexTip.y,
      rawThumbX: thumbTip.x,
      rawThumbY: thumbTip.y
    })

    // 简化手势处理
    const now = Date.now()
    if (isCurrentlyGrabbing && !isGrabbingRef.current && now - lastGestureTimeRef.current > 300) {
      console.log('DEBUG: GRAB triggered!')
      isGrabbingRef.current = true
      lastGestureTimeRef.current = now
      addGesture('grab', { x: cursorX, y: cursorY }, 0.8)

      // 查找被抓取的对象
      const grabbedObject = objects.find(obj =>
        cursorX >= obj.x && cursorX <= obj.x + obj.width &&
        cursorY >= obj.y && cursorY <= obj.y + obj.height
      )

      if (grabbedObject) {
        console.log(`DEBUG: Object grabbed: ${grabbedObject.id}`)
        setSelectedObject(grabbedObject.id)
        dragObjectOffsetRef.current = {
          x: cursorX - grabbedObject.x,
          y: cursorY - grabbedObject.y
        }
      }
    }
    else if (!isCurrentlyGrabbing && isGrabbingRef.current && now - lastGestureTimeRef.current > 300) {
      console.log('DEBUG: RELEASE triggered!')
      isGrabbingRef.current = false
      lastGestureTimeRef.current = now
      addGesture('release', { x: cursorX, y: cursorY }, 0.8)
      setSelectedObject(null)
    }

    // 拖拽处理
    if (isGrabbingRef.current && selectedObject) {
      console.log('DEBUG: Dragging object')
      const newX = Math.max(0, Math.min(cursorX - dragObjectOffsetRef.current.x, clientWidth - 80))
      const newY = Math.max(0, Math.min(cursorY - dragObjectOffsetRef.current.y, clientHeight - 80))

      setObjects(prev => prev.map(obj =>
        obj.id === selectedObject
          ? { ...obj, x: newX, y: newY }
          : obj
      ))
    }
  }, [hands, isActive, addGesture, objects, selectedObject])

  // Effect for drawing keypoints on the canvas
  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Match canvas resolution to video
    canvas.width = 640
    canvas.height = 480

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (isActive && hands.length > 0) {
      for (const hand of hands) {
        drawHand(ctx, hand)
      }
    }
  }, [hands, isActive, canvasRef])


  const getGestureEmoji = (type: GestureType): string => {
    const emojis: Record<GestureType, string> = { idle: '🤚', point: '👆', grab: '✊', release: '👋' }
    return emojis[type] || '🤚'
  }

  const getGestureColor = (type: GestureType): string => {
    const colors: Record<GestureType, string> = { idle: '#6b7280', point: '#60a5fa', grab: '#f87171', release: '#4ade80' }
    return colors[type] || '#6b7280'
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-indigo-900 to-purple-900 overflow-hidden relative">
      {/* Header */}
      <div className="absolute top-4 left-4 z-20 bg-green-800/80 backdrop-blur-lg rounded-lg p-4 text-white max-w-sm">
        <h2 className="text-lg font-bold mb-2">🖐️ Hand Gesture Control</h2>
        <p className="text-sm mb-3">
          Use your hand to interact! Pinch to grab objects.
        </p>

        <button
          onClick={isActive ? stopDemo : startDemo}
          disabled={isHandPoseLoading}
          className={`px-3 py-1 rounded text-sm w-full transition-colors ${isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} disabled:bg-gray-500 disabled:cursor-not-allowed`}
        >
          {isHandPoseLoading ? 'Loading Model...' : (isActive ? 'Stop Demo' : 'Start Demo')}
        </button>

        <div className="mt-3 text-xs space-y-1">
          <div>Status: {isActive && isDetecting ? '✅ Active' : '⏹️ Inactive'}</div>
          <div>Video Ready: {isVideoReady ? '✅' : '❌'}</div>
          <div>Detecting: {isDetecting ? '✅' : '❌'}</div>
          <div>Hands Array: [{hands.length}] {hands.length > 0 ? `Score: ${hands[0]?.score.toFixed(2)}` : 'Empty'}</div>
          <div>Gesture: {isGrabbingRef.current ? '✊ Grabbing' : '👆 Pointing'}</div>
          <div>Selected: {selectedObject ? '📦 Object' : '❌ None'}</div>
          <div>Cursor: ({cursorPosition.x.toFixed(0)}, {cursorPosition.y.toFixed(0)})</div>
          <div>Pinch: {debugInfo.pinchDistance.toFixed(3)} / {debugInfo.threshold.toFixed(3)}</div>
          <div>Stability: G:{debugInfo.grabCount} R:{debugInfo.releaseCount}</div>
          <div>Index: ({debugInfo.rawIndexX.toFixed(3)}, {debugInfo.rawIndexY.toFixed(3)})</div>
          <div>Thumb: ({debugInfo.rawThumbX.toFixed(3)}, {debugInfo.rawThumbY.toFixed(3)})</div>
          {handPoseError && <div className="text-red-400">Error: {handPoseError}</div>}
        </div>
      </div>

      {/* Camera Feed & Canvas for drawing */}
      <div className="absolute top-4 right-4 z-20 w-48 h-36">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full rounded-lg border-2 border-green-400/50 shadow-lg bg-gray-800 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}
          style={{ transform: 'scaleX(-1)' }}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ transform: 'scaleX(-1)' }}
        />
      </div>

      {/* Main Interaction Area */}
      {isActive && (
        <div ref={containerRef} className="absolute inset-0 w-full h-full">
          {/* Hand Landmarks Visualization */}
          {hands.length > 0 && containerRef.current && (() => {
            const hand = hands[0]
            const container = containerRef.current
            const { clientWidth, clientHeight } = container

            return (
              <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 25 }}>
                {/* Draw all keypoints */}
                {hand.keypoints.map((keypoint, index) => (
                  <div
                    key={index}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      left: (1 - keypoint.x) * clientWidth,
                      top: keypoint.y * clientHeight,
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: index === HAND_LANDMARKS.INDEX_TIP ? '#ff0000' :
                        index === HAND_LANDMARKS.THUMB_TIP ? '#00ff00' : '#4ade80',
                      boxShadow: '0 0 3px rgba(0,0,0,0.5)'
                    }}
                  />
                ))}

                {/* Draw pinch line */}
                {(() => {
                  const indexTip = hand.keypoints[HAND_LANDMARKS.INDEX_TIP]
                  const thumbTip = hand.keypoints[HAND_LANDMARKS.THUMB_TIP]
                  const indexPos = { x: (1 - indexTip.x) * clientWidth, y: indexTip.y * clientHeight }
                  const thumbPos = { x: (1 - thumbTip.x) * clientWidth, y: thumbTip.y * clientHeight }
                  const length = Math.sqrt(Math.pow(indexPos.x - thumbPos.x, 2) + Math.pow(indexPos.y - thumbPos.y, 2))
                  const angle = Math.atan2(indexPos.y - thumbPos.y, indexPos.x - thumbPos.x) * 180 / Math.PI

                  return (
                    <div
                      className="absolute border-t-2 border-yellow-400"
                      style={{
                        left: thumbPos.x,
                        top: thumbPos.y,
                        width: length,
                        transformOrigin: '0 0',
                        transform: `rotate(${angle}deg)`,
                      }}
                    />
                  )
                })()}
              </div>
            )
          })()}

          {/* Custom Cursor */}
          <div
            className="absolute w-8 h-8 rounded-full border-4 transition-transform duration-75 ease-out"
            style={{
              left: cursorPosition.x,
              top: cursorPosition.y,
              transform: 'translate(-50%, -50%)',
              zIndex: 30,
              pointerEvents: 'none',
              borderColor: isGrabbingRef.current ? '#4ade80' : '#ffffff',
              backgroundColor: isGrabbingRef.current ? 'rgba(74, 222, 128, 0.5)' : 'rgba(255, 255, 255, 0.5)',
              transformBox: 'fill-box',
              transformOrigin: 'center center',
              scale: isGrabbingRef.current ? '1.25' : '1',
            }}
          />

          {objects.map((obj) => (
            <div
              key={obj.id}
              className="absolute rounded-lg shadow-lg flex items-center justify-center text-white font-semibold text-sm transition-all duration-100"
              style={{
                left: Math.max(0, Math.min(obj.x, window.innerWidth - obj.width)),
                top: Math.max(0, Math.min(obj.y, window.innerHeight - obj.height)),
                width: obj.width,
                height: obj.height,
                backgroundColor: obj.color,
                zIndex: selectedObject === obj.id ? 25 : 10,
                border: selectedObject === obj.id ? '4px solid white' : 'none',
              }}
            >
              {obj.label}
            </div>
          ))}

          {currentGesture && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div
                className="bg-black/80 backdrop-blur-lg rounded-full p-8 transition-all duration-300"
                style={{ borderColor: getGestureColor(currentGesture.type), borderWidth: '3px' }}
              >
                <div className="text-6xl text-center">{getGestureEmoji(currentGesture.type)}</div>
                <div className="text-center text-white mt-2 font-semibold capitalize">
                  {currentGesture.type.replace('_', ' ')}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-20 bg-black/80 backdrop-blur-lg rounded-lg p-4 text-white max-w-sm">
        <h3 className="text-sm font-bold mb-2">How to Use:</h3>
        <ul className="text-xs space-y-1">
          <li>🖐️ Show your hand to the camera.</li>
          <li>👆 Your index finger controls the cursor.</li>
          <li>✊ Pinch thumb and index finger to "grab" an object.</li>
          <li>🖐️ Release your pinch to let go of the object.</li>
        </ul>
      </div>

      {/* Event Log & Initial Screen are mostly unchanged... */}
      <div className="absolute bottom-4 right-4 z-20 bg-black/80 backdrop-blur-lg rounded-lg p-4 text-white max-w-xs">
        <h3 className="text-sm font-bold mb-2">Recent Gestures:</h3>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {gestureHistory.length === 0 && <div className="text-xs text-gray-400">Start demo...</div>}
          {gestureHistory.slice(0, 5).map((g, i) => (
            <div key={i} className="text-xs flex items-center space-x-2">
              <span className="text-lg">{getGestureEmoji(g.type)}</span>
              <span className="capitalize">{g.type.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </div>

      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-md mx-auto p-8 bg-black/80 backdrop-blur-lg rounded-lg text-white text-center">
            <div className="text-6xl mb-4">🖐️</div>
            <h2 className="text-2xl font-bold mb-4">Hand Gesture Control</h2>
            <p className="mb-6">
              This demo uses your camera to track your hand movements.
              Make sure you allow camera access.
            </p>
            <button
              onClick={startDemo}
              disabled={isHandPoseLoading || !isVideoReady}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {isHandPoseLoading ? 'Loading Model...' : (!isVideoReady ? 'Waiting for Camera...' : 'Start Hand Tracking Demo')}
            </button>
          </div>
        </div>
      )}

      {children}
    </div>
  )
}

export default createAutoRegisterComponent({
  id: 'GestureControlHandPose',
  name: 'Hand Pose Gesture Control',
  description: 'Control elements on the screen using your hand via the camera, powered by ML5.js.',
  category: CATEGORIES.CREATIVE,
  template: `:::react{component="GestureControlHandPose"}\n:::\n`,
})(GestureControlInstant)