import { useState, useRef, useEffect } from 'react';
import { ColorHex } from '../Colors';
import CssProperties from '../CssProperties';
import CustomButton from '../Searchbar/CustomButton';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import HttpRequest from '../HttpRequest';
import Utils from '../Utils';

const ChatBotWidget = (props) => {
  const initialMessagesState = [{ id: 1, text: 'Esribe algo para empezar...', isBot: true }]
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState(initialMessagesState);
  const [inputMessage, setInputMessage] = useState('');
  const [pressedToggle, setPressedToggle] = useState(false)
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversation()
  }, [props.ownerId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversation = async () => {
    try {
      const response = await HttpRequest.get(`/client-crud/getClientByPhoneNumber?phoneNumber=test_${props.ownerId}`);

      let i = 2
      let messages = []
      response.data.lastChat.forEach(message => {
        const messageObj = { id: i, text: message.content, isBot: message.role != "user" }
        messages.push(messageObj)
        i++
      });
      setMessages(messages.length > 0 ? messages : initialMessagesState)
    } catch (error) {}
  }

  const clearChat = async () => {
    try {
      const response = await HttpRequest.put(`/client-crud/updateByNumber`, {phoneNumber: `test_${props.ownerId}`, lastChat: []});
      setMessages(prev => initialMessagesState);
    } catch(err) {}
  }

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    if(messages.length > 15) { await this.clearChat() }

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false
    };

    // Add user message and typing indicator
    setMessages(prev => [...prev, newMessage, { id: 'typing', isBot: true, isTyping: true }]);
    setInputMessage('');

    try {
      const response = await HttpRequest.post(`/chat-gpt-ai/mockReplyToClient`, [{role: "user", content: inputMessage}]);
      const botResponse = {
        id: messages.length + 2,
        text: response.data.content,
        isBot: true
      };
      
      // Remove typing indicator and add bot response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== 'typing');
        return [...filtered, botResponse];
      });
    } catch(err) {
      // Remove typing indicator on error
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
    }
  };

  const toggleChat = () => {
    if(props?.setupConditions.minimumConditionsMet) { 
      setPressedToggle(true) 

      if(props.tutorialTrigger == true) {
        props?.toastCallback(Utils.deativateBlockClientsToast)
      }
    }

    if (isChatOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsChatOpen(false);
        setIsClosing(false);
      }, 300);
    } else {
      setIsChatOpen(true);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const parseMessageText = (message) => {
    let textParts = message.text.split("---");
    if(!message.text.includes("---")) { textParts = undefined}
    const bodyText = textParts ? textParts[1] : message.text
    console.log("parseMessageText", message)
    console.log("textParts", textParts)
    const items = textParts ? textParts[0].split("\n\n") : [];

    let itemMessages = []
    for(const item of items) {
      if(item.length < 1) { continue; }

      const itemParts = item.split("\n")

      const itemMessage = {
        text: itemParts[0],
        image: itemParts[1],
        isBot: true
      }
      itemMessages.push(itemMessage)
    }

    console.log("items", items)
    
    const returnedHtml = itemMessages.map((itemMessage, index) => (
      MessageHtml(
        message,
        <>
          <img src={itemMessage.image} style={{ width: '100%', height: 'auto' }} />
          {highlightLinks(itemMessage.text)}
        </>
      )
    ));
    
    const additionalHtml = (
      MessageHtml(
        message,
        highlightLinks(bodyText)
      )
    );
    
    return (
      <>
        {itemMessages.length > 0 ? returnedHtml : <></>}
        {additionalHtml}
      </>
    );
  };

  const MessageHtml = (message, content) => {
    return (
      <div className={`message ${message.isBot ? 'bot' : 'user'}`}>
        <div
          style={{
            ...CssProperties.BodyTextStyle,
            color: !message.isBot ? ColorHex.White : 'black',
            marginBottom: '-5px',
            marginTop: '-5px'
          }}
        >
          {content}
        </div>
      </div>
    )
  }

  const MessagesContainer = () => {
    return (
      <div className="messages-container">
        {messages.map((message) => (
              message.isTyping ? (
              MessageHtml(
                message,
                <div className="typing-animation">
                  <div className="typing-dot" style={{ animationDelay: '0s' }}></div>
                  <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
                  <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
                </div>
              )
            ) : (
              parseMessageText(message)
            )
        ))}
        <div ref={messagesEndRef} />
      </div>
    );
  };

  return (
    <div className="chatbot-container">
      {isChatOpen && (
        <div className={`chat-window ${isClosing ? 'closing' : ''}`}>
          <div className="chat-header">
            <div style={{display: 'flex',  gap: '180px', justifyContent: 'space-between'}}>
              <p style={{...CssProperties.MediumHeadetTextStyle, color: ColorHex.White}}>WhatsBot</p>
              <div><CustomButton iconSize="15px" width='30px' height="30px" icon={faArrowsRotate} onClickCallback={clearChat}/></div>
            </div>
            <p style={{...CssProperties.BodyTextStyle, color: ColorHex.White, marginTop: '-23px', marginRight: 'auto'}}>Testear tu assistente virtual</p>
          </div>
          
          {
            !props?.setupConditions.minimumConditionsMet ?
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '20px' }}>
              <p style={{...CssProperties.SmallHeaderTextStyle, color: ColorHex.TextBody, textAlign: 'center'}}>Una vez que completes los pasos de configuración, podras usar esta ventana...</p>
            </div>
            :
            <>
              {MessagesContainer()}
            </>
          }
          <div className="input-container">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Escriba tu mensaje..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <CustomButton onClickCallback={handleSendMessage} disabled={!props?.setupConditions.minimumConditionsMet} text={"Enviar"} classStyle="btnGreen-clicked"/>
          </div>
        </div>
      )}

      {/* <CustomButton width={"40px"} height={"40px"} onClickCallback={toggleChat} classStyle="btnGreen-clicked"/> */}
      <button className={`chat-toggle ${props.tutorialTrigger && !pressedToggle ? 'glowing' : ''} active`} onClick={toggleChat}>
        <img 
          src='./images/iconWhite.png' 
          alt="Logo" 
          className="img-fluid" 
          style={{ width: '40px', height: '40px'}} 
        />
      </button>

      <style jsx>{`
        .chatbot-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          display: flex;
          flex-direction: column-reverse;
          gap: 20px;
          flexDirection: row 
        }

        .chat-toggle {
          background: ${ColorHex.GreenDark_1};
          border-radius: 50%;
          width: 60px;
          height: 60px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          color: white;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);
          border: 1px solid ${ColorHex.BorderColor};
        }

        .chat-window {
          width: 350px;
          height: 500px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          animation: slideIn 0.3s ease-out;
          transform-origin: bottom right;
        }

        .chat-toggle:active {
          transform: scale(0.95);
        }

        .chat-window.closing {
          animation: slideOut 0.3s ease-in;
        }

        @keyframes slideIn {
          from {
            transform: translateY(100%) scale(0.5);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          from {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          to {
            transform: translateY(100%) scale(0.5);
            opacity: 0;
          }
        }

        .chat-header {
          padding: 15px;
          background: ${ColorHex.GreenDark_1};
          color: white;
          border-radius: 12px 12px 0 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          height: 70px;
          box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.3);
          border: 1px solid ${ColorHex.BorderColor};
        }

        .messages-container {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
        }

        .message {
          margin: 8px 0;
          padding: 8px 12px;
          border-radius: 12px;
          max-width: 80%;
          animation: messageFade 0.2s ease;
          width: 300px;
          word-wrap: break-word;
        }

        @keyframes messageFade {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message.user {
          background: ${ColorHex.GreenDark_1};
          color: white;
          margin-left: auto;
        }

        .message.bot {
          background: #e0e0e0;
          color: black;
        }

        .input-container {
          padding: 16px;
          display: flex;
          gap: 8px;
          border-top: 1px solid #ddd;
        }

        .input-container input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 20px;
          outline: none;
          transition: all 0.2s ease;
        }

        .input-container input:focus {
          border-color: ${ColorHex.GreenDark_1};
          box-shadow: 0 0 0 2px rgba(0,112,243,0.2);
        }

        .input-container button {
          background: ${ColorHex.GreenDark_1};
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .input-container button:hover {
          background: ${ColorHex.GreenDark_1};
        }

      .typing-animation {
        display: flex;
        align-items: center;
        height: 25px;
        width: 50px;
      }

      .typing-dot {
        height: 7px;
        width: 7px;
        margin: 0 2px;
        background-color: #666;
        border-radius: 50%;
        animation: typing 1.4s infinite ease-in-out;
      }

      @keyframes typing {
        0%, 80%, 100% { 
          transform: translateY(0);
        }
        40% {
          transform: translateY(-7px);
        }
      }
      `}</style>

      {Utils.glowingStyle()}
    </div>
  );
};

export default ChatBotWidget;

function highlightLinks(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  // Split text by URLs
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    // Check if the part is a URL (use test() on the same regex)
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'blue', textDecoration: 'underline' }}
        >
          {part}
        </a>
      );
    }

    part = part.replaceAll("\n", "<br/>")

    // Return plain text for non-URL parts (skip empty strings from split)
    return part ? <div key={index} dangerouslySetInnerHTML={{ __html: part }}/>: null;
  });
}
