export interface UserProfile {
  id: string;
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
}

export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  profile?: UserProfile | null;
}

export interface Place {
  id: string;
  name: string;
  slug: string;
  description: string;
  latitude: number;
  longitude: number;
  address?: string | null;
  province: string;
  categoryId: string;
  averageRating: number;
  reviewCount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Review {
  id: string;
  placeId: string;
  userId: string;
  rating: number;
  content: string;
  createdAt: Date | string;
  user?: {
    profile?: {
      displayName: string | null;
      avatarUrl: string | null;
    } | null;
  };
}

export interface Photo {
  id: string;
  placeId: string;
  uploaderId?: string | null;
  rawUrl: string;
  thumbnailUrl: string;
}

// API Response Wrappers
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
