export interface Inquiry {
  id?: string; // Google Drive file ID
  name: string;
  email: string;
  phone: string;
  suiteId: string;
  suiteName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  message: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: string;
}

export interface Suite {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: string;
  size: string;
  guests: number;
  bed: string;
  image: string;
  amenities: string[];
  view: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  location: string;
  image: string;
  category: string;
}

export interface ServiceKeyFeature {
  title: string;
  description: string;
}

export interface Service {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  scope: string[];
  methodology: string;
  keyFeatures: ServiceKeyFeature[];
  benefits: string[];
  targetAudience: string;
  image: string;
  ctaText: string;
  priceOrQuote: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  coverImage: string;
  publishedAt: string;
  readTime: string;
}

