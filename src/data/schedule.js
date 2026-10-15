export const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const base = [
  { name: 'Sunrise HIIT', time: '07:00', duration: 45, coach: 'Coach Karim', room: 'Studio A', capacity: 20, type: 'HIIT' },
  { name: 'Power Lifting Club', time: '09:30', duration: 60, coach: 'Coach Youssef', room: 'Iron Zone', capacity: 12, type: 'Strength' },
  { name: 'Flow Yoga', time: '12:30', duration: 50, coach: 'Coach Nadia', room: 'Zen Room', capacity: 18, type: 'Mobility' },
  { name: 'Spin 45', time: '18:00', duration: 45, coach: 'Coach Salma', room: 'Cycle Lab', capacity: 24, type: 'Cardio' },
  { name: 'Boxing Fundamentals', time: '19:15', duration: 60, coach: 'Coach Karim', room: 'Ring', capacity: 16, type: 'Combat' },
  { name: 'Core & Stretch', time: '20:30', duration: 30, coach: 'Coach Nadia', room: 'Studio B', capacity: 20, type: 'Mobility' },
]

export const schedule = Object.fromEntries(
  days.map((d, di) => [
    d,
    base
      .filter((_, ci) => (di === 6 ? ci % 2 === 0 : di === 5 ? ci < 4 : (ci + di) % 6 !== 5))
      .map((c, ci) => ({ ...c, id: `${d}-${ci}`, booked: Math.min(c.capacity, Math.round(c.capacity * (0.45 + ((di * 3 + ci * 5) % 11) / 20))) })),
  ]),
)

export const dates = { Mon: 13, Tue: 14, Wed: 15, Thu: 16, Fri: 17, Sat: 18, Sun: 19 }

// muted categorical hues, only ever used as small dots next to a text label
export const typeColor = {
  HIIT: '#D9480F',
  Strength: '#3B5BDB',
  Mobility: '#0C8599',
  Cardio: '#2B8A3E',
  Combat: '#868E96',
}
