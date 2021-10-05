import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

import * as Location from "expo-location";
import Loading from "../../components/Loading";

type TruckType = {
  id: string;
  email: string;
  name: string;
  description: string;
  additional_information: string | null;
  document: string;
  created_at: string;
  isFavorite: boolean;
};

const Home = () => {
  const navigation = useNavigation();
  const [grantedStatus, setGrantedStatus] = useState(Boolean);
  const [loadingCoords, setLoadingCoords] = useState(false);
  const [address, setAddress] = useState("Brasília - DF");

  useEffect(() => {
    navigation.setOptions({ title: "Olá, Darlan Thiago" });
  }, [navigation]);

  const [trucks, setTrucks] = useState<TruckType[]>([
    {
      id: "aa1a27fe-2715-4270-82c2-a9ba6f57cf4e",
      email: "truck2@mail.com",
      name: "Some random name",
      description: "Truck whos food is good",
      additional_information: null,
      document: "08622198000157",
      created_at: "2021-09-25T10:01:04.404-03:00",
      isFavorite: true,
    },
    {
      id: "65cd19f3-3f52-481c-a1cb-d73cfa96b3ba",
      email: "truck3@mail.com",
      name: "Truck 3",
      description: "Truck whos food is good",
      additional_information: null,
      document: "30078388000104",
      created_at: "2021-10-04T20:07:42.088-03:00",
      isFavorite: false,
    },
    {
      id: "9298595d-ff42-4cac-a747-e71f70193383",
      email: "truck4@mail.com",
      name: "Truck 4",
      description: "Truck whos food is good",
      additional_information: null,
      document: "12291532000104",
      created_at: "2021-10-04T20:07:54.313-03:00",
      isFavorite: true,
    },
    {
      id: "24a6095a-aa55-4069-a1e7-4a50536d6242",
      email: "truck5@mail.com",
      name: "Truck 5",
      description: "Truck whos food is good",
      additional_information: null,
      document: "34476074000110",
      created_at: "2021-10-04T20:08:05.969-03:00",
      isFavorite: false,
    },
  ]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      setGrantedStatus(status === "granted" ? true : false);

      if (status !== "granted") {
        Alert.alert(
          "Ops!",
          "Para poder usar a localização precisa dar permissão"
        );
        return;
      }
    })();
  }, []);

  const getAddressLocation = useCallback(async () => {
    setLoadingCoords(true);

    let location = await Location.getCurrentPositionAsync();

    const { latitude, longitude } = location.coords;

    let response = await Location.reverseGeocodeAsync({ latitude, longitude });

    let fullAddressResponse = "";

    for (let item of response) {
      let address = `${item.city} - ${item.region}`;

      fullAddressResponse = address;
    }

    setAddress(fullAddressResponse);

    setLoadingCoords(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua cidade ou use a localização"
          value={address}
        />
        <TouchableOpacity
          style={styles.locationButton}
          activeOpacity={0.9}
          onPress={getAddressLocation}
        >
          {loadingCoords ? (
            <Loading />
          ) : (
            <MaterialIcons name="my-location" size={20} color="#6e6e6e" />
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchButton} activeOpacity={0.9}>
          <MaterialIcons name="search" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionText}>Food Trucks</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.searchLocation}>
          Food Trucks em{" "}
          <Text style={styles.searchLocationText}>{address}</Text>
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
                <Text style={styles.truckDesc}>{item.description}</Text>
              </View>
              <View style={styles.truckAction}>
                <TouchableOpacity activeOpacity={0.8}>
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
          <Text style={styles.searchLocationText}>{address}</Text>
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
                <Text style={styles.truckDesc}>{item.description}</Text>
              </View>
              <View style={styles.truckAction}>
                <TouchableOpacity activeOpacity={0.8}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 15,
  },
  section: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  sectionText: {
    fontSize: 18,
    color: "#888",
    fontWeight: "bold",
  },
  card: {
    marginHorizontal: 4,
    backgroundColor: "#fff",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  searchBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 30,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  input: {
    flex: 10,
    backgroundColor: "#f5f3f3",
    height: 45,
    borderRadius: 8,
    marginVertical: 4,
    paddingHorizontal: 10,
    margin: 4,
  },
  searchButton: {
    flex: 1,
    backgroundColor: "#5559c9",
    height: 45,
    borderRadius: 8,
    marginVertical: 4,
    paddingHorizontal: 10,
    margin: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  locationButton: {
    flex: 1,
    backgroundColor: "#f5f3f3",
    height: 45,
    borderRadius: 8,
    marginVertical: 4,
    paddingHorizontal: 10,
    margin: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  searchLocation: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 18,
  },
  searchLocationText: {
    color: "#5559c9",
  },
  truckView: {
    padding: 15,
    backgroundColor: "#f5f3f3",
    marginRight: 6,
    marginTop: 15,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  truckContent: {
    flex: 2,
    marginRight: 10,
  },
  truckAction: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  truckTitleView: {
    flexDirection: "row",
    alignItems: "center",
  },
  truckTitle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
  },
  truckEmail: {
    marginTop: 6,
    fontSize: 10,
    color: "#575656",
  },
  truckDesc: {
    marginTop: 12,
    fontSize: 10,
    color: "#575656",
    fontStyle: "italic",
  },
});

export default Home;
