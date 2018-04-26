import { AppRegistry } from 'react-native';
import App from './App';
import firebase from 'firebase';
import BackgroundFetch from "react-native-background-fetch";

const config = {
  apiKey: "AIzaSyDG6HK-6Thjavb8njzJiFtG_pJhKXIEs8E",
  authDomain: "nimbus-9f7df.firebaseapp.com",
  databaseURL: "https://nimbus-9f7df.firebaseio.com",
  //storageBucket: "krew-user-app.appspot.com"
};
const firebaseApp=firebase.initializeApp(config);

let MyHeadlessTask = async (event) => {
    console.log('- BackgroundFetch HeadlessTask start');
    // Important:  await asychronous tasks when using HeadlessJS.
    await doAction();
    // Required:  Signal to native code that your task is complete.
    // If you don't do this, your app could be terminated and/or assigned
    // battery-blame for consuming too much time in background.
    BackgroundFetch.finish();
    console.log('- BackgroundFetch HeadlessTask finished');
  }
  
  // Simulate a long-running task (eg: HTTP request)
  function doAction() { 
    console.debug("in index js");
    console.log('test headless in action');
    let timeout = 5000;
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('*** TIMEOUT ***');
        resolve();
      }, timeout);
    });
  }
  

AppRegistry.registerComponent('tweet', () => App);
AppRegistry.registerHeadlessTask('BackgroundFetch', () => MyHeadlessTask);
