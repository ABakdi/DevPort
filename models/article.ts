import mongoose, { Schema, models, model } from "mongoose"

export interface IArticle {
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage?: string
  category: string
  tags: string[]
  author: {
    name: string
    avatar?: string
  }
  status: 'draft' | 'published'
  publishedAt?: Date
  readingTime: number
  views: number
  seo: {
    title?: string
    description?: string
    keywords?: string[]
  }
  social: {
    twitter?: string
    linkedin?: string
  }
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

const ArticleSchema = new Schema<IArticle>({
  title: {
    type: String,
    required: [true, "Title is required"],
    maxlength: [200, "Title cannot exceed 200 characters"],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, "Slug is required"],
    maxlength: [200, "Slug cannot exceed 200 characters"],
    lowercase: true,
    trim: true,
  },
  excerpt: {
    type: String,
    maxlength: [500, "Excerpt cannot exceed 500 characters"],
    default: "",
  },
  content: {
    type: String,
    required: [true, "Content is required"],
    default: "",
  },
  featuredImage: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    maxlength: [50, "Category cannot exceed 50 characters"],
    default: "General",
  },
  tags: {
    type: [String],
    validate: {
      validator: function(v: string[]) {
        return v.length <= 10 && v.every(t => t.length <= 30)
      },
      message: "Maximum 10 tags, each up to 30 characters"
    },
    default: [],
  },
  author: {
    name: {
      type: String,
      required: [true, "Author name is required"],
      maxlength: [100, "Author name cannot exceed 100 characters"],
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  publishedAt: {
    type: Date,
  },
  readingTime: {
    type: Number,
    default: 5,
  },
  views: {
    type: Number,
    default: 0,
  },
  seo: {
    title: {
      type: String,
      maxlength: [60, "SEO title cannot exceed 60 characters"],
    },
    description: {
      type: String,
      maxlength: [160, "SEO description cannot exceed 160 characters"],
    },
    keywords: {
      type: [String],
      default: [],
    },
  },
  social: {
    twitter: {
      type: String,
      default: "",
    },
    linkedin: {
      type: String,
      default: "",
    },
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
})

ArticleSchema.index({ slug: 1 }, { unique: true })
ArticleSchema.index({ status: 1, publishedAt: -1 })
ArticleSchema.index({ category: 1 })
ArticleSchema.index({ tags: 1 })
ArticleSchema.index({ title: 'text', excerpt: 'text', content: 'text' })

export const Article = models.Article || model<IArticle>("Article", ArticleSchema)
