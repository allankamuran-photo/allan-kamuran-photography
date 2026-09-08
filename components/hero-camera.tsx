'use client';

import { useEffect, useState } from 'react';

const modelUrl = 'https://sketchfab.com/3d-models/sony-a7-257d4f000e664da880d70d3bcdce1c8c';

export default function HeroCamera() {
  const [rotating, setRotating] = useState<boolean | null>(null);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setRotating(!preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  return <figure className="hero-camera">
    <div className="hero-camera-viewer">
      {rotating !== null && <iframe
        title="Interactive 3D Sony A7 camera"
        src={`https://sketchfab.com/models/257d4f000e664da880d70d3bcdce1c8c/embed?autostart=1&autospin=${rotating ? '0.15' : '0'}&transparent=1`}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
      />}
    </div>
    <figcaption>
      <span>Always looking a little closer.</span>
      <button type="button" onClick={() => setRotating(value => !value)} aria-pressed={rotating === true}>
        {rotating ? 'Pause rotation' : 'Rotate camera'}
      </button>
      <small><a href={modelUrl} target="_blank" rel="noreferrer">Sony A7</a> by <a href="https://sketchfab.com/aljasib1337" target="_blank" rel="noreferrer">john6ooth</a> on Sketchfab</small>
    </figcaption>
  </figure>;
}
