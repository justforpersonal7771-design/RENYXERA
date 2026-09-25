import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { CustomTestBlock, CustomTestTemplate, TestConfig } from "@/types/exam.types";
import { QuestionRepository } from "@/lib/repository/question-repository";
import { IDBManager } from "@/lib/repository/storage/idb-manager";
import { Plus, Trash2, Save, FolderOpen, Copy, AlertCircle } from "lucide-react";
import { CustomDropdown } from "@/components/ui/custom-dropdown";

interface CustomTestBuilderProps {
  onGenerate: (config: TestConfig) => void;
  /** Focus Target's currently in-goal topics, when active — every block's available
   * count and generated pool gets restricted to this set, matching Subject Mastery /
   * Section Sprint. Undefined/empty means Focus Target isn't active. */
  focusTopics?: string[];
  /** Reports the running total question count on every block change, so the parent
   * (which now owns the "Generate Custom Draft" button, sitting beside the Deployment
   * Type dropdown in a sticky bar) can show it without duplicating the summing logic. */
  onTotalChange?: (total: number) => void;
}

/** Imperative handle so the parent's sticky "Generate Custom Draft" button can trigger
 * this component's own validated generate flow (which needs `blocks`, kept local to
 * this component) without lifting all of that block state up to the page. */
export interface CustomTestBuilderHandle {
  generate: () => void;
}

