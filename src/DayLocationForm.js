import React, { Component, createRef } from 'react';
import axios from 'axios';
import { usePopup } from './Popups/PopupProvider';
import { Color } from './Colors';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize.min.js';

class DayLocationForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      days: ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'],
      locations: [],
      times: [],
      isEditingLocations: false
    };

    this.selectRefs = this.state.days.map(() => createRef());
  }

  componentDidMount() {
      this.GetDayLocations();
      this.initializeMaterializeSelect();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState?.isEditingLocations !== this.state?.isEditingLocations) {
      this.initializeMaterializeSelect();
    }
  }

  initializeMaterializeSelect() {
    // Initialize Materialize Select for each select element using refs
    this.selectRefs.forEach((ref) => M.FormSelect.init(ref.current, {}));
  }

  GetDayLocations = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/global-config`);
      console.log("response", response.data)

      this.setState({
        locations: [...response.data.dayLocations]
      })
    } catch (error) {
      console.log("error", error)
      return error
    }
};

  handleLocationChange = (day, newLocation, newTime) => {

    const dayIndex = this.state.days.findIndex(x => x == day)
    const location = !newLocation ? this.state.locations[dayIndex].location : newLocation
    const time = !newTime ? this.state.locations[dayIndex].time : newTime
    const dayLocationObj = {
      day: dayIndex,
      location: location,
      time: time
    }

    console.log("prevLocationObj", this.state.days[dayIndex])
    console.log("dayLocationObj", dayLocationObj)
      
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

  handleSubmit = async (e) => {
    e.preventDefault();

    console.log("this.state.locations", this.state.locations)

    if(this.state.isEditingLocations) {return}
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
  };

  render() {
    const dayLocationsHtml = this.state.days.map(x => {
      const dayIndex = this.state.days.indexOf(x)
      const location = this.state.locations.find(x => x.day == dayIndex) ? this.state.locations.find(x => x.day == dayIndex).location : ""
      const time = this.state.locations.find(x => x.day == dayIndex)?.time ? this.state.locations.find(x => x.day == dayIndex).time : ""

      return(
        <div>
            <div class="col s3"><p className='centered'>{x}</p></div>
            <div class="col s5">
              {
                this.state.isEditingLocations == true ?
                <select value={time} style={{ display: 'block' }} onChange={(e) => this.handleLocationChange(x, null, e.target.value)}>
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
                <input type="text" onChange={(e) => this.handleLocationChange(x, e.target.value, null)} value={location} placeholder="Lugar..."/>
                :
                <p>{location == "" ? "-" : location}</p>
              }
            </div>
        </div>
      )
    })
    return (
      <div>
          <h6 className="center-align">Tiempos de entrega</h6>
          <form className="container" onSubmit={(e) => this.handleSubmit(e)}>
            <div class="row">
              {dayLocationsHtml}
            </div>
            <button className={`waves-effect waves-light btn ${Color.Button_1}`} onClick={this.handleEditLocations}>
              <i className="material-icons left">{this.state.isEditingLocations ? "save" : "edit"}</i>
              {this.state.isEditingLocations ? "Save" : "Edit"}
            </button>
          </form>
      </div>
    );
  }
}

export default DayLocationForm;
