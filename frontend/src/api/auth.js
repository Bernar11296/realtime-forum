export const check_auth = async() => {

    const response = await fetch(`http://localhost:8080/api/auth/check_token`, {
        headers: {
            'Accept': 'application/json',
            'Credentials': 'include'
        },
        method: "GET",
        credentials: 'include',
    })
    if (!response.ok) {
        if (response.status === 401) {
            return null;
        } else {
            throw new Error("Response error: " + response.status);
        }
    } else if (response.ok) {
        const data = await response.json();
        if (data) { // Check if I get username in my response
            return data
        } else { // Handle if there is no username in the response

            const error = new Error("Error while getting userdata from the server"); // Very unlikely to happen
            error.status = 500;
            throw error;
        }
    }
}

export const log_out = async() => {
    const response = await fetch(`http://localhost:8080/api/auth/log_out`, {
        headers: {
            'Accept': 'application/json',
            'Credentials': 'include',
        },
        method: "GET",
        credentials: "include",
    });
    if (!response.ok) {
        const errorMessage = await response.text();
        alert(`Registration failed: ${errorMessage}`);
    }
    window.location.href = '/sign_in';
}