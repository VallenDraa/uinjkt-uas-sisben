export function formatTime(date: Date, options?: Intl.DateTimeFormatOptions) {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    ...options,
  });
}
