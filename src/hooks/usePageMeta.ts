import { useEffect } from 'react'
import { site } from '@/config/site'

interface PageMeta {
  title: string
  description?: string
  /** Route path, e.g. "/portfolio" — used for the canonical URL. */
  path: string
}

function setMeta(selector: string, attribute: 'content' | 'href', value: string) {
  document.querySelector(selector)?.setAttribute(attribute, value)
}

/** Keep <title>, description, canonical and og:url in sync with the current page. */
export function usePageMeta({ title, description = site.description, path }: PageMeta) {
  useEffect(() => {
    const url = `${site.url}${path === '/' ? '/' : path}`
    document.title = title
    setMeta('meta[name="description"]', 'content', description)
    setMeta('meta[property="og:title"]', 'content', title)
    setMeta('meta[property="og:description"]', 'content', description)
    setMeta('meta[property="og:url"]', 'content', url)
    setMeta('link[rel="canonical"]', 'href', url)
  }, [title, description, path])
}
