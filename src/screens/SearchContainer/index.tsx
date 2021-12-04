import React, { useCallback, useEffect, useState } from "react";
import { Alert, TextInput, TouchableOpacity, View, Permission, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";

import { styles } from "../../styles/styles";
import { useRNAuth } from "../../hooks/contexts/Auth";
import Loading from "../../components/Loading";

const SearchContainer: React.FC = () => {
  const { searchTruck } = useRNAuth();
  const [address, setAddress] = useState<string>("");
  const [grantedStatus, setGrantedStatus] = useState(Boolean);
  const [loadingCoords, setLoadingCoords] = useState(false);

  useEffect(() => {
    (async () => {

      let { status } = await Location.requestBackgroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Ops!",
          "Para poder usar a localização precisa dar permissão"
        );

        setGrantedStatus(false);
        return;
      } else {
        setGrantedStatus(true);
      }
    })();
  }, []);

  const handleGetLocation = useCallback(async () => {
    setLoadingCoords(true);

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
      timeInterval: 10000
    });

    const { latitude, longitude } = location.coords;

    let response = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    let fullAddressResponse: string | null = "";

    for (let item of response) {

      let address = item.city ? item.city : item.subregion;

      fullAddressResponse = address;
    }

    if (fullAddressResponse || fullAddressResponse !== null) {
      setAddress(fullAddressResponse);
      searchTruck(fullAddressResponse);
    } else {
      setAddress("");
    }

    setLoadingCoords(false);
  }, []);

  const handleSearch = useCallback(async () => {
    searchTruck(address);
  }, [address]);

  useEffect(() => {
    (async () => {
      await handleGetLocation();
    })();
  }, [grantedStatus]);
  return (
    <>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua cidade ou use a localização"
          value={address}
          onChangeText={(text) => setAddress(text)}
        />
        <TouchableOpacity
          style={styles.locationButton}
          activeOpacity={0.9}
          onPress={handleGetLocation}
        >
          {loadingCoords ? (
            <Loading />
          ) : (
            <MaterialIcons name="my-location" size={20} color="#6e6e6e" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.searchButton}
          activeOpacity={0.9}
          onPress={handleSearch}
        >
          <MaterialIcons name="search" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default SearchContainer;
