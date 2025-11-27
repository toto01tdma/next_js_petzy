/**
 * Utility functions to convert file paths to API endpoints
 * Accepts either full paths (/uploads/...) or just filenames
 * Converts to /api/images/... for secure access
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

/**
 * Extract filename from path
 */
const extractFilename = (path: string): string => {
  // Remove any leading slashes, directory separators, or path components
  let filename = path;
  filename = filename.split('/').pop() || filename;
  filename = filename.split('\\').pop() || filename; // Handle Windows paths
  return filename;
};

/**
 * Get room image URL
 */
export const getRoomImageUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  
  // If already a full URL (http/https), return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If it's a data URL or blob URL (for previews), return as is
  if (path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  
  const filename = extractFilename(path);
  return `${API_BASE_URL}/api/images/rooms/${filename}`;
};

/**
 * Get service image URL
 */
export const getServiceImageUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  if (path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  
  const filename = extractFilename(path);
  return `${API_BASE_URL}/api/images/services/${filename}`;
};

/**
 * Get policy file URL
 */
export const getPolicyFileUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  if (path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  
  const filename = extractFilename(path);
  return `${API_BASE_URL}/api/images/policies/${filename}`;
};

/**
 * Get document file URL
 */
export const getDocumentFileUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  if (path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  
  const filename = extractFilename(path);
  return `${API_BASE_URL}/api/images/documents/${filename}`;
};

/**
 * Get bank book file URL
 */
export const getBankBookFileUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  if (path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  
  const filename = extractFilename(path);
  return `${API_BASE_URL}/api/images/bank-books/${filename}`;
};

/**
 * Get cover image URL
 */
export const getCoverImageUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  if (path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  
  const filename = extractFilename(path);
  return `${API_BASE_URL}/api/images/cover/${filename}`;
};

/**
 * Get banner image URL
 */
export const getBannerImageUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  if (path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  
  const filename = extractFilename(path);
  return `${API_BASE_URL}/api/images/banners/${filename}`;
};

/**
 * Get promotion image URL
 */
export const getPromotionImageUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  if (path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  
  const filename = extractFilename(path);
  return `${API_BASE_URL}/api/images/promotions/${filename}`;
};

/**
 * Generic function to get file URL based on type
 */
export const getFileImageUrl = (
  path: string | null | undefined,
  type: 'rooms' | 'services' | 'policies' | 'documents' | 'bank-books' | 'cover' | 'banners' | 'promotions'
): string | null => {
  if (!path) return null;
  
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  if (path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  
  const filename = extractFilename(path);
  return `${API_BASE_URL}/api/images/${type}/${filename}`;
};

