'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface RotatingEarthProps { width?: number; height?: number; className?: string }

export default function RotatingEarth({ width = 800, height = 600, className = '' }: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const [status, setStatus] = useState('Loading globe…');
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const controller = new AbortController();
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => { pausedRef.current = preference.matches; setPaused(preference.matches); };
    updateMotion();
    preference.addEventListener('change', updateMotion);
    let size = 1, canvasHeight = 1, radius = 1, zoom = 1;
    let land: d3.ExtendedFeatureCollection | null = null;
    const dots: [number, number][] = [];
    const rotation: [number, number] = [0, -15];
    let dragging = false, previousX = 0, previousY = 0;
    const projection = d3.geoOrthographic().clipAngle(90);
    const path = d3.geoPath(projection, context);
    const graticule = d3.geoGraticule10();
    const render = () => {
      context.clearRect(0, 0, size, canvasHeight);
      projection.rotate(rotation).scale(radius * zoom).translate([size / 2, canvasHeight / 2]);
      context.beginPath(); path({ type: 'Sphere' });
      context.fillStyle = '#090909'; context.fill();
      context.strokeStyle = '#ddd'; context.lineWidth = 1; context.stroke();
      context.beginPath(); path(graticule); context.strokeStyle = '#ffffff40'; context.stroke();
      if (land) {
        context.beginPath(); path(land); context.strokeStyle = '#eee'; context.lineWidth = .7; context.stroke();
        const center: [number, number] = [-rotation[0], -rotation[1]];
        context.fillStyle = '#999';
        for (const dot of dots) {
          if (d3.geoDistance(dot, center) >= Math.PI / 2) continue;
          const point = projection(dot);
          if (!point) continue;
          context.beginPath(); context.arc(point[0], point[1], Math.max(.6, radius / 180) * zoom, 0, Math.PI * 2); context.fill();
        }
      }
    };
    const resize = () => {
      size = Math.min(width, canvas.parentElement!.clientWidth);
      canvasHeight = size * height / width;
      radius = Math.min(size, canvasHeight) / 2.5;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(size * dpr); canvas.height = Math.round(canvasHeight * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0); render();
    };
    const observer = new ResizeObserver(resize); observer.observe(canvas.parentElement!); resize();
    const pointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
      const [x, y] = point
      let inside = false

      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i]
        const [xj, yj] = polygon[j]

        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside
        }
      }

      return inside
    }

    const pointInFeature = (point: [number, number], feature: any): boolean => {
      const geometry = feature.geometry

      if (geometry.type === "Polygon") {
        const coordinates = geometry.coordinates
        // Check if point is in outer ring
        if (!pointInPolygon(point, coordinates[0])) {
          return false
        }
        // Check if point is in any hole (inner rings)
        for (let i = 1; i < coordinates.length; i++) {
          if (pointInPolygon(point, coordinates[i])) {
            return false // Point is in a hole
          }
        }
        return true
      } else if (geometry.type === "MultiPolygon") {
        // Check each polygon in the MultiPolygon
        for (const polygon of geometry.coordinates) {
          // Check if point is in outer ring
          if (pointInPolygon(point, polygon[0])) {
            // Check if point is in any hole
            let inHole = false
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) {
                inHole = true
                break
              }
            }
            if (!inHole) {
              return true
            }
          }
        }
        return false
      }

      return false
    }

    fetch('/data/land.json', { signal: controller.signal }).then(response => {
      if (!response.ok) throw new Error('Map unavailable');
      return response.json() as Promise<d3.ExtendedFeatureCollection>;
    }).then(data => {
      if (controller.signal.aborted) return;
      land = data;
      for (let lng = -180; lng < 180; lng += 1.6) {
        for (let lat = -85; lat < 85; lat += 1.6) {
          if (data.features.some((feature: Parameters<typeof pointInFeature>[1]) => pointInFeature([lng, lat], feature))) dots.push([lng, lat]);
        }
      }
      setStatus(''); render();
    }).catch(() => { if (!controller.signal.aborted) setStatus('The globe map could not load. Please refresh to try again.'); });
    let previousTime = 0;
    const timer = d3.timer(elapsed => {
      const delta = Math.min(elapsed - previousTime, 50); previousTime = elapsed;
      if (!pausedRef.current && !dragging && !document.hidden) { rotation[0] += delta * .006; render(); }
    });
    const down = (event: PointerEvent) => { dragging = true; previousX = event.clientX; previousY = event.clientY; canvas.setPointerCapture(event.pointerId); };
    const move = (event: PointerEvent) => {
      if (!dragging) return;
      rotation[0] += (event.clientX - previousX) * .4;
      rotation[1] = Math.max(-85, Math.min(85, rotation[1] - (event.clientY - previousY) * .4));
      previousX = event.clientX; previousY = event.clientY; render();
    };
    const up = () => { dragging = false; };
    const wheel = (event: WheelEvent) => { event.preventDefault(); zoom = Math.max(.6, Math.min(2.2, zoom * (event.deltaY > 0 ? .9 : 1.1))); render(); };
    const key = (event: KeyboardEvent) => {
      if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-'].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'ArrowLeft') rotation[0] -= 8;
      if (event.key === 'ArrowRight') rotation[0] += 8;
      if (event.key === 'ArrowUp') rotation[1] = Math.max(-85, rotation[1] - 8);
      if (event.key === 'ArrowDown') rotation[1] = Math.min(85, rotation[1] + 8);
      if (event.key === '+') zoom = Math.min(2.2, zoom * 1.1);
      if (event.key === '-') zoom = Math.max(.6, zoom / 1.1);
      render();
    };
    canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('lostpointercapture', up); canvas.addEventListener('wheel', wheel, { passive: false });
    canvas.addEventListener('keydown', key);
    return () => {
      controller.abort(); observer.disconnect(); timer.stop(); preference.removeEventListener('change', updateMotion);
      canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up);
      canvas.removeEventListener('lostpointercapture', up); canvas.removeEventListener('wheel', wheel); canvas.removeEventListener('keydown', key);
    };
  }, [width, height]);
  return <figure className={`dotted-globe ${className}`}>
    <canvas ref={canvasRef} tabIndex={0} role="img" aria-label="Rotating dotted world globe. Drag or use arrow keys to rotate; scroll or use plus and minus to zoom." style={{ aspectRatio: `${width} / ${height}` }} />
    {status && <p role="status">{status}</p>}
    <figcaption><span>Drag to rotate · Scroll to zoom</span><button type="button" aria-pressed={paused} onClick={() => { pausedRef.current = !paused; setPaused(!paused); }}>{paused ? 'Resume rotation' : 'Pause rotation'}</button></figcaption>
  </figure>;
}
