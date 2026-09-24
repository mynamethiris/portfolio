// GitHub contribution graph built from recent public events.
"use client";

import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect, useCallback } from "react";
import SectionWrapper from "./ui/SectionWrapper";
import { useLang } from "@/lib/i18n";
import { GithubLogo } from "@phosphor-icons/react/dist/csr/GithubLogo";
import { ArrowUpRight } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { ArrowClockwise } from "@phosphor-icons/react/dist/csr/ArrowClockwise";
import { GITHUB_USERNAME } from "@/lib/site";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

function getLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 8) return 3;
  return 4;
}

const LEVEL_COLORS = [
  "bg-white/[0.04]",
  "bg-emerald-900/60",
  "bg-emerald-700/70",
  "bg-emerald-500/80",
  "bg-emerald-400",
];

const MONTH_LABELS_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const MONTH_LABELS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_LABELS_ID = ["", "Sen", "", "Rab", "", "Jum", ""];
const DAY_LABELS_EN = ["", "Mon", "", "Wed", "", "Fri", ""];

// Local-date key (YYYY-MM-DD in the viewer's timezone) so aggregation and
// labels never disagree by a day for users far from UTC.
function localKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function buildEmptyYear(): ContributionDay[] {
  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const daysArray: ContributionDay[] = [];
  const d = new Date(oneYearAgo);
  while (d <= now) {
    daysArray.push({ date: localKey(d), count: 0, level: 0 });
    d.setDate(d.getDate() + 1);
  }
  return daysArray;
}

function isContributionDay(value: unknown): value is ContributionDay {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.date === "string" &&
    typeof v.count === "number" &&
    (v.level === 0 || v.level === 1 || v.level === 2 || v.level === 3 || v.level === 4)
  );
}

