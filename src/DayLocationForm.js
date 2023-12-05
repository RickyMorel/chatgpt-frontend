import { useState } from 'react';

function DayLocationForm() {
    const [selectedValue, setSelectedValue] = useState('');

    // Handler function to update the selected value
    const handleSelectChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleSubmit = (event) => {
        alert('An essay was submitted: ' + this.state.value);
        event.preventDefault();
    }

    const dropDown =     
    <div>
        <label htmlFor="dropdown">Select an option:</label>
        <select id="dropdown" value={selectedValue} onChange={handleSelectChange}>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
        </select>

        {/* Display the selected value */}
        <p>Selected Value: {selectedValue}</p>
    </div>

    return (
        <form onSubmit={handleSubmit}>
            {dropDown}
            {dropDown}
            {dropDown}
            {dropDown}
            {dropDown}
            {dropDown}
            {dropDown}
            <input type="submit" value="Submit" />
        </form>
    )
}

export default DayLocationForm