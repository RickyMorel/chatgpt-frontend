import axios from 'axios';

class HttpRequest {
    static async get(link) {
        const token = window.token
        console.log("HttpRequest get", link, token)
        const response = await axios.get(
            `${process.env.REACT_APP_HOST_URL}${link}`,
            {
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
            }
        );
        return response
    }

    static async put(link, data) {
        const token = window.token
        console.log("HttpRequest put", link, token)
        const response = await axios.put(
            `${process.env.REACT_APP_HOST_URL}${link}`,
            data,
            {
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
            }
        );
        return response
    }

    static async post(link, data) {
        const token = window.token
        console.log("HttpRequest post", link, token)
        const response = await axios.post(
            `${process.env.REACT_APP_HOST_URL}${link}`,
            data,
            {
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
            }
        );
        return response
    }
}

export default HttpRequest