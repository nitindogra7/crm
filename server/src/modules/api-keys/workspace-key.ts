import crypto from "crypto";

export function workspaceKey(dashboardId: string, name: string) {
  const keyPrefix = "sln_live_";
  const key = keyPrefix + crypto.randomBytes(16).toString("hex");
  return { dashboardId, name, key, keyPrefix, environment: "production", fullKeyMock: key };
}
