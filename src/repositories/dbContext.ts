const backendUri = process.env["REACT_APP_BACKEND_URL"] as string;
if (!backendUri) {
    console.log("No")
}

export async function Get(path: string) {
    try {
        const response = await fetch(backendUri + path);

        if(response.status < 200 || response.status > 299) {
            return;
        }

        const jsonResponse = await response.json();

        return jsonResponse;
    } catch(e){
        console.log(e);
        return;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function Post(path: string, data: any) {
    try {
        const response = await fetch(backendUri + path, {
            method: "POST",
            mode: "no-cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(data)
        });

        if(response.status < 200 || response.status > 299) {
            return;
        }

        const jsonResponse = await response.json();

        return jsonResponse;
    } catch {
        return;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function Put(path: string, data: any) {
    try {
        const response = await fetch(backendUri + path, {
            method: "PUT",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(data)
        });

        if(response.status < 200 || response.status > 299) {
            return;
        }

        const jsonResponse = await response.json();

        return jsonResponse;
    } catch {
        return;
    }
}

export async function Delete(path: string) {
    try {
        const response = await fetch(backendUri + path, {
            method: "DELETE",
            mode: "no-cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
        });

        if(response.status < 200 || response.status > 299) {
            return;
        }

        const jsonResponse = await response.json();

        return jsonResponse;
    } catch {
        return;
    }
}