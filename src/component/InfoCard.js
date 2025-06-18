import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const InfoCard = ({ header, title, subtitle, onPress }) => {
  return (
    <View style={{ marginBottom: 16 }}>
      {/* Header Tag */}
      <View style={{ alignSelf: 'flex-end', marginBottom: -15, zIndex: 1 }}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{header}</Text>
        </View>
      </View>

      {/* Card */}
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.separator} />

          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#000',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginBottom: 8,
  },
  subtitle: {
    color: '#000',
    fontSize: 14,
  },
});

export default InfoCard;
