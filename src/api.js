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

export async function viewFragment(user, id, type) {
    try {
        const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
            headers: user.authorizationHeaders(),
            method: 'GET',
        });

        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }
        let content;
        if (type.startsWith('text/')) {
            content = await res.text();
        } else if (type.startsWith('application/')) {
            content = await res.json();
        } else if (type.startsWith('image/')) {
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            return url;
        }
        return content;
    } catch (err) {
        console.error('Unable to call GET /v1/fragments/:id', { err });
    }
}

export async function convertFragment(user, id, ext) {
    try {
        const res = await fetch(`${apiUrl}/v1/fragments/${id}.${ext}`, {
            headers: user.authorizationHeaders(),
            method: 'GET',
        });

        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }

        const blob = await res.blob();
        return URL.createObjectURL(blob);
    } catch (err) {
        console.error('Unable to call GET /v1/fragments/:id', { err });
    }
}

export async function deleteFragment(user, id) {
    try {
        const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
            headers: user.authorizationHeaders(),
            method: 'DELETE',
        });

        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }
    } catch (err) {
        console.error('Unable to call DELETE /v1/fragments/:id', { err });
    }
}

export async function updateFragment(user, id, content, contentType) {
    try {
        if (!contentType) {
            contentType = 'text/plain';
        }
        const headers = { 'Content-Type': contentType };
        headers['Authorization'] = `Bearer ${user.idToken}`;

        const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
            headers: headers,
            method: 'PUT',
            crossDomain: true,
            body: content,
        });

        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }
        console.log('Fragment has been updated');
        return await res.text();
    } catch (err) {
        console.error('Unable to call PUT /v1/fragments/:id', { err });
    }
}
