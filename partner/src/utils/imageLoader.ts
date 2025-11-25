/**
 * Custom image loader for Next.js Image component that includes Bearer token
 * This is used when images require authentication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export const imageLoaderWithToken = ({ src, width, quality }: { src: string; width?: number; quality?: number }) => {
  // If src is already a full URL, return as is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // If it's a data URL or blob URL, return as is
  if (src.startsWith('data:') || src.startsWith('blob:')) {
    return src;
  }

  // For API image URLs, we need to use a proxy route since Next.js Image can't send headers
  // Extract the path from the src (should be like /api/images/services/filename.png)
  const imagePath = src.startsWith('/') ? src : `/${src}`;
  
  // Use Next.js API route as proxy to add authentication
  return `/api/proxy-image?url=${encodeURIComponent(`${API_BASE_URL}${imagePath}`)}`;
};

/**
 * Get image URL with token support for regular img tags
 * Returns a blob URL that includes authentication
 */
export const getImageUrlWithToken = async (imagePath: string): Promise<string | null> => {
  if (!imagePath) return null;
  
  // If already a full URL (http/https), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a data URL or blob URL (for previews), return as is
  if (imagePath.startsWith('data:') || imagePath.startsWith('blob:')) {
    return imagePath;
  }

  try {
    const token = localStorage.getItem('accessToken');
    const fullUrl = imagePath.startsWith('/') 
      ? `${API_BASE_URL}${imagePath}` 
      : `${API_BASE_URL}/api/images/${imagePath}`;

    if (!token) {
      // Return the URL anyway, backend will handle auth error
      return fullUrl;
    }

    const response = await fetch(fullUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }

    return null;
  } catch (error) {
    console.error('Error loading image with token:', error);
    return null;
  }
};

