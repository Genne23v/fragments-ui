const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export async function getUserFragments(user) {
    console.log('Requesting user fragments data...', apiUrl);
    try {
        const res = await fetch(`${apiUrl}/v1/fragments?expand=1`, {
            headers: user.authorizationHeaders(),
        });

        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        console.log('Got user fragments data', { data });
        return data;
    } catch (err) {
        console.error('Unable to call GET /v1/fragments', { err });
    }
}

export async function postFragment(user, content, contentType) {
    try {
        console.log('user idToken', user.idToken);

        if (!contentType) {
            contentType = 'text/plain';
        }
        const headers = { 'Content-Type': contentType };
        headers['Authorization'] = `Bearer ${user.idToken}`;

        const res = await fetch(`${apiUrl}/v1/fragments`, {
            headers: headers,
            method: 'POST',
            crossDomain: true,
            body: content,
        });

        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        console.log('Fragment has been posted', { data });
    } catch (err) {
        console.error('Unable to call POST /v1/fragments', { err });
    }
}
