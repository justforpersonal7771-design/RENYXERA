"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, GripVertical, ListTodo, Plus, Trash2, Sparkles, PartyPopper } from "lucide-react";
import { useTodoStore } from "@/store/use-todo-store";
import { TodoItem } from "@/types/todo.types";
import { RadialGauge, CountUp, Segmented } from "@/components/ui/interactive";

const PRIORITY: Record<TodoItem["priority"], { dot: string; chip: string; bar: string }> = {
  Low: { dot: "bg-sky-500", chip: "text-sky-600 dark:text-sky-300 bg-sky-500/10", bar: "from-sky-400 to-blue-500" },
  Medium: { dot: "bg-amber-500", chip: "text-amber-600 dark:text-amber-300 bg-amber-500/10", bar: "from-amber-400 to-orange-500" },
  High: { dot: "bg-rose-500", chip: "text-rose-600 dark:text-rose-300 bg-rose-500/10", bar: "from-rose-400 to-red-500" },
};
const PRIORITY_OPTIONS: TodoItem["priority"][] = ["Low", "Medium", "High"];
type Filter = "all" | "open" | "done";

/**
 * Quick to-do list in the navbar: completion ring in the header, filter tabs, priority
 * picker, animated add/complete/delete (check springs in, text strikes through, a small
 * burst on completion), drag to reorder open tasks, and a celebration when all are done.
 */
