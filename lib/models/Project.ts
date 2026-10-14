import mongoose, { Schema, Document, Model } from "mongoose"

export interface IProject extends Document {
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
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    subtitle: { type: String, default: "" },
    projecttype: { type: String, required: true },
    description: { type: String, required: true },
    techStack: { type: [String], default: [] },
    stats: { type: String, default: "" },
    problem: { type: String, default: "" },
    architecture: { type: String, default: "" },
    metrics: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    featured: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
)

export const ProjectModel: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema)
