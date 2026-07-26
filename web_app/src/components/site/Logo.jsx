export default function Logo({ size = 32 }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-[10px] shadow-[0_6px_16px_rgba(99,102,241,0.35)]"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
      }}
    >
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2C8.5 2 6 4.2 6 7.5c0 2.1.6 3.3 1.1 4.9.5 1.6.9 3.6.9 6.6 0 1.4.8 2.5 1.8 2.5.9 0 1.5-.8 1.7-2.1.2-1.5.3-3.4 1-3.4s.8 1.9 1 3.4c.2 1.3.8 2.1 1.7 2.1 1 0 1.8-1.1 1.8-2.5 0-3 .4-5 .9-6.6.5-1.6 1.1-2.8 1.1-4.9C18 4.2 15.5 2 12 2Z"
          stroke="white"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
