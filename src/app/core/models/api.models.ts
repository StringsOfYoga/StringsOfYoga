export interface AuthRequest {
  email: string;
  password: string;
  name?: string;
}

export interface CollectionRequest {
  name: string;
  description?: string;
  isFeatured?: boolean;
}

export interface MediaRequest {
  title: string;
  type: 'audio' | 'video' | 'image' | string;
  url: string;
  thumbnailUrl?: string;
  collectionId?: string;
  description?: string;
  isFeatured?: boolean;
}

export interface GalleryCollection {
  id?: string;
  name?: string;
  title?: string;
  description?: string;
  isFeatured?: boolean;
  image?: string;
}

export interface GalleryMedia {
  id?: string;
  title?: string;
  type?: 'audio' | 'video' | 'image' | string;
  url?: string;
  thumbnailUrl?: string;
  collectionId?: string;
  description?: string;
  isFeatured?: boolean;
  category?: string;
}
