export function statsWindow(utcOffsetMinutes?: number) {
    const now = new Date();
    const shifted = new Date(now.getTime() + (utcOffsetMinutes || 0) * 60_000);
    const startOfToday = utcOffsetMinutes === undefined
      ? new Date(now.getFullYear(), now.getMonth(), now.getDate())
      : new Date(Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()) - utcOffsetMinutes * 60_000);
    const sevenDaysAgo = new Date(startOfToday.getTime() - 6 * 24 * 60 * 60 * 1000);

    return { startOfToday, sevenDaysAgo };
}
