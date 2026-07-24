const API_BASE = '/api';

async function fetchJSON(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getCategories() {
  const data = await fetchJSON('/assets/categories');
  return data.categories || [];
}

export async function getCategoryTracks(categoryId) {
  const data = await fetchJSON(`/assets/categories/${categoryId}`);
  return { category: data.category, tracks: data.tracks || [] };
}

export async function getCategoryTracksPreview(categoryId) {
  return getCategoryTracks(categoryId);
}

export function getAudioUrl(track) {
  return `/assets/${track.category || 'unknown'}/${track.file || track.id}.mp3`;
}

export async function searchTracks(query) {
  const data = await fetchJSON(`/search?q=${encodeURIComponent(query)}`);
  return data.tracks || [];
}

export function getThumbnailUrl(track) {
  return `https://img.youtube.com/vi/${track.id}/hqdefault.jpg`;
}

export async function getPlaylists() {
  const data = await fetchJSON('/playlists');
  return data.playlists || [];
}

export async function createPlaylist(name, description) {
  const data = await fetchJSON('/playlists', {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  });
  return data.playlist;
}

export async function getPlaylist(id) {
  const data = await fetchJSON(`/playlists/${id}`);
  return data.playlist;
}

export async function addTrackToPlaylist(playlistId, track) {
  const data = await fetchJSON(`/playlists/${playlistId}/tracks`, {
    method: 'POST',
    body: JSON.stringify({ track }),
  });
  return data.playlist;
}

export async function removeTrackFromPlaylist(playlistId, trackId) {
  const data = await fetchJSON(`/playlists/${playlistId}/tracks/${trackId}`, {
    method: 'DELETE',
  });
  return data.playlist;
}

export async function deletePlaylist(id) {
  await fetchJSON(`/playlists/${id}`, { method: 'DELETE' });
}
