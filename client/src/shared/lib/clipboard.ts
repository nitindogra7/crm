import { useAppStore } from "@/shared/store/use-app-store";
export async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; }
  catch { useAppStore.getState().addToast("Could not copy", "Please select and copy the text manually.", "error"); return false; }
}
