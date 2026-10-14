import { event } from './event.js'

export function utcStamp(value) {
  return new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

export function escapeIcs(value) {
  return value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,')
}

// RFC 5545: строки не длиннее 75 октетов, не разрываем UTF-8 символы.
export function foldLine(line) {
  const encoder = new TextEncoder()
  const lines = []
  let part = '', size = 0
  for (const char of line) {
    const length = encoder.encode(char).length
    if (size + length > 75) {
      lines.push(part)
      part = ' '
      size = 1
    }
    part += char
    size += length
  }
  lines.push(part)
  return lines.join('\r\n')
}

export function createIcs(data = event) {
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Egor18//Birthday Invitation//RU',
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
    `UID:egor-18-${data.year}@birthday.local`, 'DTSTAMP:20261012T000000Z',
    `DTSTART:${utcStamp(data.start)}`, `DTEND:${utcStamp(data.end)}`,
    `SUMMARY:${escapeIcs(data.title)}`, `LOCATION:${escapeIcs(data.location)}`,
    `DESCRIPTION:${escapeIcs(data.description)}`, 'STATUS:CONFIRMED',
    'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY',
    `DESCRIPTION:${escapeIcs('Завтра — день рождения Егора!')}`, 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR'
  ].map(foldLine).join('\r\n') + '\r\n'
}

export function googleCalendarUrl(data = event) {
  const params = new URLSearchParams({
    action: 'TEMPLATE', text: data.title,
    dates: `${utcStamp(data.start)}/${utcStamp(data.end)}`,
    details: data.description, location: data.location, ctz: 'Europe/Moscow'
  })
  return `https://calendar.google.com/calendar/render?${params}`
}
