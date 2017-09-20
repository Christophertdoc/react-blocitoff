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
          // check if task is older than 2 minutes
          // 2 minutes in milliseconds: 120000
          let task = snapshot.val();
          if(Date.now() - task.createdAt >= 120000){
            firebase.database().ref('tasks').child(snapshot.key).update({
            expired: true
              //taskRef.child(snapshot.key).remove();
            });
          }
          task.expiredString = String(task.expired);
          task.id = snapshot.key;
          this.setState({ tasks: [task].concat(this.state.tasks) });
      })
  }
  addTask(e) {
      e.preventDefault();
      let todo = {
        text: this.inputEl.value,
        createdAt: Date.now(),
        completed: false,
        expired: false
      }
      firebase.database().ref('tasks').push( todo );
      this.inputEl.value = '';
  }
  render() {

    return (
      <form onSubmit={this.addTask.bind(this)}>
          <input type="text" ref={ el => this.inputEl = el }/>
          <input type="submit"/>
          <ul>
            {
              // this.state.tasks.map(function(task){
              //   if(task.expired){
              //     return <li key={task.id}>{task.text}, {task.createdAt}, is expired</li>
              //   }
              //   else {
              //     return <li key={task.id}>{task.text}, {task.createdAt}, is NOT expired</li>
              //   }
              // })

              // the original:
              this.state.tasks.filter( task => !task.expired ).map( task => <li key={task.id}>{task.text}, {task.createdAt}, expired: {task.expiredString}</li> )
            }
          </ul>

          <h1>Expired tasks!</h1>
          <ul>
            {
              this.state.tasks.filter( task => task.expired ).map( task => <li key={task.id}>{task.text}, {task.createdAt}, expired: {task.expiredString}</li> )
            }
          </ul>
       </form>
    );
  }
}
export default App;
