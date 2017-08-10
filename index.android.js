import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { TabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import {
  StackNavigator,
} from 'react-navigation';


var EventsScreen = require('./Screens/EventsScreen');
var SearchScreen = require('./Screens/SearchScreen');
var EventDetailScreen = require('./Screens/EventDetailScreen');
var ResultScreen = require('./Screens/ResultScreen');

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
  },
});

const KlubitusTab = TabNavigator({
  Events: {
    screen: EventsScreen,
  },
  Search: {
    screen: SearchScreen,
  },
}, {
  tabBarOptions: {
    activeTintColor: '#e91e63',    
  },
});

const Klubitus = StackNavigator({
  Home: { 
    screen: KlubitusTab,
    navigationOptions: { 
      title: 'Klubitus' 
    },
    path: 'main',
  },
  Detail: {
    screen: EventDetailScreen,
    navigationOptions: {
      title: 'Event details'
    },
    path: 'detail/:event'
  },
  Result: {
    screen: ResultScreen,
    navigationOptions: {
      title: 'Search results'
    },
    path: 'result/:query'
  },
},
{
  initialRouteName: 'Home',
});


AppRegistry.registerComponent('Klubitus', () => Klubitus);
