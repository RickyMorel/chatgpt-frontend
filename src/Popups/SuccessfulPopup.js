import React from 'react';

const SuccessfulPopup = ({ isOpen, onRequestClose }) => {
  return (
    <div class="row valign-wrapper card grey ">
        <div className="col s3">
        <img width="150" height="150" src="images/tick.png" alt="" class="circle responsive-img"/>
        </div>
    <div class="col s9">
      <div>
        <div class="card-content white-text">
          <h6>Guardo los datos correctamente.</h6>
        </div>
        <div class="card-action center">
            <button className='waves-effect waves btn blue'>Close</button>
        </div>
      </div>
    </div>
  </div>
    // <div className="card valign-wrapper">
    //     <div class="row">
    //         <div className="card valign-wrapper">
    //             <div class="col s2">
    //                 <img width="150" height="150" src="images/tick.png" alt="" class="circle responsive-img"/>
    //             </div>
    //             <div class="col s10">
    //                 <span class="black-text">
    //                     Guardo los datos correctamente
    //                 </span>
    //                 <button className='waves-effect waves btn blue'>Close</button>
    //             </div>
    //         </div>
    //     </div>
    // </div>
    //     <div class="row">
    //     <div class="col s12 m7">
    //       <div class="card">
    //         <div class="card-image">
    //           <img src="images/tick.png"/>
    //           <span class="card-title">Card Title</span>
    //         </div>
    //         <div class="card-content">
    //           <p>I am a very simple card. I am good at containing small bits of information.
    //           I am convenient because I require little markup to use effectively.</p>
    //         </div>
    //         <div class="card-action">
    //           <a href="#">This is a link</a>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
  );
};

export default SuccessfulPopup;
