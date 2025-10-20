import { useState, useEffect } from 'react';

/**
 * Hook to read approval status from localStorage (set during login)
 * This hook no longer makes API calls - the status is fetched and stored during login
 */
export const useApprovalStatus = () => {
    const [approvalStatus, setApprovalStatus] = useState<string>('DRAFT');
    const [isApproved, setIsApproved] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // Read approval status from localStorage (set during login)
        const storedStatus = localStorage.getItem('approvalStatus');
        
        if (storedStatus) {
            setApprovalStatus(storedStatus);
            setIsApproved(storedStatus === 'APPROVED');
        } else {
            // If no status found, default to DRAFT
            setApprovalStatus('DRAFT');
            setIsApproved(false);
        }
        
        setIsLoading(false);
    }, []);

    return { approvalStatus, isApproved, isLoading };
};
