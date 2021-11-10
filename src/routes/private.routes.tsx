import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/Home";
import SignOutButton from "../components/SignOutButton";
import Truck from "../screens/Truck";

export type RootStackParamList = {
  Home: undefined;
  Truck: { truckId: string };
};

const AppStack = createNativeStackNavigator<RootStackParamList>();

export const PrivateRoutes: React.FC = () => {
  return (
    <AppStack.Navigator initialRouteName="Home">
      <AppStack.Screen
        name="Home"
        component={Home}
        options={{
          title: "Meu Truck",
          headerLeft: () => false,
          headerRight: () => <SignOutButton />,
        }}
      />
      <AppStack.Screen name="Truck" component={Truck} />
    </AppStack.Navigator>
  );
};
