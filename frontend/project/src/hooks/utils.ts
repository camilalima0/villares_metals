// (Você pode até movê-la para um arquivo 'api/utils.ts' e importar em todos os hooks)
export const getAuthHeader = (): Record<string, string> => {
    const encodedCredentials = localStorage.getItem('authBasic');
    if (encodedCredentials) {
        return {
            'Authorization': `Basic ${encodedCredentials}`,
            'Content-Type': 'application/json',
        };
    }
    return {
        'Content-Type': 'application/json',
    };
};