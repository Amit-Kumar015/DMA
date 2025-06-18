import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import Header from '../../component/header';
import useTheme from '../../hooks/useTheme';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Text from '../../component/Text';
import { useNavigation } from '@react-navigation/native';

const categories = [
   {
    id: 0,
    name: 'Categories',
    isMain: true,
    image: 'https://cdn-icons-png.flaticon.com/512/747/747376.png', // grid icon
  },
  {
    id: 1,
    name: 'Sarees',
    image: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357',
  },
  {
    id: 2,
    name: 'Kurtis',
    image: 'https://images.unsplash.com/photo-1618005198919-e71bd5710f94',
  },
  {
    id: 3,
    name: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
  },
  {
    id: 4,
    name: 'Jewelry',
    image: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357',
  },
    {
    id: 5,
    name: 'Sarees',
    image: 'https://images.unsplash.com/photo-1602810311611-b74a9f90b826',
  },
  {
    id: 6,
    name: 'Kurtis',
    image: 'https://images.unsplash.com/photo-1618005198919-e71bd5710f94',
  },
  {
    id: 7,
    name: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
  },
  {
    id: 8,
    name: 'Jewelry',
    image: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357',
  },
];

const products = [
  {
    id: 1,
    name: 'Printed Cotton Kurti',
    price: '₹349',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
  },
  {
    id: 2,
    name: 'Gold Plated Earrings',
    price: '₹199',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
  },
  {
    id: 3,
    name: 'Embroidered Saree',
    price: '₹599',
    image: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357',
  },
  {
    id: 4,
    name: 'Women Heels',
    price: '₹799',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
  },
  {
    id: 5,
    name: 'Printed Cotton Kurti',
    price: '₹349',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
  },
  {
    id: 6,
    name: 'Gold Plated Earrings',
    price: '₹199',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
  },
  {
    id: 7,
    name: 'Embroidered Saree',
    price: '₹599',
    image: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357',
  },
  {
    id: 8,
    name: 'Women Heels',
    price: '₹799',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
  },
];

const MainShop = () => {
  const { theme } = useTheme();
    const navigation = useNavigation();

  // const renderCategory = ({ item }) => (
  //   <TouchableOpacity style={styles.categoryCard}>
  //     <Image source={{ uri: item.image }} style={styles.categoryImage} />
  //     <Text h6 style={styles.categoryText}>{item.name}</Text>
  //   </TouchableOpacity>
  // );
    const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => {
        if (item.isMain) {
          navigation.navigate('AllCategories'); // Navigate to full category screen
        } else {
          console.log('Category selected:', item.name);
        }
      }}
    >
      <Image source={{ uri: item.image }} style={styles.categoryImage} />
      <Text h6 style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

const renderProduct = ({ item }) => (
  <TouchableOpacity
    style={styles.productCard}
    onPress={() => navigation.navigate('ProductScreen', { product: item })}
  >
    <Image source={{ uri: item.image }} style={styles.productImage} />
    <Text h6 numberOfLines={2} customColor="black" style={styles.productName}>
      {item.name}
    </Text>
    <Text h5 customColor="black" style={styles.productPrice}>
      {item.price}
    </Text>
  </TouchableOpacity>
);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.$background }]}>
      <Header showSearchInput={true} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text h4 style={styles.sectionTitle}>Top Categories</Text>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCategory}
          contentContainerStyle={styles.categoryList}
        />

        <Text h4 style={styles.sectionTitle}>Products for You</Text>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.productList}
          scrollEnabled={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MainShop;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  categoryList: {
    paddingBottom: 10,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 16,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 6,
    backgroundColor: '#eee',
  },
  categoryText: {
    // fontSize: 14,
  },
  productList: {
    paddingTop: 10,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: (wp('100%') - 48) / 2,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  productName: {
    // fontSize: 14,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    // color: '#000',
  },
});
