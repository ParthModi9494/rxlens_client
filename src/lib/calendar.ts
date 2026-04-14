/** RFC 5545 helpers for generating iCalendar (.ics) files in the browser. */

interface CalendarEvent {
  title: string;
  date: string;          // "YYYY-MM-DD"
  time?: string | null;  // "HH:MM" (24-hour) or null → all-day
  description?: string;
  location?: string;
}

// ── Private helpers ───────────────────────────────────────────────

/** Escape special characters per RFC 5545 §3.3.11 */
const escapeICS = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

/** "HH:MM" → "HH:MM" one hour later (clamps at 23:00) */
const addOneHour = (time: string): string => {
  const [h, m] = time.split(":").map(Number);
  const next = Math.min(h + 1, 23);
  return `${String(next).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

/** Date → "YYYYMMDDTHHMMSSZ" for DTSTAMP */
const formatDtstamp = (d: Date): string => {
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}` +
    `T${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}Z`
  );
};

// ── Public API ────────────────────────────────────────────────────

/** Build an iCalendar string for a single event. */
export function generateICS(event: CalendarEvent): string {
  const { title, date, time, description, location } = event;

  const dateCompact = date.replace(/-/g, "");

  const dtStart = time
    ? `DTSTART:${dateCompact}T${time.replace(":", "")}00`
    : `DTSTART;VALUE=DATE:${dateCompact}`;

  const dtEnd = time
    ? `DTEND:${dateCompact}T${addOneHour(time).replace(":", "")}00`
    : `DTEND;VALUE=DATE:${dateCompact}`;

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RxLens//RxLens//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:rxlens-${dateCompact}-${Date.now()}@rxlens.app`,
    `SUMMARY:${escapeICS(title)}`,
    dtStart,
    dtEnd,
    `DTSTAMP:${formatDtstamp(new Date())}`,
  ];

  if (description) lines.push(`DESCRIPTION:${escapeICS(description)}`);
  if (location) lines.push(`LOCATION:${escapeICS(location)}`);

  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\r\n");
}

/** Trigger an .ics file download in the browser. */
export function downloadICS(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Build a Google Calendar "Add event" URL. */
export function buildGoogleCalendarUrl(event: CalendarEvent): string {
  const { title, date, time, description, location } = event;

  const dateCompact = date.replace(/-/g, "");

  const start = time
    ? `${dateCompact}T${time.replace(":", "")}00`
    : dateCompact;

  const end = time
    ? `${dateCompact}T${addOneHour(time).replace(":", "")}00`
    : dateCompact;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start}/${end}`,
    ...(description ? { details: description } : {}),
    ...(location ? { location } : {}),
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
