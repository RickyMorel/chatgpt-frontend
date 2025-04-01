import axios from 'axios';

class HttpRequest {
    static async get(link, noToken = false) {
        const token = window.token
        let response = undefined

        if(noToken) {
            response = await axios.get(`${process.env.REACT_APP_HOST_URL}${link}`);
        }
        else {
            response = await axios.get(
                `${process.env.REACT_APP_HOST_URL}${link}`,
                {
                    headers: {
                      'Authorization': `Bearer ${token}`,
                    },
                }
            );
        }
        return response
    }

    static async put(link, data) {
        const token = window.token
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

    static async post(link, data, noToken = false) {
        const token = window.token
        let response = undefined

        if(noToken) {
            response = await axios.post(`${process.env.REACT_APP_HOST_URL}${link}`, data);
        }
        else {
            response = await axios.post(
                `${process.env.REACT_APP_HOST_URL}${link}`,
                data,
                {
                    headers: {
                      'Authorization': `Bearer ${token}`,
                    },
                }
            );
        }
        return response
    }
}

export default HttpRequest