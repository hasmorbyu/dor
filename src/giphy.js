// Giphy integration: fetch-on-demand per screen, cached for the session so
// repeat visits to a screen (or a replay) don't re-fetch, with a graceful
// fallback to a hand-drawn doodle if there's no key or the request fails.

const API_KEY = import.meta.env.VITE_GIPHY_API_KEY;
const ENDPOINT = 'https://api.giphy.com/v1/gifs/search';

const cache = new Map();

/**
 * @param {string} query - search term, e.g. "shinchan confused"
 * @returns {Promise<{url: string} | null>} null means "use the doodle fallback"
 */
export async function fetchGif(query) {
  if (cache.has(query)) return cache.get(query);

  if (!API_KEY) {
    cache.set(query, null);
    return null;
  }

  try {
    const url = `${ENDPOINT}?api_key=${encodeURIComponent(API_KEY)}&q=${encodeURIComponent(query)}&limit=1&rating=pg-13`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`giphy ${res.status}`);
    const data = await res.json();
    const gif = data?.data?.[0]?.images?.fixed_height?.url ?? null;
    const result = gif ? { url: gif } : null;
    cache.set(query, result);
    return result;
  } catch (err) {
    console.warn('[giphy] fetch failed, falling back to doodle:', err);
    cache.set(query, null);
    return null;
  }
}
