import { SUPABASE_TABLE } from '../config/appConfig'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

export async function submitEmail(payload) {
  if (!isSupabaseConfigured || !supabase) {
    return { error: new Error('Supabase belum dikonfigurasi.') }
  }

  const organization = payload.organization?.trim()
  const email = payload.email?.trim().toLowerCase()

  if (!organization || !email) {
    return { error: new Error('Divisi dan email wajib diisi.') }
  }

  const { error } = await supabase.from(SUPABASE_TABLE).insert([
    {
      organization,
      email,
    },
  ])

  if (error) {
    const isDuplicate =
      error.code === '23505' || /duplicate|unique/i.test(error.message || '')
    if (isDuplicate) {
      return {
        error: new Error(
          'Divisi ini sudah pernah claim. Silakan hubungi admin.',
        ),
      }
    }
  }

  return { error }
}

export async function fetchSubmissions() {
  if (!isSupabaseConfigured || !supabase) {
    return { data: [], error: new Error('Supabase belum dikonfigurasi.') }
  }

  return supabase
    .from(SUPABASE_TABLE)
    .select('id, organization, email, created_at')
    .order('created_at', { ascending: false })
}

export async function deleteSubmission(id) {
  if (!isSupabaseConfigured || !supabase) {
    return { error: new Error('Supabase belum dikonfigurasi.') }
  }

  if (!id) {
    return { error: new Error('ID tidak valid.') }
  }

  const { error } = await supabase.from(SUPABASE_TABLE).delete().eq('id', id)
  return { error }
}
