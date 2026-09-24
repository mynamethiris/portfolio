"use client";

import { useLayoutEffect, useRef, useState } from "react";

// Text badge that marquees only when the text overflows its container.
export default function OverflowMarquee({
  text,
  outerClassName = "",
  duplicateGap = "pr-8",
}: {
  text: string;
  outerClassName?: string;
  duplicateGap?: string;
}) {
  const outerRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const [overflow, setOverflow] = useState(false);
  const overflowRef = useRef(false);

  useLayoutEffect(() => {
    let cancelled = false;

    const check = () => {
      if (cancelled) return;
      const o = outerRef.current;
      const inner = innerRef.current;
      if (!o || !inner) return;
      if (o.clientWidth === 0) return;
      const cs = getComputedStyle(o);
      const avail = o.clientWidth - parseFloat(cs.paddingLeft || "0") - parseFloat(cs.paddingRight || "0");
      if (avail <= 0) return;
      const probe = overflowRef.current
        ? (inner.firstElementChild as HTMLElement | null)
        : inner;
      const width = probe ? probe.scrollWidth : inner.scrollWidth;
      const need = width > avail + 1;
      if (need !== overflowRef.current) {
        overflowRef.current = need;
        setOverflow(need);
      }
    };

    overflowRef.current = false;
    setOverflow(false);
    check();
    const ro = new ResizeObserver(check);
    if (outerRef.current) ro.observe(outerRef.current);
    window.addEventListener("resize", check);
    if (document.fonts?.ready) {
      document.fonts.ready.then(check).catch(() => {});
    }
    const t = setTimeout(check, 300);
    return () => {
      cancelled = true;
      ro.disconnect();
      window.removeEventListener("resize", check);
      clearTimeout(t);
    };
  }, [text]);

  return (
    <span
      ref={outerRef}
      className={`${outerClassName} overflow-hidden ${overflow ? "badge-marquee-mask" : ""}`}
    >
      {overflow ? (
        <>
          <span ref={innerRef} className="badge-marquee inline-flex whitespace-nowrap" aria-hidden="true">
            <span className={duplicateGap}>{text}</span>
            <span aria-hidden="true" className={duplicateGap}>{text}</span>
          </span>
          <span className="sr-only">{text}</span>
        </>
      ) : (
        <span ref={innerRef} className="block truncate">
          {text}
        </span>
      )}
    </span>
  );
}
