import { useState, useEffect } from 'react';
import { API_BASE_URL, USE_API_MODE } from '@/config/api';

interface ApprovalStatusData {
    id: string;
    status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface ApprovalStatusResponse {
    success: boolean;
    message: string;
    data: ApprovalStatusData;
}

export const useApprovalStatus = () => {
    const [approvalStatus, setApprovalStatus] = useState<string>('DRAFT');
    const [isApproved, setIsApproved] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchApprovalStatus = async () => {
            try {
                // Skip API call in preview mode
                if (!USE_API_MODE) {
                    setApprovalStatus('APPROVED');
                    setIsApproved(true);
                    setIsLoading(false);
                    return;
                }

                const token = localStorage.getItem('accessToken');
                if (!token) {
                    setIsLoading(false);
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/api/partner/approval-status`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const result: ApprovalStatusResponse = await response.json();

                if (result.success && result.data) {
                    setApprovalStatus(result.data.status);
                    setIsApproved(result.data.status === 'APPROVED');
                }
            } catch (error) {
                console.error('Error fetching approval status:', error);
                // On error, assume not approved to be safe
                setIsApproved(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchApprovalStatus();
    }, []);

    return { approvalStatus, isApproved, isLoading };
};
