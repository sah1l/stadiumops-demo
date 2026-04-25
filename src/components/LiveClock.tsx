import { useEffect, useState } from "react";

function fmt(d: Date): { time: string; date: string } {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  const day = d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
  return { time: `${hh}:${mm}:${ss}`, date: day.toUpperCase() };
}

export default function LiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const { time, date } = fmt(now);
  return (
    <div className="text-right">
      <div className="text-[9px] font-mono tracking-[0.3em] text-slate-500">
        {date} · IST
      </div>
      <div className="text-base font-mono font-semibold text-brand-gold tabular leading-none mt-0.5">
        {time}
      </div>
    </div>
  );
}
