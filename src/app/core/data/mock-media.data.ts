import { ContentCollection, ContentMedia } from '../models/content.models';

/** In-memory fallback when JSON assets are unavailable. */
export const MOCK_MEDIA: ContentMedia[] = [
  {
    id: 'm1',
    title: 'Guided Yoga Nidra',
    type: 'audio',
    url: '/assets/audio/yoga-nidra.mp3',
    thumbnailUrl: 'download4.jpg',
    collectionId: 'sleep-better',
    description: 'A 25-minute practice for deep rest.',
    isFeatured: true,
    category: 'Yog Nidra'
  },
  {
    id: 'm2',
    title: 'Guided Yoga Nidra for Sleep',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=VFJwKU-o5dE',
    thumbnailUrl: 'download2.jpg',
    collectionId: 'sleep-better',
    isFeatured: true,
    category: 'Sleep'
  },
  {
    id: 'm3',
    title: '30-Minute Yoga Nidra',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=inpok4MKVLM',
    thumbnailUrl: 'download3.jpg',
    collectionId: 'sleep-better',
    isFeatured: true,
    category: 'Yog Nidra'
  },
  {
    id: 'm4',
    title: 'Morning Breath Awareness',
    type: 'audio',
    url: '/assets/audio/yoga-nidra.mp3',
    thumbnailUrl: 'download1.jpg',
    collectionId: 'morning-calm',
    isFeatured: false,
    category: 'Breathwork'
  },
  {
    id: 'm5',
    title: 'Grounding PDF Guide',
    type: 'pdf',
    url: '/assets/STRINGS OF YOGA planning-.pdf',
    thumbnailUrl: 'download5.jpg',
    collectionId: 'anxiety-relief-series',
    description: 'Printable grounding exercises for anxious moments.',
    isFeatured: false,
    category: 'Anxiety'
  },
  {
    id: 'm6',
    title: 'Yoga Nidra — Deep Rest',
    type: 'image',
    url: 'download1.jpg',
    thumbnailUrl: 'download1.jpg',
    collectionId: 'beginner-breathwork',
    isFeatured: false,
    category: 'Inspiration'
  }
];

export const MOCK_COLLECTIONS: ContentCollection[] = [
  {
    id: 'sleep-better',
    name: 'Sleep Better Collection',
    description: 'Evening Yog Nidra and soft breath practices for deep rest.',
    isFeatured: true,
    image: 'download4.jpg'
  },
  {
    id: 'beginner-breathwork',
    name: 'Beginner Breathwork',
    description: 'Gentle introductory sequences to build breath awareness.',
    isFeatured: true,
    image: 'download2.jpg'
  },
  {
    id: 'anxiety-relief-series',
    name: 'Anxiety Relief Series',
    description: 'Grounding audios and short meditations for anxious moments.',
    isFeatured: false,
    image: 'download3.jpg'
  },
  {
    id: 'morning-calm',
    name: 'Morning Calm Playlist',
    description: 'Soft starts for your day—breath, intention, and gentle movement.',
    isFeatured: true,
    image: 'download1.jpg'
  }
];
