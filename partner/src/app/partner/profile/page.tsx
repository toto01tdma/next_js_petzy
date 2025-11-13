'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/partner/shared/Sidebar';
import { MenuOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import Swal from 'sweetalert2';
import { API_BASE_URL, USE_API_MODE } from '@/config/api';
import { useApprovalStatus } from '@/hooks/useApprovalStatus';
import ApprovalModal from '@/components/partner/shared/ApprovalModal';
import Image from 'next/image';
import { checkAuthError } from '@/utils/api';

interface ProfileData {
    fullName: string;
    fullNameTh?: string; // Thai full name
    fullNameEn?: string; // English full name
    accommodationName?: string; // Accommodation name (Thai)
    nameEn: string;
    accommodationId: string;
    taxId?: string; // Tax ID (corporate_tax_id)
    phoneNumber: string;
    backupPhoneNumber: string;
    currentPassword: string;
    newPassword: string;
    profileImage: string | null;
    coverImages: (string | null)[];
}

interface UploadedFiles {
    profileImageFile: File | null;
    coverImageFiles: (File | null)[];
}

export default function UserProfile() {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [accommodationType, setAccommodationType] = useState('โรงแรมสัตว์เลี้ยง');
    const [approvalStatus, setApprovalStatus] = useState('APPROVED');
    const [accommodationName, setAccommodationName] = useState('');
    
    // Approval status check
    const { isApproved, isLoading: isLoadingApproval } = useApprovalStatus();
    
    const [profileData, setProfileData] = useState<ProfileData>({
        fullName: '',
        nameEn: '',
        accommodationName: '',
        accommodationId: '',
        phoneNumber: '',
        backupPhoneNumber: '',
        currentPassword: '',
        newPassword: '',
        profileImage: null,
        coverImages: Array(7).fill(null)
    });

    const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({
        profileImageFile: null,
        coverImageFiles: Array(7).fill(null)
    });

    useEffect(() => {
        // In preview mode, skip authentication check
        if (!USE_API_MODE) {
            fetchProfile();
            fetchServiceData();
            return;
        }
        
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }
        
        fetchProfile();
        fetchServiceData();
    }, [router]);

    const fetchProfile = async () => {
        setIsFetching(true);
        try {
            if (!USE_API_MODE) {
                // Mock data for preview
                await new Promise(resolve => setTimeout(resolve, 500));
                setProfileData({
                    fullName: 'Name Mr.Tammanut sunteeruk',
                    nameEn: 'Tammanut Sunteeruk',
                    accommodationName: 'โรงแรมสัตว์เลี้ยง',
                    accommodationId: '25258-2585258',
                    phoneNumber: '064-252585-585',
                    backupPhoneNumber: '064-252585-585',
                    currentPassword: '',
                    newPassword: '',
                    profileImage: null,
                    coverImages: Array(7).fill(null)
                });
                setAccommodationType('โรงแรมสัตว์เลี้ยง');
                setApprovalStatus('APPROVED');
            } else {
                const token = localStorage.getItem('accessToken');
                const response = await fetch(`${API_BASE_URL}/api/partner/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const result = await response.json();

                // Check for authentication error
                if (checkAuthError(response, result)) {
                    return;
                }

                if (!response.ok) throw new Error('Failed to fetch profile');
                
                if (result.success) {
                    const data = result.data;
                    setProfileData({
                        fullName: data.fullNameTh || data.fullName || '',
                        fullNameTh: data.fullNameTh || data.fullName || '',
                        fullNameEn: data.fullNameEn || '',
                        accommodationName: data.accommodationName || '',
                        nameEn: data.nameEn || '',
                        accommodationId: data.accommodationId || '',
                        taxId: data.taxId || '',
                        phoneNumber: data.phoneNumber || '',
                        backupPhoneNumber: data.backupPhoneNumber || '',
                        currentPassword: '',
                        newPassword: '',
                        profileImage: data.profileImage || null,
                        coverImages: Array.isArray(data.coverImages) && data.coverImages.length === 7 
                            ? data.coverImages 
                            : Array(7).fill(null)
                    });
                    setAccommodationType(data.accommodationType || 'โรงแรมสัตว์เลี้ยง');
                    setAccommodationName(data.accommodationName || '');
                    setApprovalStatus(data.approvalStatus || 'DRAFT');
                } else {
                    throw new Error(result.error || 'Failed to fetch profile');
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            await Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถโหลดข้อมูลโปรไฟล์ได้',
                confirmButtonColor: '#0D263B'
            });
        } finally {
            setIsFetching(false);
        }
    };

    // Fetch service data to get accommodation photos from Step 3
    const fetchServiceData = async () => {
        try {
            if (!USE_API_MODE) {
                // Mock data for preview
                return;
            }

            const token = localStorage.getItem('accessToken');
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/api/partner/service-data`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            // Check for authentication error
            if (checkAuthError(response, result)) {
                return;
            }

            if (result.success && result.data?.accommodation_photos) {
                const photos = result.data.accommodation_photos;

                // Helper function to get full image URL
                const getFullImageUrl = (path: string) => {
                    if (!path) return '';
                    if (path.startsWith('http://') || path.startsWith('https://')) {
                        return path;
                    }
                    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
                };

                // Update cover images array
                const newCoverImages = Array(7).fill(null);

                // Cover image (index 0)
                if (photos.cover_image_url) {
                    newCoverImages[0] = getFullImageUrl(photos.cover_image_url);
                }

                // Room images (indices 1-6)
                if (photos.room_image_urls && Array.isArray(photos.room_image_urls)) {
                    photos.room_image_urls.forEach((url: string, index: number) => {
                        if (url && index < 6) {
                            newCoverImages[index + 1] = getFullImageUrl(url);
                        }
                    });
                }

                // Update profile data with fetched images
                setProfileData(prev => ({
                    ...prev,
                    coverImages: newCoverImages
                }));
            }
        } catch (error) {
            console.error('Error fetching service data:', error);
            // Don't show error to user, just log it
            // The profile page should still work even if service data fetch fails
        }
    };

    const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                Swal.fire({
                    icon: 'error',
                    title: 'ไฟล์ไม่ถูกต้อง',
                    text: 'กรุณาเลือกรูปภาพเท่านั้น',
                    confirmButtonColor: '#0D263B'
                });
                e.target.value = ''; // Reset input
                return;
            }

            // Store the file object for upload later
            setUploadedFiles(prev => ({
                ...prev,
                profileImageFile: file
            }));

            // Create preview immediately using URL.createObjectURL for better performance and reliability
            try {
                // Revoke previous object URL if exists to prevent memory leaks
                if (profileData.profileImage && profileData.profileImage.startsWith('blob:')) {
                    URL.revokeObjectURL(profileData.profileImage);
                }
                
                // Create new object URL for preview
                const previewUrl = URL.createObjectURL(file);
                
                setProfileData(prev => ({
                    ...prev,
                    profileImage: previewUrl
                }));
            } catch (error) {
                console.error('Error creating preview:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: 'ไม่สามารถแสดงตัวอย่างรูปภาพได้',
                    confirmButtonColor: '#0D263B'
                });
                // Clear the file on error
                setUploadedFiles(prev => ({
                    ...prev,
                    profileImageFile: null
                }));
            }
        }

        // Reset input value to allow selecting the same file again
        e.target.value = '';
    };

    const handleCoverImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                Swal.fire({
                    icon: 'error',
                    title: 'ไฟล์ไม่ถูกต้อง',
                    text: 'กรุณาเลือกรูปภาพเท่านั้น',
                    confirmButtonColor: '#0D263B'
                });
                e.target.value = ''; // Reset input
                return;
            }

            // Store the file object for upload later
            setUploadedFiles(prev => {
                const newCoverImageFiles = [...prev.coverImageFiles];
                newCoverImageFiles[index] = file;
                return {
                    ...prev,
                    coverImageFiles: newCoverImageFiles
                };
            });

            // Create preview using URL.createObjectURL for better performance
            try {
                // Revoke previous object URL if exists to prevent memory leaks
                if (profileData.coverImages[index] && profileData.coverImages[index]?.startsWith('blob:')) {
                    URL.revokeObjectURL(profileData.coverImages[index]!);
                }
                
                // Create new object URL for preview
                const previewUrl = URL.createObjectURL(file);
                
                setProfileData(prev => {
                    const newCoverImages = [...prev.coverImages];
                    newCoverImages[index] = previewUrl;
                    return {
                        ...prev,
                        coverImages: newCoverImages
                    };
                });
            } catch (error) {
                console.error('Error creating cover image preview:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: 'ไม่สามารถแสดงตัวอย่างรูปภาพได้',
                    confirmButtonColor: '#0D263B'
                });
            }
        }

        // Reset input value to allow selecting the same file again
        e.target.value = '';
    };

    // Upload profile image only
    const uploadProfileImage = async () => {
        const token = localStorage.getItem('accessToken');

        if (!uploadedFiles.profileImageFile) {
            return { profileImage: profileData.profileImage };
        }

        const formDataUpload = new FormData();
            formDataUpload.append('profileImage', uploadedFiles.profileImageFile);

        const uploadResponse = await fetch(`${API_BASE_URL}/api/upload/profile-image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formDataUpload
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResult.success) {
            throw new Error(uploadResult.error || 'Failed to upload profile image');
        }

        return uploadResult.data;
    };

    // Upload cover images only (with index tracking)
    const uploadCoverImages = async () => {
        const token = localStorage.getItem('accessToken');
        const formDataUpload = new FormData();
        const imageIndices: number[] = []; // Track which indices have new images
        let hasFiles = false;

        // Add cover images with their indices
        uploadedFiles.coverImageFiles.forEach((file, index) => {
            if (file) {
                formDataUpload.append('coverImages', file);
                formDataUpload.append('imageIndices', index.toString()); // Track which slot this image belongs to
                imageIndices.push(index);
                hasFiles = true;
            }
        });

        // If no new files to upload, return existing URLs
        if (!hasFiles) {
            return { coverImages: profileData.coverImages.filter(img => img !== null), imageIndices: [] };
        }

        // Upload files to server
        const uploadResponse = await fetch(`${API_BASE_URL}/api/upload/cover-images`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formDataUpload
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResult.success) {
            throw new Error(uploadResult.error || 'Failed to upload cover images');
        }

        return { ...uploadResult.data, imageIndices };
    };

    // Handle profile image submit (กรุณากดยืนยัน button)
    const handleProfileImageSubmit = async () => {
        setIsLoading(true);
        try {
            if (!USE_API_MODE) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                await Swal.fire({
                    icon: 'success',
                    title: 'บันทึกข้อมูลสำเร็จ',
                    text: 'รูปโปรไฟล์ได้รับการอัปเดตแล้ว',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                });
                return;
            }

            const token = localStorage.getItem('accessToken');
            if (!token) {
                await Swal.fire({
                    icon: 'error',
                    title: 'กรุณาเข้าสู่ระบบ',
                    text: 'ไม่พบข้อมูลการเข้าสู่ระบบ',
                    confirmButtonColor: '#0D263B'
                });
                return;
            }

            // Upload profile image
            const uploadedUrls = await uploadProfileImage();

            // Save profile image URL
            if (uploadedUrls.profileImage) {
                const response = await fetch(`${API_BASE_URL}/api/partner/profile-image`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        profileImage: uploadedUrls.profileImage
                    }),
                });

                const result = await response.json();

                if (checkAuthError(response, result)) {
                    return;
                }

                if (result.success) {
                    // Helper function to get full image URL
                    const getFullImageUrl = (path: string) => {
                        if (!path) return null;
                        if (path.startsWith('http://') || path.startsWith('https://')) {
                            return path;
                        }
                        if (path.startsWith('data:')) {
                            return path; // Keep data URLs as-is for previews
                        }
                        return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
                    };

                    // Convert relative URL to full URL
                    const fullImageUrl = getFullImageUrl(uploadedUrls.profileImage);

                    // Update local state with new image URL (full URL)
                    setProfileData(prev => ({
                        ...prev,
                        profileImage: fullImageUrl
                    }));

                    // Clear uploaded file
                    setUploadedFiles(prev => ({
                        ...prev,
                        profileImageFile: null
                    }));

                    await Swal.fire({
                        icon: 'success',
                        title: 'บันทึกข้อมูลสำเร็จ',
                        text: 'รูปโปรไฟล์ได้รับการอัปเดตแล้ว',
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true
                    });
                } else {
                    throw new Error(result.error || 'Failed to save profile image');
                }
            } else {
                await Swal.fire({
                    icon: 'info',
                    title: 'ไม่มีรูปภาพใหม่',
                    text: 'กรุณาเลือกรูปภาพก่อนกดยืนยัน',
                    confirmButtonColor: '#0D263B'
                });
            }
        } catch (error) {
            console.error('Error saving profile image:', error);
            await Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: error instanceof Error ? error.message : 'ไม่สามารถบันทึกรูปโปรไฟล์ได้',
                confirmButtonColor: '#0D263B'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle cover images submit (ยืนยันข้อมูล button)
    const handleCoverImagesSubmit = async () => {
        setIsLoading(true);
        try {
            if (!USE_API_MODE) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                await Swal.fire({
                    icon: 'success',
                    title: 'บันทึกข้อมูลสำเร็จ',
                    text: 'รูปภาพหน้าปกได้รับการอัปเดตแล้ว',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                });
                return;
            }

            const token = localStorage.getItem('accessToken');
            if (!token) {
                await Swal.fire({
                    icon: 'error',
                    title: 'กรุณาเข้าสู่ระบบ',
                    text: 'ไม่พบข้อมูลการเข้าสู่ระบบ',
                    confirmButtonColor: '#0D263B'
                });
                return;
            }

            // Upload cover images
            const uploadedUrls = await uploadCoverImages();

            // Save cover images URLs with index tracking
            if (uploadedUrls.coverImages && uploadedUrls.coverImages.length > 0 && uploadedUrls.imageIndices && uploadedUrls.imageIndices.length > 0) {
                const response = await fetch(`${API_BASE_URL}/api/partner/cover-images`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        coverImages: uploadedUrls.coverImages,
                        imageIndices: uploadedUrls.imageIndices // Send which slots to update
                    }),
                });

                const result = await response.json();

                if (checkAuthError(response, result)) {
                    return;
                }

                if (result.success) {
                    // Helper function to get full image URL
                    const getFullImageUrl = (path: string) => {
                        if (!path) return null;
                        if (path.startsWith('http://') || path.startsWith('https://')) {
                            return path;
                        }
                        if (path.startsWith('data:')) {
                            return path; // Keep data URLs as-is for previews
                        }
                        return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
                    };

                    // Use the response from the save endpoint which contains the updated cover images
                    // This ensures we have the latest state from the database
                    const updatedCoverImages = result.data?.coverImages || [];

                    // Update local state with the updated cover images from the backend
                    // Convert all URLs to full URLs
                    setProfileData(prev => {
                        const newCoverImages = Array(7).fill(null);
                        updatedCoverImages.forEach((url: string | null, index: number) => {
                            if (index < 7 && url) {
                                newCoverImages[index] = getFullImageUrl(url);
                            }
                        });

                        // Only update if there are actual changes
                        const hasChanges = newCoverImages.some((url: string | null, index: number) => {
                            return url !== prev.coverImages[index];
                        });

                        if (hasChanges) {
                            return {
                                ...prev,
                                coverImages: newCoverImages
                            };
                        }
                        return prev; // Return previous state if no changes
                    });

                    // Clear uploaded files for the slots that were uploaded
                    setUploadedFiles(prev => {
                        const newCoverImageFiles = [...prev.coverImageFiles];
                        uploadedUrls.imageIndices.forEach((index: number) => {
                            if (index >= 0 && index < 7) {
                                newCoverImageFiles[index] = null;
                            }
                        });
                        return {
                            ...prev,
                            coverImageFiles: newCoverImageFiles
                        };
                    });

                    await Swal.fire({
                        icon: 'success',
                        title: 'บันทึกข้อมูลสำเร็จ',
                        text: 'รูปภาพหน้าปกได้รับการอัปเดตแล้ว',
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true
                    });
                } else {
                    throw new Error(result.error || 'Failed to save cover images');
                }
            } else {
                await Swal.fire({
                    icon: 'info',
                    title: 'ไม่มีรูปภาพใหม่',
                    text: 'กรุณาเลือกรูปภาพก่อนกดยืนยัน',
                    confirmButtonColor: '#0D263B'
                });
            }
        } catch (error) {
            console.error('Error saving cover images:', error);
            await Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: error instanceof Error ? error.message : 'ไม่สามารถบันทึกรูปภาพหน้าปกได้',
                confirmButtonColor: '#0D263B'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            if (!USE_API_MODE) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                await Swal.fire({
                    icon: 'success',
                    title: 'บันทึกข้อมูลสำเร็จ',
                    text: 'ข้อมูลโปรไฟล์ของคุณได้รับการอัปเดตแล้ว',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                });
            } else {
                const token = localStorage.getItem('accessToken');
                const user = localStorage.getItem('user');
                const userData = user ? JSON.parse(user) : null;

                if (!userData?.id) {
                    throw new Error('User ID not found. Please login again.');
                }

                // Upload images if there are any new files
                let profileImageUrl = profileData.profileImage;
                let coverImageUrls: (string | null)[] = profileData.coverImages.filter(img => img !== null);

                // Upload profile image if exists
                if (uploadedFiles.profileImageFile) {
                    const profileUploadResult = await uploadProfileImage();
                    if (profileUploadResult.profileImage) {
                        profileImageUrl = profileUploadResult.profileImage;
                    }
                }

                // Upload cover images if they exist
                const hasCoverImages = uploadedFiles.coverImageFiles.some(file => file !== null);
                if (hasCoverImages) {
                    const coverUploadResult = await uploadCoverImages();
                    if (coverUploadResult.coverImages && coverUploadResult.coverImages.length > 0) {
                        coverImageUrls = coverUploadResult.coverImages;
                    }
                }

                // Prepare the payload - only include fields that have values
                const payload: Record<string, unknown> = {
                    userId: userData.id, // Use the actual UUID from localStorage
                };

                // Only include fields that have been changed or have values
                if (profileData.fullName) payload.fullName = profileData.fullName;
                if (profileData.nameEn) payload.nameEn = profileData.nameEn;
                if (profileData.phoneNumber) payload.phoneNumber = profileData.phoneNumber;
                if (profileData.backupPhoneNumber) payload.backupPhoneNumber = profileData.backupPhoneNumber;
                
                // Only include password if user wants to change it
                if (profileData.currentPassword && profileData.newPassword) {
                    payload.currentPassword = profileData.currentPassword;
                    payload.newPassword = profileData.newPassword;
                }
                
                // Include uploaded image URLs
                if (profileImageUrl) {
                    payload.profileImage = profileImageUrl;
                }
                
                if (coverImageUrls && coverImageUrls.length > 0) {
                    payload.coverImages = coverImageUrls;
                }

                const response = await fetch(`${API_BASE_URL}/api/partner/profile`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                const result = await response.json();

                // Check for authentication error
                if (checkAuthError(response, result)) {
                    return;
                }

                if (!response.ok) {
                    // Handle validation errors
                    if (result.details && Array.isArray(result.details)) {
                        const errorMessages = result.details.map((d: { field: string; message: string }) => 
                            `${d.field}: ${d.message}`
                        ).join('\n');
                        throw new Error(errorMessages);
                    }
                    throw new Error(result.error || result.message || 'Failed to save profile');
                }

                if (result.success) {
                    await Swal.fire({
                        icon: 'success',
                        title: 'บันทึกข้อมูลสำเร็จ',
                        text: 'ข้อมูลโปรไฟล์ของคุณได้รับการอัปเดตแล้ว',
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true
                    });

                    // Clear password fields and uploaded files after successful update
                    setProfileData(prev => ({
                        ...prev,
                        currentPassword: '',
                        newPassword: ''
                    }));
                    
                    setUploadedFiles({
                        profileImageFile: null,
                        coverImageFiles: Array(7).fill(null)
                    });

                    // Refresh profile data
                    await fetchProfile();
                } else {
                    throw new Error(result.error || 'Failed to save profile');
                }
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            const errorMessage = error instanceof Error ? error.message : 'ไม่สามารถบันทึกข้อมูลได้';
            await Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: errorMessage,
                confirmButtonColor: '#0D263B'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'ออกจากระบบ',
            text: 'คุณต้องการออกจากระบบหรือไม่?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0D263B',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        });

        if (result.isConfirmed) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            router.push('/login');
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    if (isFetching) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-xl" style={{ color: '#666666' }}>กำลังโหลด...</div>
            </div>
        );
    }

    return (
        <div className="flex h-screen" style={{ backgroundColor: '#F5F5F5' }}>
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="shadow-sm border-b border-gray-200 px-6 py-4" style={{ backgroundColor: '#FFFFFF' }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleSidebar}
                                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                            >
                                <MenuOutlined className="text-xl" />
                            </button>
                            <h1 className="text-2xl font-semibold" style={{ color: '#333333' }}>ตั้งค่าโปรไฟล์</h1>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-6">
                    <div className="max-w-6xl mx-auto">
                        {/* Profile Section */}
                        <div className="rounded-lg shadow-sm p-8 mb-6" style={{ backgroundColor: '#FFFFFF' }}>
                            <div className="flex items-start gap-8">
                                {/* Left - Profile Image */}
                                <div className="flex-shrink-0">
                                    <div className="text-center">
                                        <h3 className="text-xl font-semibold mb-4" style={{ color: '#000000' }}>รูปโปรไฟล์</h3>
                                        <div className="relative">
                                            <label htmlFor="profile-upload" className="cursor-pointer">
                                            {profileData.profileImage ? (
                                                    <div className="relative">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            key={`profile-preview-${uploadedFiles.profileImageFile?.name || 'existing'}-${Date.now()}`}
                                                            src={profileData.profileImage}
                                                            alt="Profile Preview"
                                                            className="rounded-full mx-auto"
                                                            style={{
                                                                width: '200px',
                                                                height: '200px',
                                                                objectFit: 'cover',
                                                                display: 'block',
                                                                borderRadius: '50%'
                                                            }}
                                                            onError={(e) => {
                                                                console.error('Profile image preview error:', e);
                                                                // Fallback to placeholder if preview fails
                                                                setProfileData(prev => ({
                                                                    ...prev,
                                                                    profileImage: null
                                                                }));
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center transition-all pointer-events-none">
                                                            <UploadOutlined style={{ fontSize: '32px', color: '#FFFFFF', opacity: 0 }} className="hover:opacity-100" />
                                                        </div>
                                                    </div>
                                            ) : (
                                                <div 
                                                        className="rounded-full mx-auto flex items-center justify-center hover:bg-gray-200 transition-colors"
                                                    style={{ 
                                                        width: '200px', 
                                                        height: '200px', 
                                                        backgroundColor: '#E5E7EB',
                                                        border: '2px solid #D1D5DB'
                                                    }}
                                                >
                                                        <UploadOutlined style={{ fontSize: '48px', color: '#9CA3AF' }} />
                                                </div>
                                            )}
                                            </label>
                                            <input
                                                type="file"
                                                id="profile-upload"
                                                accept="image/*"
                                                onChange={handleProfileImageUpload}
                                                className="hidden"
                                            />
                                        </div>
                                        <p className="text-sm mt-3" style={{ color: '#666666' }}>
                                            อัพโหลดรูปหน้าโปรไฟล์ของคุณ
                                        </p>
                                    </div>
                                </div>

                                {/* Right - Profile Information */}
                                <div className="flex-1">
                                    {/* Status Badges */}
                                    <div className="flex gap-3 mb-6 bg-[#00B6AA] px-4 py-2 justify-between items-center">
                                        <span className="" style={{ color: '#FFFFFF' }}>โรงแรม {accommodationName}</span>
                                        <span className="" style={{
                                            color: approvalStatus === 'APPROVED' ? '#FDD988' : '#F59E0B'
                                        }}>                                            {approvalStatus === 'APPROVED' ? 'บริการของคุณได้รับการยืนยันแล้ว' : 'รอการอนุมัติ'}</span>
                                    </div>
                                    {/* <div className="flex gap-3 mb-6">
                                        <button
                                            className="px-6 py-2 rounded font-medium text-sm"
                                            style={{
                                                backgroundColor: '#14B8A6',
                                                color: '#FFFFFF'
                                            }}
                                        >
                                            {accommodationType}
                                        </button>
                                        <button
                                            className="px-6 py-2 rounded font-medium text-sm"
                                            style={{
                                                backgroundColor: approvalStatus === 'APPROVED' ? '#10B981' : '#F59E0B',
                                                color: '#FFFFFF'
                                            }}
                                        >
                                            {approvalStatus === 'APPROVED' ? 'บริการของคุณได้รับการยืนยันแล้ว' : 'รอการอนุมัติ'}
                                        </button>
                                    </div> */}

                                    <div className="grid grid-cols-2 gap-6">
                                        {/* Left Column */}
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>
                                                    ชื่อ {profileData.fullNameTh}
                                                </label>
                                                <div className="text-base font-medium" style={{ color: '#000000' }}>
                                                    Name {profileData.fullNameEn}
                                                </div>
                                                <div className="text-xs mt-1" style={{ color: '#999999' }}>
                                                    *ชื่อจริงบนบัตรประจำตัวประชาชนเท่านั้น
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>
                                                    รหัสผู้เสียภาษีอากร : {profileData.taxId || profileData.accommodationId || '-'}
                                                </label>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>
                                                    เบอร์โทรศัพท์มือถือ : {profileData.phoneNumber}
                                                </label>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>
                                                    เบอร์โทรศัพท์มือถือสำรอง : {profileData.backupPhoneNumber}
                                                </label>
                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>
                                                    รหัสผ่านของคุณ
                                                </label>
                                                <Input.Password 
                                                    placeholder="**********251" 
                                                    value={profileData.currentPassword}
                                                    onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                                                    className="w-full"
                                                    style={{
                                                        backgroundColor: '#E5E7EB',
                                                        border: 'none'
                                                    }}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>
                                                    เปลี่ยนรหัสผ่าน
                                                </label>
                                                <Input.Password 
                                                    placeholder="**********" 
                                                    value={profileData.newPassword}
                                                    onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                                                    className="w-full"
                                                    style={{
                                                        backgroundColor: '#FFFFFF',
                                                        border: '1px solid #D1D5DB'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cover Images Section */}
                        <div className="rounded-lg shadow-sm p-8 mb-6" style={{ backgroundColor: '#FFFFFF' }}>
                            <h3 className="text-xl font-semibold mb-6" style={{ color: '#000000' }}>อัพรูปภาพหน้าปก</h3>
                            
                            <div className="flex gap-4 mb-6">
                                {/* Main Upload Area (Left) */}
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        id="cover-0"
                                        accept="image/*"
                                        onChange={(e) => handleCoverImageUpload(0, e)}
                                        className="hidden"
                                    />
                                    <label htmlFor="cover-0" className="cursor-pointer">
                                        <div 
                                            className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center"
                                            style={{ 
                                                backgroundColor: profileData.coverImages[0] ? '#000000' : '#E8E8E8',
                                                borderColor: '#CCCCCC',
                                                height: '348px',
                                                backgroundImage: profileData.coverImages[0] ? `url(${profileData.coverImages[0]})` : 'none',
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center'
                                            }}
                                        >
                                            {!profileData.coverImages[0] && (
                                                <>
                                                    <UploadOutlined style={{ fontSize: '48px', color: '#666666' }} />
                                                    <p className="text-center mt-4" style={{ color: '#000000' }}>
                                                        อัพโหลดรูปหน้าที่พักของคุณ
                                                    </p>
                                                    <p className="text-sm text-center" style={{ color: '#666666' }}>
                                                        ขนาดรูปไม่เกิน 500x500 pixel* png.
                                                    </p>
                                                    <p className="text-2xl font-bold mt-2" style={{ color: '#000000' }}>1</p>
                                                </>
                                            )}
                                        </div>
                                    </label>
                                </div>

                                {/* Right Grid (6 smaller images in 3x2) */}
                                <div className="flex-1 grid grid-cols-3 gap-2">
                                    {[1, 2, 3, 4, 5, 6].map((index) => (
                                        <div key={index}>
                                            <input
                                                type="file"
                                                id={`cover-${index}`}
                                                accept="image/*"
                                                onChange={(e) => handleCoverImageUpload(index, e)}
                                                className="hidden"
                                            />
                                            <label htmlFor={`cover-${index}`} className="cursor-pointer">
                                                <div 
                                                    className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center"
                                                    style={{ 
                                                        backgroundColor: profileData.coverImages[index] ? '#000000' : '#E8E8E8',
                                                        borderColor: '#CCCCCC',
                                                        height: '170px',
                                                        backgroundImage: profileData.coverImages[index] ? `url(${profileData.coverImages[index]})` : 'none',
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center'
                                                    }}
                                                >
                                                    {!profileData.coverImages[index] && (
                                                        <>
                                                            <UploadOutlined style={{ fontSize: '24px', color: '#666666' }} />
                                                            <p className="text-xs text-center mt-2 px-2" style={{ color: '#000000' }}>
                                                                อัพโหลดรูปหน้าที่พักของคุณ
                                                            </p>
                                                            <p className="text-xs text-center px-2" style={{ color: '#666666' }}>
                                                                ขนาดรูปภาพ 300x300 pixel png
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button 
                                size="large"
                                onClick={handleCoverImagesSubmit}
                                loading={isLoading}
                                style={{
                                    backgroundColor: '#FDB930',
                                    color: '#000000',
                                    border: 'none',
                                    fontWeight: 600,
                                    height: '50px',
                                    paddingLeft: '48px',
                                    paddingRight: '48px',
                                    borderRadius: '8px'
                                }}
                            >
                                ยืนยันข้อมูล
                            </Button>
                        </div>

                        {/* Terms and Logout Section */}
                        <div className="rounded-lg shadow-sm p-8" style={{ backgroundColor: '#FFFFFF' }}>
                            <h3 className="text-xl font-semibold mb-4" style={{ color: '#000000' }}>กรอกรายละเอียดข้อมูลสิทธิ์</h3>
                            
                            <div className="rounded-lg p-8 mb-6" style={{ backgroundColor: '#E8E8E8', minHeight: '200px' }}>
                                {/* Terms content area */}
                                <div style={{ color: '#666666' }}>
                                    {/* Map icon placeholder */}
                                    <div className="flex justify-end">
                                        <button className="p-2">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666666" strokeWidth="2">
                                                <line x1="5" y1="12" x2="19" y2="12" />
                                                <line x1="5" y1="6" x2="19" y2="6" />
                                                <line x1="5" y1="18" x2="19" y2="18" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mb-4">
                                <Button 
                                    size="large"
                                    style={{
                                        backgroundColor: '#0D263B',
                                        color: '#FFFFFF',
                                        border: 'none',
                                        fontWeight: 500,
                                        height: '45px',
                                        paddingLeft: '32px',
                                        paddingRight: '32px',
                                        borderRadius: '8px'
                                    }}
                                >
                                    ติดต่อฝ่ายลูกค้าสัมพันธ์
                                </Button>
                                <Button 
                                    size="large"
                                    onClick={handleLogout}
                                    style={{
                                        backgroundColor: '#6B7280',
                                        color: '#FFFFFF',
                                        border: 'none',
                                        fontWeight: 500,
                                        height: '45px',
                                        paddingLeft: '32px',
                                        paddingRight: '32px',
                                        borderRadius: '8px'
                                    }}
                                >
                                    ออกจากระบบ
                                </Button>
                            </div>

                            <p className="text-sm mb-6" style={{ color: '#666666' }}>
                                *กรณีต้องการเปลี่ยนข้อมูลส่วนตัว หรือยกเลิกสิทธิ์กรุณาติดต่อฝ่ายสนับสนุน
                            </p>

                            <div className="text-center">
                                <Button 
                                    size="large"
                                    onClick={handleProfileImageSubmit}
                                    loading={isLoading}
                                    style={{
                                        backgroundColor: '#0D263B',
                                        color: '#FFFFFF',
                                        border: 'none',
                                        fontWeight: 600,
                                        height: '55px',
                                        paddingLeft: '64px',
                                        paddingRight: '64px',
                                        borderRadius: '8px'
                                    }}
                                >
                                    กรุณากดยืนยัน
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            
            {/* Approval Status Modal */}
            <ApprovalModal isOpen={!isLoadingApproval && !isApproved} />
        </div>
    );
}

