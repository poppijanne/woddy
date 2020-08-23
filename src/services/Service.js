import generateID from "../util/generateID";

export default class Service {

    async get(url) {
        return await this.execute("GET", url);
    }

    async post(url, data) {
        return await this.execute("POST", url, data);
    }

    async put(url, data) {
        return await this.execute("PUT", url, data);
    }

    async delete(url) {
        return await this.execute("DELETE", url);
    }

    async execute(method, url, data) {

        //console.log(url);

        const requestId = generateID();

        const headers = {
            'Accept': 'application/json',
            'Request-Id': requestId,
        };

        if (data) {
            headers['Content-Type'] = 'application/json';
        }

        try {
            
            const response = await fetch(url, {
                headers,
                method,
                credentials: 'same-origin',
                body: data && JSON.stringify(data)
            });

            if (response.ok) {
                return response.status === 204 ? { ok: true } : await response.json();
            }
            if (response.status === 400) {
                const message = await response.text();
                throw new Error(message);
            }            
            if (response.status === 401) {
                throw new Error(`Istuntosi on vanhentunut. Kirjaudu sisään uudestaan.`);
            }
            if (response.status === 403) {
                throw new Error(`Käyttöoikeutesi eivät riitä tämän toiminnon suorittamiseen.`);
            }
            if (response.status === 404) {
                return { notFound: true };
            }
            if (response.status === 410) {
                return { notFound: true };
            }
            if (response.status === 500) {
                throw new Error(`Hups, jokin meni vikaan. Virheen tunniste: ${requestId}`);
            }
            const message = await response.text();
            throw new Error(`${response.status} ${message}`);
        }
        catch (error) {
            console.error(error);
            return { error };
        }
    }
}