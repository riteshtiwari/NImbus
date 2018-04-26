import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, AsyncStorage,
    Dimensions, Image, ImageBackground, NetInfo } from 'react-native';
import firebase from 'firebase';
import axios from 'axios';

const status_cric = require('./status_cric.png');
const status_normal = require('./status_normal.png');
const status_suspend = require('./status_suspend.png');
const red_circle = require('./red_circle.png');
const green_circle = require('./green_circle.png');
const searchImg = require('./search.png');
const { width, height } = Dimensions.get('screen');
const widthScreen = Number(width) - 20; 

export default class vmList extends Component{
    constructor(props) {
        super(props);
        this.state ={
            username: '',
            vms: '',
            cricCount: 0,
            echoCount: 0,
            load: false,
        }
    }
    atoi(addr) {
        var parts = addr.split('.').map(function(str) {
          return parseInt(str); 
        });
      
        return (parts[0] ? parts[0] << 24 : 0) +
               (parts[1] ? parts[1] << 16 : 0) +
               (parts[2] ? parts[2] << 8  : 0) +
                parts[3];
      };
      
      checkIpaddrInRange(ipaddr, start, end) {
        var num = this.atoi(ipaddr);
        return (num >= this.atoi(start)) && (num <= this.atoi(end));
      }
      
