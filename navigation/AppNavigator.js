import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import LoginScreen from './../screens/LoginScreen';
import HomeScreen from './../screens/HomeScreen';
import Chat from './../screens/Chat';

export default createAppContainer(
  createStackNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Login: LoginScreen,
    Home: HomeScreen,
    Chat: Chat,
    Main: MainTabNavigator,
  })
);
