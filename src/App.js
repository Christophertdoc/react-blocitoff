import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };
    }

    componentWillMount() {
        let messagesRef = firebase.database().ref('messages').orderByKey().limitToLast(100);
        messagesRef.on('child_added', snapshot => {
            let message = { text: snapshot.val(), id: snapshot.key };
            this.setState({ messages: [message].concat(this.state.messages) });
        })
    }

    addMessage(e) {
        e.preventDefault();
        firebase.database().ref('messages').push( this.inputEl.value );
        this.inputEl.value = '';
    }

    render() {
      return (
        <form onSubmit={this.addMessage.bind(this)}>
            <input type="text" ref={ el => this.inputEl = el }/>
            <input type="submit"/>
            <ul>
              {
                  this.state.messages.map( message => <li key={message.id}>{message.text}</li> )
              }
            </ul>
         </form>
      );
    }
}

export default App;
