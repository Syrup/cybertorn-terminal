
export function calculateBankTimeLeft(until: number, now: number): number {
  if (until <= 0) return 0;
  
  // If until is a future timestamp in milliseconds (e.g., 1742000000000)
  if (until > 10000000000) {
    const targetSeconds = Math.floor(until / 1000);
    return Math.max(0, targetSeconds - now);
  }
  
  // If until is a future timestamp in seconds (e.g., 1742000000)
  if (until > 1000000000) {
    return Math.max(0, until - now);
  }
  
  // If until is already a duration (e.g., 518400 seconds for 6 days)
  return Math.max(0, until);
}

export function formatDuration(seconds: number): string {
  if (seconds <= 0) return "MATURED";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
