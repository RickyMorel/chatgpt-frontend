import axios from 'axios';
import SuccessfulPopup from '../Popups/SuccessfulPopup';

class GetClientDataFromExcel {

    static FindHeaderIndexes = (inputArray) => {
        const stringsToFind = ["Nombre", "Numero", "Domicilio"];
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

    static ExtractClientData = (clientsJson) => {
        const headerIndexes = this.FindHeaderIndexes(clientsJson[0])
        clientsJson.shift()
        let clientData = []

        clientsJson.forEach(jsonClient => {
            const newClient = {name: jsonClient[headerIndexes[0]], phoneNumber: jsonClient[headerIndexes[1]], address: jsonClient[headerIndexes[2]]}
            clientData.push(newClient)
        });
        return clientData
    }

    static PostClientData = async (clientData) => {
        try {
          //const response = await axios.post('http://localhost:3000/client-crud/createMany', clientData);
          //console.log("response", response)
          return <SuccessfulPopup/>
        } catch (error) {
            console.log("error", error)
          //this.setState({ error: error });
        } finally {
          //this.setState({ loading: false });
        }
      };
}

export default GetClientDataFromExcel