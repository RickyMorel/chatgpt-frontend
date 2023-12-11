import React, { Component } from 'react';
import axios from 'axios';

class DayLocationForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      days: ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'],
      locations: []
    };
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

  handleLocationChange = (day, newLocation) => {
    const dayIndex = this.state.days.findIndex(x => x == day)
    const dayLocationObj = {
      day: dayIndex,
      location: newLocation
    }
    //console.log("handleLocationChange", day, dayLocationObj)

    let newLocationArray = this.state.locations
    console.log(dayIndex)
    console.log("this.state.locations.includes(x => x.day == dayIndex)", this.state.locations.find(x => x.day == dayIndex))

    if(this.state.locations.includes(x => x.day == dayIndex)){
      console.log("found")
      const dayToUpdateIndex = newLocationArray.findIndex(x => x.day == dayIndex)
      newLocationArray[dayToUpdateIndex] = dayLocationObj
    }
    else {
      console.log("push")
      newLocationArray.push(dayLocationObj)
    }

    this.setState({
      locations: newLocationArray,
    });

    console.log("newLocationArray", this.state.locations)
  };

  handleSubmit = async (e) => {
    e.preventDefault();

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

  render() {
    const dayLocationsHtml = this.state.days.map(x => {
      return(
        <div>
            <div class="col s6"><p className='centered'>{x}</p></div>
            <div class="col s6">
              <input type="text" onChange={(e) => this.handleLocationChange(x, e.target.value)} placeholder="Lugar..."/>
            </div>
        </div>
      )
    })
    return (
        <form className="container" onSubmit={this.handleSubmit}>
          <div class="row">
            {dayLocationsHtml}
          </div>
          <button type="submit">Submit</button>
        </form>
    );
  }
}

export default DayLocationForm;
