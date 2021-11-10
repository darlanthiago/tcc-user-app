import React, { useCallback } from "react";

import { Linking, Platform, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { styles } from "../../styles/truckStyle";

import { formatAddress } from "../../utils/formatAddress";

type Address = {
  id: string;
  street_name: string;
  street_number: string;
  neighborhood: string;
  zipcode: string;
  city: string;
  state: string;
  lat?: number;
  long?: number;
};

interface IAddress {
  address: Address;
  truckName: string;
}

const TruckLocation = ({ address, truckName }: IAddress) => {
  const openMap = useCallback(() => {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${address.lat},${address.long}`;
    const label = truckName;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url) {
      Linking.openURL(url);
    }
  }, [address]);

  return (
    <>
      <View style={[styles.card, styles.cardWithCols]}>
        <View style={styles.colContent}>
          <Text style={styles.truckName}>Localização Atual:</Text>

          <Text style={styles.addressText}>
            {address
              ? formatAddress(address.street_name, address.city, address.state)
              : "Nenhum Endereço"}
          </Text>
        </View>
        <View style={styles.colAction}>
          <TouchableOpacity
            style={[styles.buttonEdit]}
            activeOpacity={0.9}
            onPress={openMap}
          >
            <MaterialIcons name="arrow-forward" size={14} color="#0f3d20" />
            <Text style={styles.buttonEditText}>Go to</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default TruckLocation;
