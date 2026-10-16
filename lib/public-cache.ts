import { unstable_cache } from "next/cache"
import { getBlogs, getBlogBySlug, getProjects, getProjectBySlug } from "@/lib/store"

export const CACHE_TAG_PROJECTS = "projects"
export const CACHE_TAG_BLOGS = "blogs"

const PUBLIC_REVALIDATE_SECONDS = 120

export async function getPublicProjects() {
  return unstable_cache(async () => getProjects(), ["public-projects"], {
    revalidate: PUBLIC_REVALIDATE_SECONDS,
    tags: [CACHE_TAG_PROJECTS],
  })()
}

export async function getPublicProjectBySlug(slug: string) {
  return unstable_cache(async () => getProjectBySlug(slug), ["public-project", slug], {
    revalidate: PUBLIC_REVALIDATE_SECONDS,
    tags: [CACHE_TAG_PROJECTS, `project-${slug}`],
  })()
}

export async function getPublicBlogs() {
  return unstable_cache(async () => getBlogs(true), ["public-blogs"], {
    revalidate: PUBLIC_REVALIDATE_SECONDS,
    tags: [CACHE_TAG_BLOGS],
  })()
}

export async function getPublicBlogBySlug(slug: string) {
  return unstable_cache(async () => getBlogBySlug(slug), ["public-blog", slug], {
    revalidate: PUBLIC_REVALIDATE_SECONDS,
    tags: [CACHE_TAG_BLOGS, `blog-${slug}`],
  })()
}
