import React, { useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

import { useRNAuth } from "../../hooks/contexts/Auth";

import { styles } from "../../styles/styles";

import SearchContainer from "../SearchContainer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/private.routes";

type homeScreenProp = NativeStackNavigationProp<RootStackParamList, "Home">;

const Home = () => {
  const navigation = useNavigation<homeScreenProp>();
  const { trucks, currentAddress } = useRNAuth();

  useEffect(() => {
    navigation.setOptions({ title: "Home" });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <SearchContainer />

      <View style={styles.section}>
        <Text style={styles.sectionText}>Food Trucks</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.searchLocation}>
          Food Trucks em{" "}
          <Text style={styles.searchLocationText}>{currentAddress}</Text>
        </Text>
        <FlatList
          data={trucks}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(trucks) => trucks.id}
          renderItem={({ item }) => (
            <View style={styles.truckView}>
              <View style={styles.truckContent}>
                <View style={styles.truckTitleView}>
                  <Text style={styles.truckTitle}>{item.name}</Text>
                  {item.isFavorite && (
                    <MaterialIcons name="star" size={16} color="#c4c42c" />
                  )}
                </View>
                <Text style={styles.truckEmail}>{item.email}</Text>
              </View>
              <View style={styles.truckAction}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.navigate("Truck", {
                      truckId: item.id,
                    });
                  }}
                >
                  <FontAwesome
                    name="arrow-circle-right"
                    size={30}
                    color="#5559c9"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionText}>Food Trucks Favoritos</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.searchLocation}>
          Food Trucks favoritos em{" "}
          <Text style={styles.searchLocationText}>{currentAddress}</Text>
        </Text>
        <FlatList
          data={trucks.filter((truck) => truck.isFavorite === true)}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(trucks) => trucks.id}
          renderItem={({ item }) => (
            <View style={styles.truckView}>
              <View style={styles.truckContent}>
                <View style={styles.truckTitleView}>
                  <Text style={styles.truckTitle}>{item.name}</Text>
                  {item.isFavorite && (
                    <MaterialIcons name="star" size={16} color="#c4c42c" />
                  )}
                </View>
                <Text style={styles.truckEmail}>{item.email}</Text>
              </View>
              <View style={styles.truckAction}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate("Truck", {
                      truckId: item.id,
                    })
                  }
                >
                  <FontAwesome
                    name="arrow-circle-right"
                    size={30}
                    color="#5559c9"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
