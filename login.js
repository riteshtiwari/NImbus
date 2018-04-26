import React, { Component } from 'react';
import { StyleSheet, ScrollView, NetInfo, AsyncStorage, StatusBar,
   View, TextInput, TouchableOpacity, Text, Alert, 
   Image
  } from 'react-native';
import BackgroundFetch from "react-native-background-fetch";
import TweetEmbed from './TweetEmbed';
import firebase from 'firebase';

const ImageLogo = require('./logo_energy.png');
const signUpButton = require('./sign_in_button.png');

export default class Login extends Component<{}> {
  constructor(){
    super();
    this.state = {
      email: '',
      password: '',
      nav: ''
    }
  }
  componentDidMount(){
    AsyncStorage.getItem('email').then((value1)=>{
        if(value1){
            this.props.navigation.navigate('vmList');
        }
    }).catch((err)=>{
        console.log('err', err);
    })
    this.setState({ nav: this.props.navigation });
   
    AsyncStorage.getItem('randNum').then((value)=>{
      if(value){
        console.log('value', value);
      }
    })
    AsyncStorage.getItem('tweet').then((tweet)=>{
      if(tweet){
        console.log('tweet', tweet);
      }
    })

    BackgroundFetch.configure({
      minimumFetchInterval: 15, // <-- minutes (15 is minimum allowed)
      stopOnTerminate: false,   // <-- Android-only,
      startOnBoot: true         // <-- Android-only
    }, () => {
      AsyncStorage.setItem('tweet', 'khalid ansari');
      console.log("[js] Received background-fetch event");
      console.debug("in app js");
      // Required: Signal completion of your task to native code
      // If you fail to do this, the OS can terminate your app
      // or assign battery-blame for consuming too much background-time
      let randNum = Math.random();
      let randStr = randNum.toString();
      console.debug("in app js");
      console.log('randStr configure', randStr);
      AsyncStorage.setItem('randNum configure' , randStr);
      BackgroundFetch.finish();
    }, (error) => {
      console.log("[js] RNBackgroundFetch failed to start");
    });

    BackgroundFetch.start((successFn)=>{
      // let randNum = Math.random();
      // let randStr = randNum.toString();
      // console.debug("in app js");
      // console.log('randStr', randStr);
      // AsyncStorage.setItem('randNum', randStr);
      BackgroundFetch.finish();
    });

    BackgroundFetch.status((status) => {
      switch(status) {
        case BackgroundFetch.STATUS_RESTRICTED:
          console.log("BackgroundFetch restricted");
          break;
        case BackgroundFetch.STATUS_DENIED:
          console.log("BackgroundFetch denied");
          break;
        case BackgroundFetch.STATUS_AVAILABLE:
          console.log("BackgroundFetch is enabled");
          break;
      }
    });

    this.firebaseFn();
  }

firebaseFn(){
  let ref = firebase.database().ref().child('users').child('ravi'); 
  //let firebasint1 = firebase.database().ref().child('nimbus-9f7df').child('users'); 
  ref.once("value")
  .then(function(snapshot) {

    var key = snapshot.key; // "ada"
    console.log('snapshot', snapshot.val());
    var childKey = snapshot.child("email").val(); // "last"
    //let key = Object.keys(snapshot.val())[0]
  });

}

onLoginPress(){
  let email = this.state.email;
  let pass = this.state.password;
  let self = this;
  let ref = firebase.database().ref().child('Login'); 
  ref.once("value")
  .then(function(snapshot) {
    let emailList = snapshot.val();
    let loginStatus;
   
    emailList.map((data, key) => {
      console.log('data', data);
      if(data.email === email){
        if(`${data.pass}` === pass){
          loginStatus = true;
          AsyncStorage.setItem('email', email);
          console.log('sssss');
        }else{
          
        }
      }else{
          //Alert.alert('wrong email');
      }
    })
    if(loginStatus){
        self.state.nav.navigate('vmList');
        console.log('sss')
    }else{
      Alert.alert('Wrong email or password');
    }
  });

}

  changeEmail(text){
    this.setState({ email: text });
  }
  changePassword(text){
    this.setState({ password: text });
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#172C41' }}>
      <StatusBar
        backgroundColor="#172C41"
        barStyle="light-content"
      />
      <ScrollView style={{ flex: 1 }} >
        <View style={{ flex: 1, flexDirection: 'column', marginTop: 100 }}>
          <View style={{flex: 2, justifyContent: 'center', alignSelf: 'center'}}>
            <Image source={ImageLogo} style={{ width: 100, height: 100 }} />
          </View>
          <View style={{ flex: 2, justifyContent: 'center', padding: 20 }} >
            <TextInput 
              placeholder="Enter Email" 
              underlineColorAndroid="#32CD32"
              placeholderTextColor="white"
              style={{ color: 'white' }}
              onChangeText={(text) => this.changeEmail(text)}
              value={this.state.email}
            />
          </View>
          <View style={{ flex: 2, justifyContent: 'center', padding: 20 }}>
            <TextInput 
              placeholder="Enter Password"
              secureTextEntry
              underlineColorAndroid="#32CD32"
              placeholderTextColor="white"
              style={{ color: 'white' }}
              onChangeText={(text) => this.changePassword(text)}
              value={this.state.password}
            />
          </View>
          <TouchableOpacity onPress={() => this.onLoginPress()} 
            style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}
          >
            <Image source={signUpButton} style={{ width: 250, height: 54 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
