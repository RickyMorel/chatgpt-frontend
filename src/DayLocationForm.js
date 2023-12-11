import React, { Component } from 'react';
import axios from 'axios';

class DayLocationForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      days: ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'],
      locations: [],
      isEditingLocations: false
    };
  }

  componentDidMount() {
      this.GetDayLocations();
  }

  GetDayLocations = async () => {
    try {
      const response = await axios.get('http://localhost:3000/day-location');
      console.log("response", response.data)

      this.setState({
        locations: [...response.data]
      })
    } catch (error) {
      console.log("error", error)
      return error
    }
};

  handleLocationChange = (day, newLocation) => {
    const dayIndex = this.state.days.findIndex(x => x == day)
    const dayLocationObj = {
      day: dayIndex,
      location: newLocation
    }

    let newLocationArray = this.state.locations
    console.log(dayIndex)
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

    if(this.state.isEditingLocations) {return}
    if(this.state.locations.length != 7) {console.log("No se lleno los 7 dias")}

    try {
      const response = await axios.put('http://localhost:3000/day-location', this.state.locations);
      return null
    } catch (error) {
      return error
    }
  };

  handleSelectChange = (e, day) => {
    const selectedLocation = e.target.value;
    this.handleLocationChange(day, selectedLocation);
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

      return(
        <div>
            <div class="col s6"><p className='centered'>{x}</p></div>
            <div class="col s6">
              {
                this.state.isEditingLocations == true ?
                <input type="text" onChange={(e) => this.handleLocationChange(x, e.target.value)} value={location} placeholder="Lugar..."/>
                :
                <p>{location == "" ? "-" : location}</p>
              }
            </div>
        </div>
      )
    })
    return (
        <form className="container" onSubmit={this.handleSubmit}>
          <div class="row">
            {dayLocationsHtml}
          </div>
          <button onClick={this.handleEditLocations}>{this.state.isEditingLocations ? "Save" : "Edit"}</button>
          {/* <button type="submit">Submit</button> */}
        </form>
    );
  }
}

export default DayLocationForm;
