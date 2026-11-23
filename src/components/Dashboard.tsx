import { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";
import { getUsers, loadTasks, saveTasks } from "../storage";
import type { Task, TaskValues } from "../types";
import { btnSecondary, card } from "../ui";

interface Props {
  email: string;
  onLogout: () => void;
}

export default function Dashboard({ email, onLogout }: Props) {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks(email));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const name = getUsers()[email]?.name ?? email;

  useEffect(() => {
    saveTasks(email, tasks);
  }, [email, tasks]);

  const openCount = tasks.filter((t) => !t.done).length;

  function addTask(values: TaskValues) {
    setTasks((prev) => [{ id: crypto.randomUUID(), done: false, ...values }, ...prev]);
  }
  function updateTask(id: string, values: TaskValues) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...values } : t)));
    setEditingId(null);
  }
  function toggleTask(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }
  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setConfirmId(null);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Tasks</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Signed in as {name}</p>
        </div>
        <button onClick={onLogout} className={btnSecondary}>Log out</button>
      </header>

      <section className={`mb-6 ${card}`} aria-labelledby="new-task">
        <h2 id="new-task" className="mb-3 text-lg font-bold">Create a task</h2>
        <TaskForm idPrefix="new" submitLabel="Add task" onSubmit={addTask} />
      </section>

      <h2 className="mb-3 text-lg font-bold">
        Tasks{" "}
        {tasks.length > 0 && (
          <span className="text-sm font-normal text-slate-500">
            ({openCount} open of {tasks.length})
          </span>
        )}
      </h2>

      <ul className="grid gap-3">
        {tasks.length === 0 && (
          <li className="rounded-xl border border-dashed border-slate-400 px-4 py-8 text-center text-slate-500">
            No tasks yet. Add your first task above.
          </li>
        )}
        {tasks.map((task) =>
          editingId === task.id ? (
            <li key={task.id} className="flex rounded-xl border border-teal-600 bg-white p-4 dark:bg-slate-800">
              <TaskForm
                idPrefix={`edit-${task.id}`}
                initial={{ title: task.title, description: task.description, priority: task.priority }}
                submitLabel="Save"
                onSubmit={(values) => updateTask(task.id, values)}
                onCancel={() => setEditingId(null)}
              />
            </li>
          ) : (
            <TaskItem
              key={task.id}
              task={task}
              confirming={confirmId === task.id}
              onToggle={() => toggleTask(task.id)}
              onEdit={() => { setEditingId(task.id); setConfirmId(null); }}
              onDelete={() => (confirmId === task.id ? deleteTask(task.id) : setConfirmId(task.id))}
              onKeep={() => setConfirmId(null)}
            />
          )
        )}
      </ul>
    </div>
  );
}