    componentDidMount(){
       
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
          });
          let self = this;
          function handleFirstConnectivityChange(connectionInfo) {
            console.log('First change, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
            
            axios.get('https://json.geoiplookup.io/api').then((ipData) => {
                console.log('ddd', ipData.data);
                let ipCheck = self.checkIpaddrInRange(ipData.data.ip, '10.0.0.1', '10.100.100.100');
                console.log('ipCheck', ipCheck);
                if(ipCheck){
                    //inside office
                    let ref = firebase.database().ref().child('users'); 
                    ref.once("value")
                    .then(function(snapshot) {
                        //let userSnap = snapshot.child(self.state.username + '/vms').val();
                        ref.child(self.state.username).update({ 
                            state: 'in'
                        });
                    });
                }else{
                    //outside office
                    //let self = this;
                    let ref = firebase.database().ref().child('users'); 
                    ref.once("value")
                    .then(function(snapshot) {
                        //let userSnap = snapshot.child(self.state.username + '/vms').val();
                        ref.child(self.state.username).update({ 
                            state: 'out'
                        });
                    });
                }
            })
          }
          NetInfo.addEventListener(
            'connectionChange',
            handleFirstConnectivityChange
          );
  

      
    }
    userChange(text){
        this.setState({ username: text });
       
    }
    getVmList(){
        let self = this;
        let ref = firebase.database().ref().child('users'); 
        ref.once("value")
        .then(function(snapshot) {
          let userSnap = snapshot.child(self.state.username + '/vms').val();
          if(userSnap){
            var result = Object.keys(userSnap).map(function(key) {
                console.log('key', key);
                let newArr = userSnap[key];
                newArr.key = key;
                return newArr;
              });
            self.setState({ vms: result });
          }else{
            self.setState({ vms: [] });
            let username = self.state.username;
            let pushRef = firebase.database().ref().child('users');
            pushRef.child(username).set({
                state: "in",
                vms: []
            });
            // pushRef.push({ 
                    
            //   })
          }
          
          //let emailList = snapshot.val();
          console.log('userSnap', userSnap, result);
        });
    }
    onLogout(){
        AsyncStorage.removeItem('email').then((sc) =>{
            this.props.navigation.navigate('Login');
        })
    }
    makeCric(data, key){
        
        let self = this;
        let ref = firebase.database().ref().child('users'); 
        ref.once("value")
        .then(function(snapshot) {
          ref.child(self.state.username + '/vms/' + data.key).update({ 
              isCritical: "false",
            });
        });

    }
    makeNonCric(data, key){
        let self = this;
        let ref = firebase.database().ref().child('users'); 
        ref.once("value")
        .then(function(snapshot) {
          ref.child(self.state.username + '/vms/' + data.key).update({ 
              isCritical: "True",
            }) 
        });

    }
    render(){
        let cricCount = 0;
        let echoCount = 0;
        this.state.vms ?
        this.state.vms.map((data1, key) => {
            if(data1.isCritical === 'false'){
              cricCount = Number(cricCount) + 1;
            }else{
              echoCount = Number(echoCount) + 1;
            }
        })
        : null
        console.log('VM', cricCount, echoCount)
        return (
            <View style={{ flex: 1, backgroundColor: '#172C41' }}>

                <View style={{ padding: 20, paddingLeft: 50,
                     flexDirection: 'row', alignItems: 'center', 
                     }}>
                    <View style={{ flex: 6 }}>
                        <TextInput 
                            placeholder="Type in your Username"
                            underlineColorAndroid="#32CD32"
                            placeholderTextColor="white"
                            style={{ color: 'white' }}
                            onChangeText={(text) => this.userChange(text)}
                            value={this.state.username}
                        />
                    </View>
                    <View style={{ flex: 2, justifyContent: 'center', 
                    paddingLeft: 10, paddingTop: 5 }} >
                        <TouchableOpacity
                            onPress={() => this.getVmList()}
                            style={{  }}
                        >
                            <Image source={searchImg} style={{ width: 24, height: 24 }} />
                        </TouchableOpacity>
                    </View>
                </View>
                     
                <ScrollView style={{ flex: 1 }} >
                    <View style={{ paddingTop: 20, paddingLeft: 30 }}>
                        {
                            this.state.vms ?
                            this.state.vms.map((data, key)=>{
                                console.log('data',data)
                                return(
                                    <View key={key} style={{ 
                                        flexDirection: 'row', 
                                        width: 300, 
                                        height: 70,
                                        backgroundColor: '#2F3A4F',
                                        borderBottomWidth: 10,
                                        borderBottomColor: '#172C41',
                                    }} >
                                        <View style={{ justifyContent: 'center', paddingLeft: 20, flex: 2 }}>
                                            <Text style={{ fontSize: 16, color: 'white' }} >{key}:</Text>
                                        </View>
                                        <View style={{ justifyContent: 'center', flex: 8 }}>
                                            <Text style={{ fontSize: 15, color: 'white' }}>{data.name}</Text>
                                        </View>
                                        <View style={{ padding: 10, flex: 2, justifyContent: 'center' }}>
                                            {
                                                data.isCritical === 'false' ?
                                                <TouchableOpacity onPress={() => this.makeNonCric(data, key)}>
                                                    <Image source={status_normal} style={{ width: 30, height: 30 }} />
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity onPress={() => this.makeCric(data, key)}>
                                                    <Image source={status_cric} style={{ width: 30, height: 30 }} />
                                                </TouchableOpacity>
                                            }
                                        </View>
                                    </View>
                                )
                            }): null
                        }
                    </View >
                    <View style={{ flexDirection: 'row', flex: 1, alignSelf: 'center' }}  >
                        <View style={{ flex: 2, alignItems: 'center' }}>
                            <ImageBackground source={green_circle} style={{ width: 120, height: 120 }} >
                                <View style={{ 
                                    justifyContent: 'center',
                                    alignItems: 'center' ,
                                    flex: 1
                                }}>
                                    <Text style={{ justifyContent: 'center', color: 'white', fontSize: 14 }}>
                                        {cricCount} VMs in {"\n"} 
                                    </Text>
                                    <Text style={{ justifyContent: 'center', color: 'white', fontSize: 14 }}>Echo Mode</Text>
                                </View>
                            </ImageBackground>
                        </View>
                        <View style={{ flex: 2, alignItems: 'center' }}>
                            <ImageBackground source={red_circle} style={{ width: 120, height: 120 }} >
                                <View style={{ 
                                    justifyContent: 'center',
                                    alignItems: 'center' ,
                                    flex: 1
                                }}>
                                    <Text style={{ justifyContent: 'center', color: 'white', fontSize: 14 }}>
                                        {echoCount} VMs in {"\n"} 
                                    </Text>
                                    <Text style={{ justifyContent: 'center', color: 'white', fontSize: 14 }}>Cric mode</Text>
                                </View>
                            </ImageBackground>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={{ alignSelf: 'center', padding: 15 }}
                        onPress={() => this.onLogout()}
                    >
                        <Text style={{ fontSize: 16 }}>Logout</Text>
                    </TouchableOpacity>
                </ScrollView>
               
            </View>
        );
    }
}

const styles = {
    critical: {
        backgroundColor: 'red',
        width: 10,
        height: 10,
        justifyContent: 'center',
        paddingTop: 10
    },
    non_cri: {
        backgroundColor: 'green',
        width: 10,
        height: 10,
        justifyContent: 'center',
        paddingTop: 10
    }
}