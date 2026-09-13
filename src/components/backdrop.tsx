export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-void" />
      <div className="absolute inset-0 grid-noise" />
      <div className="absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-soul-600/25 blur-[140px] animate-pulse-soft" />
      <div className="absolute top-1/3 -left-32 h-[30rem] w-[30rem] rounded-full bg-ember/10 blur-[130px]" />
      <div className="absolute bottom-0 -right-24 h-[34rem] w-[34rem] rounded-full bg-soul-700/25 blur-[140px]" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-void to-transparent" />
    </div>
  );
}
