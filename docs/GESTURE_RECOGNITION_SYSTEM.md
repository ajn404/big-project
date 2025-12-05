# 🤖 Gesture Recognition System

A comprehensive hand gesture recognition and control system built with React hooks, ML5.js, and TypeScript. This system allows for natural hand gesture interactions with web applications.

## 📦 Overview

The gesture recognition system consists of three main hooks:
- **`useHandPose`** - Raw hand tracking and pose detection
- **`useGestureRecognition`** - Gesture pattern recognition
- **`useGestureControls`** - Complete UI control system with gesture mapping

## 🚀 Quick Start

### Prerequisites

Include ML5.js in your HTML:
```html
<script src="https://unpkg.com/ml5@1/dist/ml5.js"></script>
```

### Basic Usage

```tsx
import { useGestureControls } from '@workspace/ui-components'

function MyComponent() {
  const { currentGesture, startDetection, videoRef } = useGestureControls({
    enableScrollControl: true,
    enableClickControl: true,
  }, {
    onScroll: (direction, intensity) => {
      console.log(`Scroll ${direction} with intensity ${intensity}`)
    },
    onClick: (position, type) => {
      console.log(`${type} click at`, position)
    }
  })

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline muted />
      <button onClick={startDetection}>Start Detection</button>
      <p>Current gesture: {currentGesture?.type || 'None'}</p>
    </div>
  )
}
```

## 🎯 Available Hooks

### `useHandPose`

Basic hand tracking hook for raw pose detection.

```tsx
const {
  hands,           // Array of detected hands
  isLoading,       // ML5 model loading state
  error,           // Error message if any
  videoRef,        // Ref for video element
  startDetection,  // Start hand detection
  stopDetection,   // Stop hand detection
  isDetecting,     // Detection state
} = useHandPose({
  maxHands: 2,
  flipHorizontal: true,
  runtime: 'mediapipe'
})
```

### `useGestureRecognition`

Gesture pattern recognition with customizable detection.

```tsx
const {
  gestures,        // Array of detected gestures
  currentGesture,  // Most confident current gesture
  isGestureActive, // Check if specific gesture is active
  getHandPosition, // Get hand center position
  // ... plus all useHandPose returns
} = useGestureRecognition({
  enabledGestures: ['open_palm', 'fist', 'pointing', 'peace'],
  confidenceThreshold: 0.8,
})
```

### `useGestureControls`

Complete gesture control system with UI event mapping.

```tsx
const {
  isDragging,      // Current drag state
  cursorPosition,  // Virtual cursor position
  activeGestures,  // Currently active gestures
  // ... plus all useGestureRecognition returns
} = useGestureControls(config, callbacks)
```

## 🤲 Supported Gestures

| Gesture | Description | Use Case |
|---------|-------------|----------|
| `open_palm` | All fingers extended | Release, zoom out, reset |
| `fist` | All fingers closed | Grab, zoom in, activate |
| `pointing` | Index finger extended | Point, primary click |
| `peace` | Index and middle extended | Secondary action |
| `thumbs_up` | Thumb up, others closed | Approve, scroll up |
| `thumbs_down` | Thumb down, others closed | Disapprove, scroll down |
| `pinch` | Thumb and index close | Precise selection, drag |

## ⚙️ Configuration Options

### `GestureControlConfig`

```tsx
interface GestureControlConfig {
  // Scroll controls
  enableScrollControl?: boolean
  scrollSensitivity?: number
  scrollGestures?: {
    up?: GestureType
    down?: GestureType
    left?: GestureType
    right?: GestureType
  }
  
  // Click controls
  enableClickControl?: boolean
  clickGestures?: {
    primary?: GestureType
    secondary?: GestureType
    doubleClick?: GestureType
  }
  
  // Drag and drop
  enableDragControl?: boolean
  dragGestures?: {
    grab?: GestureType
    release?: GestureType
  }
  
  // Zoom controls
  enableZoomControl?: boolean
  zoomGestures?: {
    zoomIn?: GestureType
    zoomOut?: GestureType
  }
  
  // Navigation
  enableNavigation?: boolean
  navigationGestures?: {
    back?: GestureType
    forward?: GestureType
    home?: GestureType
  }
}
```

### `GestureControlCallbacks`

```tsx
interface GestureControlCallbacks {
  onScroll?: (direction: 'up' | 'down' | 'left' | 'right', intensity: number) => void
  onClick?: (position: { x: number; y: number }, type: 'primary' | 'secondary') => void
  onDoubleClick?: (position: { x: number; y: number }) => void
  onDragStart?: (position: { x: number; y: number }) => void
  onDragEnd?: (position: { x: number; y: number }) => void
  onDragMove?: (position: { x: number; y: number }, delta: { x: number; y: number }) => void
  onZoom?: (direction: 'in' | 'out', center: { x: number; y: number }) => void
  onNavigate?: (action: 'back' | 'forward' | 'home') => void
  onGestureDetected?: (gesture: GestureEvent) => void
}
```

## 🎮 Use Cases

### 1. Accessibility Controls
Enable hands-free navigation for users with mobility limitations:

```tsx
const controls = useGestureControls({
  enableNavigation: true,
  enableScrollControl: true,
}, {
  onScroll: (direction) => {
    window.scrollBy(0, direction === 'up' ? -100 : 100)
  },
  onNavigate: (action) => {
    if (action === 'back') history.back()
  }
})
```

