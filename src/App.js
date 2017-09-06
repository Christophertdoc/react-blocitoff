import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase';

// TODO: make this.state.tasks an array
var TodoList = React.createClass({
  render: function() {
    var createItem = function(task, index) {
      debugger
      return <li key={ index }>{task.task}</li>;
    };
    return <ul>{ this.props.tasks.map(createItem) }</ul>;
  }
});

class App extends Component {

constructor() {
    super();
    this.state = {
        // task: 1,
        tasks: []
    };

    /*
      tasks = [{
        task: "Go to store",
        completed: false,
        expired: false,
        createdAt: Firebase.ServerValue.TIMESTAMP
      }, {}, {}]

    */
}

componentDidMount() {
    const rootRef = firebase.database().ref();
    const taskRef = rootRef.child('task');
    rootRef.on('value', snap => {
      this.setState({
          tasks: [snap.val()]
      });
      console.log(this.state);

    });
}

  render() {
    return (
      <div className="App">
        <TodoList tasks = {this.state.tasks} />
          // <h1>{this.state.task}</h1>
      </div>
    );
  }
}



export default App;
