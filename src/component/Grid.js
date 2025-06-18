import React from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';

const CustomGrid = ({ images }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Row 1 Pattern: 2 big + 3 small */}
      <View style={styles.row}>
        <Image source={images[0]} style={styles.bigImage} />
        <Image source={images[1]} style={styles.bigImage} />
      </View>
      <View style={styles.row}>
        <Image source={images[2]} style={styles.smallImage} />
        <Image source={images[3]} style={styles.smallImage} />
        <Image source={images[4]} style={styles.smallImage} />
      </View>

      {/* Row 2 Pattern: 3 small + 2 big */}
      <View style={styles.row}>
        <Image source={images[5]} style={styles.smallImage} />
        <Image source={images[6]} style={styles.smallImage} />
        <Image source={images[7]} style={styles.smallImage} />
      </View>
      <View style={styles.row}>
        <Image source={images[8]} style={styles.bigImage} />
        <Image source={images[9]} style={styles.bigImage} />
      </View>

      {/* Row 3 Repeat pattern: 2 big + 3 small */}
      <View style={styles.row}>
        <Image source={images[10]} style={styles.bigImage} />
        <Image source={images[11]} style={styles.bigImage} />
      </View>
      <View style={styles.row}>
        <Image source={images[12]} style={styles.smallImage} />
        <Image source={images[13]} style={styles.smallImage} />
        <Image source={images[14]} style={styles.smallImage} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'center',
  },
  bigImage: {
    width: 170,
    height: 170,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  smallImage: {
    width: 110,
    height: 110,
    marginHorizontal: 5,
    borderRadius: 10,
  },
});

export default CustomGrid;