### 2. Interactive Presentations
Control slides and presentations with gestures:

```tsx
const presentationControls = useGestureControls({
  enableNavigation: true,
  navigationGestures: {
    forward: 'swipe_left',
    back: 'swipe_right',
    home: 'thumbs_up'
  }
}, {
  onNavigate: (action) => {
    switch(action) {
      case 'forward': nextSlide(); break
      case 'back': previousSlide(); break
      case 'home': goToFirstSlide(); break
    }
  }
})
```

### 3. Gaming Controls
Natural gesture-based game interactions:

```tsx
const gameControls = useGestureControls({
  enableClickControl: true,
  enableDragControl: true,
  clickGestures: {
    primary: 'pointing',
    secondary: 'peace'
  }
}, {
  onClick: (pos, type) => {
    if (type === 'primary') fireWeapon(pos)
    if (type === 'secondary') deployShield(pos)
  },
  onDragMove: (pos, delta) => {
    moveCharacter(delta)
  }
})
```

### 4. Creative Tools
Gesture-controlled drawing and design applications:

```tsx
const drawingControls = useGestureControls({
  enableDragControl: true,
  enableZoomControl: true,
  dragGestures: {
    grab: 'pinch',
    release: 'open_palm'
  }
}, {
  onDragMove: (pos, delta) => {
    if (isDrawing) addPointToPath(pos)
  },
  onZoom: (direction, center) => {
    adjustCanvasZoom(direction === 'in' ? 1.1 : 0.9, center)
  }
})
```

## 🔧 Advanced Features

### Custom Gesture Recognition

Extend the system with custom gesture detection:

```tsx
const recognizeCustomGesture = (hand: Hand): number => {
  // Implement custom gesture logic
  // Return confidence level 0-1
  return confidence
}

// Add to gesture recognition pipeline
const customGestures = useGestureRecognition({
  customRecognizers: {
    'my_gesture': recognizeCustomGesture
  }
})
```

### Gesture History and Analytics

Track gesture usage patterns:

```tsx
const [gestureHistory, setGestureHistory] = useState<GestureEvent[]>([])

const controls = useGestureControls({}, {
  onGestureDetected: (gesture) => {
    setGestureHistory(prev => [...prev, gesture].slice(-100)) // Keep last 100
    
    // Analytics
    trackGestureUsage(gesture.type)
    adjustGestureThresholds(gesture.confidence)
  }
})
```

### Multi-Hand Support

Handle multiple hands simultaneously:

```tsx
const { hands } = useHandPose({ maxHands: 2 })

hands.forEach((hand, index) => {
  const position = getHandPosition(index)
  const gesture = recognizeGesture(hand)
  
  // Handle each hand independently
  handleHandGesture(hand.handedness, gesture, position)
})
```

## 📱 Performance Optimization

### Frame Rate Control
```tsx
const controls = useGestureControls({
  detectionInterval: 100, // Process every 100ms instead of every frame
  smoothingFactor: 0.8,   // Smooth gesture transitions
})
```

### Conditional Detection
```tsx
const [isActive, setIsActive] = useState(false)

useEffect(() => {
  if (isActive) {
    startDetection()
  } else {
    stopDetection()
  }
}, [isActive])
```

## 🐛 Troubleshooting

### Common Issues

1. **Camera Permission Denied**
   ```tsx
   const { error } = useHandPose()
   if (error?.includes('camera')) {
     // Show camera permission instructions
   }
   ```

2. **ML5 Not Loaded**
   ```tsx
   useEffect(() => {
     if (!window.ml5) {
       console.error('ML5.js not found. Include: https://unpkg.com/ml5@1/dist/ml5.js')
     }
   }, [])
   ```

3. **Poor Gesture Recognition**
   - Ensure good lighting
   - Position hand clearly in frame
   - Adjust `confidenceThreshold`
   - Calibrate for user's hand size

### Debug Mode

Enable debug information:

```tsx
const controls = useGestureControls({}, {
  onGestureDetected: (gesture) => {
    console.log(`Gesture: ${gesture.type} (${gesture.confidence})`)
  }
})

// Show hand landmarks
const { hands } = useHandPose()
hands.forEach(hand => {
  hand.keypoints.forEach((point, index) => {
    console.log(`Landmark ${index}:`, point.x, point.y)
  })
})
```

## 🚀 Future Enhancements

- [ ] Hand pose estimation with 3D coordinates
- [ ] Gesture sequence recognition (e.g., swipe patterns)
- [ ] Multi-user gesture tracking
- [ ] Gesture customization UI
- [ ] Machine learning model fine-tuning
- [ ] Mobile device optimization
- [ ] WebXR/AR integration

## 📚 Examples

Check out the complete examples in the Creative Collection:

1. **Gesture Control Demo** - Interactive object manipulation
2. **Gesture Hooks Guide** - Comprehensive documentation and examples
3. **Integration Examples** - Real-world use cases

## 🤝 Contributing

To extend the gesture recognition system:

1. Add new gesture recognizers in `useGestureRecognition.ts`
2. Implement gesture algorithms using hand landmarks
3. Test with diverse hand sizes and lighting conditions
4. Update documentation with usage examples

## 📄 License

This gesture recognition system is part of the @workspace/ui-components package and follows the same license terms.