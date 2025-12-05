# 🔧 ML5.js Troubleshooting Guide

This guide helps resolve common ML5.js loading and initialization issues that can cause gesture recognition to fail.

## 🚨 Common Error Messages

### 1. "Can only have one anonymous define call per script file"

**Cause:** AMD module loading conflicts, typically when ML5.js is loaded multiple times or conflicts with other libraries.

**Solutions:**
```html
<!-- Option 1: Use the minified version -->
<script src="https://unpkg.com/ml5@1/dist/ml5.min.js"></script>

<!-- Option 2: Load from CDN with specific version -->
<script src="https://cdn.jsdelivr.net/npm/ml5@1.0.5/dist/ml5.min.js"></script>

<!-- Option 3: Use UMD build -->
<script src="https://unpkg.com/ml5@1/dist/ml5.umd.min.js"></script>
```

### 2. "Module.arguments has been replaced with plain arguments_"

**Cause:** WebAssembly module initialization conflict with MediaPipe.

**Solution:** Use TensorFlow.js runtime instead:
```tsx
const handpose = useHandPose({
  runtime: 'tfjs',  // Instead of 'mediapipe'
  maxHands: 2,
  flipHorizontal: true
})
```

### 3. "Aborted(Module.arguments...)" or WASM errors

**Cause:** WebAssembly loading conflicts or browser compatibility issues.

**Solutions:**
1. **Switch to TensorFlow.js runtime:**
   ```tsx
   const options = {
     runtime: 'tfjs',
     modelComplexity: 0,  // Use lighter model
   }
   ```

2. **Add WASM headers (if you control the server):**
   ```
   Cross-Origin-Embedder-Policy: require-corp
   Cross-Origin-Opener-Policy: same-origin
   ```

3. **Use fallback detection:**
   ```tsx
   import { GestureControlFallback } from '@workspace/ui-components'
   ```

## 🛠️ Installation Methods

### Method 1: HTML Script Tag (Recommended)
```html
<!DOCTYPE html>
<html>
<head>
  <!-- Add before your app scripts -->
  <script src="https://unpkg.com/ml5@1/dist/ml5.min.js"></script>
</head>
<body>
  <!-- Your app -->
</body>
</html>
```

### Method 2: Dynamic Loading
```tsx
import { ml5Loader } from '@workspace/ui-components/utils/ml5-loader'

// Load ML5 when needed
const loadGestureRecognition = async () => {
  try {
    await ml5Loader.loadML5({ version: '1.0.5', timeout: 10000 })
    console.log('ML5 loaded successfully')
  } catch (error) {
    console.error('Failed to load ML5:', error)
  }
}
```

### Method 3: NPM Installation
```bash
npm install ml5
```

Then import in your module:
```tsx
import ml5 from 'ml5'

// Make available globally
window.ml5 = ml5
```

## 🌐 Browser Compatibility

### Supported Browsers
- ✅ Chrome 88+
- ✅ Firefox 78+
- ✅ Safari 14+
- ✅ Edge 88+

### Known Issues
- **Safari:** May require additional CORS headers for WASM
- **Firefox:** Older versions may have WebAssembly limitations
- **Mobile browsers:** Performance may be limited

### Browser-Specific Fixes

**Chrome:**
```javascript
// Enable experimental features if needed
chrome://flags/#enable-experimental-web-platform-features
```

**Safari:**
```javascript
// Add to your app initialization
if (navigator.userAgent.includes('Safari')) {
  // Use TensorFlow.js runtime
  const options = { runtime: 'tfjs' }
}
```

**Firefox:**
```javascript
// Check WebAssembly support
if (!window.WebAssembly) {
  console.warn('WebAssembly not supported, using fallback')
  // Use fallback implementation
}
```

## 🔄 Fallback Strategies

### 1. Automatic Fallback
```tsx
import { useHandPose } from '@workspace/ui-components'

const GestureComponent = () => {
  const { hands, error, isLoading } = useHandPose()
  
  if (error) {
    return <GestureControlFallback />
  }
  
  return <GestureControls hands={hands} />
}
```

### 2. Progressive Enhancement
```tsx
const [useML5, setUseML5] = useState(true)

useEffect(() => {
  // Test ML5 availability
  const testML5 = async () => {
    try {
      await ml5Loader.loadML5({ timeout: 5000 })
    } catch (error) {
      setUseML5(false)
    }
  }
  testML5()
}, [])

return useML5 ? <GestureControls /> : <MouseSimulation />
```

### 3. User Choice
```tsx
const [mode, setMode] = useState<'ml5' | 'fallback'>('ml5')

return (
  <div>
    <button onClick={() => setMode('ml5')}>Try ML5</button>
    <button onClick={() => setMode('fallback')}>Use Mouse</button>
    
    {mode === 'ml5' ? <GestureControls /> : <GestureControlFallback />}
  </div>
)
```

## 🚀 Performance Optimization

### 1. Reduce Model Complexity
```tsx
const options = {
  modelComplexity: 0,        // Use lighter model (0, 1)
  detectionConfidence: 0.7,  // Lower confidence threshold
  trackingConfidence: 0.5,   // Lower tracking confidence
  maxHands: 1,              // Track fewer hands
}
```

