"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useToastStore } from "@/store/use-toast-store";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Calendar, Plus, Play, Check, X, Clock3, ChevronRight, ChevronLeft, Target, Sparkles } from "lucide-react";
import { useCalendarStore } from "@/store/use-calendar-store";
import { IDBManager } from "@/lib/repository/storage/idb-manager";
import { toLocalDateStr, formatTime12h } from "@/lib/utils";
import { useTargetYear } from "@/store/use-auth-store";
import { examDateFor } from "@/lib/goals/exam-year";
import { CalendarEvent } from "@/types/calendar.types";
import { CompactCalendarView } from "./compact-calendar-view";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { DatePicker } from "@/components/ui/date-picker";
import { RadialGauge } from "@/components/ui/interactive";

const TARGET_EXAM_DATE_KEY = "target_exam_date";
const QUICK_TYPE_OPTIONS = [
  { label: "Study", value: "Study" },
  { label: "Revision", value: "Revision" },
  { label: "Mock Test", value: "Mock Test" },
  { label: "Mistakes", value: "Mistakes" },
  { label: "Bookmarks", value: "Bookmarks" },
];

export function CalendarQuickPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { events, loadEvents, addEvent, updateEvent } = useCalendarStore();
  const [isAdding, setIsAdding] = useState(false);
  const [quickTitle, setQuickTitle] = useState("");
  const [quickType, setQuickType] = useState<CalendarEvent["studyType"]>("Study");
  const targetYear = useTargetYear();
  const [savedExamDate, setSavedExamDate] = useState<string | null>(null);
  const examDate = examDateFor(targetYear, savedExamDate);
  const [editingExamDate, setEditingExamDate] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadEvents();
    IDBManager.getMetadata(TARGET_EXAM_DATE_KEY).then(rec => {
      if (rec?.value) setSavedExamDate(String(rec.value));
    });
  }, [loadEvents]);

  useEffect(() => {
    if (isAdding) inputRef.current?.focus();
  }, [isAdding]);

  const todayStr = toLocalDateStr();
  const weekAheadStr = toLocalDateStr(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

  const todayEvents = useMemo(
    () => events.filter(e => e.date === todayStr).sort((a, b) => (a.startTime || "").localeCompare(b.startTime || "")),
    [events, todayStr]
  );

  const overdueCount = useMemo(
    () => events.filter(e => e.date < todayStr && e.status !== "Completed" && e.status !== "Cancelled").length,
    [events, todayStr]
  );

  const upcomingCount = useMemo(
    () => events.filter(e => e.date > todayStr && e.date <= weekAheadStr && e.status !== "Completed").length,
    [events, todayStr, weekAheadStr]
  );

  const todayDone = todayEvents.filter((e) => e.completed).length;
  const todayPct = todayEvents.length ? Math.round((todayDone / todayEvents.length) * 100) : 0;

  const daysToExam = examDate
    ? Math.round((new Date(examDate + "T00:00:00").getTime() - new Date(todayStr + "T00:00:00").getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const handleSaveExamDate = async (value: string) => {
    // The countdown follows the target year; a date in another year would be ignored,
    // so say so instead of silently not applying it.
    if (!value.startsWith(String(targetYear))) {
      setEditingExamDate(false);
      useToastStore.getState().show(`Pick a date in ${targetYear}, your target GATE year. Change the year on your profile.`, "error");
      return;
    }
    setSavedExamDate(value);
    setEditingExamDate(false);
    await IDBManager.setMetadata(TARGET_EXAM_DATE_KEY, value);
  };

  const handleQuickAdd = async () => {
    if (!quickTitle.trim()) return;
    await addEvent({
      id: crypto.randomUUID(),
      title: quickTitle.trim(),
      description: "",
      category: quickType === "Revision" ? "Revision" : quickType === "Mock Test" ? "Mock Test" : "Study",
      date: todayStr,
      color: "#6366f1",
      priority: "Medium",
      completed: false,
      studyType: quickType,
      timeRangeType: "date_only",
      revisionCycle: "One Time",
      status: "Pending",
    });
    setQuickTitle("");
    setIsAdding(false);
  };

  const handleToggleComplete = async (e: CalendarEvent) => {
    const nextCompleted = !e.completed;
    await updateEvent(e.id, { completed: nextCompleted, status: nextCompleted ? "Completed" : "Pending" });
  };

  const handleLaunch = (e: CalendarEvent) => {
    onClose();
    const type = e.studyType;
    if (type === "Revision") router.push("/revision");
    else if (type === "Mistakes") router.push("/mistakes");
    else if (type === "Bookmarks") router.push("/bookmarks");
    else router.push("/setup");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className={`nav-cluster fixed sm:absolute left-4 right-4 sm:left-auto top-16 sm:top-full sm:right-0 mt-0 sm:mt-2 rounded-2xl shadow-[0_30px_80px_-24px_rgba(76,29,149,0.45)] z-50 transition-[width] duration-200 ${
        isExpanded ? "sm:w-[min(520px,calc(100vw-2rem))]" : "sm:w-[360px]"
      }`}
    >
      {/* Header — clips its own decorative blur + matches the panel's rounded top corners.
          The outer panel itself must NOT clip (overflow-hidden), or the quick-add
          CustomDropdown's popover list — absolutely positioned within this panel —
          gets cut off and never appears. */}
      <div className="relative overflow-hidden rounded-t-2xl p-4 flex items-center justify-between gap-2 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600">
        <motion.div aria-hidden="true" className="absolute -top-10 -right-8 w-32 h-32 bg-cyan-300/25 rounded-full blur-2xl pointer-events-none" animate={{ x: [0, -15, 0], y: [0, 10, 0] }} transition={{ duration: 8, repeat: Infinity }} />
        <div className="relative flex items-center gap-2.5">
          {isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 -ml-1 mr-1 text-white/70 hover:text-white rounded-md hover:bg-white/10 transition-colors cursor-pointer"
              title="Back to quick view"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
          {isExpanded ? (
            <Calendar className="w-4 h-4 text-white" />
          ) : (
            <span className="w-10 h-11 rounded-xl bg-white text-center shadow-md overflow-hidden flex flex-col shrink-0" aria-hidden="true">
              <span className="block bg-rose-500 text-[8px] font-bold uppercase tracking-wider text-white py-0.5">{new Date().toLocaleDateString(undefined, { month: "short" })}</span>
              <span className="flex-1 flex items-center justify-center text-base font-bold font-num text-slate-900 leading-none">{new Date().getDate()}</span>
            </span>
          )}
          <div className="min-w-0">
            <span className="block font-bold text-sm text-white leading-tight">
              {isExpanded ? "Study planner" : "Today's plan"}
            </span>
            {!isExpanded && (
              <span className="block text-[11px] text-white/75">
                {todayEvents.length === 0 ? "Nothing scheduled" : <><span className="font-num font-semibold text-white">{todayDone}</span> of {todayEvents.length} done</>}
              </span>
            )}
          </div>
        </div>
        {!isExpanded && (
          <div className="relative flex items-center gap-2.5">
            {todayEvents.length > 0 && (
              <RadialGauge value={todayPct} size={40} stroke={4} from="#a7f3d0" to="#fde68a" track="#fff" trackOpacity={0.2}>
                <span className="text-[10px] font-bold font-num text-white">{todayPct}%</span>
              </RadialGauge>
            )}
            <button
              onClick={() => setIsExpanded(true)}
              className="group flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-[11px] font-semibold text-white transition-colors cursor-pointer"
            >
              Full planner <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        )}
      </div>

      {isExpanded ? (
        <CompactCalendarView onClose={onClose} />
      ) : (
        <>
      {/* Exam countdown */}
      <div className="px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--surface)] flex items-center justify-between relative z-10">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text-secondary)]">
          <Target className="w-3.5 h-3.5 text-rose-500" />
          GATE {targetYear}
        </div>
        {editingExamDate ? (
          <DatePicker
            compact
            autoOpen
            value={examDate || ""}
            onChange={(v) => handleSaveExamDate(v)}
            onClose={() => setEditingExamDate(false)}
          />
        ) : (
          <button
            onClick={() => setEditingExamDate(true)}
            className={`text-[10px] font-black font-num px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
              daysToExam === null
                ? "text-[var(--text-primary)] hover:text-indigo-500"
                : daysToExam < 0
                ? "bg-[var(--surface-secondary)] text-[var(--text-muted)]"
                : daysToExam <= 14
                ? "bg-rose-500/10 text-rose-500"
                : daysToExam <= 45
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {daysToExam !== null ? (daysToExam >= 0 ? `${daysToExam} days left` : "Date passed") : "Set date"}
          </button>
        )}
      </div>

      {/* Today's agenda */}
      <div className="max-h-[280px] overflow-y-auto custom-scrollbar bg-[var(--surface)] p-2">
        {todayEvents.length === 0 ? (
          <div className="py-7 text-center">
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex w-11 h-11 rounded-2xl bg-violet-500/10 text-violet-500 items-center justify-center mb-2"
            >
              <Sparkles className="w-5 h-5" />
            </motion.span>
            <p className="text-xs font-semibold text-[var(--text-primary)]">Nothing scheduled today</p>
            <p className="text-[11px] text-[var(--text-muted)]">Add a task below or plan your week in the full planner.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {todayEvents.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.25) }}
                whileHover={{ x: 3 }}
                className="relative p-2.5 pl-4 flex items-center gap-2.5 rounded-xl border border-transparent hover:border-[var(--border)] hover:bg-[var(--surface-secondary)]/60 transition-colors group"
              >
                <span
                  className={`absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full ${
                    e.studyType === "Revision" ? "bg-purple-500" :
                    e.studyType === "Mock Test" ? "bg-rose-500" :
                    e.studyType === "Mistakes" ? "bg-amber-500" :
                    e.studyType === "Bookmarks" ? "bg-blue-500" : "bg-indigo-500"
                  }`}
                />
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={() => handleToggleComplete(e)}
                  aria-label={e.completed ? "Mark as not done" : "Mark as done"}
                  className={`w-[18px] h-[18px] rounded-full border-2 shrink-0 flex items-center justify-center transition-colors cursor-pointer ${
                    e.completed ? "bg-gradient-to-br from-emerald-400 to-green-600 border-transparent" : "border-[var(--border-strong)] hover:border-emerald-500"
                  }`}
                >
                  <AnimatePresence>
                    {e.completed && (
                      <motion.span initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 600, damping: 18 }}>
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold truncate ${e.completed ? "line-through text-[var(--text-muted)]" : "text-[var(--text-primary)]"}`}>
                    {e.title}
                  </p>
                  <p className="text-[9px] text-[var(--text-muted)] font-semibold flex items-center gap-1">
                    <Clock3 className="w-2.5 h-2.5" /> {e.startTime ? formatTime12h(e.startTime) : "Anytime"} · {e.studyType}
                  </p>
                </div>
                <button
                  onClick={() => handleLaunch(e)}
                  className="w-7 h-7 flex items-center justify-center opacity-100 sm:opacity-0 group-hover:opacity-100 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg text-white shadow-md shadow-violet-500/30 transition-all hover:scale-110 cursor-pointer shrink-0"
                  title="Start this now"
                  aria-label={`Start ${e.title}`}
                >
                  <Play className="w-3 h-3 fill-white stroke-none" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Quick add */}
      <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--surface)]">
        <AnimatePresence mode="wait">
          {isAdding ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 overflow-hidden"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Task title..."
                value={quickTitle}
                onChange={e => setQuickTitle(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleQuickAdd(); if (e.key === "Escape") setIsAdding(false); }}
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] text-xs font-semibold text-[var(--text-primary)] rounded-lg outline-none focus:border-indigo-500 transition-colors"
              />
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <CustomDropdown
                    value={quickType}
                    onChange={(v) => setQuickType(v as CalendarEvent["studyType"])}
                    options={QUICK_TYPE_OPTIONS}
                    className="text-[10px] font-bold [&>button]:px-2.5 [&>button]:py-1.5 [&>button]:rounded-lg"
                  />
                </div>
                <button
                  onClick={handleQuickAdd}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[11px] font-semibold rounded-lg shadow-md shadow-violet-500/25 transition hover:brightness-110 cursor-pointer"
                >
                  Add
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ) : (
            <button
              key="trigger"
              onClick={() => setIsAdding(true)}
              className="group w-full flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-semibold text-[var(--text-secondary)] hover:text-violet-600 dark:hover:text-violet-300 border border-dashed border-[var(--border)] hover:border-violet-500/50 hover:bg-violet-500/5 rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 transition-transform group-hover:rotate-90" /> Add a task for today
            </button>
          )}
        </AnimatePresence>
      </div>

      {/* Footer stats */}
      {(overdueCount > 0 || upcomingCount > 0) && (
        <div className="px-4 py-2.5 border-t border-[var(--border-subtle)] bg-[var(--surface)] rounded-b-2xl overflow-hidden flex items-center justify-center gap-2 text-[11px] font-semibold">
          {overdueCount > 0 && <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400"><span className="font-num">{overdueCount}</span> overdue</span>}
          {upcomingCount > 0 && <span className="px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-300"><span className="font-num">{upcomingCount}</span> in the next 7 days</span>}
        </div>
      )}
        </>
      )}
    </motion.div>
  );
}