export const CustomTestBuilder = forwardRef<CustomTestBuilderHandle, CustomTestBuilderProps>(
  function CustomTestBuilder({ onGenerate, focusTopics, onTotalChange }, ref) {
  const [blocks, setBlocks] = useState<CustomTestBlock[]>([]);
  const [templates, setTemplates] = useState<CustomTestTemplate[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [errorLine, setErrorLine] = useState("");

  const repo = QuestionRepository;
  const focusSet = focusTopics && focusTopics.length > 0 ? new Set(focusTopics) : null;

  const loadTemplates = async () => {
    const list = await IDBManager.getAllCustomTemplates();
    setTemplates(list);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTemplates();
  }, []);

  const calculateAvailableCount = (block: Partial<CustomTestBlock>) => {
    let pool = repo.getAllQuestions();
    if (block.yearShift) pool = pool.filter(q => q.year_shift === block.yearShift);
    if (block.section) pool = pool.filter(q => q.section === block.section);
    if (block.subject) pool = pool.filter(q => q.subject === block.subject);
    if (block.topic) pool = pool.filter(q => q.topic === block.topic);
    if (focusSet) pool = pool.filter(q => focusSet.has(q.topic));
    return pool.length;
  };

  // Re-derives a block's count against the current filters AND current Focus Target:
  // "include all" blocks follow the full matching pool, manual counts are capped to it.
  const syncBlockCount = (b: CustomTestBlock): CustomTestBlock => {
    const available = calculateAvailableCount(b);
    if (b.includeAll !== false) return b.count === available ? b : { ...b, count: available };
    return b.count > available ? { ...b, count: available } : b;
  };

  // Counts used to be computed only when a block was added or edited, so changing the
  // Focus Target afterwards left existing blocks at their old, larger pool size (e.g. 881
  // per block while the goal only allowed far fewer) even though the banner above says
  // counts already reflect Focus Target.
  const focusKey = focusTopics && focusTopics.length > 0 ? [...focusTopics].sort().join("|") : "";
  useEffect(() => {
    setBlocks((prev) => prev.map(syncBlockCount));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusKey]);

  const addBlock = () => {
    const available = calculateAvailableCount({});
    setBlocks([
      ...blocks,
      {
        id: crypto.randomUUID(),
        count: available,
        includeAll: true,
      },
    ]);
  };

  // Filter changes (year/section/subject/topic) always keep an "include all"
  // block synced to its full matching pool. Only an explicit count edit
  // (handleCountChange) switches a block to a manual, fixed count.
  const updateBlock = (id: string, updates: Partial<CustomTestBlock>) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id === id) {
          const updated = { ...b, ...updates };
          const available = calculateAvailableCount(updated);
          if (updated.includeAll !== false) {
            updated.count = available;
          } else if (updated.count > available) {
            updated.count = available;
          }
          return updated;
        }
        return b;
      })
    );
  };

  const handleCountChange = (id: string, value: number) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id !== id) return b;
        const available = calculateAvailableCount(b);
        const clamped = Math.max(1, Math.min(value, available > 0 ? available : value));
        return { ...b, count: clamped, includeAll: false };
      })
    );
  };

  const handleResetToAll = (id: string) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id !== id) return b;
        return { ...b, count: calculateAvailableCount(b), includeAll: true };
      })
    );
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      setErrorLine("Template name is required.");
      return;
    }
    if (templates.find(t => t.name.toLowerCase() === templateName.toLowerCase())) {
      setErrorLine("Template name already exists.");
      return;
    }
    if (blocks.length === 0) {
      setErrorLine("Must have at least one block to save template.");
      return;
    }

    const newTemplate: CustomTestTemplate = {
      id: crypto.randomUUID(),
      name: templateName.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      blocks: [...blocks],
    };

    await IDBManager.saveCustomTemplate(newTemplate);
    setTemplateName("");
    setErrorLine("");
    loadTemplates();
  };

  const handleDuplicateTemplate = async (template: CustomTestTemplate) => {
    let baseName = template.name + " Copy";
    let counter = 1;
    while (templates.find(t => t.name === (counter > 1 ? `${baseName} ${counter}` : baseName))) {
       counter++;
    }
    const finalName = counter > 1 ? `${baseName} ${counter}` : baseName;

    const newTemplate: CustomTestTemplate = {
      ...template,
      id: crypto.randomUUID(),
      name: finalName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await IDBManager.saveCustomTemplate(newTemplate);
    loadTemplates();
  }

  const handleDeleteTemplate = async (id: string) => {
    await IDBManager.deleteCustomTemplate(id);
    loadTemplates();
  };

  const handleLoadTemplate = (template: CustomTestTemplate) => {
    // A saved template's counts reflect the pool when it was saved — re-sync them to the
    // current Focus Target so a loaded template can't ask for more than is available.
    setBlocks(template.blocks.map(syncBlockCount));
    setErrorLine("");
  };

  const getTotalQuestions = () => {
    return blocks.reduce((acc, b) => acc + b.count, 0);
  };

  useEffect(() => {
    onTotalChange?.(getTotalQuestions());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks]);

  const handleGenerateClick = () => {
    if (blocks.length === 0) {
      setErrorLine("Please add at least one selection block to generate.");
      return;
    }
    onGenerate({
      examType: "CUSTOM_TEST",
      customBlocks: blocks,
      focusTopics: focusSet ? Array.from(focusSet) : undefined,
    });
  };

  useImperativeHandle(ref, () => ({
    generate: handleGenerateClick,
  }));

  const papers = repo.getAvailablePapers().sort();
  const sections = repo.getAvailableSections().sort();
  const subjects = repo.getAvailableSubjects().sort();
  const topics = repo.getAvailableTopics().sort();

  return (
    <div className="space-y-6">

      {focusSet && (
        <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded-lg px-3 py-2 leading-relaxed">
          Focus Target is on ({focusSet.size} in-goal topics) — every block below is restricted to those topics. "Available" counts already reflect this.
        </div>
      )}

      {errorLine && (
        <div
          role="alert"
          className="flex items-center gap-2 text-xs font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {errorLine}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
         <div className="flex w-full md:w-auto gap-2">
            <input 
              className="p-2 border border-[var(--border)] rounded-lg dark:bg-gray-800 flex-1 min-w-[200px]"
              placeholder="Template Name..."
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
            <button onClick={handleSaveTemplate} className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold rounded-lg flex items-center gap-2 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition">
              <Save className="w-4 h-4"/> Save
            </button>
         </div>

         {templates.length > 0 && (
           <div className="w-full md:w-auto relative min-w-[200px]">
             <CustomDropdown
                value=""
                onChange={(val) => {
                  if (val) {
                    const t = templates.find(temp => temp.id === val);
                    if (t) handleLoadTemplate(t);
                  }
                }}
                placeholder="Load Template..."
                options={templates.map(t => ({ label: `${t.name} (${t.blocks.length} blocks)`, value: t.id }))}
                className="text-sm"
             />
           </div>
         )}
      </div>

      {/* Templates List */}
      {templates.length > 0 && (
         <div className="flex flex-wrap gap-2 mb-6">
            {templates.map(t => (
               <div key={t.id} className="flex items-center gap-2 bg-[var(--surface-elevated)] border border-[var(--border)] px-3 py-1.5 rounded-full text-sm">
                  <span className="font-semibold cursor-pointer hover:underline" onClick={() => handleLoadTemplate(t)}>{t.name}</span>
                  <span className="text-[var(--text-muted)] text-xs">({t.blocks.reduce((a,b)=>a+b.count,0)}Qs)</span>
                  <button onClick={() => handleDuplicateTemplate(t)} className="text-[var(--text-muted)] hover:text-indigo-500" title="Duplicate"><Copy className="w-3 h-3" /></button>
                  <button onClick={() => handleDeleteTemplate(t.id)} className="text-[var(--text-muted)] hover:text-red-500" title="Delete"><Trash2 className="w-3 h-3" /></button>
               </div>
            ))}
         </div>
      )}

      <div className="space-y-4">
        {blocks.map((block, index) => {
          // When Focus Target is active, every dropdown below (Year, Section, Subject,
          // Topic) is scoped to only the options that actually have in-goal questions —
          // previously the "Available" count reflected the filter but the pickers
          // themselves still listed every option, including ones focus target would
          // reduce to zero.
          const poolForYear = focusSet
            ? repo.getAllQuestions().filter(q => focusSet.has(q.topic))
            : repo.getAllQuestions();
          const availableYears = Array.from(new Set(poolForYear.map(q => q.year_shift))).filter(Boolean).sort();
          
          let poolForSection = poolForYear;
          if (block.yearShift) poolForSection = poolForSection.filter(q => q.year_shift === block.yearShift);
          const availableSections = Array.from(new Set(poolForSection.map(q => q.section))).filter(Boolean).sort();

          let poolForSubject = poolForSection;
          if (block.section) poolForSubject = poolForSubject.filter(q => q.section === block.section);
          const availableSubjects = Array.from(new Set(poolForSubject.map(q => q.subject))).filter(Boolean).sort();

          let poolForTopic = poolForSubject;
          if (block.subject) poolForTopic = poolForTopic.filter(q => q.subject === block.subject);
          const availableTopics = Array.from(new Set(poolForTopic.map(q => q.topic))).filter(Boolean).sort();

          let finalPool = poolForTopic;
          if (block.topic) finalPool = finalPool.filter(q => q.topic === block.topic);
          if (focusSet) finalPool = finalPool.filter(q => focusSet.has(q.topic));
          const available = finalPool.length;

          return (
            <div key={block.id} className="p-4 border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl relative">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-[var(--text-secondary)]">Selection Block {index + 1}</h4>
                <button
                  onClick={() => removeBlock(block.id)}
                  className="p-1.5 text-[var(--text-muted)] hover:bg-red-100 hover:text-red-600 rounded-md transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Year</label>
                  <CustomDropdown
                    value={block.yearShift || ""}
                    onChange={(val) => updateBlock(block.id, { yearShift: val || undefined, section: undefined, subject: undefined, topic: undefined })}
                    options={[{ label: "All", value: "" }, ...availableYears.map(p => ({ label: p, value: p }))]}
                    className="w-full text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Section</label>
                  <CustomDropdown
                    value={block.section || ""}
                    onChange={(val) => updateBlock(block.id, { section: val || undefined, subject: undefined, topic: undefined })}
                    options={[{ label: "All", value: "" }, ...availableSections.map(s => ({ label: s, value: s }))]}
                    className="w-full text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Subject</label>
                  <CustomDropdown
                    value={block.subject || ""}
                    onChange={(val) => updateBlock(block.id, { subject: val || undefined, topic: undefined })}
                    options={[{ label: "All", value: "" }, ...availableSubjects.map(s => ({ label: s, value: s }))]}
                    className="w-full text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Topic</label>
                  <CustomDropdown
                    value={block.topic || ""}
                    onChange={(val) => updateBlock(block.id, { topic: val || undefined })}
                    options={[{ label: "All", value: "" }, ...availableTopics.map(t => ({ label: t, value: t }))]}
                    className="w-full text-sm"
                  />
                </div>
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-[var(--text-muted)] mb-1">
                    <span>Count</span>
                    {block.includeAll === false ? (
                      <button
                        type="button"
                        onClick={() => handleResetToAll(block.id)}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold cursor-pointer"
                        title="Reset to include all matching questions"
                      >
                        Use all ({available})
                      </button>
                    ) : (
                      <span className="text-[var(--text-muted)]">All matching</span>
                    )}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={available > 0 ? available : 100}
                    value={block.count}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      handleCountChange(block.id, val);
                    }}
                    className="w-full p-2 text-sm bg-[var(--surface)] border border-[var(--border)] rounded-md"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={addBlock}
        className="w-full py-3 border-2 border-dashed border-[var(--border)] text-[var(--text-muted)] hover:text-indigo-600 hover:border-indigo-500 dark:hover:text-indigo-400 dark:hover:border-indigo-500 rounded-xl font-medium transition flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" /> Add Selection Block
      </button>

      {/* "Generate Custom Draft" now lives in the parent's sticky bar, beside the
          Deployment Type dropdown — triggered via the imperative handle above. */}

    </div>
  );
});
