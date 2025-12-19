import { useEffect, useRef, useState } from 'react'
import { createAutoRegisterComponent, CATEGORIES } from '../../auto-register'
import { WebGLRenderer, PerspectiveCamera, Scene } from 'three'
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LumaSplatsThree } from '@lumaai/luma-web'

interface LumaDemoProps {
    width?: number
    height?: number
    splatsUrl?: string
}

function LumaDemo({
    width = 800,
    height = 600,
    splatsUrl = 'https://lumalabs.ai/capture/decb0344-6455-4189-934f-8bd1f6a4fe2e'
}: LumaDemoProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const rendererRef = useRef<WebGLRenderer>()
    const sceneRef = useRef<Scene>()
    const cameraRef = useRef<PerspectiveCamera>()
    const controlsRef = useRef<OrbitControls>()
    const splatRef = useRef<LumaSplatsThree | null>(null)

    useEffect(() => {
        if (!canvasRef.current || splatRef.current) return
        const canvas = canvasRef.current
        const renderer = new WebGLRenderer({
            canvas: canvas,
            antialias: false
        })
        renderer.setSize(width, height, false)
        rendererRef.current = renderer

        const scene = new Scene()
        sceneRef.current = scene

        const camera = new PerspectiveCamera(75, width / height, 0.1, 1000)
        camera.position.set(0, 0, 10)
        camera.lookAt(0, 0, 0)
        cameraRef.current = camera

        const controls = new OrbitControls(camera, canvas)
        controls.enableDamping = true
        controls.dampingFactor = 0.25
        controls.target.set(0, 0, 0)
        controlsRef.current = controls
        splatRef.current = new LumaSplatsThree({
            source: splatsUrl,
            onBeforeRender(renderer, scene, camera, splats) {
            },
        })
        splatRef.current.onLoad = () => {
        }
        splatRef.current.onProgress = e => {
        }
        scene.add(splatRef.current)
        renderer.setAnimationLoop(() => {
            let width = canvas.clientWidth;
            let height = canvas.clientHeight;
            if (canvas.width !== width || canvas.height !== height) {
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height, false);
            }
            controls.update();
            renderer.render(scene, camera);
        });
        return () => {
            // controls.dispose()
            // renderer.dispose()
        }
    }, [width, height, splatsUrl])

    return (
        <div className="flex flex-col items-center p-4">
            <h3 className="text-lg font-semibold mb-4">Luma Splats Demo</h3>
            <div
                className="border border-gray-300 rounded-lg overflow-hidden relative"
                style={{ width: `${width}px`, height: `${height}px` }}
            >
                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    className="block"
                />
            </div>
            <p className="text-sm text-gray-600 mt-2 max-w-md text-center">
                Use mouse to orbit around the 3D Gaussian splat. Drag to rotate, scroll to zoom.
            </p>
        </div>
    )
}

const RegisteredLumaDemo = createAutoRegisterComponent({
    id: 'luma-demo',
    name: 'LumaDemo',
    description: 'Interactive 3D Gaussian splats viewer using Luma AI technology',
    category: CATEGORIES.UI,
    template: `:::react{component="LumaDemo"}\n:::\n\nWith custom settings:\n:::react{component="LumaDemo" width="1000" height="600" splatsUrl="your-custom-url"}\n:::`,
})(LumaDemo)

export { RegisteredLumaDemo as LumaDemo }