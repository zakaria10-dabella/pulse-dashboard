const raw = [
  ['Yasmine El Idrissi', 'Elite', 'Active', '2023-02-14', 0, 22, 'Anfa', 'Coach Salma'],
  ['Omar Benjelloun', 'Premium', 'Active', '2024-06-03', 1, 18, 'Maarif', 'Coach Karim'],
  ['Salma Tazi', 'Basic', 'Paused', '2022-11-21', 34, 0, 'Ain Diab', 'Coach Nadia'],
  ['Mehdi Alaoui', 'Elite', 'Active', '2021-09-08', 0, 25, 'Maarif', 'Coach Karim'],
  ['Kenza Berrada', 'Premium', 'Overdue', '2024-01-17', 12, 6, 'Anfa', 'Coach Salma'],
  ['Hamza Chraibi', 'Basic', 'Active', '2025-03-02', 2, 11, 'Ain Diab', 'Coach Youssef'],
  ['Nour Fassi', 'Premium', 'Active', '2023-07-29', 0, 20, 'Anfa', 'Coach Nadia'],
  ['Adam Lahlou', 'Elite', 'Active', '2022-04-11', 1, 19, 'Maarif', 'Coach Youssef'],
  ['Imane Kettani', 'Basic', 'Overdue', '2025-01-05', 21, 3, 'Ain Diab', 'Coach Salma'],
  ['Rayan Sefrioui', 'Premium', 'Active', '2024-09-14', 3, 14, 'Anfa', 'Coach Karim'],
  ['Lina Bennani', 'Elite', 'Active', '2020-12-01', 0, 24, 'Maarif', 'Coach Nadia'],
  ['Youssef Amrani', 'Basic', 'Active', '2025-05-19', 4, 9, 'Ain Diab', 'Coach Youssef'],
  ['Ghita Ouazzani', 'Premium', 'Paused', '2023-03-23', 48, 0, 'Anfa', 'Coach Salma'],
  ['Anas Filali', 'Premium', 'Active', '2024-02-08', 1, 16, 'Maarif', 'Coach Karim'],
  ['Sara Mernissi', 'Elite', 'Active', '2022-08-30', 0, 21, 'Anfa', 'Coach Nadia'],
  ['Karim Zniber', 'Basic', 'Active', '2025-07-07', 5, 8, 'Ain Diab', 'Coach Youssef'],
  ['Hiba Squalli', 'Premium', 'Overdue', '2023-10-12', 15, 4, 'Maarif', 'Coach Salma'],
  ['Zakaria Naciri', 'Elite', 'Active', '2021-05-16', 0, 23, 'Anfa', 'Coach Karim'],
  ['Meryem Belkadi', 'Basic', 'Active', '2025-08-25', 2, 12, 'Ain Diab', 'Coach Nadia'],
  ['Ilyas Guessous', 'Premium', 'Active', '2024-04-04', 1, 17, 'Maarif', 'Coach Youssef'],
  ['Aya Skalli', 'Basic', 'Paused', '2024-11-11', 39, 0, 'Anfa', 'Coach Salma'],
  ['Othmane Kabbaj', 'Elite', 'Active', '2022-01-27', 0, 26, 'Maarif', 'Coach Karim'],
  ['Rim Tahiri', 'Premium', 'Active', '2023-12-19', 2, 15, 'Ain Diab', 'Coach Nadia'],
  ['Soufiane Jettou', 'Basic', 'Active', '2025-09-30', 6, 7, 'Anfa', 'Coach Youssef'],
]

const hues = [262, 280, 200, 160, 20, 330, 45, 240]

export const members = raw.map(([name, plan, status, joined, lastVisitDaysAgo, visits, branch, coach], i) => ({
  id: `M-${(1042 + i * 7).toString()}`,
  name,
  initials: name.split(' ').map((p) => p[0]).join('').slice(0, 2),
  hue: hues[i % hues.length],
  plan,
  status,
  joined,
  lastVisitDaysAgo,
  visits,
  branch,
  coach,
  // last 8 weeks of check-ins, deterministic
  weekly: Array.from({ length: 8 }, (_, w) => (status === 'Paused' && w > 5 ? 0 : Math.max(0, Math.round(((visits + 3) / 4) * (0.7 + ((i * 7 + w * 13) % 10) / 16))))),
  goal: ['Strength', 'Weight loss', 'Endurance', 'Mobility', 'Hypertrophy'][i % 5],
}))

export const planPrice = { Basic: 299, Premium: 499, Elite: 899 }
