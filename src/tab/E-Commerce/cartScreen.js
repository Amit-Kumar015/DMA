import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../../slices/cartSlice';
import Header from '../../component/header';
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const cartItems = useSelector(state => state.cart.items || []);

  const handleRemove = index => {
    dispatch(removeFromCart(index));
  };

  const handleNavigateToProduct = (item) => {
    navigation.navigate('ProductScreen', {
      category: item.category || 'General',
      subcategory: item.name,
      product: item,
    });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => handleNavigateToProduct(item)}>
      <View style={styles.item}>
        <Image source={{ uri: item.images?.[0] }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>{item.price}</Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemove(index)}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Cart" showBack={true} />
      <FlatList
        data={cartItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>Your cart is empty</Text>
        }
      />
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  item: { flexDirection: 'row', marginBottom: 16, paddingHorizontal: 16 },
  image: { width: 80, height: 80, borderRadius: 8 },
  info: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: 'bold' },
  price: { fontSize: 14, color: '#007bff', marginTop: 4 },
  removeButton: {
    marginTop: 8,
    backgroundColor: '#dc3545',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    color: '#888',
    fontSize: 16,
  },
});
