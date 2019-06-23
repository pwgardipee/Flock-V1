import React from 'react';
import { View, Text, Button } from 'react-native';
import * as firebase from 'firebase';

export default class SettingsScreen extends React.Component {

  static navigationOptions = {
    header: null,
  };

  SignOut = (context) => {
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
      context.props.navigation.navigate('Login')
    }).catch(function (error) {
      // An error happened.
      alert(error)
    });

    //Add a course
    // firebase.database().ref().child('Chats').push({
    //   Name: 'Introduction to Database Management Systems',
    //   Code: 'CS564',
    //   Semester: 'Spring 2019',
    //   Messages: 'Something',
    // })
  }

  render() {
    return (
      <View>
        <Button title='Log Out' onPress={() => this.SignOut(this)} />
      </View>
    );
  }
}