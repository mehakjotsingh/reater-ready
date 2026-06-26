// Shared quiz definition used by both the /app intake quiz and the /report output.
// Single source of truth so the two never drift.

export const QUIZ_STEPS = [
  {
    id: 'pets',
    step: '1 OF 5',
    icon: '🐾',
    question: 'Do you have pets?',
    subtext: 'This tailors your lease review and what we flag as risky for you.',
    options: [
      { value: 'none', label: 'No pets' },
      { value: 'yes', label: 'Yes, I have a pet' },
    ],
  },
  {
    id: 'roommates',
    step: '2 OF 5',
    icon: '👥',
    question: 'Are you living with roommates?',
    subtext: 'This tailors your lease review and what we flag as risky for you.',
    options: [
      { value: 'solo', label: 'Just me' },
      { value: 'shared', label: 'Yes, on a shared lease' },
    ],
  },
  {
    id: 'cosigner',
    step: '3 OF 5',
    icon: '✅',
    question: 'Do you have a co-signer or guarantor?',
    subtext: 'This tailors your lease review and what we flag as risky for you.',
    options: [
      { value: 'none', label: 'No co-signer' },
      { value: 'yes', label: 'Yes, a parent/guarantor' },
    ],
  },
  {
    id: 'departure',
    step: '4 OF 5',
    icon: '🚪',
    question: "Any chance you'll need to leave early or sublet?",
    subtext: 'This tailors your lease review and what we flag as risky for you.',
    options: [
      { value: 'full', label: 'Staying the full term' },
      { value: 'maybe', label: 'Possibly — study abroad / internship' },
    ],
  },
  {
    id: 'furnished',
    step: '5 OF 5',
    icon: '🛋️',
    question: 'Is the unit furnished?',
    subtext: 'This tailors your move-in inspection checklist and what items we prompt you to document.',
    options: [
      { value: 'no', label: 'Unfurnished' },
      { value: 'yes', label: 'Yes, fully or partially furnished' },
    ],
  },
]

// Turn a saved rr_profile object into readable question/answer rows for display.
export function profileToReadable(profile) {
  if (!profile) return []
  return QUIZ_STEPS
    .filter(q => profile[q.id])
    .map(q => {
      const opt = q.options.find(o => o.value === profile[q.id])
      return { id: q.id, question: q.question, answer: opt ? opt.label : String(profile[q.id]) }
    })
}
