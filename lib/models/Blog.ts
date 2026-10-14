import mongoose, { Schema, Document, Model } from "mongoose"

export interface IBlog extends Document {
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  readTime: string
  published: boolean
  createdAt: Date
  updatedAt: Date
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, default: "ENGINEERING" },
    readTime: { type: String, default: "5 min read" },
    published: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
)

export const BlogModel: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema)
