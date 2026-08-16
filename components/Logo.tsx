export default function Logo() {
  return (
    <div className="logo">
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <linearGradient id="romeo-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#ff3d71" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <path
          fill="url(#romeo-gradient)"
          d="M8 7.5A4.5 4.5 0 0 1 12.5 3h15C35.5 3 41 8.1 41 15c0 4.7-2.6 8.3-6.9 10.3L43 41H31.5l-7.1-13H19v13H8V7.5Zm11 4.6v8h7.2c2.5 0 4-1.5 4-4s-1.5-4-4-4H19Z"
        />
      </svg>
      <span>Romeo <b>Flix</b></span>
    </div>
  );
}
