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
        console.log("PostData", url)
        try {
          const response = await axios.post(url, data);
          return null
        } catch (error) {
          return error
        }
      };
}

export default GetDataFromExcel