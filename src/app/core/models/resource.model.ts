export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video' | 'audio' | 'pdf' | 'document' | 'youtube' | 'vimeo' | 'external';
  mediaUrl: string;
  thumbnailUrl?: string;
  publicId?: string;
  fileSize?: number;
  mimeType?: string;
  tags: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}
