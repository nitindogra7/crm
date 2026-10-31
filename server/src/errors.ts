export class WorkspaceAccessError extends Error {
  constructor() {
    super("Access denied: You do not have access to this workspace");
    this.name = "WorkspaceAccessError";
  }
}
