interface Entry { value: unknown; loadedAt: number; revision: number }
/** Provider-owned cache: never shared between users, workspaces, or environments. */
export class ResourceCache {
  private entries = new Map<string, Entry>();
  private pending = new Map<string, { controller: AbortController; promise: Promise<unknown>; revision: number }>();
  constructor(private readonly ttl = 30_000) {}
  async get<T>(key: string, revision: number, load: (signal: AbortSignal) => Promise<T>, force = false): Promise<T> {
    const cached = this.entries.get(key);
    if (!force && cached?.revision === revision && Date.now() - cached.loadedAt < this.ttl) return cached.value as T;
    const pending = this.pending.get(key);
    if (pending && pending.revision === revision) return pending.promise as Promise<T>;
    pending?.controller.abort();
    const controller = new AbortController();
    const promise = load(controller.signal).then(value => {
      if (!controller.signal.aborted) this.entries.set(key, { value, revision, loadedAt: Date.now() });
      return value;
    }).finally(() => { if (this.pending.get(key)?.promise === promise) this.pending.delete(key); });
    this.pending.set(key, { controller, promise, revision });
    return promise;
  }
  seed(key: string, value: unknown, revision: number) {
    this.entries.set(key, { value, revision, loadedAt: Date.now() });
  }
  cancelPending() {
    this.pending.forEach(request => request.controller.abort());
    this.pending.clear();
  }
  clear() { this.cancelPending(); this.entries.clear(); }
}
