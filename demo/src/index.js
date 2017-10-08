import React, {Component} from 'react'
import {render} from 'react-dom'
import {Launcher} from '../../src'
import messageHistory from './messageHistory';
import Highlight from "react-highlight.js";
import './../assets/styles'
import io from 'socket.io-client';



class Demo extends Component {

  constructor() {
    super();
    this.state = {
      messageList: messageHistory,
      newMessagesCount: 0,
      isOpen: false, 
      socket: io('http://chatlecto.herokuapp.com')
    };
  }

  _onMessageWasSent(message) {
    this.state.socket.emit('chat message', message['data']['text']);
    this.setState({
      messageList: [...this.state.messageList, message]
    })
  }

  componentDidMount() {
     this.state.socket.on('chat message', this._update);
  }

  _update = (e) => {
    this._sendMessage(e)
  }

  _sendMessage(text) {
    if (text.length > 0) {
      const newMessagesCount = this.state.isOpen ? this.state.newMessagesCount : this.state.newMessagesCount + 1
      this.setState({
        newMessagesCount: newMessagesCount,
        messageList: [...this.state.messageList, {
          author: 'them',
          type: 'text',
          data: { text }
        }]
      })
    }
  }

  _handleClick() {
    this.setState({
      isOpen: !this.state.isOpen,
      newMessagesCount: 0
    })
  }

  render() {
    return <div>
      <Launcher
        agentProfile={{
          teamName: 'react-live-chat',
          imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
        }}
        onMessageWasSent={this._onMessageWasSent.bind(this)}
        messageList={this.state.messageList}
        newMessagesCount={this.state.newMessagesCount}
        handleClick={this._handleClick.bind(this)}
        isOpen={this.state.isOpen}
      />

    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
