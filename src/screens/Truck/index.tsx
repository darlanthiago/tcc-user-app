import {
  CompositeNavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../../routes/private.routes";
import { api } from "../../services/api";

type TruckScreenProp = NativeStackNavigationProp<RootStackParamList, "Truck">;

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

type Schedule = {
  id: string;
  day: string;
  initial_hour: string;
  finish_hour: string;
};

type Truck = {
  id: string;
  name: string;
  email: string;
  document?: string;
  description: string;
  additional_information?: string;
  address_id?: string;
  isFavorite: boolean;
  address: Address;
  schedules: Schedule;
};

type Item = {
  id: string;
  name: string;
  description: string;
  price: number;
  itemCategory: string | null;
  itemCategoryText: string | null;
};

import { styles } from "../../styles/truckStyle";
import TruckInfo from "../TruckInfo";
import TruckItemsCategories from "../TruckItemsCategories";
import TruckLocation from "../TruckLocation";
import TruckSchedule from "../TruckSchedule";

const Truck = () => {
  const { params }: any = useRoute();
  const truckId = params?.truckId;
  const [truck, setTruck] = useState({} as Truck);
  const [truckSchedules, setTruckSchedules] = useState<Schedule[]>([]);
  const [truckItems, setTruckItems] = useState<Item[]>([]);

  useEffect(() => {
    (async () => {
      Promise.all([
        api.get(`/truck/${truckId}`, {
          headers: {
            relationships: '["address", "schedules"]',
          },
        }),
        api.get(
          `/items?filters=[{"field": "truck_id", "operation": "=", "value": "${truckId}"}]`,
          {
            headers: {
              relationships: '["itemCategory"]',
            },
          }
        ),
      ]).then((resp) => {
        setTruck(resp[0].data);

        const filteredSchedules = resp[0].data.schedules.filter(
          (item: any) => item.deleted_at === null
        );

        setTruckSchedules(filteredSchedules);

        setTruckItems(resp[1].data);
      });
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <TruckInfo truck={truck} />
        <View style={styles.section}>
          <Text style={styles.sectionText}>Localização</Text>
        </View>
        <TruckLocation truckName={truck.name} address={truck.address} />
        <View style={styles.section}>
          <Text style={styles.sectionText}>Horários de Funcionamento</Text>
        </View>
        <TruckSchedule schedules={truckSchedules} />
        <View style={styles.section}>
          <Text style={styles.sectionText}>Itens</Text>
        </View>
        <TruckItemsCategories items={truckItems} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Truck;
