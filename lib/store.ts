import { connectToDatabase } from "./mongodb"
import { BlogModel, IBlog } from "./models/Blog"
import { ProjectModel, IProject } from "./models/Project"

export interface BlogItemData {
  _id?: string
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  readTime: string
  published: boolean
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface ProjectItemData {
  _id?: string
  id?: string
  title: string
  slug: string
  subtitle: string
  projecttype: string
  description: string
  techStack: string[]
  stats: string
  problem?: string
  architecture?: string
  metrics?: string
  liveUrl?: string
  githubUrl?: string
  thumbnail?: string
  banner?: string
  featured: boolean
  createdAt?: string | Date
  updatedAt?: string | Date
}

// Initial High-Quality Seed Data
export const initialBlogs: BlogItemData[] = [
  {
    id: "blog-1",
    slug: "engineering-distributed-state-machines",
    title: "Engineering Distributed State Machines with Zero Drift",
    category: "DISTRIBUTED SYSTEMS",
    readTime: "7 min read",
    published: true,
    excerpt:
      "A deep dive into idempotent message queues, deterministic state synchronization, and handling network partitions across distributed clusters.",
    content: `
# Engineering Distributed State Machines with Zero Drift

Building real-time distributed applications requires confronting a fundamental law of networks: packets will be dropped, connections will partition, and race conditions are an inevitability.

When orchestrating mission-critical state across distributed nodes, relying on naive polling or optimistic client-side transitions inevitably introduces state drift. In this article, I examine the patterns used to guarantee state consistency across high-throughput distributed microservices.

---

### The Fundamental Problem: Split-Brain & Race Conditions

In standard client-server models, a client issues a state change request. If the server acknowledges the request but the network connection drops prior to client receipt, the client assumes failure and retries. Without idempotent message keys, this produces double-execution mutations.

To resolve this, we enforce three architectural invariants:
1. **Idempotency Keys with Redis Leases**: Every mutation carries a unique UUID and a 60-second atomic lease.
2. **Log-Structured State Transitions**: State is never directly mutated in-place; instead, transitions append to an append-only event ledger.
3. **Deterministic State Projection**: Nodes rebuild their memory state by replaying verified transaction logs from a checkpoint.

\`\`\`typescript
interface StateTransition<TState, TEvent> {
  eventId: string;
  timestamp: number;
  type: string;
  payload: TEvent;
  apply: (current: TState) => TState;
}

// Deterministic state reducer
export function projectState<TState, TEvent>(
  initial: TState,
  log: StateTransition<TState, TEvent>[]
): TState {
  return log.reduce((acc, transition) => transition.apply(acc), initial);
}
\`\`\`

---

### Consensus vs Eventual Consistency

While Raft consensus ensures strong consistency across small clusters (3-5 nodes), it incurs a severe latency penalty for global cross-region workloads. By decoupling critical transaction logs from read-heavy projected views, we achieve:
- **Sub-10ms read latency** served directly from read-replica caches.
- **Strict linearizability** on write pipelines backed by PostgreSQL ACID transactions.

> "A resilient system does not assume perfection from the network. It assumes chaos, and designs self-healing deterministic pathways."

---

### Summary & Key Takeaways

1. Never mutate critical state in place without an auditable event ledger.
2. Decouple write-side consistency verification from read-side query acceleration.
3. Treat network disconnection as an expected operational state, not an exceptional error.
`,
    createdAt: new Date("2026-09-20"),
  },
  {
    id: "blog-2",
    slug: "realtime-webgl-shaders-for-creative-computing",
    title: "Sculpting Real-Time Parametric Shaders in Three.js",
    category: "CREATIVE WEBGL",
    readTime: "5 min read",
    published: true,
    excerpt:
      "How to build performant, hardware-accelerated 3D wireframe sculptures that react seamlessly to user scroll velocity and viewport constraints.",
    content: `
# Sculpting Real-Time Parametric Shaders in Three.js

Modern web interfaces frequently err on two extremes: static, lifeless typography or heavy, GPU-choking 3D experiences that cause battery drain and frame drops.

Striking the balance between artistic kinetic expression and mathematical restraint requires treating WebGL not as a toy, but as a precision rendering pipeline.

---

### 1. Minimal Mathematical Geometries

Instead of loading massive 50MB \`.gltf\` models with heavy UV textures, procedural parametric geometries offer infinite resolution at virtually zero network cost.

By composing a geodesic **Icosahedron wireframe** alongside a **Torus Knot core**, we achieve rich geometric complexity through pure code:

\`\`\`javascript
const outerGeo = new THREE.IcosahedronGeometry(1.6, 2);
const outerMat = new THREE.MeshBasicMaterial({
  color: 0x9e9ea7,
  wireframe: true,
  transparent: true,
  opacity: 0.35,
});
const mesh = new THREE.Mesh(outerGeo, outerMat);
scene.add(mesh);
\`\`\`

---

### 2. Smooth Scroll Coupling via Linear Interpolation (Lerp)

Directly coupling scroll position to 3D rotation produces jagged stuttering. Instead, we decouple the scroll listener from the animation loop using smooth linear interpolation:

\`\`\`javascript
// Update scroll target in passive event listener
window.addEventListener('scroll', () => {
  targetScrollProgress = window.scrollY / maxScroll;
}, { passive: true });

// Lerp inside requestAnimationFrame loop
scrollProgress += (targetScrollProgress - scrollProgress) * 0.08;
mesh.rotation.y = time * 0.2 + scrollProgress * Math.PI * 2;
\`\`\`

The result is a tactile, organic responsiveness that feels grounded in real-world physics.
`,
    createdAt: new Date("2026-10-02"),
  },
  {
    id: "blog-3",
    slug: "minimalism-and-the-art-of-subtraction",
    title: "Minimalism and the Architectural Art of Subtraction",
    category: "DESIGN PHILOSOPHY",
    readTime: "4 min read",
    published: true,
    excerpt:
      "Why the best software is defined not by the features we accumulate, but by the negative space and intentional constraints we preserve.",
    content: `
# Minimalism and the Architectural Art of Subtraction

Every UI component, every line of JavaScript, and every database index carries an ongoing cognitive and operational tax.

When building web applications, the easiest path is additive: adding more buttons, more badges, more gradients, more analytics scripts. The rigorous path is subtractive: removing until only the essential structure remains.

---

### Negative Space as an Active Component

In Swiss graphic design and brutalist architecture, whitespace is not "empty space" to be filled. It is the active force that guides the user's eye, establishes rhythm, and elevates content from noise into signal.

When we give headings room to breathe (e.g. 100px+ vertical padding) and restrict color palettes to curated neutrals with an intentional accent, the user feels calm, focused, and empowered.

---

### Three Subtractive Rules for Engineers:

1. **Eliminate Non-Essential Borders**: Rely on typographic hierarchy and whitespace before adding bounding boxes.
2. **Cap Animation Durations**: Animations should never make a user wait. Keep micro-interactions between 150ms and 250ms with clean easing.
3. **Respect Device Constraints**: Design interfaces that load in sub-200ms and operate flawlessly on mobile networks.
`,
    createdAt: new Date("2026-10-10"),
  },
]

export const initialProjects: ProjectItemData[] = [
  {
    id: "proj-1",
    slug: "apex-telemetry-engine",
    title: "Apex Engine",
    subtitle: "Realtime Telemetry & Stream Processing",
    projecttype: "Distributed Systems · Full Stack",
    description:
      "High-performance telemetry platform ingesting 50k+ metrics/sec. Features real-time WebSocket state synchronization, interactive spatial charts, and sub-millisecond query pipelines.",
    techStack: ["Next.js", "TypeScript", "Three.js", "Redis", "PostgreSQL"],
    stats: "50k evt/sec · 99.98% uptime",
    problem:
      "Distributed IoT and microservice deployments generated disjointed log formats, causing telemetry latency exceeding 4.2 seconds during peak traffic bursts.",
    architecture:
      "Engineered an event-driven ingestion pipeline utilizing Redis streams for atomic buffering, feeding into a clustered PostgreSQL time-series table. Real-time dashboards subscribe to WebSocket rooms powered by Node.js worker pools.",
    metrics:
      "Reduced end-to-end telemetry ingestion latency from 4,200ms to 12ms. Maintained 99.98% availability under continuous 50,000 metrics/second load.",
    liveUrl: "https://apex-telemetry.example.com",
    githubUrl: "https://github.com/User-manjil/apex-engine",
    featured: true,
    createdAt: new Date("2026-08-15"),
  },
  {
    id: "proj-2",
    slug: "kroma-audio-visual-studio",
    title: "Kroma Studio",
    subtitle: "Parametric Audio-Visual Synthesis Canvas",
    projecttype: "Creative Computing · WebGL",
    description:
      "Hardware-accelerated browser workstation coupling the Web Audio API with real-time GLSL fragment shaders. Supports dynamic frequency modulation and preset exports.",
    techStack: ["React 19", "Three.js", "WebGL", "Web Audio API", "Tailwind"],
    stats: "60 FPS rendering · 0ms latency audio",
    problem:
      "Traditional browser-based audio visualizers suffered from main-thread frame drops, resulting in desynchronized audio waveforms and degraded user interaction.",
    architecture:
      "Offloaded frequency spectrum FFT analysis to Web Audio audio worklets running on a dedicated audio thread. Rendered complex parametric wireframes and particle geometries using Three.js with instanced buffer attributes.",
    metrics:
      "Achieved locked 60 FPS across desktop and mobile devices while synthesizing multiple audio channels concurrently.",
    liveUrl: "https://kroma-studio.example.com",
    githubUrl: "https://github.com/User-manjil/kroma-studio",
    featured: true,
    createdAt: new Date("2026-09-01"),
  },
  {
    id: "proj-3",
    slug: "voxel-distributed-store",
    title: "Voxel Data Store",
    subtitle: "Distributed Document Store & Query Explorer",
    projecttype: "Backend Architecture · Database",
    description:
      "Low-latency document store explorer with visual query explain plans, automated sharding simulation, and Raft consensus cluster diagnostics.",
    techStack: ["Node.js", "MongoDB", "Express", "Docker", "TypeScript"],
    stats: "Multi-cluster sync · ACID compliance",
    problem:
      "Engineering teams lacked visibility into distributed partition balancing and transaction locks across replicated MongoDB sharded clusters.",
    architecture:
      "Developed a lightweight telemetry daemon in Node.js that taps into MongoDB oplog events and Raft leader elections. Visualized topology clusters and shard distribution in real time.",
    metrics:
      "Identified and mitigated replication lag spikes by 78%, enabling automated failover testing with zero data loss.",
    liveUrl: "https://voxel-store.example.com",
    githubUrl: "https://github.com/User-manjil/voxel-store",
    featured: true,
    createdAt: new Date("2026-09-28"),
  },
]

// In-Memory fallback store
let memoryBlogs: BlogItemData[] = [...initialBlogs]
let memoryProjects: ProjectItemData[] = [...initialProjects]

let dbSeedChecked = false

// Helper to seed Mongo if empty (runs once per server instance)
async function ensureDbSeeded() {
  if (dbSeedChecked) return

  try {
    await connectToDatabase()
    const blogCount = await BlogModel.countDocuments()
    if (blogCount === 0) {
      await BlogModel.insertMany(initialBlogs)
    }
    const projectCount = await ProjectModel.countDocuments()
    if (projectCount === 0) {
      await ProjectModel.insertMany(initialProjects)
    }
    dbSeedChecked = true
  } catch (err) {
    console.warn("MongoDB connection fallback to memory store:", (err as Error).message)
  }
}

// BLOG METHODS
export async function getBlogs(onlyPublished = false): Promise<BlogItemData[]> {
  try {
    await ensureDbSeeded()
    const query = onlyPublished ? { published: true } : {}
    const docs = await BlogModel.find(query).sort({ createdAt: -1 }).lean()
    if (docs && docs.length > 0) {
      return docs.map((d) => ({
        ...d,
        _id: d._id.toString(),
        id: d._id.toString(),
      })) as BlogItemData[]
    }
  } catch {
    // fallback
  }

  return memoryBlogs.filter((b) => (onlyPublished ? b.published : true))
}

export async function getBlogBySlug(slug: string): Promise<BlogItemData | null> {
  try {
    await ensureDbSeeded()
    const doc = await BlogModel.findOne({ slug }).lean()
    if (doc) {
      return { ...doc, _id: doc._id.toString(), id: doc._id.toString() } as BlogItemData
    }
  } catch {
    // fallback
  }

  return memoryBlogs.find((b) => b.slug === slug) || null
}

export async function getBlogById(id: string): Promise<BlogItemData | null> {
  try {
    await ensureDbSeeded()
    if (id.length === 24) {
      const doc = await BlogModel.findById(id).lean()
      if (doc) {
        return { ...doc, _id: doc._id.toString(), id: doc._id.toString() } as BlogItemData
      }
    }
  } catch {
    // fallback
  }

  return memoryBlogs.find((b) => b.id === id || b._id === id) || null
}

export async function createBlog(
  data: Omit<BlogItemData, "id" | "_id" | "createdAt" | "updatedAt">
): Promise<BlogItemData> {
  try {
    await connectToDatabase()
    const doc = await BlogModel.create(data)
    const result = { ...doc.toObject(), _id: doc._id.toString(), id: doc._id.toString() }
    memoryBlogs.unshift(result)
    return result
  } catch (err) {
    console.warn("Saving to memory store due to DB error:", (err as Error).message)
    const newBlog: BlogItemData = {
      ...data,
      id: "blog-" + Date.now(),
      _id: "blog-" + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    memoryBlogs.unshift(newBlog)
    return newBlog
  }
}

export async function updateBlog(
  id: string,
  data: Partial<BlogItemData>
): Promise<BlogItemData | null> {
  try {
    await connectToDatabase()
    if (id.length === 24) {
      const doc = await BlogModel.findByIdAndUpdate(id, data, { new: true }).lean()
      if (doc) {
        const updated = { ...doc, _id: doc._id.toString(), id: doc._id.toString() } as BlogItemData
        memoryBlogs = memoryBlogs.map((b) => (b.id === id || b._id === id ? updated : b))
        return updated
      }
    }
  } catch {
    // fallback
  }

  const index = memoryBlogs.findIndex((b) => b.id === id || b._id === id)
  if (index !== -1) {
    memoryBlogs[index] = { ...memoryBlogs[index], ...data, updatedAt: new Date() }
    return memoryBlogs[index]
  }

  return null
}

export async function deleteBlog(id: string): Promise<boolean> {
  try {
    await connectToDatabase()
    if (id.length === 24) {
      await BlogModel.findByIdAndDelete(id)
    }
  } catch {
    // fallback
  }

  memoryBlogs = memoryBlogs.filter((b) => b.id !== id && b._id !== id)
  return true
}

// PROJECT / CASE STUDY METHODS
export async function getProjects(): Promise<ProjectItemData[]> {
  try {
    await ensureDbSeeded()
    const docs = await ProjectModel.find().sort({ createdAt: -1 }).lean()
    if (docs && docs.length > 0) {
      return docs.map((d) => ({
        ...d,
        _id: d._id.toString(),
        id: d._id.toString(),
      })) as ProjectItemData[]
    }
  } catch {
    // fallback
  }

  return memoryProjects
}

export async function getProjectBySlug(slug: string): Promise<ProjectItemData | null> {
  try {
    await ensureDbSeeded()
    const doc = await ProjectModel.findOne({ slug }).lean()
    if (doc) {
      return { ...doc, _id: doc._id.toString(), id: doc._id.toString() } as ProjectItemData
    }
  } catch {
    // fallback
  }

  return memoryProjects.find((p) => p.slug === slug) || null
}

export async function getProjectById(id: string): Promise<ProjectItemData | null> {
  try {
    await ensureDbSeeded()
    if (id.length === 24) {
      const doc = await ProjectModel.findById(id).lean()
      if (doc) {
        return { ...doc, _id: doc._id.toString(), id: doc._id.toString() } as ProjectItemData
      }
    }
  } catch {
    // fallback
  }

  return memoryProjects.find((p) => p.id === id || p._id === id) || null
}

export async function createProject(
  data: Omit<ProjectItemData, "id" | "_id" | "createdAt" | "updatedAt">
): Promise<ProjectItemData> {
  try {
    await connectToDatabase()
    const doc = await ProjectModel.create(data)
    const result = { ...doc.toObject(), _id: doc._id.toString(), id: doc._id.toString() }
    memoryProjects.unshift(result)
    return result
  } catch (err) {
    console.warn("Saving project to memory store due to DB error:", (err as Error).message)
    const newProj: ProjectItemData = {
      ...data,
      id: "proj-" + Date.now(),
      _id: "proj-" + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    memoryProjects.unshift(newProj)
    return newProj
  }
}

export async function updateProject(
  id: string,
  data: Partial<ProjectItemData>
): Promise<ProjectItemData | null> {
  try {
    await connectToDatabase()
    if (id.length === 24) {
      const doc = await ProjectModel.findByIdAndUpdate(id, data, { new: true }).lean()
      if (doc) {
        const updated = { ...doc, _id: doc._id.toString(), id: doc._id.toString() } as ProjectItemData
        memoryProjects = memoryProjects.map((p) => (p.id === id || p._id === id ? updated : p))
        return updated
      }
    }
  } catch {
    // fallback
  }

  const index = memoryProjects.findIndex((p) => p.id === id || p._id === id)
  if (index !== -1) {
    memoryProjects[index] = { ...memoryProjects[index], ...data, updatedAt: new Date() }
    return memoryProjects[index]
  }

  return null
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    await connectToDatabase()
    if (id.length === 24) {
      await ProjectModel.findByIdAndDelete(id)
    }
  } catch {
    // fallback
  }

  memoryProjects = memoryProjects.filter((p) => p.id !== id && p._id !== id)
  return true
}
