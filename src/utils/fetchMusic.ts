import type { Song } from '~/types'
import { NCM_API, NCM_UID } from 'astro:env/server'
import { ofetch } from 'ofetch'

interface Data {
  playCount: number
  score: number
  song: Song
}

interface RankData {
  weekData: Data[]
  allData: Data[]
  code: number
}

const fetcher = ofetch.create({
  baseURL: NCM_API,
  headers: {
    'Cache-Control': 's-max-age=86400, stale-while-revalidate=30', // 缓存一天
    'CDN-Cache-Control': 'max-age=86400',
    'Vercel-CDN-Cache-Control': 'max-age=86400',
  },
  onResponseError({ error }) {
    console.error(error)
  },
})

function parseSong(song: Song) {
  return {
    id: song.id,
    name: song.name,
    ar: song.ar.map(({ id, name }) => ({ id, name })),
    al: {
      id: song.al.id,
      name: song.al.name,
      picUrl: `${song.al.picUrl.replace('http://', 'https://')}?param=128y128`,
    },
    dt: song.dt,
  }
}

export async function musicRank() {
  const url = `${NCM_API}/user/record?uid=${NCM_UID}&type=1`

  const { data } = await fetcher<{ data: RankData }>(url).catch(() => ({ data: null }))

  if (!data)
    return []

  return data.weekData.map(({ song, playCount, score }) => ({
    ...parseSong(song),
    playCount: playCount || 0,
    score,
  })).slice(0, 20)
}

export async function musicLikes() {
  const { data } = await fetcher<{ data: { songs: Song[] } }>('/playlist/track/all?id=2648568306&limit=20').catch(() => ({ data: null }))

  if (!data)
    return []

  return data.songs.map(parseSong)
}
