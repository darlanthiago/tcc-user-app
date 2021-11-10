import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/core";
import { Center, HStack, InputGroup, Stack } from "native-base";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { formatCnpj } from "../../utils/documentFormat";

import { styles } from "../../styles/truckStyle";
import { useRNAuth } from "../../hooks/contexts/Auth";
import { api } from "../../services/api";

type Truck = {
  id: string;
  name: string;
  email: string;
  document?: string;
  description: string;
  additional_information?: string;
  address_id?: string;
};

interface ITruck {
  truck: Truck;
}

export const TruckInfo = ({ truck }: ITruck) => {
  const { favoriteTrucks, addToFavorites } = useRNAuth();

  const handleToggleFavorite = useCallback(async () => {
    await addToFavorites(truck.id);
  }, [truck]);

  return (
    <>
      <Stack space={3} style={styles.card}>
        <HStack space={3} alignItems="center" justifyContent="space-between">
          <View>
            <Text style={[styles.truckName]}>{truck.name}</Text>

            <Text style={styles.truckMail}>{truck.email}</Text>
            {truck.document && (
              <Text style={styles.truckMail}>{formatCnpj(truck.document)}</Text>
            )}
            <Text style={styles.truckDesc}>{truck.description}</Text>
          </View>
          <View>
            {favoriteTrucks.includes(truck.id) ? (
              <View style={[styles.buttonFavorite]}>
                <MaterialIcons name="star" size={14} color="#0f3d20" />
                <Text style={styles.buttonEditText}>Favorito</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.buttonFavorite]}
                activeOpacity={0.9}
                onPress={handleToggleFavorite}
              >
                <MaterialIcons name="star" size={14} color="#0f3d20" />
                <Text style={styles.buttonEditText}>Favoritar </Text>
              </TouchableOpacity>
            )}
          </View>
        </HStack>
      </Stack>
    </>
  );
};

export default TruckInfo;
