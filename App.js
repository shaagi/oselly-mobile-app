import React from "react";
import "firebase/auth";
import "firebase/firestore";
import {createAppContainer, createSwitchNavigator, NavigationActions} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

// import AuthLoadingScreen from "./screens/AuthLoadingScreen";
import VacanciesScreen from "./screens/VacanciesScreen";
import BookScreen from "./screens/BookScreen";
import MyBookingsScreen from "./screens/MyBookingsScreen";
import NotifsScreen from "./screens/NotifsScreen";
import SignUpScreen from './screens/SignUpScreen';


const VacanciesStack = createStackNavigator({
  Home:  VacanciesScreen,
  Book:  BookScreen,
});

// function defaultHandler() {
//
// }



const AuthStack = createStackNavigator({ SignUp: SignUpScreen });
const AppStack = createMaterialTopTabNavigator({
  Vacancies: { screen: VacanciesStack },
  Bookings: MyBookingsScreen,
  Notifications: NotifsScreen,
},
//     {
//   // initialRouteName: "FooTab",
//   defaultNavigationOptions: ({ navigation }) => ({
//     tabBarOnPress: ({ navigation, defaultHandler }) => {
//       console.log('onPress:', navigation.state.routeName);
//       defaultHandler();
//     },
//   }),
// }
{
  tabBarOptions: {
    activeTintColor: 'yellow',
    labelStyle: {
      fontSize: 12,
    },
    style: {
      backgroundColor: 'grey',
      paddingTop: 15,
    },
  }
});

const AppContainer = createAppContainer(createSwitchNavigator({
  // AuthLoading: AuthLoadingScreen,
  Auth: AuthStack,
  App: AppStack,
}, {
  // initialRouteName: 'AuthLoading',
  initialRouteName: 'App',
}));



export default function App() {

  return <AppContainer />;
}
