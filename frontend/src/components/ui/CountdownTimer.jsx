// src/components/ui/CountdownTimer.jsx — Hot Deals countdown
import React, { useState, useEffect } from "react";

const CountdownTimer = ({ targetHours = 5, targetMinutes = 30, targetSeconds = 0 }) => {
  const [secs, setSecs] = useState(targetHours * 3600 + targetMinutes * 60 + targetSeconds);

  useEffect(() => {
    if (secs <= 0) return;
    const id = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const h = String(Math.floor(secs / 3600)).padStart(2, "0");
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");

  return (
    <div className="d-flex align-items-center gap-1">
      <span className="lx-deal-digit">{h}</span>
      <span className="lx-deal-sep">:</span>
      <span className="lx-deal-digit">{m}</span>
      <span className="lx-deal-sep">:</span>
      <span className="lx-deal-digit">{s}</span>
    </div>
  );
};

export default CountdownTimer;
