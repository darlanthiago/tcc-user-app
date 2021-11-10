import React, { useCallback, useEffect, useState } from "react";
import { Alert, TextInput, TouchableOpacity, View } from "react-native";
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

  const handleGetLocation = useCallback(async () => {
    setLoadingCoords(true);

    let location = await Location.getCurrentPositionAsync();

    const { latitude, longitude } = location.coords;

    let response = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    let fullAddressResponse = "";

    for (let item of response) {
      let address = `${item.city}`;
      fullAddressResponse = address;
    }

    if (fullAddressResponse || fullAddressResponse !== null) {
      setAddress(fullAddressResponse);
    } else {
      setAddress("");
    }

    searchTruck(fullAddressResponse);

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
