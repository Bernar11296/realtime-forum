async function check_auth() {
    try {
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
                store.dispatch(logout());
                return false; // return false if user is not authenticated
            } else {
                const error = new Error(response.statusText);
                error.status = response.status;
                throw error;
            }
        } else if (response.ok) {
            const data = await response.json();
            if (data.Username) { // Check if I get username in my response
                store.dispatch(loginSuccess({ username: data.Username }));
                return true; // return true if user is authenticated
            } else { // Handle if there is no username in the response
                store.dispatch(logout());
                signOutOnError();
                const error = new Error("Error while getting userdata from the server"); // Very unlikely to happen
                error.status = 500;
                throw error;
            }
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export default check_auth();