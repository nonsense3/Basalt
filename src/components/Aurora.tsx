export default function Aurora() {
  return (
    <div className="aurora" aria-hidden="true">
      <div className="blade blade-1" />
      <div className="blade blade-2" />
      <div className="blade blade-3" />
      <div className="blade blade-4" />
      <svg className="aurora-grain" xmlns="http://www.w3.org/2000/svg">
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      <div className="aurora-vignette" />
    </div>
  );
}
