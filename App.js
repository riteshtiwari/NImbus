import React, { Component } from 'react';
import BackgroundFetch from "react-native-background-fetch";
import { Platform, BackHandler, Alert, Easing, Animated } from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import axios from 'axios';

import Login from './login';
import vmList from './vmList';

const AppNavigator = StackNavigator(
  {
    Login: { screen: Login },
    vmList: { screen: vmList },
  },
  {
      initialRouteName: "Login",
      headerMode: "none",
  }
);

export default class App extends Component{

  render(){
    return(
      <AppNavigator />
    )
  }
}
    