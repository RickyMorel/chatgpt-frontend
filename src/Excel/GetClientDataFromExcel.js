import axios from 'axios';
import GetDataFromExcel from './GetDataFromExcel';

class GetClientDataFromExcel extends GetDataFromExcel {

    static ExtractClientData = (clientsJson) => {
        const stringsToFind = ["Nombre", "Numero", "Domicilio"];
        const headerIndexes = this.FindHeaderIndexes(clientsJson[0], stringsToFind)
        clientsJson.shift()
        let clientData = []

        clientsJson.forEach(jsonClient => {
            const newClient = {name: jsonClient[headerIndexes[0]], phoneNumber: jsonClient[headerIndexes[1]], address: jsonClient[headerIndexes[2]]}
            clientData.push(newClient)
        });
        return clientData
    }
}

export default GetClientDataFromExcel