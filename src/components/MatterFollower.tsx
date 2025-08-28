'use client'

import { useEffect, useRef } from 'react'
import Matter from 'matter-js'

// @ts-ignore: Plugins may not have types
import MatterAttractors from 'matter-attractors'
// @ts-ignore
import MatterWrap from 'matter-wrap'


export default function MatterFollower() {
  Matter.use(MatterAttractors)
  Matter.use(MatterWrap)
  const canvasRef = useRef<HTMLDivElement>(null)
  const matterInstance = useRef<any>(null)

  // Debounce function
  const debounce = (func: () => void, wait: number) => {
    let timeout: NodeJS.Timeout
    return () => {
      clearTimeout(timeout)
      timeout = setTimeout(func, wait)
    }
  }

  useEffect(() => {
    if (!canvasRef.current) return

    const canvasContainer = canvasRef.current
    const dimensions = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    const {
      Engine,
      Events,
      Runner,
      Render,
      World,
      Body,
      Mouse,
      Common,
      Bodies,
    } = Matter

    const engine = Engine.create()
    const runner = Runner.create()
    const render = Render.create({
      element: canvasContainer,
      engine: engine,
      options: {
        width: dimensions.width,
        height: dimensions.height,
        wireframes: false,
        background: 'transparent',
      },
    })

    engine.world.gravity.scale = 0

    const attractiveBody = Bodies.circle(
      dimensions.width / 2,
      dimensions.height / 2,
      Math.max(dimensions.width / 25, dimensions.height / 25) / 2,
      {
        isStatic: true,
        plugin: {
          attractors: [
            (bodyA: any, bodyB: any) => ({
              x: (bodyA.position.x - bodyB.position.x) * 1e-6,
              y: (bodyA.position.y - bodyB.position.y) * 1e-6,
            }),
          ],
        },
        render: {
          fillStyle: `#000`,
          strokeStyle: `#000`,
          lineWidth: 0,
        },
      }
    )

    World.add(engine.world, attractiveBody)

    for (let i = 0; i < 60; i++) {
      const x = Common.random(0, dimensions.width)
      const y = Common.random(0, dimensions.height)
      const s = Common.random() > 0.6 ? Common.random(10, 80) : Common.random(4, 60)
      const polygonSides = Common.random(3, 6)
      const r = Common.random(0, 1)

      const shapes = [
        // 🪐 Polygon — 70% black, 30% very dark blue
        Bodies.polygon(x + Common.random(-300, 300), y + Common.random(-200, 200), polygonSides, s * 0.65, {
          mass: s / 25,
          friction: 0,
          frictionAir: 0.01,
          angle: Math.random() * Math.PI,
          render: {
            fillStyle: Common.random() < 0.7
              ? Common.choose(['#000000', '#0a0a0a'])         // Black tones
              : Common.choose(['#050b1e', '#0a0f2c']),        // Very dark blue
            strokeStyle: '#ffffff11', // Subtle outer stroke
            lineWidth: 2,
          },
        }),

        // ✨ Star — faint, cold gray tones
        Bodies.circle(x + Common.random(-250, 250), y + Common.random(-250, 250), Common.random(1.6, 3), {
          mass: 0.01,
          friction: 0,
          frictionAir: 0.001,
          render: {
            fillStyle: Common.choose(['#44444422', '#55555533']),
            strokeStyle: '#88888811',
            lineWidth: 1,
          },
        }),

        // 🌌 Core / orb — dark gray/blue only
        Bodies.circle(x + Common.random(-200, 200), y + Common.random(-200, 200), Common.random(7, 12), {
          mass: 1.5,
          friction: 0,
          frictionAir: 0.003,
          render: {
            fillStyle: Common.choose(['#121212', '#1a1f2b']),  // deep gray or steel blue
            strokeStyle: '#33333322',
            lineWidth: 2,
          },
        }),

        // 🛰️ Asteroid — heavy dark gray
        Bodies.circle(x + Common.random(-300, 300), y + Common.random(-300, 300), Common.random(10, 16), {
          mass: 0.7,
          friction: 0.4,
          frictionAir: 0.05,
          render: {
            fillStyle: Common.choose(['#1b1b1b', '#262626']),
            strokeStyle: '#ffffff11',
            lineWidth: 1.5,
          },
        }),
      ]







      shapes.forEach((shape) => World.add(engine.world, shape))
    }

    const mouse = Mouse.create(render.canvas)
    Events.on(engine, 'afterUpdate', () => {
      if (!mouse.position.x) return
      Body.translate(attractiveBody, {
        x: (mouse.position.x - attractiveBody.position.x) * 0.12,
        y: (mouse.position.y - attractiveBody.position.y) * 0.12,
      })
    })

    Runner.run(runner, engine)
    Render.run(render)

    matterInstance.current = { runner, render }

    const handleResize = debounce(() => {
      const w = window.innerWidth
      const h = window.innerHeight
      render.canvas.width = w
      render.canvas.height = h
    }, 250)

    window.addEventListener('resize', handleResize)

    return () => {
      Render.stop(render)
      Runner.stop(runner)
      if (render.canvas.parentNode) {
        render.canvas.parentNode.removeChild(render.canvas)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <div ref={canvasRef} className="absolute inset-0 block md:pointer-events-auto"
    style={{
      background: `radial-gradient(circle at 50% 50%, #0d0d1a 0%, #000000 100%)`,
    }} />
}
