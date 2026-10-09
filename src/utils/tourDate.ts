const pad = (value: number) => String(value).padStart(2, "0");

// Today as "YYYY-MM-DD" in the visitor's local time, the format <input type="date"> uses.
// (toISOString would give the UTC date, which is wrong late at night.)
export const todayISO = (now = new Date()) =>
  `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

// Current time as "HH:MM", the format <input type="time"> uses
export const currentTime = (now = new Date()) =>
  `${pad(now.getHours())}:${pad(now.getMinutes())}`;

// True when a tour slot has already started. The server checks this too.
export const isPastSlot = (date: string, time: string, now = new Date()) => {
  const today = todayISO(now);
  if (date !== today) return date < today;
  return time <= currentTime(now);
};

// The earliest time to offer: now for today's date, otherwise no limit
export const minTimeFor = (date: string, now = new Date()) =>
  date === todayISO(now) ? currentTime(now) : undefined;
