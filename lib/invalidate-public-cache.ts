import { revalidateTag } from "next/cache"
import { CACHE_TAG_BLOGS, CACHE_TAG_PROJECTS } from "@/lib/public-cache"

export function invalidateProjectsCache(slug?: string) {
  revalidateTag(CACHE_TAG_PROJECTS)
  if (slug) revalidateTag(`project-${slug}`)
}

export function invalidateBlogsCache(slug?: string) {
  revalidateTag(CACHE_TAG_BLOGS)
  if (slug) revalidateTag(`blog-${slug}`)
}
