import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from 'firebase';

var config = {
    apiKey: "AIzaSyD7Cj4P1VolSooKeCKhfeYwLxP3mjb01uk",
    authDomain: "react-blocitoff.firebaseapp.com",
    databaseURL: "https://react-blocitoff.firebaseio.com",
    projectId: "react-blocitoff",
    storageBucket: "react-blocitoff.appspot.com",
    messagingSenderId: "801994369004"
  };
  firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
