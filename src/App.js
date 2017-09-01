import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase';

class App extends Component {

constructor() {
    super();
    this.state = {
        task: 1
    };
}

componentDidMount() {
    const rootRef = firebase.database().ref();
    const taskRef = rootRef.child('task');
    taskRef.on('value', snap => {
      this.setState({
          task: snap.val()
      });
    });
}

  render() {
    return (
      <div className="App">
          <h1>{this.state.task}</h1>
      </div>
    );
  }
}

export default App;
