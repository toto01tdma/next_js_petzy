/**
 * Utility function to convert profile image paths to API endpoints
 * Accepts either full paths (/uploads/profile/...) or just filenames
 * Converts to /api/images/profile/... for secure access
 */
export const getProfileImageUrl = (path: string | null | undefined): string | null => {
    if (!path) return null;
    
    // If already a full URL (http/https), return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    
    // If it's a data URL (for previews), return as is
    if (path.startsWith('data:')) {
        return path;
    }
    
    // If it's a blob URL (for previews), return as is
    if (path.startsWith('blob:')) {
        return path;
    }
    
    // Get API base URL
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    
    // Extract filename from path
    let filename = path;
    
    // If path starts with /uploads/profile/, extract filename
    if (path.startsWith('/uploads/profile/')) {
        filename = path.replace('/uploads/profile/', '');
    } else if (path.includes('/uploads/profile/')) {
        // If path contains /uploads/profile/, extract from that point
        const index = path.indexOf('/uploads/profile/');
        filename = path.substring(index + '/uploads/profile/'.length);
    } else if (path.startsWith('uploads/profile/')) {
        filename = path.replace('uploads/profile/', '');
    } else if (path.includes('uploads/profile/')) {
        const index = path.indexOf('uploads/profile/');
        filename = path.substring(index + 'uploads/profile/'.length);
    }
    
    // Remove any leading slashes, directory separators, or path components
    // This handles both paths and plain filenames
    filename = filename.split('/').pop() || filename;
    filename = filename.split('\\').pop() || filename; // Handle Windows paths
    
    // Return API endpoint URL with just the filename
    return `${API_BASE_URL}/api/images/profile/${filename}`;
};