function ContributionGrid({ days, lang, summaryLabel }: { days: ContributionDay[]; lang: "id" | "en"; summaryLabel: string }) {
  const [tooltip, setTooltip] = useState<{ day: ContributionDay; x: number; y: number } | null>(null);

  // Group days into weeks
  const weeks: ContributionDay[][] = [];
  let currentWeek: ContributionDay[] = [];

  // Pad start to align with correct day of week
  const firstDay = new Date(days[0]?.date || "");
  const startDow = (firstDay.getDay() + 6) % 7; // Monday=0
  for (let i = 0; i < startDow; i++) {
    currentWeek.push({ date: "", count: 0, level: 0 });
  }

  days.forEach((day) => {
    const d = new Date(day.date);
    const dow = (d.getDay() + 6) % 7;
    if (dow === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });
  if (currentWeek.length > 0) weeks.push(currentWeek);

  // Month labels
  const MONTH_LABELS = lang === "id" ? MONTH_LABELS_ID : MONTH_LABELS_EN;
  const DAY_LABELS = lang === "id" ? DAY_LABELS_ID : DAY_LABELS_EN;
  const monthPositions: { label: string; weekIdx: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const firstDayOfWeek = week.find((d) => d.date);
    if (firstDayOfWeek) {
      const m = new Date(firstDayOfWeek.date).getMonth();
      if (m !== lastMonth) {
        monthPositions.push({ label: MONTH_LABELS[m], weekIdx: i });
        lastMonth = m;
      }
    }
  });

  // The grid is decorative for assistive tech: one focusable summary plus a
  // mouse tooltip, instead of 365 unreachable cells.
  return (
    <div
      className="w-full overflow-x-auto scrollbar-none -mx-1 px-1 rounded-lg"
      role="img"
      aria-label={summaryLabel}
      tabIndex={0}
    >
      <div aria-hidden="true" className="inline-flex flex-col gap-1.5 min-w-max">
        {/* Month labels */}
        <div className="flex ml-7 gap-0">
          {monthPositions.map((mp, i) => (
            <div
              key={`${mp.label}-${mp.weekIdx}`}
              className="text-[10px] font-mono text-[var(--color-text-muted)] whitespace-nowrap"
              style={{ marginLeft: mp.weekIdx === 0 || i === 0 ? 0 : `${(mp.weekIdx - (monthPositions[i - 1]?.weekIdx ?? 0)) * 13 - 12}px` }}
            >
              {mp.label}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-0">
          {/* Day labels */}
          <div className="hidden sm:flex flex-col gap-[3px] mr-1.5">
            {DAY_LABELS.map((label, i) => (
              <div key={`${label || "blank"}-${i}`} className="text-[9px] font-mono text-[var(--color-text-muted)] h-[10px] leading-[10px] w-7 text-right">
                {label}
              </div>
            ))}
          </div>

          {/* Weeks */}
          <div className="flex gap-[3px]">
            {weeks.map((week, wi) => {
              const weekKey = week.find((d) => d.date)?.date || `pad-${wi}`;
              return (
                <div key={weekKey} className="flex flex-col gap-[3px]">
                  {week.map((day, di) => (
                    <div
                      key={day.date || `${weekKey}-pad-${di}`}
                      className={`w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] rounded-[2px] ${LEVEL_COLORS[day.level]} transition-colors duration-150 cursor-default ${day.date ? "hover:ring-1 hover:ring-white/20" : ""}`}
                      onMouseEnter={(e) => {
                        if (!day.date) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({ day, x: rect.left + rect.width / 2, y: rect.top - 8 });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-2.5 py-1.5 rounded-lg glass text-[11px] font-mono text-[var(--color-text-primary)] pointer-events-none whitespace-nowrap max-w-[90vw] overflow-hidden text-ellipsis"
          style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, -100%)" }}
        >
          {lang === "id"
            ? `${tooltip.day.count} kontribusi pada ${new Date(tooltip.day.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`
            : `${tooltip.day.count} contributions on ${new Date(tooltip.day.date).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}`}
        </div>
      )}
    </div>
  );
}

export default function GitHubActivity() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t, lang } = useLang();
  const [days, setDays] = useState<ContributionDay[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchContributions = useCallback(async (signal: AbortSignal) => {
    const cacheKey = `gh-activity-${GITHUB_USERNAME}`;
    setLoading(true);
    setError(false);
    try {
      try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          const parsed: unknown = JSON.parse(cached);
          if (
            typeof parsed === "object" &&
            parsed !== null &&
            Array.isArray((parsed as Record<string, unknown>).days) &&
            typeof (parsed as Record<string, unknown>).at === "number" &&
            typeof (parsed as Record<string, unknown>).total === "number" &&
            Date.now() - ((parsed as Record<string, unknown>).at as number) < 3600_000
          ) {
            const cache = parsed as { days: unknown[]; total: number };
            const validDays = cache.days.filter(isContributionDay);
            if (validDays.length > 0) {
              if (signal.aborted) return;
              setDays(validDays);
              setTotal(cache.total);
              setLoading(false);
              return;
            }
          }
        }
      } catch {}
      // Fetch recent events from GitHub API
      const res = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`,
        { headers: { "User-Agent": "portfolio-builder" }, signal }
      );
      if (!res.ok) throw new Error(`GitHub API responded with status ${res.status}`);

      const events: unknown = await res.json();
      if (!Array.isArray(events)) throw new Error("Unexpected GitHub API response shape");

      // Aggregate contributions by date (last 365 days, local dates)
      const now = new Date();
      const oneYearAgo = new Date(now);
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const counts: Record<string, number> = {};

      // Initialize all days
      const d = new Date(oneYearAgo);
      while (d <= now) {
        counts[localKey(d)] = 0;
        d.setDate(d.getDate() + 1);
      }

      // Count events
      let totalCommits = 0;
      events.forEach((item) => {
        if (typeof item !== "object" || item === null) return;
        const event = item as Record<string, unknown>;
        const created = typeof event.created_at === "string" ? event.created_at : "";
        const createdDate = new Date(created);
        if (Number.isNaN(createdDate.getTime())) return;
        const date = localKey(createdDate);
        if (counts[date] !== undefined) {
          const type = event.type;
          if (type === "PushEvent") {
            const payload = event.payload;
            const commits =
              typeof payload === "object" && payload !== null && Array.isArray((payload as Record<string, unknown>).commits)
                ? (payload as Record<string, unknown>).commits as unknown[]
                : [];
            counts[date] += commits.length;
            totalCommits += commits.length;
          } else if (type === "CreateEvent" || type === "DeleteEvent" || type === "IssuesEvent" || type === "PullRequestEvent") {
            counts[date] += 1;
            totalCommits += 1;
          }
        }
      });

      // Convert to array
      const daysArray: ContributionDay[] = Object.entries(counts).map(([date, count]) => ({
        date,
        count,
        level: getLevel(count),
      }));

      if (signal.aborted) return;
      setDays(daysArray);
      setTotal(totalCommits);
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), days: daysArray, total: totalCommits }));
      } catch {}
    } catch (err) {
      if (signal.aborted) return;
      console.warn("[GitHubActivity] Failed to fetch contributions:", err);
      // Honest empty state: show the grid shape but flag the failure so a
      // network error is never misread as "0 contributions".
      setDays(buildEmptyYear());
      setTotal(0);
      setError(true);
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10000);
    fetchContributions(ctrl.signal);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [fetchContributions]);

  const retry = () => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10000);
    fetchContributions(ctrl.signal).finally(() => clearTimeout(timer));
  };

  const summaryLabel =
    lang === "id"
      ? `${total} kontribusi dalam setahun terakhir di GitHub`
      : `${total} contributions in the last year on GitHub`;

  return (
    <SectionWrapper id="aktivitas">
      <div ref={ref} className="flex flex-col gap-8">
        {/* Header */}
        <div>
          <motion.div
            className="flex items-center gap-3 mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">{t.github.num}</span>
            <span className="w-12 h-px bg-white/10" />
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-balance"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            {t.github.title}
          </motion.h2>
        </div>

        {/* Contribution card */}
        <motion.div
          className="glass glass-inner-highlight rounded-2xl p-4 sm:p-6 lg:p-8 overflow-hidden"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <div className="flex flex-col gap-5">
            {/* Stats row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="glass rounded-xl p-2.5 shrink-0" aria-hidden="true">
                  <GithubLogo size={20} className="text-[var(--color-text-secondary)]" />
                </div>
                <div className="min-w-0">
                  {error && !loading ? (
                    <p className="text-sm font-semibold leading-snug">{t.github.error}</p>
                  ) : (
                    <p className="text-sm font-semibold leading-snug">{total} {t.github.year}</p>
                  )}
                  <p className="text-xs text-[var(--color-text-muted)] font-mono truncate">@{GITHUB_USERNAME}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                {error && !loading && (
                  <button
                    type="button"
                    onClick={retry}
                    className="glass rounded-full px-4 py-2 text-xs font-mono text-[var(--color-text-secondary)] inline-flex items-center gap-1.5 hover:text-[var(--color-text-primary)] transition-colors whitespace-nowrap"
                  >
                    <ArrowClockwise size={12} aria-hidden="true" /> {t.github.retry}
                  </button>
                )}
                <a
                  href={`https://github.com/${GITHUB_USERNAME}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass rounded-full px-4 py-2 text-xs font-mono text-[var(--color-text-secondary)] flex items-center justify-center sm:justify-start gap-1.5 hover:text-[var(--color-text-primary)] transition-colors whitespace-nowrap"
                >
                  {t.github.profile}
                  <ArrowUpRight size={12} aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Contribution grid */}
            {loading ? (
              <div className="flex items-center justify-center py-8" role="status" aria-label={t.github.title}>
                <div className="w-5 h-5 border-2 border-white/10 border-t-white/50 rounded-full animate-spin" />
              </div>
            ) : (
              <ContributionGrid days={days} lang={lang} summaryLabel={summaryLabel} />
            )}

            {/* Legend */}
            <div className="flex items-center justify-end gap-1.5 text-[10px] font-mono text-[var(--color-text-muted)]" aria-hidden="true">
              <span>{t.github.less}</span>
              {LEVEL_COLORS.map((color, i) => (
                <div key={`level-${i}`} className={`w-[10px] h-[10px] rounded-[2px] ${color}`} />
              ))}
              <span>{t.github.more}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
