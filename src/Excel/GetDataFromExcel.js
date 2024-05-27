import axios from 'axios';

class GetDataFromExcel {

    static FindHeaderIndexes = (inputArray, stringsToFind) => {
        const indexes = [];
        for (const searchString of stringsToFind) {
            for (let i = 0; i < inputArray.length; i++) {
                const element = inputArray[i];
                if (element.includes(searchString)) {
                    indexes.push(i);
                }
            }
        }
        return indexes;
    }

    static PostData = async (url, data) => {
        try {
          const response = await axios.post(url, data);
          console.log("PostData", response)
          return response
        } catch (error) {
          return error
        }
    };
}

export default GetDataFromExcel