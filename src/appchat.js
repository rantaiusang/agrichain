// src/appchat.js
import { supabase } from './api/supabase.js'

/**
 * Ambil history chat
 */
export async function getChatHistory(roomId) {
  try {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data
  } catch (err) {
    console.error('❌ Gagal ambil chat history:', err.message)
    return []
  }
}

/**
 * Kirim pesan baru
 */
export async function sendMessage(roomId, userId, message) {
  try {
    const { data, error } = await supabase
      .from('chats')
      .insert([{ room_id: roomId, user_id: userId, message }])

    if (error) throw error
    return data
  } catch (err) {
    console.error('❌ Gagal kirim pesan:', err.message)
    return null
  }
}

/**
 * Subscribe realtime chat
 */
export function subscribeToChat(roomId, callback) {
  return supabase
    .channel(room-${roomId})
    .on('postgres_changes', { event: '*', schema: 'public', table: 'chats', filter: room_id=eq.${roomId} }, (payload) => {
      callback(payload.new)
    })
    .subscribe()
}
