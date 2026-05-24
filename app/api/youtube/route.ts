import { NextRequest } from 'next/server'

export const runtime = 'edge'

export interface YTVideo {
  id: string
  title: string
  channel: string
  thumbnail: string
  publishedAt: string
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')
  const maxResults = Number(req.nextUrl.searchParams.get('max') ?? '3')
  const apiKey = process.env.YOUTUBE_API_KEY

  if (!query) {
    return Response.json({ videos: [], error: 'query obrigatória' }, { status: 400 })
  }

  if (!apiKey) {
    return Response.json(
      { videos: [], error: 'YOUTUBE_API_KEY não configurada' },
      { status: 503 }
    )
  }

  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/search')
    url.searchParams.set('key', apiKey)
    url.searchParams.set('q', query)
    url.searchParams.set('part', 'snippet')
    url.searchParams.set('type', 'video')
    url.searchParams.set('maxResults', String(maxResults))
    url.searchParams.set('order', 'relevance')
    url.searchParams.set('videoEmbeddable', 'true')
    url.searchParams.set('relevanceLanguage', 'pt')
    url.searchParams.set('regionCode', 'BR')
    url.searchParams.set('safeSearch', 'strict')

    const res = await fetch(url.toString())
    if (!res.ok) {
      const err = await res.json()
      return Response.json({ videos: [], error: err?.error?.message ?? 'Erro YouTube API' }, { status: res.status })
    }

    const data = await res.json()
    const videos: YTVideo[] = (data.items ?? []).map((item: {
      id: { videoId: string }
      snippet: { title: string; channelTitle: string; thumbnails: { medium: { url: string } }; publishedAt: string }
    }) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium.url,
      publishedAt: item.snippet.publishedAt,
    }))

    return Response.json({ videos })
  } catch (err) {
    return Response.json({ videos: [], error: 'Erro interno' }, { status: 500 })
  }
}
