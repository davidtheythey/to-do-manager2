import type { Priority, Task } from "../types";

const badge: Record<Priority, string> = {
  high: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
  low: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
};
const link =
  "rounded px-2 py-1 text-sm font-medium text-teal-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:text-teal-300";
const linkDel =
  "rounded px-2 py-1 text-sm font-medium text-red-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:text-red-400";

interface Props {
  task: Task;
  confirming: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onKeep: () => void;
}

export default function TaskItem({ task, confirming, onToggle, onEdit, onDelete, onKeep }: Props) {
  const strike = task.done ? " line-through opacity-60" : "";
  return (
    <li className="flex items-start gap-3 rounded-xl border border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <input type="checkbox" checked={task.done} onChange={onToggle}
        aria-label={`Mark “${task.title}” as done`}
        className="mt-1 h-5 w-5 flex-none accent-teal-700" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`break-words font-bold${strike}`}>{task.title}</span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${badge[task.priority]}`}>
            {task.priority[0].toUpperCase() + task.priority.slice(1)}
          </span>
        </div>
        {task.description && (
          <p className={`mt-1 whitespace-pre-wrap break-words text-slate-500 dark:text-slate-400${strike}`}>
            {task.description}
          </p>
        )}
        <div className="-ml-2 mt-1 flex gap-1">
          <button onClick={onEdit} className={link}>Edit</button>
          <button onClick={onDelete} className={linkDel}>
            {confirming ? "Confirm delete" : "Delete"}
          </button>
          {confirming && <button onClick={onKeep} className={link}>Keep</button>}
        </div>
      </div>
    </li>
  );
}