// Giphy integration. Two paths:
//  - fetchGif(query): live search, used only as a fallback for anything not
//    in the curated map below.
//  - fetchNarratorGif(key): fetches a SPECIFIC, hand-picked Giphy GIF id per
//    narrator beat. The Shinchan catalog on Giphy turned out to be tiny and
//    very repetitive (the same ~10 real clips resurface for almost any
//    emotion query), and the top search hit for several screens wasn't even
//    Shinchan — so rather than gamble on live search ranking, every beat was
//    reviewed by hand and pinned to a specific, tonally-correct id. It's
//    still a live Giphy fetch (by id, not a bundled asset), just a curated
//    one instead of "whatever search ranks first today."
import { CURATED_GIFS } from './narratorGifs.js';

const API_KEY = import.meta.env.VITE_GIPHY_API_KEY;
const SEARCH_ENDPOINT = 'https://api.giphy.com/v1/gifs/search';
const BY_ID_ENDPOINT = 'https://api.giphy.com/v1/gifs';

const cache = new Map();

function toResult(item) {
  const url = item?.images?.fixed_height?.url ?? null;
  return url ? { url } : null;
}

/**
 * @param {string} key - a narrator beat id, e.g. 'coldOpen' or 'roast-chef'
 * @returns {Promise<{url: string} | null>}
 */
export async function fetchNarratorGif(key) {
  const id = CURATED_GIFS[key];
  if (!id) return fetchGif(`shinchan ${key}`);
  if (cache.has(key)) return cache.get(key);
  if (!API_KEY) {
    cache.set(key, null);
    return null;
  }
  try {
    const url = `${BY_ID_ENDPOINT}/${id}?api_key=${encodeURIComponent(API_KEY)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`giphy ${res.status}`);
    const data = await res.json();
    const result = toResult(data?.data);
    cache.set(key, result);
    return result;
  } catch (err) {
    console.warn('[giphy] curated fetch failed, falling back to doodle:', err);
    cache.set(key, null);
    return null;
  }
}

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
    const url = `${SEARCH_ENDPOINT}?api_key=${encodeURIComponent(API_KEY)}&q=${encodeURIComponent(query)}&limit=1&rating=pg-13`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`giphy ${res.status}`);
    const data = await res.json();
    const result = toResult(data?.data?.[0]);
    cache.set(query, result);
    return result;
  } catch (err) {
    console.warn('[giphy] search fetch failed, falling back to doodle:', err);
    cache.set(query, null);
    return null;
  }
}
