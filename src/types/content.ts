export interface Project{
    title: string,
    description: string,
    thumbnail: string,
    link: string,
    published: string,
    github: string,
    tags: string[],
    createAt :Date,
    updateAt:Date
    
}
export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}