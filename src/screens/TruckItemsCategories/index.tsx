import React from "react";
import { FlatList, Text, View } from "react-native";

import { styles } from "../../styles/truckStyle";
import { doTruncarStr } from "../../utils/trucateStr";
import { formatCurrency } from "../../utils/formatCurrency";

type Item = {
  id: string;
  name: string;
  description: string;
  price: number;
  itemCategory: string | null;
  itemCategoryText: string | null;
};

interface IItem {
  items: Array<Item>;
}

const TruckItemsCategories = ({ items }: IItem) => {
  return (
    <View style={[styles.card]}>
      <View style={styles.itemsContainer}>
        <FlatList
          data={items}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(items) => String(items.id)}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.itemTitle}>
                <Text style={styles.itemTitleText}>{item.name}</Text>
                {item.itemCategoryText && (
                  <View style={styles.itemCategory}>
                    <Text style={styles.itemCategoryText}>
                      {String(item.itemCategoryText).toLowerCase()}
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.itemDesc}>
                {doTruncarStr(item.description, 20)}
              </Text>
              <View style={styles.itemPrice}>
                <Text style={styles.itemPriceText}>
                  {formatCurrency(item.price)}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default TruckItemsCategories;
