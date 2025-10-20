/**
 * Validation Utilities
 * Provides validation functions for form inputs
 */

/**
 * Check if a string contains only Thai characters (including spaces, numbers, and Thai punctuation)
 * @param text - The text to validate
 * @returns true if text contains only Thai characters, false if it contains English letters
 */
export const isThaiOnly = (text: string): boolean => {
    if (!text) return true; // Empty string is valid
    
    // English letters pattern (a-z, A-Z)
    const englishPattern = /[a-zA-Z]/;
    
    // Return false if English letters are found
    return !englishPattern.test(text);
};

/**
 * Check if a string contains English letters
 * @param text - The text to check
 * @returns true if text contains English letters
 */
export const containsEnglish = (text: string): boolean => {
    const englishPattern = /[a-zA-Z]/;
    return englishPattern.test(text);
};

/**
 * Validate Thai name (First name or Last name)
 * Should not contain English letters
 * @param name - The name to validate
 * @returns { isValid: boolean, error?: string }
 */
export const validateThaiName = (name: string): { isValid: boolean; error?: string } => {
    if (!name || !name.trim()) {
        return {
            isValid: false,
            error: 'กรุณากรอกข้อมูล'
        };
    }
    
    if (containsEnglish(name)) {
        return {
            isValid: false,
            error: 'กรุณากรอกเป็นภาษาไทยเท่านั้น ไม่สามารถใช้ตัวอักษรภาษาอังกฤษได้'
        };
    }
    
    return { isValid: true };
};

/**
 * Validate accommodation name (should be Thai only)
 * @param name - The accommodation name to validate
 * @returns { isValid: boolean, error?: string }
 */
export const validateThaiAccommodationName = (name: string): { isValid: boolean; error?: string } => {
    if (!name || !name.trim()) {
        return {
            isValid: false,
            error: 'กรุณากรอกชื่อโรงแรมหรือที่พัก'
        };
    }
    
    if (containsEnglish(name)) {
        return {
            isValid: false,
            error: 'กรุณากรอกชื่อเป็นภาษาไทยเท่านั้น ไม่สามารถใช้ตัวอักษรภาษาอังกฤษได้'
        };
    }
    
    return { isValid: true };
};

/**
 * Validate English name (should contain only English letters, spaces, and basic punctuation)
 * @param name - The name to validate
 * @returns { isValid: boolean, error?: string }
 */
export const validateEnglishName = (name: string): { isValid: boolean; error?: string } => {
    if (!name || !name.trim()) {
        return {
            isValid: false,
            error: 'Please enter the information'
        };
    }
    
    // Pattern for English letters, spaces, hyphens, and apostrophes
    const englishPattern = /^[a-zA-Z\s'-]+$/;
    
    if (!englishPattern.test(name)) {
        return {
            isValid: false,
            error: 'Please use English letters only'
        };
    }
    
    return { isValid: true };
};

/**
 * Validate confirmation fields match
 * @param original - Original value
 * @param confirmation - Confirmation value
 * @param fieldName - Name of the field for error message
 * @returns { isValid: boolean, error?: string }
 */
export const validateConfirmation = (
    original: string,
    confirmation: string,
    fieldName: string = 'ข้อมูล'
): { isValid: boolean; error?: string } => {
    if (!confirmation || !confirmation.trim()) {
        return {
            isValid: false,
            error: `กรุณากรอก${fieldName}เพื่อยืนยัน`
        };
    }
    
    if (original !== confirmation) {
        return {
            isValid: false,
            error: `${fieldName}ไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง`
        };
    }
    
    return { isValid: true };
};