### 2. Throttle Detection
```tsx
const [throttledHands, setThrottledHands] = useState([])

useEffect(() => {
  const interval = setInterval(() => {
    setThrottledHands(hands)
  }, 100) // Update every 100ms instead of every frame
  
  return () => clearInterval(interval)
}, [hands])
```

### 3. Lazy Loading
```tsx
const [gestureEnabled, setGestureEnabled] = useState(false)

const enableGestures = async () => {
  if (!gestureEnabled) {
    await ml5Loader.loadML5()
    setGestureEnabled(true)
  }
}

return (
  <div>
    {!gestureEnabled ? (
      <button onClick={enableGestures}>Enable Gestures</button>
    ) : (
      <GestureControls />
    )}
  </div>
)
```

## 🐛 Debug Tools

### 1. ML5 Status Monitor
```tsx
import { useML5Status } from '@workspace/ui-components/utils/ml5-loader'

const ML5StatusMonitor = () => {
  const { loaded, loading, error, version } = useML5Status()
  
  return (
    <div className="fixed top-0 right-0 p-4 bg-black text-white">
      <h3>ML5 Status</h3>
      <p>Loaded: {loaded ? '✅' : '❌'}</p>
      <p>Loading: {loading ? '⏳' : '✅'}</p>
      <p>Version: {version || 'Unknown'}</p>
      {error && <p className="text-red-400">Error: {error}</p>}
    </div>
  )
}
```

### 2. Hand Tracking Debug
```tsx
const DebugPanel = ({ hands }) => {
  return (
    <div className="debug-panel">
      <h3>Debug Info:</h3>
      <p>Hands detected: {hands.length}</p>
      {hands.map((hand, i) => (
        <div key={i}>
          <p>Hand {i + 1}: {hand.handedness}</p>
          <p>Confidence: {(hand.score * 100).toFixed(1)}%</p>
          <p>Keypoints: {hand.keypoints?.length || 0}</p>
        </div>
      ))}
    </div>
  )
}
```

### 3. Console Diagnostics
```tsx
// Add to your component for debugging
useEffect(() => {
  console.log('ML5 available:', !!window.ml5)
  console.log('WebAssembly support:', !!window.WebAssembly)
  console.log('MediaDevices support:', !!navigator.mediaDevices)
  console.log('Camera permissions:', navigator.permissions?.query?.({ name: 'camera' }))
}, [])
```

## 🔧 Development Setup

### Vite Configuration
```javascript
// vite.config.js
export default {
  optimizeDeps: {
    exclude: ['ml5'], // Exclude ML5 from optimization
  },
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
}
```

### Webpack Configuration
```javascript
// webpack.config.js
module.exports = {
  externals: {
    ml5: 'ml5', // Treat ML5 as external
  },
  resolve: {
    fallback: {
      fs: false,
      path: false,
    },
  },
}
```

### TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["ml5"],
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  }
}
```

## 📱 Mobile Considerations

### 1. Performance Limitations
```tsx
const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
)

const mobileOptions = {
  maxHands: 1,
  modelComplexity: 0,
  detectionConfidence: 0.8,
}

const options = isMobile ? mobileOptions : desktopOptions
```

### 2. Camera Constraints
```tsx
const mobileVideoConstraints = {
  video: {
    width: { ideal: 640, max: 1280 },
    height: { ideal: 480, max: 720 },
    facingMode: 'user',
    frameRate: { ideal: 15, max: 30 }, // Limit frame rate on mobile
  },
}
```

### 3. Touch Fallback
```tsx
const GestureMobileWrapper = ({ children }) => {
  const [touchMode, setTouchMode] = useState(isMobile)
  
  return touchMode ? <TouchControls /> : <GestureControls />
}
```

## 🚀 Production Deployment

### 1. CDN Configuration
```javascript
// Use stable CDN URLs
const ML5_CDN = 'https://cdn.jsdelivr.net/npm/ml5@1.0.5/dist/ml5.min.js'

// Preload in HTML head
<link rel="preload" href={ML5_CDN} as="script">
```

### 2. Error Reporting
```tsx
const handleML5Error = (error) => {
  // Report to error tracking service
  console.error('ML5 Error:', error)
  
  // Fallback to safe mode
  setUseFallback(true)
  
  // Optional: Show user notification
  showNotification('Gesture recognition unavailable, using fallback mode')
}
```

### 3. Feature Detection
```tsx
const supportsGestureRecognition = () => {
  return !!(
    window.ml5 &&
    navigator.mediaDevices &&
    window.WebAssembly &&
    !isMobile // Optional: disable on mobile
  )
}
```

## 📞 Getting Help

If you're still experiencing issues:

1. **Check the browser console** for specific error messages
2. **Test with the fallback component** to isolate the issue
3. **Try different ML5 versions** (1.0.1, 1.0.5, latest)
4. **Use the debug tools** provided in this guide
5. **Check network connectivity** and CORS settings

## 🔗 Useful Resources

- [ML5.js Official Documentation](https://ml5js.org/)
- [MediaPipe Hands Documentation](https://google.github.io/mediapipe/solutions/hands.html)
- [WebAssembly Browser Support](https://caniuse.com/wasm)
- [Camera API Browser Support](https://caniuse.com/stream)

Remember: When in doubt, use the fallback components provided in this package!