import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import React, { Component } from 'react';
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import HttpRequest from '../HttpRequest';
import '../SideNav.css';
import CustomButton from './CustomButton';

class LogoInput extends Component {
    fileInputRef = React.createRef();

    constructor(props) {
        super(props);

        this.state = {
            selectedImage: null,
            downloadURL: '',
            uploading: false,
            imageURL: '',
            isHovered: false
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.imageURL === this.props.imageURL) { return; }
        
        this.setState({
            imageURL: this.props?.imageURL || ''
        })
    }

    handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const base64 = e.target.result;
                this.setState({ selectedImage: base64 });
                this.uploadImage(base64);
            };
            
            reader.readAsDataURL(file);
        }
        event.target.value = '';
    };

    uploadImage = async (base64Data) => {
        try {
            const response = await HttpRequest.put(`/global-config/updateLogo`, { 
                logoBase64: base64Data 
            });
            console.log("uploadImage response", response);
        } catch(err) {
            console.log("Upload Logo error", err);
        }
    };

    render() {
        const { selectedImage, imageURL, isHovered } = this.state;

        return (
            <div style={{display: 'flex', justifyContent: 'center'}}>
                {selectedImage || imageURL.length > 0 ? (
                    <img 
                        style={{ 
                            maxWidth: '120px', 
                            maxHeight: '100%', 
                            cursor: 'pointer',
                            border: isHovered ? `2px solid ${ColorHex.GreenDark_1}` : 'none',
                            borderRadius: '4px',
                            transition: 'all 0.3s ease',
                            opacity: isHovered ? 0.8 : 1
                        }} 
                        src={selectedImage || imageURL} 
                        onMouseEnter={() => this.setState({ isHovered: true })}
                        onMouseLeave={() => this.setState({ isHovered: false })}
                        onClick={() => this.fileInputRef.current.click()}
                        alt="Company logo"
                    />
                ) : (
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <p style={{ ...CssProperties.BodyTextStyle, color: ColorHex.RedFabri, marginBottom: '8px' }}>
                            Agregue logo de empresa
                        </p>
                        <CustomButton 
                            icon={faCloudUploadAlt} 
                            width='120px' 
                            height='120px' 
                            iconSize={80} 
                            onClickCallback={() => this.fileInputRef.current.click()}
                        />
                    </div>
                )}
                
                <input
                    type="file"
                    accept="image/*"
                    onChange={this.handleImageChange}
                    style={{ display: "none" }}
                    ref={this.fileInputRef}
                />
            </div>
        );
    }
}

export default LogoInput;