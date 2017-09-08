import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: []
        };
    }

    componentWillMount() {
        let tasksRef = firebase.database().ref('tasks').orderByKey().limitToLast(100);
        tasksRef.on('child_added', snapshot => {
            let task = {
              text: snapshot.val(),
              id: snapshot.key,
            };
            this.setState({ tasks: [task].concat(this.state.tasks) });
        })
    }

    addTask(e) {
        e.preventDefault();
        firebase.database().ref('tasks').push( this.inputEl.value );
        this.inputEl.value = '';
    }

    render() {
      return (
        <form onSubmit={this.addTask.bind(this)}>
            <input type="text" ref={ el => this.inputEl = el }/>
            <input type="submit"/>
            <ul>
              {
                  this.state.tasks.map( task => <li key={task.id}>{task.text}</li> )
              }
            </ul>
         </form>
      );
    }
}

export default App;
