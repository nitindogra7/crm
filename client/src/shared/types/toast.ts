export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: "success" | "error" | "info";
}
