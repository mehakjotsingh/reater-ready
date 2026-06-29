'use client'
import { createClient } from './supabase/client'

// Async data-access layer backed by Supabase (per-user via RLS).
// Functions return objects shaped like the old localStorage records so the
// UI components need minimal changes.

const QUIZ_FIELDS = ['pets', 'roommates', 'cosigner', 'departure', 'furnished']

export async function getCurrentUser() {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  return data?.user ?? null
}

/* ---------------- Profile / quiz answers ---------------- */
export async function getProfile() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, pets, roommates, cosigner, departure, furnished')
    .maybeSingle()
  if (error) throw error
  return data
}

// True once the user has completed the setup quiz.
export function quizComplete(profile) {
  return !!(profile && profile.pets)
}

export async function saveQuizAnswers(answers) {
  const supabase = createClient()
  const user = await getCurrentUser()
  if (!user) throw new Error('Not signed in')
  const row = { id: user.id, updated_at: new Date().toISOString() }
  for (const f of QUIZ_FIELDS) row[f] = answers[f] ?? null
  const { error } = await supabase.from('profiles').upsert(row)
  if (error) throw error
}

/* ---------------- Calendar ---------------- */
export async function listCalendar() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('calendar_events')
    .select('id, type, title, date')
    .order('date', { ascending: true })
  if (error) throw error
  return data || []
}

export async function addCalendar({ type, title, date }) {
  const supabase = createClient()
  const user = await getCurrentUser()
  if (!user) throw new Error('Not signed in')
  const { data, error } = await supabase
    .from('calendar_events')
    .insert({ user_id: user.id, type, title, date })
    .select('id, type, title, date')
    .single()
  if (error) throw error
  return data
}

export async function deleteCalendar(id) {
  const supabase = createClient()
  const { error } = await supabase.from('calendar_events').delete().eq('id', id)
  if (error) throw error
}

/* ---------------- Maintenance ---------------- */
function mapMaint(r) {
  return { id: r.id, title: r.title, room: r.room, note: r.note, status: r.status, msg: r.msg || '', created: r.created_at }
}

export async function listMaintenance() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('maintenance_issues')
    .select('id, title, room, note, status, msg, created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(mapMaint)
}

export async function addMaintenance({ title, room, note }) {
  const supabase = createClient()
  const user = await getCurrentUser()
  if (!user) throw new Error('Not signed in')
  const { data, error } = await supabase
    .from('maintenance_issues')
    .insert({ user_id: user.id, title, room, note, status: 'open', msg: '' })
    .select('id, title, room, note, status, msg, created_at')
    .single()
  if (error) throw error
  return mapMaint(data)
}

export async function updateMaintenance(id, patch) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('maintenance_issues')
    .update(patch)
    .eq('id', id)
    .select('id, title, room, note, status, msg, created_at')
    .single()
  if (error) throw error
  return mapMaint(data)
}

export async function deleteMaintenance(id) {
  const supabase = createClient()
  const { error } = await supabase.from('maintenance_issues').delete().eq('id', id)
  if (error) throw error
}

/* ---------------- Rent ---------------- */
function mapRent(r) {
  return { id: r.id, month: r.month, amount: r.amount, method: r.method, paid: r.paid_at }
}

export async function listRent() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('rent_payments')
    .select('id, month, amount, method, paid_at')
    .order('paid_at', { ascending: false })
  if (error) throw error
  return (data || []).map(mapRent)
}

export async function addRent({ month, amount, method }) {
  const supabase = createClient()
  const user = await getCurrentUser()
  if (!user) throw new Error('Not signed in')
  const { data, error } = await supabase
    .from('rent_payments')
    .insert({ user_id: user.id, month, amount, method })
    .select('id, month, amount, method, paid_at')
    .single()
  if (error) throw error
  return mapRent(data)
}

export async function deleteRent(id) {
  const supabase = createClient()
  const { error } = await supabase.from('rent_payments').delete().eq('id', id)
  if (error) throw error
}

/* ---------------- Roommate agreement ---------------- */
const RM_BLANK = { address: '', startDate: '', roommates: [], terms: {}, generated: '', generatedAt: '', signatures: {} }

function mapRoommate(r) {
  if (!r) return { ...RM_BLANK }
  return {
    address: r.address || '',
    startDate: r.start_date || '',
    roommates: r.roommates || [],
    terms: r.terms || {},
    generated: r.generated || '',
    generatedAt: r.generated_at || '',
    signatures: r.signatures || {},
  }
}

export async function getRoommate() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('roommate_agreements')
    .select('address, start_date, roommates, terms, generated, generated_at, signatures')
    .maybeSingle()
  if (error) throw error
  return mapRoommate(data)
}

export async function saveRoommate(d) {
  const supabase = createClient()
  const user = await getCurrentUser()
  if (!user) throw new Error('Not signed in')
  const row = {
    user_id: user.id,
    address: d.address || null,
    start_date: d.startDate || null,
    roommates: d.roommates || [],
    terms: d.terms || {},
    generated: d.generated || null,
    generated_at: d.generatedAt || null,
    signatures: d.signatures || {},
    updated_at: new Date().toISOString(),
  }
  const { error } = await supabase.from('roommate_agreements').upsert(row)
  if (error) throw error
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
}
