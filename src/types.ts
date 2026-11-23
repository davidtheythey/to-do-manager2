export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  done: boolean;
}

export interface TaskValues {
  title: string;
  description: string;
  priority: Priority;
}

export interface User {
  name: string;
  hash: string;
}