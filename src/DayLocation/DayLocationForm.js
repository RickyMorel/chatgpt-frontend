import React, { Component, createRef } from 'react';
import axios from 'axios';
import '../MultiSelect.css';
import TimeBlock from './TimeBlock';
import { Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material';
import { Color, ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import StatCard from '../Searchbar/StatCard';
import { faHouseChimney, faHouseChimneyUser, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import CustomButton from '../Searchbar/CustomButton';
import CustomInput from '../Searchbar/CustomInput';
import { faFloppyDisk, faRectangleXmark, faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import Utils from '../Utils';

class DayLocationForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      days: ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'],
      locations: [],
      nextDayIndex: -1,
      clientLocations: [],
      times: [],
      isEditingLocations: false,
      timeSets: [],
      canMessageTommorrowsClients: false
    };

    this.selectRefs = this.state.days.map(() => createRef());
  }

  componentDidMount() {
    this.GetAllData()
  }

  GetAllData = async () => {
    this.props.setIsLoading(true)

    await this.GetDayLocations();
    await this.GetAllClientLocations();
    await this.GetCanMessageTommorrowsClients();

    this.props.setIsLoading(false)
  }

  GetCanMessageTommorrowsClients = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/chat-gpt-ai/canMessageTommorrowsClients`);

      this.setState({
        canMessageTommorrowsClients: response.data
      })
    } catch(error) {
      this.setState({
        canMessageTommorrowsClients: false
      })
    }
  }

  GetDayLocations = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/global-config`);
      let timeSets = []
      for (let i = 0; i < response.data.timesToSendMessages.length; i++) {
        const timeSet = {id: i, set: response.data.timesToSendMessages[i]};
        timeSets.push(timeSet)
      }

      console.log("timeSets", timeSets)
      this.setState({
        locations: [...response.data.dayLocations],
        nextDayIndex: response.data.nextMessageDayIndex,
        sendMessagesTime: response.data.timeToSendMessages,
        timeSets: timeSets
      })

      console.log("GetDayLocations this.state.locations", response.data.dayLocations)

    } catch (error) {
      this.props.showPopup(new Error(error.response.data.message))
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

  handleLocationChange = (e, day, newTime) => {
    const selectedOptions = Array.isArray(e.target.value) ? e.target.value : [e.target.value];
    const dayIndex = this.state.days.findIndex(x => x == day)
    const time = newTime == undefined || newTime == null ? this.state.locations[dayIndex].time : newTime
    
    const dayLocationObj = {
      day: dayIndex,
      locations: selectedOptions,
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

  handleAddTimeSet = () => {
    let newTimeSets = [...this.state.timeSets]

    newTimeSets.push({id: this.state.timeSets.length + 1, set: {startTime: "00:00", endTime: "00:00"}})

    this.setState({
      timeSets: newTimeSets,
      isEditingLocations: true
    })
  }

  handleRemoveTimeSet = (idToRemove) => {
    let newTimeSets = [...this.state.timeSets]

    newTimeSets = newTimeSets.filter(x => x.id != idToRemove)

    this.setState({
      timeSets: newTimeSets
    })
  }

  handleTimeChange = (day, newTime) => {
    const dayIndex = this.state.days.findIndex(x => x == day)
    const time = newTime == undefined || newTime == null ? this.state.locations[dayIndex].time : newTime

    console.log("handleTimeChange location", dayIndex, this.state.locations)
    console.log("handleTimeChange newTime", newTime)
      
    let newLocationArray = this.state.locations
    const dayToUpdateIndex = this.state.locations.findIndex(x => x.day === dayIndex);

    newLocationArray[dayToUpdateIndex].time = time

    this.setState({
      locations: [...newLocationArray],
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    if(this.state.locations.length != 7) {this.props.showPopup(new Error("No se lleno los 7 dias")); return}
    if(this.state.locations.includes(x => x.time == "" || x.time == undefined))
     {this.props.showPopup(new Error("No se lleno los 7 tiempos")); return}

    //Check times
    let prevTimeSet = undefined

    for(const timeSet of this.state.timeSets) {
      if(!prevTimeSet) { prevTimeSet = timeSet; continue;}

      if(this.isTime1Bigger(prevTimeSet.set.endTime, timeSet.set.startTime) == true) {
        this.props.showPopup(new Error("El tiempo inicial no puede ser menor al tiempo final anterior!"))
        return;
      }

      prevTimeSet = timeSet
    }

    //Don't add empty timesets
    let timeSets = this.state.timeSets.map(x => x.set)
    timeSets = timeSets.filter(x => (x.startTime == x.endTime) == false)

    this.setState({
      isEditingLocations: false
    })

    try {
      const response = await axios.put(`${process.env.REACT_APP_HOST_URL}/global-config/dayLocations`, 
        {
          dayLocations: [...this.state.locations],
          timesToSendMessages: timeSets,
        }
      );

      return null
    } catch (error) {
      this.props.showPopup(new Error(error.response.data.message))
    }
  };

  handleSendMessages = async () => {
    if(this.state.canMessageTommorrowsClients == false) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/chat-gpt-ai/canMessageTommorrowsClients`);
      } catch(error) {
        this.props.showPopup(new Error(error.response.data.message))
      }
      return;
    }
    try {
      this.setState({
        canMessageTommorrowsClients: false
      })
      const response = await axios.post(`${process.env.REACT_APP_HOST_URL}/chat-gpt-ai/messageTommorrowsClients`);
    } catch (error) {
      this.props.showPopup(new Error(error.response.data.message))
    }
  }

  handleChangeProcessTimes = (id, timeSet) => {
    console.log("timeSet", id, timeSet)
    let newTimeSets = [...this.state.timeSets]

    let prevTimeIndex = newTimeSets.indexOf(x => x.id != id)
    const newTimeSet = {id: id, set: timeSet}

    if(prevTimeIndex) {
      newTimeSets = newTimeSets.filter(x => x.id != id)
      newTimeSets.splice(prevTimeIndex, 0, newTimeSet)
    }
    else {
      newTimeSets.push(newTimeSet)
    }

    newTimeSets.sort((a, b) => {
      return a.id - b.id
    })

    console.log("newTimeSets", newTimeSets)
    
    // if(foundTimeProblem) { return; }

    this.setState({
      timeSets: newTimeSets
    })
  }

  handleEditLocations = (e) => {
    const isEdting = !this.state.isEditingLocations;

    if(isEdting) {
      this.setState({
        isEditingLocations: isEdting
      })
    }
  };

  isTime1Bigger(time1, time2) {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);

    console.log("startTime > endTime", hours1, ">", hours2)
  
    // Compare hours first
    if (hours1 > hours2) {
      return true;
    } else if (hours1 < hours2) {
      return false;
    }
  
    // If hours are equal, compare minutes
    if (minutes1 > minutes2) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const textStyle = {
      "margin-left": "5%"
    };

    let orderedLocations = this.state.clientLocations.sort()
    orderedLocations = orderedLocations.filter(x => x.toString().toLowerCase() != "NO MENSAJEAR".toLowerCase())
    orderedLocations = orderedLocations.filter(x => x.toString().includes(",") == false)

    const dayLocationsHtml = this.state.days.map(x => {
      const dayIndex = this.state.days.indexOf(x)
      const locations = this.state.locations.find(x => x.day == dayIndex) ? this.state.locations.find(x => x.day == dayIndex).locations : []
      const time = this.state?.locations?.find(x => x.day == dayIndex)?.time ? this.state?.locations?.find(x => x.day == dayIndex)?.time : ""

      console.log("time", time)
      let locationsString = ""

      locations?.forEach(location => {
        locationsString += location + ", "
      });

      const finalLocationsString = locationsString.substring(0, locationsString.length-2)
      const selectedLocations = this.state.locations.find(x => x.day === dayIndex)?.locations ?? []

      return(
        <div style={{ alignItems: 'center', width: '98%', display: 'flex', justifyContent: 'space-between'}}>
          <div className="col-4 d-flex justify-content-center align-items-center">
              <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody}}>
                  {dayIndex == this.state.nextDayIndex ? `${x} (Dia de mensajes)` : x}
              </p>
          </div>
          <div className="col-4 d-flex justify-content-center align-items-center">
              {this.state.isEditingLocations == true ? (
                  <CustomInput
                    maxLength={18}
                    placeholder='Mañana'
                    value={time}
                    onChange={(itemValue) => this.handleTimeChange(x, itemValue)}
                    width="90%"
                  />
              ) : (
                <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody}}>{time == "" ? "Elejir Tiempo" : time}</p>
              )}
          </div>
          <div className="col-4 d-flex justify-content-center align-items-center">
              {this.state.isEditingLocations == true ? (
                  <FormControl style={{ width: '90%' }}>
                      <Select
                          labelId="locations-label"
                          multiple
                          value={selectedLocations}
                          onChange={(e) => this.handleLocationChange(e, x, null)}
                          renderValue={(selected) => selected.join(', ')}
                          style={{backgroundColor: ColorHex.White, borderRadius: '10px', height: '75px'}}
                      >
                          {orderedLocations.map((location) => (
                              <MenuItem
                                  key={location}
                                  value={location}
                                  style={{
                                      fontWeight: selectedLocations?.includes(location) ? 'bold' : 'normal',
                                      color: selectedLocations?.includes(location) ? 'blue' : 'black',
                                      backgroundColor: selectedLocations?.includes(location) ? ColorHex.Third : 'white',
                                  }}
                              >
                                  {location}
                              </MenuItem>
                          ))}
                      </Select>
                  </FormControl>
              ) : (
                  <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody}}>{finalLocationsString == "" ? "-" : finalLocationsString}</p>
              )}
          </div>
        </div>
      )
    })

    const timeBlocks = this.state.timeSets.map(x => <TimeBlock isEditing={this.state.isEditingLocations} id={x.id} set={x.set} changeTimesCallback={this.handleChangeProcessTimes} removeTimeCallback={this.handleRemoveTimeSet}/>)

    const timesScrollHtml = 
      <div style={{ alignItems: 'center', width: '100%', marginTop: '25px'}}>
           <div style={{ alignItems: 'center', height: '45px', width: '98%', display: 'flex'}}>
            <div style={headerStyle} className='col-4'>Dia de Mensaje</div>
            <div style={headerStyle} className='col-4'>Tiempo de Entrega</div>
            <div style={headerStyle} className='col-4'>Zonas de Entrega</div>
           </div>

           <div style={scrollStyle}>
              {dayLocationsHtml}
           </div>
      </div>

    return (
      <div>
        <p style={{...CssProperties.LargeHeaderTextStyle, color: ColorHex.TextBody}}>Tiempos & Lugares</p>
        
        <div style={{display: 'flex'}}>
            <div class="flex-grow-1"><StatCard title="Semana de:" amountFunction={() => `${Utils.formatDateShort(Utils.getWeekRange().startOfWeek)} - ${Utils.formatDateShort(Utils.getWeekRange().endOfWeek)}`}/></div>
            <div className="col-11"></div>
        </div>

        <div style={{display: 'flex', width: '100%', paddingTop: '25px'}}>
          {
            this.state.isEditingLocations ?
            <>
              <div class="flex-grow-1"><CustomButton text="Guardar Cambios" classStyle="btnGreen" width="182px" height="45px" icon={faFloppyDisk} onClickCallback={this.handleSubmit}/></div>
              <div class="flex-grow-1" style={{paddingLeft: '25px'}}><CustomButton text="Cancelar Cambios" classStyle="btnRed" icon={faRectangleXmark} onClickCallback={() => window.location.reload()}/></div>
            </>
            :
            <>
              <div class="flex-grow-1"><CustomButton text="Editar Tiempos & Mensajes" icon={faPenToSquare} onClickCallback={this.handleEditLocations}/></div>
              <div class="flex-grow-1"style={{paddingLeft: '25px'}}><CustomButton text="Ver Barrios & Moviles" icon={faHouseChimneyUser} link="createOrder"/></div>
            </>
          }
          <div className="col-10"></div>
        </div>

        <div style={{...orderPanelStyling, height: '75px'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={{display: 'flex', flexGrow: 1, alignItems: 'center'}}>
              <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody}}>Horarios de Envio de Mensajes:</p>
              {timeBlocks}
            </div>
            <div style={{marginTop: '-20px'}}>
              <CustomButton width='186px' height="45px" text="Agregar Horario" icon={faSquarePlus} onClickCallback={this.handleAddTimeSet} />
            </div>
          </div>
        </div>


        <div style={{...orderPanelStyling, height: '70vh'}}>
          {timesScrollHtml}
        </div>
      </div>
      // <div className={`card bordered ${Color.Background}`}>
      //   <div className="card-content">
      //     <nav>
      //       <div className={`nav-wrapper ${Color.Background}`}>
      //         <ul id="nav-mobile" className="valign-wrapper" style={{ display: "flex", justifyContent: "space-between" }}>
      //           <li className='black-text' style={textStyle}>Tiempo en el que envia los mensajes:</li>
      //           {timeBlocks}
      //           {
      //             this.state.isEditingLocations ? 
      //             <div className='row'>
      //               <div className="col s6">
      //                 <button onClick={this.handleAddTimeSet} className={`waves-effect waves-light btn ${Color.Fifth}`} style={{ padding: '12px 12px', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
      //                   <i className="material-icons" style={{ fontSize: '18px' }}>add_circle_outline</i>  
      //                 </button>
      //               </div>
      //               <div className='col s6'>
      //                 {
      //                   this.state.timeSets.length > 0 ?
      //                   <button onClick={this.handleRemoveTimeSet} className={`waves-effect waves-light btn ${Color.First}`} style={{ padding: '12px 12px', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
      //                     <i className="material-icons" style={{ fontSize: '18px' }}>remove_circle_outline</i>
      //                   </button>
      //                   :
      //                   <div></div>
      //                 }
      //               </div>
      //             </div>
      //             : 
      //             <div></div>
      //           }
      //           {
      //             this.state.isEditingLocations ? 
      //             <div></div>
      //             :
      //             <a style={textStyle} className={`waves-effect waves-light btn ${this.state?.canMessageTommorrowsClients ? Color.Fifth : Color.First}`} onClick={this.handleSendMessages}>Enviar Mensajes Ahora</a>
      //           }
      //         </ul>
      //       </div>
      //     </nav>
      //     <br />
      //     <br />
      //     <h6 className="center-align"><strong>Tiempos de entrega</strong></h6>
      //     <form className="container">
      //       <hr />
      //       <div className="row">
      //         <div className="col s4"><strong>Día de Mensaje</strong></div>
      //         <div className="col s4"><strong>Día de entrega</strong></div>
      //         <div className="col s4"><strong>Zona de entrega</strong></div>
      //       </div>
      //       {dayLocationsHtml}
      //       <hr />
      //       <br />
      //       <button className={`waves-effect waves-light btn ${Color.Button_1}`} onClick={this.handleEditLocations}>
      //         <i className="material-icons left">{this.state.isEditingLocations ? "save" : "edit"}</i>
      //         {this.state.isEditingLocations ? "Save" : "Edit"}
      //       </button>
      //     </form>
      //   </div>
      // </div>
    );
  }
}

const orderPanelStyling = {
  width: '100%',
  marginTop: '10px',
  marginTop: '25px',
  padding: '25px',
  boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
  border: `1px solid ${ColorHex.BorderColor}`,
  borderRadius: '10px',
  backgroundColor: ColorHex.White
}

const headerStyle = {
  textAlign: 'center',
  color: ColorHex.TextBody,
  ...CssProperties.SmallHeaderTextStyle
}

const scrollStyle = {
  borderRadius: '10px',
  backgroundColor: ColorHex.Background,
  padding: '10px',
  boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.3)',
  overflowY: 'scroll', 
  height: '55vh',
  width: '100%',
  alignItems: 'center'
}

export default DayLocationForm;
