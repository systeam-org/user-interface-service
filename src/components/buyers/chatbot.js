import React from "react";
import ReactDOM from "react-dom";
import { Chat } from "@progress/kendo-react-conversational-ui";
import "@progress/kendo-theme-default/dist/all.css";
import axios from "axios";
import uuid from 'uuid';
import "./chatbot.css";
import { CHAT_BOT,ESTIMATE } from "../../constants/api-constant";
import {
    MDBBtn,
    MDBModal,
    MDBModalHeader,
    MDBModalBody,
    MDBContainer,
    MDBIcon
} from "mdbreact";
class ChatBot extends React.Component {
    constructor(props) {
        super(props);
        this.user = {
            id: 1
        };
        this.bot = {
            id: 0
        };
        this.state = {
            messages: [],
            selfMessages:[],
            toggleOpen:false

        };
        this.toggle = this.toggle.bind(this);
    }

    componentDidMount(){
        this.setState({user_uuid:uuid.v4()})
    }

    addNewMessage = event => {
    const { messages, selfMessages } = this.state;
this.setState(prevState => ({
    messages: [...prevState.messages,event.message],
selfMessages:[...prevState.selfMessages,event.message]
}));

axios.post(`${CHAT_BOT}`, {
    user:this.state.user_uuid,
    message:event.message.text
}).then(res => {
    const msg = {
        author: this.bot,
        timestamp: new Date(),
        text: res.data.message
    };
return this.setState(prevState => ({
    messages: [...prevState.messages,msg]
}));
});

};
toggle(){
    console.log(this.state.toggleOpen)
    this.setState({toggleOpen:!this.state.toggleOpen});
}


render() {
    const {toggleOpen} = this.state;
    return (
        <div className="chat-container">
        <MDBContainer>
        <MDBBtn color="orange" type="submit" onClick = {this.toggle} className="chatbot-btn">
        <MDBIcon fab icon="rocketchat" size="3x"/>
        </MDBBtn>

        <MDBModal isOpen= {toggleOpen}  toggle ={this.toggle} side position="bottom-left" backdrop={false}>
        <MDBModalHeader toggle={this.toggle}>Estimate Shipment Cost</MDBModalHeader>
    <MDBModalBody>
    <Chat
    user={this.user}
    messages={this.state.messages}
    onMessageSend={this.addNewMessage}
    placeholder={"Type a message..."}
    width={400} >
        </Chat>
        </MDBModalBody>
        </MDBModal>
        </MDBContainer>

        </div>
);
}
}
export default ChatBot;