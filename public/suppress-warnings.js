// Suppress Ant Design React 19 compatibility warnings globally
(function() {
    if (typeof window !== 'undefined') {
        const originalWarn = console.warn;
        const originalError = console.error;
        
        console.warn = function(...args) {
            const message = String(args[0] || '');
            if (
                message.includes('antd: compatible') || 
                message.includes('React is 16 ~ 18') ||
                message.includes('v5-for-19') ||
                message.includes('antd v5 support React is 16') ||
                message.includes('[antd: compatible]')
            ) {
                return;
            }
            originalWarn.apply(console, args);
        };

        console.error = function(...args) {
            const message = String(args[0] || '');
            if (
                message.includes('antd: compatible') || 
                message.includes('React is 16 ~ 18') ||
                message.includes('v5-for-19') ||
                message.includes('antd v5 support React is 16') ||
                message.includes('[antd: compatible]')
            ) {
                return;
            }
            originalError.apply(console, args);
        };
    }
})();
