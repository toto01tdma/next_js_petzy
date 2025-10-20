'use client';

import { Input } from 'antd';

const { TextArea } = Input;

interface BusinessDetailsSectionProps {
    businessAdditionalDetails: string;
    onInputChange: (field: string, value: string) => void;
    disabled?: boolean;
}

export default function BusinessDetailsSection({
    businessAdditionalDetails,
    onInputChange,
    disabled = false
}: BusinessDetailsSectionProps) {
    return (
        <div className="mt-8">
            <label className="block text-base font-medium text-gray-800 mb-3">
                กรอกรายละเอียดเพิ่มเติมของธุรกิจ เพื่อประกอบการพิจารณา
            </label>
            <TextArea
                value={businessAdditionalDetails}
                onChange={(e) => onInputChange('businessAdditionalDetails', e.target.value)}
                rows={6}
                className="w-full text-base"
                style={{ fontSize: '16px' }}
                disabled={disabled}
            />
        </div>
    );
}

