import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "./src/screens/Login";

import { StatusBar } from "react-native";

import { RegisterScreen } from "./src/screens/Register";
import SignOutButton from "./src/components/SignOutButton";
import Home from "./src/screens/Home";

const AppStack = createNativeStackNavigator();
const GuestStack = createNativeStackNavigator();

export default function App() {
  const isSigned = true;

  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor="#5758BB"
        barStyle="light-content"
        networkActivityIndicatorVisible={false}
        hidden
      />

      {isSigned ? (
        <AppStack.Navigator initialRouteName="Home">
          <AppStack.Screen
            name="Home"
            component={Home}
            options={{
              title: "Home",
              headerLeft: () => false,
              headerRight: () => <SignOutButton />,
            }}
          />
        </AppStack.Navigator>
      ) : (
        <GuestStack.Navigator initialRouteName="Login">
          <GuestStack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <GuestStack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </GuestStack.Navigator>
      )}
    </NavigationContainer>
  );
}
