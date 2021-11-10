import React from "react";
import { FlatList, Text, View } from "react-native";

import { styles } from "../../styles/truckStyle";

import { isEmpty } from "../../utils/objectHelper";

type Schedule = {
  id: string;
  day: string;
  initial_hour: string;
  finish_hour: string;
};

interface ISchedules {
  schedules: Array<Schedule>;
}

const TruckSchedule = ({ schedules }: ISchedules) => {
  return (
    <>
      <View style={[styles.card]}>
        <View style={[styles.schedules]}>
          {!isEmpty(schedules) ? (
            <FlatList
              data={schedules}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(schedules) => String(schedules.id)}
              renderItem={({ item }) => (
                <View style={styles.scheduleDay}>
                  <Text style={styles.scheduleDayName}>{item.day}</Text>
                  <Text style={styles.scheduleDayHour}>
                    {item.initial_hour}h - {item.finish_hour}h
                  </Text>
                </View>
              )}
            />
          ) : (
            <Text style={styles.sectionText}>Nenhum Horário</Text>
          )}
        </View>
      </View>
    </>
  );
};

export default TruckSchedule;
