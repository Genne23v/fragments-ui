const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export async function getUserFragments(user) {
    console.log('Requesting user fragments data...', { user });
    try {
        const res = await fetch(`${apiUrl}/v1/fragments`, {
            headers: user.authorizationHeaders(),
        });
        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        console.log('Got user fragments data', { data });
    } catch (err) {
        console.error('Unable to call GET /v1/fragments', { err });
    }
}