/**
 * A global API service function to handle all fetch requests.
 * @param {string} url - The endpoint URL for the API call.
 * @param {object} [options={}] - The options for the fetch request (method, body, headers).
 * @returns {Promise<any>} A promise that resolves with the JSON response.
 */
const ApiService = async (url, options = {}, isFormData = false) => {
    let defaultHeaders = {};
    if (!isFormData) {
        defaultHeaders = {
            'Content-Type': 'application/json',
        };
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    if (config.body && !isFormData) {
        config.body = JSON.stringify(config.body);
    }

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            // Try to parse error response, but fallback to status text if it fails
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                throw new Error(response.statusText);
            }
            // Use the message from the API response if available
            throw new Error(errorData.message || 'An unknown API error occurred.');
        }

        return response.status === 204 ? null : response.json();
    } catch (error) {
        console.error('ApiService Error:', error.message);
        throw error; // Re-throw the error to be handled by the calling function
    }
};

export default ApiService;