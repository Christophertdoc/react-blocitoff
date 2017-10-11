import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';



class App extends Component {
  constructor(props) {
      super(props);
      this.firebase = firebase.database().ref('tasks')
      this.state = {
          tasks: [],
          // db: firebase.database().ref('tasks')
      };

  }
  updateTasks(){
    let tasksRef = this.firebase.orderByKey().limitToLast(100);
    tasksRef.on('child_added', snapshot => {
        let task = snapshot.val();
        if(Date.now() - task.createdAt >= 120000){
          this.firebase.child(snapshot.key).update({
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
    let input = this.inputEl;
    let dropDownPriority = this.dropDownPriority;
    if(dropDownPriority){
      e.preventDefault();
      let todo = {
        text: input.value,
        createdAt: Date.now(),
        completed: false,
        expired: false,
        priorityLevel: dropDownPriority.value,
      }
      input.value = '';
      dropDownPriority.value = "low"
      this.firebase.push( todo );

    }
    else {
      alert("Please make sure task field is filled, and that the task has a priority of low, med, or high.");
    }
  }
  completeTask(task){
    this.firebase.child(task.id).update({
        completed: true
    });
    task.completed = true;

    this.updateTasks();

    this.firebase.on('child_changed', snapshot => {
        task = snapshot.val();
        // task.completed = true;
        console.log("Changed!");
        // this.updateTasks();
    });
  }
  render() {

    return (
      <form onSubmit={this.addTask.bind(this)}>
          <h4>Enter Task</h4>
          <input type="text" ref={ el => this.inputEl = el }/>
          <h4>Enter Priority Level (low, med, high)</h4>
          <select name="Select a priority" ref={ el => this.dropDownPriority = el }>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            </select>
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
