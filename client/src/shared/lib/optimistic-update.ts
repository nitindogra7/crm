import { useAppStore } from "@/shared/store/use-app-store";

type RecordItem = { id: string };
function restore<T extends RecordItem>(before: T[], after: T[], current: T[]): T[] {
  const prior = new Map(before.map(item => [item.id, item]));
  const optimistic = new Map(after.map(item => [item.id, item]));
  const result = current.flatMap(item => {
    if (optimistic.get(item.id) !== item) return [item];
    const original = prior.get(item.id);
    return original ? [original] : [];
  });
  before.forEach((item, index) => {
    if (!optimistic.has(item.id) && !result.some(value => value.id === item.id)) result.splice(Math.min(index, result.length), 0, item);
  });
  return result;
}

/** Restore affected records after a failed save without overwriting later edits. */
export async function optimisticUpdate(apply: () => void, save: () => Promise<unknown>) {
  const before = useAppStore.getState();
  apply();
  const after = useAppStore.getState();
  try { await save(); }
  catch (error) {
    const current = useAppStore.getState();
    if (before.activeDashboardId === current.activeDashboardId && before.currentEnvironment === current.currentEnvironment) {
      useAppStore.setState({
        forms: before.forms === after.forms ? current.forms : restore(before.forms, after.forms, current.forms),
        leads: before.leads === after.leads ? current.leads : restore(before.leads, after.leads, current.leads),
        spam: before.spam === after.spam ? current.spam : restore(before.spam, after.spam, current.spam),
        apiKeys: before.apiKeys === after.apiKeys ? current.apiKeys : restore(before.apiKeys, after.apiKeys, current.apiKeys),
      });
    }
    throw error;
  }
}
