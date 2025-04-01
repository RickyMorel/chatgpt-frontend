import { faRectangleXmark } from '@fortawesome/free-regular-svg-icons';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import React, { Component } from 'react';
import { ColorHex } from '../Colors';
import '../SideNav.css';
import CustomButton from './CustomButton';

class CustomFileInput extends Component {
    fileInputRef = React.createRef();

    constructor(props) {
        super(props);

        this.state = {
            selectedImage: null,
            downloadURL: '',
            uploading: false,
            imageURL: ''
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.imageURL == this.props.imageURL) { return; }
        
        this.setState({
            imageURL: this.props?.imageURL
        })
    }

    handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
          const file = event.target.files[0];
          this.setState({selectedImage: URL.createObjectURL(file)});
          this.props.onChange(URL.createObjectURL(file))
        }
    };

    render() {
        const { width, height } = this.props;
        const { selectedImage, imageURL } = this.state;

        return (
            <div style={{...blockStyle, height: '405px', position: 'relative'}}>
                <div style={scrollStyle}>
                    {
                        selectedImage || imageURL.length > 0 ? 
                        <>
                            <img style={{ maxWidth: '100%', maxHeight: '100%' }} src={selectedImage ?? imageURL} />
                            <div style={{ position: 'absolute', top: 0, right: 0 }}>
                                <CustomButton classStyle="btnRed" width='55px' height='55px' icon={faRectangleXmark} onClickCallback={() => this.setState({ selectedImage: null, imageURL: '' })} />
                            </div>
                        </>
                        :
                        <>
                            <CustomButton icon={faCloudUploadAlt} width='300px' height='300px' iconSize={200} onClickCallback={() => this.fileInputRef.current.click()}/>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={this.handleImageChange}
                                style={{ display: "none" }}
                                ref={this.fileInputRef}
                            />
                        </>
                    }
                </div>
            </div>
        );
    }
}

const scrollStyle = {
    borderRadius: '10px',
    backgroundColor: ColorHex.Background,
    padding: '10px',
    boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.3)',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center', 
}

const blockStyle = {
    width: '800px',
    marginTop: '10px',
    marginTop: '25px',
    padding: '25px',
    boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.3)',
    border: `1px solid ${ColorHex.BorderColor}`,
    borderRadius: '10px',
    backgroundColor: ColorHex.White
}
export default CustomFileInput;