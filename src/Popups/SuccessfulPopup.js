import React from 'react';

const SuccessfulPopup = ({ isOpen, closeFunc, errorMsg }) => {
  const successMessage = "Guardo los datos correctamente."

  return (
    <div class="row valign-wrapper card">
        <div className="col s3">
        <img width="200" height="200" src={errorMsg == null ? "images/tick.png" : "images/failIcon.png"} alt="" class="circle responsive-img"/>
        </div>
    <div class="col s9">
      <div>
        <div class="card-content">
          <h6>{errorMsg == null ? successMessage : GetSameStringLength(successMessage.length, errorMsg.message)}</h6>
        </div>
        <div>
            <button onClick={closeFunc} className='waves-effect btn red lighten-1 waves grey-text'>Close</button>
        </div>
      </div>
    </div>
  </div>
  );
};

const GetSameStringLength = (wantedLength, currentString) => {
  const lengthDifference = wantedLength - currentString.length
  let newString = currentString

  for (let i = 0; i < lengthDifference; i++) {
    newString += " ";
  }

  return newString
}

export default SuccessfulPopup;
