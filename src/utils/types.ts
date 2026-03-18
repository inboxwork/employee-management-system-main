export type LoginRule = "admin" | "employee" | "manager";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type Currency = "USD" | "EUR" | "EGP" | "AED" | "SAR" | "GBP";
export type UserRole = "MANAGER" | "ADMIN" | "EMPLOYEE";
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "UNDER_REVIEW";
export type TabsNavigationTypes = "all-tasks" | "submitted-work" | "users" | "archive";
export type TimeFilter = "today" | "week" | "month" | "all";
export interface RegisterUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface EditUserData {
  name: string;
  password?: string;
  role: UserRole;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  password: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedBy: string;
  userId: string;
  assignedTo: User;
  startDate: string;
  endDate: string;
  priority: TaskPriority;
  price: number;
  currency: Currency;
  attachments: File[] | { url: string; publicId: string }[];
  status: TaskStatus;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  submitted: boolean;
  submittedAt: string;
  archivedBy: string;
  archivedDate: string;
  progress: number;
  reassignReason?: string;
  comment: string;
  submittedWorks: SubmittedWork[];
}

export interface SubmittedWork extends Omit<Task, "assignedTo"> {
  fromEmployee: string;
  toEmployee: User;
  task: Task;
  taskId: string;
}

export type JWTPayload = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;
};

export type ChangePasswordTypes = { oldPassword: string; newPassword: string };

export interface UploadedFile {
  file: File;
  name: string;
  size: number;
  type: string;
}

export interface ReassignReason {
  fromEmployee: string;
  toEmployee: string;
  startDate: string;
  endDate: string;
  reassignReason: string;
}