async function check_auth() {
    const response = await fetch(`localhost:8080/auth/check_token`, {
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
        if (data.Username) { // Check if I get username in my response
            return Username
        } else { // Handle if there is no username in the response

            const error = new Error("Error while getting userdata from the server"); // Very unlikely to happen
            error.status = 500;
            throw error;
        }
    }
}
export default check_auth();