import React, { Component, createRef } from 'react';
import axios from 'axios';
import { Color } from '../Colors';
import 'materialize-css/dist/css/materialize.min.css';
import '../MultiSelect.css';

class DayLocationForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      days: ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'],
      locations: [],
      clientLocations: [],
      times: [],
      isEditingLocations: false
    };

    this.selectRefs = this.state.days.map(() => createRef());
  }

  componentDidMount() {
      this.GetDayLocations();
      this.GetAllClientLocations();
  }

  GetDayLocations = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/global-config`);

      this.setState({
        locations: [...response.data.dayLocations]
      })
    } catch (error) {
      console.log("error", error)
      return error
    }
  };

  GetAllClientLocations = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/client-crud/getAllClientZones`);

      this.setState({
        clientLocations: [...response.data]
      })
    } catch (error) {
      console.log("error", error)
      return error
    }
  };

  handleLocationChange = (day, newLocations, newTime) => {
    const dayIndex = this.state.days.findIndex(x => x == day)
    const location = !newLocations ? this.state.locations[dayIndex].location : Array.from(newLocations, (option) => option.value)
    const time = !newTime ? this.state.locations[dayIndex].time : newTime
    const dayLocationObj = {
      day: dayIndex,
      locations: location,
      time: time
    }
      
    let newLocationArray = this.state.locations
    const dayToUpdateIndex = this.state.locations.findIndex(x => x.day === dayIndex);

    if(dayToUpdateIndex !== -1){
      newLocationArray[dayToUpdateIndex] = dayLocationObj
    }
    else {
      newLocationArray.push(dayLocationObj)
    }

    this.setState({
      locations: [...newLocationArray],
    });
  };
handleSubmit = async (e, isEdting) => {
    e.preventDefault();

    if(isEdting) {return}

    if(this.state.locations.length != 7) {this.props.showPopup(new Error("No se lleno los 7 dias")); return}
    if(this.state.locations.includes(x => x.time == "" || x.time == undefined))
     {this.props.showPopup(new Error("No se lleno los 7 tiempos")); return}

    try {
      const response = await axios.put(`${process.env.REACT_APP_HOST_URL}/global-config/dayLocations`, {dayLocations: [...this.state.locations]});
      return null
    } catch (error) {
      return error
    }
  };

  handleEditLocations = (e) => {
    const isEdting = !this.state.isEditingLocations;

    this.setState({
      isEditingLocations: isEdting
    })

    this.handleSubmit(e, isEdting)
  };

  render() {
    const dayLocationsHtml = this.state.days.map(x => {
      const dayIndex = this.state.days.indexOf(x)
      const locations = this.state.locations.find(x => x.day == dayIndex) ? this.state.locations.find(x => x.day == dayIndex).locations : []
      const time = this.state.locations.find(x => x.day == dayIndex)?.time ? this.state.locations.find(x => x.day == dayIndex).time : ""
      let locationsString = ""

      locations?.forEach(location => {
        locationsString += location + ", "
      });

      const finalLocationsString = locationsString.substring(0, locationsString.length-2)

      const selectStyle = {
        width: '100%',
        height: '60px',
        border: 'none',
        outline: 'none',
        appearance: 'none',
        background: 'transparent',
        cursor: 'pointer',
        display: 'block' 
      };

      return(
        <div>
            <div class="col s3"><p className='centered'>{x}</p></div>
            <div class="col s5">
              {
                this.state.isEditingLocations == true ?
                <select style={{display: 'block' }} value={time} onChange={(e) => this.handleLocationChange(x, null, e.target.value)}>
                  <option value="">Tiempo...</option>
                  <option value="morning">En la mañana</option>
                  <option value="afternoon">En la tarde</option>
                </select>
                :
                <p>{time == "" ? "Elejir Tiempo" : time}</p>
              }
            </div>
            <div class="col s4">
              {
                this.state.isEditingLocations == true ?
                <select style={selectStyle} multiple={true} value={locations} onChange={(e) => this.handleLocationChange(x, e.target.selectedOptions, null)}>
                  {
                    this.state.clientLocations && this.state.clientLocations?.map(x => (
                      <option value={x}>{x}</option>
                    ))
                  }
                </select>
                :
                <p>{finalLocationsString == "" ? "-" : finalLocationsString}</p>
              }
            </div>
        </div>
      )
    })
    return (
      <div className={`card bordered ${Color.Background}`}>
        <div className="card-content">
          <h6 className="center-align">Tiempos de entrega</h6>
          <form className="container">
            <div class="row">
              {dayLocationsHtml}
            </div>
            <button className={`waves-effect waves-light btn ${Color.Button_1}`} onClick={this.handleEditLocations}>
              <i className="material-icons left">{this.state.isEditingLocations ? "save" : "edit"}</i>
              {this.state.isEditingLocations ? "Save" : "Edit"}
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default DayLocationForm;
