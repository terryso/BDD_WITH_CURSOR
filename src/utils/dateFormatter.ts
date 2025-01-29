export function formatDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const utc8Date = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  return `${utc8Date.getFullYear()}-${pad(utc8Date.getMonth() + 1)}-${pad(utc8Date.getDate())} ${pad(utc8Date.getHours())}:${pad(utc8Date.getMinutes())}:${pad(utc8Date.getSeconds())}`;
} 