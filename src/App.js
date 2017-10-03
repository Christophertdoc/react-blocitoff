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
  updateTasks(){
    let tasksRef = firebase.database().ref('tasks').orderByKey().limitToLast(100);
    tasksRef.on('child_added', snapshot => {
        let task = snapshot.val();
        if(Date.now() - task.createdAt >= 120000){
          firebase.database().ref('tasks').child(snapshot.key).update({
              expired: true
          });
        }
        task.completedString = String(task.completed);


        task.expiredString = String(task.expired);
        task.id = snapshot.key;
        this.setState({ tasks: [task].concat(this.state.tasks) });
    })
  }
  componentWillMount() {
    this.updateTasks();
  }

  addTask(e) {
    let input = this.inputEl.value;
    let inputPriority = this.inputPriority.value;
    if(input.length > 0 &&
       (inputPriority === "low" || inputPriority === "med" || inputPriority === "high")){
      e.preventDefault();
      let todo = {
        text: input,
        createdAt: Date.now(),
        completed: false,
        expired: false,
        priorityLevel: inputPriority,
      }
      firebase.database().ref('tasks').push( todo );
      input = '';
      inputPriority = '';
    }
    else {
      alert("Please make sure task field is filled, and that the task has a priority of low, med, or high.");
    }
  }
  completeTask(task){
    firebase.database().ref('tasks').child(task.id).update({
        completed: true
    });
    task.completed = true;

    this.updateTasks();
  }
  render() {

    return (
      <form onSubmit={this.addTask.bind(this)}>
          <h4>Enter Task</h4>
          <input type="text" ref={ el => this.inputEl = el }/>
          <h4>Enter Priority Level (low, med, high)</h4>
          <input type="text" ref={ el => this.inputPriority = el }/>
          <input type="submit"/>

          <h2>Active Tasks</h2>
          <ul>
            {
              this.state.tasks.filter( task => !task.expired && !task.completed ).map( task => <li key={task.id}>{task.text}, {task.createdAt}, priority: {task.priorityLevel}, expired: {task.expiredString}, completed: {task.completedString} <a href="#" onClick={() => this.completeTask(task)}>[Complete Task]</a></li> )
            }
          </ul>

          <h3>Expired Tasks</h3>
          <ul>
            {
              this.state.tasks.filter( task => task.expired || task.completed ).map( task => <li key={task.id}>{task.text}, {task.createdAt}, priority: {task.priorityLevel}, expired: {task.expiredString}, completed: {task.completedString}</li> )
            }
          </ul>
       </form>
    );
  }
}


export default App;
