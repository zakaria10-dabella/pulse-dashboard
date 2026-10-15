export const kpis = [
  { id: 'members', label: 'Active members', value: 1284, delta: 4.2, format: 'int', spark: [40, 44, 43, 48, 52, 51, 56, 60] },
  { id: 'revenue', label: 'Revenue (Oct)', value: 486200, delta: 7.8, format: 'madk', spark: [30, 34, 33, 38, 41, 46, 45, 52] },
  { id: 'checkins', label: 'Check-ins today', value: 342, delta: -2.1, format: 'int', spark: [50, 48, 52, 47, 49, 45, 46, 44] },
  { id: 'retention', label: '90-day retention', value: 91.4, delta: 1.3, format: 'pct', spark: [70, 72, 71, 74, 75, 77, 78, 80] },
]

export const revenue = [
  { m: 'Nov', v: 352 }, { m: 'Dec', v: 331 }, { m: 'Jan', v: 418 }, { m: 'Feb', v: 402 },
  { m: 'Mar', v: 389 }, { m: 'Apr', v: 421 }, { m: 'May', v: 436 }, { m: 'Jun', v: 410 },
  { m: 'Jul', v: 395 }, { m: 'Aug', v: 428 }, { m: 'Sep', v: 451 }, { m: 'Oct', v: 486 },
]

export const planMix = [
  { plan: 'Basic', share: 46, color: '#5CC8FF' },
  { plan: 'Premium', share: 37, color: '#9B70FF' },
  { plan: 'Elite', share: 17, color: '#C6F432' },
]

export const peakHours = [12, 18, 34, 22, 15, 19, 28, 46, 72, 88, 64, 30]
export const peakLabels = ['6a', '7a', '8a', '9a', '11a', '1p', '3p', '5p', '6p', '7p', '8p', '9p']
