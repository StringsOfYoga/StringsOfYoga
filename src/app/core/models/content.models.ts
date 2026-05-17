export interface SiteBrand {
  name: string;
  slogan: string;
  mission: string;
  vision: string;
  email: string;
  phone: string;
}

export interface HeroSlide {
  title: string;
  description: string;
  image: string;
  ctaPrimary: { label: string; route: string };
  ctaSecondary?: { label: string; route: string };
}

export interface SiteContent {
  brand: SiteBrand;
  about: {
    headline: string;
    story: string;
    philosophy: string;
    image: string;
  };
  heroSlides: HeroSlide[];
  quote: { text: string; author: string };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  format: string;
  image: string;
  slug: string;
}

export interface Workshop {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  duration: string;
  spots: number;
  image: string;
  category: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  readMinutes: number;
  body: string;
}

export interface ContentCollection {
  id: string;
  name: string;
  description?: string;
  isFeatured?: boolean;
  image?: string;
}

export interface ContentMedia {
  id: string;
  title: string;
  type: 'audio' | 'video' | 'image' | 'pdf' | string;
  url: string;
  thumbnailUrl?: string;
  collectionId?: string;
  description?: string;
  isFeatured?: boolean;
  category?: string;
}

export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}
