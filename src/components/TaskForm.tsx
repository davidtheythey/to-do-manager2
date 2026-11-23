import { useState } from "react";
import type { FormEvent } from "react";
import type { Priority, TaskValues } from "../types";
import { btnPrimary, btnSecondary, errorText, field, label } from "../ui";

interface Props {
  idPrefix: string;
  initial?: TaskValues;
  submitLabel: string;
  onSubmit: (values: TaskValues) => void;
  onCancel?: () => void;
}

const empty: TaskValues = { title: "", description: "", priority: "medium" };

export default function TaskForm({ idPrefix, initial = empty, submitLabel, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [priority, setPriority] = useState<Priority>(initial.priority);
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Enter a title for the task.");
      return;
    }
    onSubmit({ title: title.trim(), description: description.trim(), priority });
    if (!onCancel) {
      // create mode: reset the form after adding
      setTitle("");
      setDescription("");
      setPriority("medium");
    }
    setError("");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="min-w-0 flex-1">
      <div className="mb-3">
        <label htmlFor={`${idPrefix}-title`} className={label}>Title</label>
        <input id={`${idPrefix}-title`} type="text" maxLength={120} autoComplete="off"
          autoFocus={!!onCancel} className={field}
          value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="mb-3">
        <label htmlFor={`${idPrefix}-desc`} className={label}>
          Description <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <textarea id={`${idPrefix}-desc`} maxLength={500} className={`${field} min-h-[76px] resize-y`}
          value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[160px] flex-1">
          <label htmlFor={`${idPrefix}-prio`} className={label}>Priority</label>
          <select id={`${idPrefix}-prio`} className={field} value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" className={btnPrimary}>{submitLabel}</button>
          {onCancel && (
            <button type="button" onClick={onCancel} className={btnSecondary}>Cancel</button>
          )}
        </div>
      </div>
      <p role="alert" className={`mt-2 ${errorText}`}>{error}</p>
    </form>
  );
}