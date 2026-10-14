import test from 'node:test'
import assert from 'node:assert/strict'
import { createIcs, escapeIcs, foldLine, googleCalendarUrl } from '../src/calendar.js'
import { event } from '../src/event.js'

test('событие в UTC соответствует вечеру в Москве и утру следующего дня', () => {
  const ics = createIcs()
  assert.match(ics, /DTSTART:20261205T150000Z\r\n/)
  assert.match(ics, /DTEND:20261206T080000Z\r\n/)
  assert.match(ics, /TRIGGER:-P1D/)
  assert.ok(ics.endsWith('END:VCALENDAR\r\n'))
  assert.equal(new Date(event.start).getDay(), 6)
})

test('кириллица сворачивается по UTF-8 октетам без повреждения текста', () => {
  const value = 'DESCRIPTION:' + 'Привет, день рождения! '.repeat(30)
  const folded = foldLine(value)
  for (const line of folded.split('\r\n')) assert.ok(Buffer.byteLength(line, 'utf8') <= 75)
  assert.equal(folded.replace(/\r\n /g, ''), value)
})

test('значения iCalendar экранируют переносы и специальные символы', () => {
  assert.equal(escapeIcs('дом, баня; 18\\лет\nУра'), 'дом\\, баня\\; 18\\\\лет\\nУра')
  const ics = createIcs().replace(/\r\n /g, '')
  assert.ok(ics.includes('LOCATION:Брянск\\, с. Толмачево\\, СДТ Союз\\, 195'))
  assert.ok(ics.includes('минивэн Hyundai'))
})

test('Google Calendar получает те же даты, адрес и программу', () => {
  const url = new URL(googleCalendarUrl())
  assert.equal(url.searchParams.get('action'), 'TEMPLATE')
  assert.equal(url.searchParams.get('dates'), '20261205T150000Z/20261206T080000Z')
  assert.equal(url.searchParams.get('ctz'), 'Europe/Moscow')
  assert.equal(url.searchParams.get('text'), event.title)
  assert.equal(url.searchParams.get('location'), event.location)
  assert.equal(url.searchParams.get('details'), event.description)
})