export function TodoQuickPanel() {
  const { items, loadItems, addItem, toggleItem, deleteItem, reorderItems } = useTodoStore();
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<TodoItem["priority"]>("Medium");
  const [filter, setFilter] = useState<Filter>("all");
  const [justDone, setJustDone] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  useEffect(() => { loadItems(); }, [loadItems]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const pending = items.filter((i) => !i.completed);
  const completed = items.filter((i) => i.completed);
  const pct = items.length ? Math.round((completed.length / items.length) * 100) : 0;
  const visible = useMemo(
    () => (filter === "open" ? pending : filter === "done" ? completed : [...pending, ...completed]),
    [filter, pending, completed],
  );

  const handleAdd = () => {
    if (!text.trim()) return;
    addItem(text, priority);
    setText("");
    setPriority("Medium");
    inputRef.current?.focus();
  };

  const handleToggle = (item: TodoItem) => {
    if (!item.completed) {
      setJustDone(item.id);
      setTimeout(() => setJustDone((id) => (id === item.id ? null : id)), 700);
    }
    toggleItem(item.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className="nav-cluster fixed sm:absolute left-4 right-4 sm:left-auto top-16 sm:top-full sm:right-0 mt-0 sm:mt-2 sm:w-[340px] rounded-2xl shadow-[0_30px_80px_-24px_rgba(76,29,149,0.45)] overflow-hidden z-50"
    >
      {/* Header */}
      <div className="relative overflow-hidden p-4 flex items-center justify-between gap-3 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white">
        <motion.div aria-hidden="true" className="absolute -top-10 -right-8 w-32 h-32 bg-cyan-300/25 rounded-full blur-2xl" animate={{ x: [0, -15, 0], y: [0, 10, 0] }} transition={{ duration: 8, repeat: Infinity }} />
        <div className="relative flex items-center gap-2.5 min-w-0">
          <span className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
            <ListTodo className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <p className="font-bold text-sm leading-tight">To-do list</p>
            <p className="text-[11px] text-white/75"><span className="font-num font-semibold text-white">{pending.length}</span> open · <span className="font-num">{completed.length}</span> done</p>
          </div>
        </div>
        <RadialGauge value={pct} size={46} stroke={5} from="#a7f3d0" to="#fde68a" track="#fff" trackOpacity={0.2} className="relative shrink-0">
          <CountUp value={pct} suffix="%" duration={0.5} className="text-[11px] font-bold text-white" />
        </RadialGauge>
      </div>

      <div className="bg-[var(--surface)]">
        {/* Add */}
        <div className="p-3 border-b border-[var(--border-subtle)] space-y-2.5">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              aria-label="New task"
              placeholder="Add a quick task…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="flex-1 min-w-0 px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border)] text-xs font-medium text-[var(--text-primary)] rounded-xl"
            />
            <motion.button
              whileTap={{ scale: 0.9, rotate: 90 }}
              onClick={handleAdd}
              disabled={!text.trim()}
              aria-label="Add task"
              className="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-xl shadow-md shadow-violet-500/30 disabled:opacity-40 disabled:shadow-none transition cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              {PRIORITY_OPTIONS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`relative flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer ${
                    priority === p ? PRIORITY[p].chip : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {priority === p && <motion.span layoutId="todo-priority" className="absolute inset-0 rounded-lg ring-1 ring-current opacity-40" transition={{ type: "spring", stiffness: 500, damping: 34 }} />}
                  <span className={`relative w-1.5 h-1.5 rounded-full ${PRIORITY[p].dot}`} />
                  <span className="relative">{p}</span>
                </button>
              ))}
            </div>
            <Segmented
              size="xs"
              value={filter}
              onChange={setFilter}
              options={[{ label: "All", value: "all" }, { label: "Open", value: "open" }, { label: "Done", value: "done" }]}
            />
          </div>
        </div>

        {/* List */}
        <div className="max-h-[320px] overflow-y-auto custom-scrollbar p-2">
          {items.length > 0 && pending.length === 0 && filter !== "done" ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-6 text-center">
              <motion.div animate={{ rotate: [0, -12, 12, 0] }} transition={{ duration: 0.8, delay: 0.1 }} className="inline-flex w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-500 items-center justify-center mb-2">
                <PartyPopper className="w-5 h-5" />
              </motion.div>
              <p className="text-xs font-semibold text-[var(--text-primary)]">All done. Nice work!</p>
              <p className="text-[11px] text-[var(--text-muted)]">Add something new above when you&apos;re ready.</p>
            </motion.div>
          ) : visible.length === 0 ? (
            <div className="py-8 text-center">
              <span className="inline-flex w-11 h-11 rounded-2xl bg-violet-500/10 text-violet-500 items-center justify-center mb-2"><Sparkles className="w-5 h-5" /></span>
              <p className="text-xs font-semibold text-[var(--text-primary)]">{filter === "done" ? "Nothing finished yet" : "Nothing on your list yet"}</p>
              <p className="text-[11px] text-[var(--text-muted)]">Quick tasks with no due date live here.</p>
            </div>
          ) : (
            <div className="space-y-1">
              <AnimatePresence initial={false}>
                {visible.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0, transition: { delay: Math.min(i * 0.03, 0.2) } }}
                    exit={{ opacity: 0, x: 30, height: 0, marginTop: 0, transition: { duration: 0.2 } }}
                    draggable={!item.completed}
                    onDragStart={() => setDraggedId(item.id)}
                    onDragEnter={() => !item.completed && setDragOverId(item.id)}
                    onDragEnd={() => { setDraggedId(null); setDragOverId(null); }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedId && !item.completed) reorderItems(draggedId, item.id);
                      setDraggedId(null);
                      setDragOverId(null);
                    }}
                    className={`relative pl-3 pr-2 py-2.5 flex items-center gap-2.5 rounded-xl border transition-colors group overflow-hidden ${
                      dragOverId === item.id && draggedId !== item.id ? "border-violet-400/60 bg-violet-500/10" : "border-transparent hover:border-[var(--border)] hover:bg-[var(--surface-secondary)]/60"
                    } ${draggedId === item.id ? "opacity-40" : ""}`}
                  >
                    <span className={`absolute left-0 top-2 bottom-2 w-1 rounded-full bg-gradient-to-b ${PRIORITY[item.priority].bar} ${item.completed ? "opacity-30" : ""}`} />
                    {!item.completed && (
                      <GripVertical className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0 cursor-grab opacity-0 group-hover:opacity-60 transition-opacity -ml-1" />
                    )}
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={() => handleToggle(item)}
                      aria-label={item.completed ? "Mark as not done" : "Mark as done"}
                      className={`relative w-[18px] h-[18px] rounded-full border-2 shrink-0 flex items-center justify-center transition-colors cursor-pointer ${
                        item.completed ? "bg-gradient-to-br from-emerald-400 to-green-600 border-transparent" : "border-[var(--border-strong)] hover:border-emerald-500"
                      }`}
                    >
                      <AnimatePresence>
                        {item.completed && (
                          <motion.span initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 600, damping: 18 }}>
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {justDone === item.id && (
                        <motion.span aria-hidden="true" initial={{ scale: 1, opacity: 0.7 }} animate={{ scale: 2.8, opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0 rounded-full bg-emerald-400" />
                      )}
                    </motion.button>
                    <span className="relative flex-1 min-w-0">
                      <span className={`block text-xs font-medium truncate transition-colors ${item.completed ? "text-[var(--text-muted)]" : "text-[var(--text-primary)]"}`}>
                        {item.text}
                      </span>
                      <motion.span
                        aria-hidden="true"
                        initial={false}
                        animate={{ scaleX: item.completed ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute left-0 right-0 top-1/2 h-px bg-[var(--text-muted)] origin-left"
                      />
                    </span>
                    <span className={`hidden sm:inline px-1.5 py-0.5 rounded-md text-[9px] font-semibold ${PRIORITY[item.priority].chip} ${item.completed ? "opacity-50" : ""}`}>{item.priority}</span>
                    <button
                      onClick={() => deleteItem(item.id)}
                      aria-label="Delete task"
                      className="p-1 rounded-md opacity-100 sm:opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
