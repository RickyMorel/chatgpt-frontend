import axios from 'axios';

class HttpRequest {
    static async get(link, noToken = false, retries=3) {
        const token = window.token
        let response = undefined

        console.log("get token", token)

        if(noToken) {
            response = await axios.get(`${process.env.REACT_APP_HOST_URL}${link}`);
        }
        else {
            try {
                response = await axios.get(
                    `${process.env.REACT_APP_HOST_URL}${link}`,
                    {
                        headers: {
                          'Authorization': `Bearer ${token}`,
                        },
                    }
                );
            } catch(err) {
                retries--
                if(retries == 0) { return err}
                else { 
                    console.log("Got error in HTTP request, trying again", retries);
                    return this.get(link, noToken, retries) 
                }
            }
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