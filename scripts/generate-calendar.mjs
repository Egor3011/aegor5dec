import { writeFile } from 'node:fs/promises'
import { createIcs } from '../src/calendar.js'

await writeFile(new URL('../public/egor-18.ics', import.meta.url), createIcs())
console.log('Событие календаря создано: public/egor-18.ics')
