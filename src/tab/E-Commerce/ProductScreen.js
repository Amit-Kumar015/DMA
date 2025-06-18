// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   Dimensions,
// } from 'react-native';
// import Header from '../../component/header';
// import { useDispatch, useSelector } from 'react-redux';
// import { addToCart } from '../../slices/cartSlice';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';
// import useTheme from '../../hooks/useTheme';



// const { width } = Dimensions.get('window');

// // const ProductScreen = ({ route }) => {
// //   const { category, subcategory } = route.params;

// //   return (
// //     <View style={styles.container}>
// //           <Header title="Product" showBack={true} />
// //       <ScrollView contentContainerStyle={styles.scrollContent}>
// //         {/* Product Image */}
// //         <Image
// //           source={{ uri: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff' }}
// //           style={styles.image}
// //           resizeMode="cover"
// //         />

// //         {/* Product Details Card */}
// //         <View style={styles.detailsCard}>
// //           <Text style={styles.title}>{subcategory}</Text>
// //           <Text style={styles.category}>Category: {category}</Text>
// //           <Text style={styles.description}>
// //             This is a beautiful {subcategory} from our {category} collection. Crafted with care and designed to impress.
// //           </Text>
// //           <Text style={styles.price}>₹ 2,499</Text>
// //         </View>
// //       </ScrollView>

// //       {/* Bottom Buttons */}
// //       <View style={styles.buttonContainer}>
// //         <TouchableOpacity style={[styles.button, styles.cartButton]}>
// //           <Text style={styles.buttonText}>Add to Cart</Text>
// //         </TouchableOpacity>
// //         <TouchableOpacity style={[styles.button, styles.buyButton]}>
// //           <Text style={styles.buttonText}>Buy Now</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </View>
// //   );
// // };

// const ProductScreen = ({ route }) => {
//   const { category, subcategory, product } = route.params || {};
//   const dispatch = useDispatch();
//    const navigation = useNavigation();
//    const {theme}=useTheme()

//   const cartItems = useSelector(state => state.cart.items || []);
//   const cartCount = cartItems.length;

//   const handleAddToCart = () => {
//     const productData = product || {
//       name: subcategory,
//       image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
//       price: '₹ 2,499',
//       category,
//     };
//     dispatch(addToCart(productData));
//   };
  
//  const renderCartIcon = () => (
//     <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={{ padding: 4 }}>
//       <Icon name="cart-outline" size={24} color={theme.$lightText} />
//       {cartCount > 0 && (
//         <View
//           style={{
//             position: 'absolute',
//             top: -4,
//             right: -4,
//             backgroundColor: 'red',
//             borderRadius: 8,
//             paddingHorizontal: 4,
//             minWidth: 16,
//             height: 16,
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
//             {cartCount}
//           </Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   );

//   return (
//       <View style={[styles.container, { backgroundColor: theme.$background }]}>
//       <Header title="Product" showBack={true} rightComponent={renderCartIcon()}/>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {product ? (
//           <>
//             <Image source={{ uri: product.image }} style={styles.image} />
//  <View style={styles.detailsCard}>
//             <Text style={styles.name}>{product.name}</Text>
//              <Text style={styles.description}>
//                 This is a beautiful {subcategory} from our {category} collection. Crafted with care and designed to impress.
//               </Text>
//             <Text style={styles.price}>{product.price}</Text>
//             </View>
//           </>
//         ) : (
//           <>
//             <Image
//               source={{ uri: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff' }}
//               style={styles.image}
//             />
//             <View style={styles.detailsCard}>
//               <Text style={styles.title}>{subcategory}</Text>
//               <Text style={styles.category}>Category: {category}</Text>
//               <Text style={styles.description}>
//                 This is a beautiful {subcategory} from our {category} collection. Crafted with care and designed to impress.
//               </Text>
//               <Text style={styles.price}>₹ 2,499</Text>
//             </View>
//           </>
//         )}
//       </ScrollView>

//        <View style={[styles.buttonContainer, { backgroundColor: theme.$background }]}>
//         <TouchableOpacity style={[styles.button, styles.cartButton]} onPress={handleAddToCart}>
//           <Text style={styles.buttonText}>Add to Cart</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.button, styles.buyButton]}>
//           <Text style={styles.buttonText}>Buy Now</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default ProductScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   scrollContent: {
//     paddingBottom: 120,
//     alignItems: 'center',
//   },
//   image: {
//     width: width * 0.9,
//     height: width * 0.9,
//     borderRadius: 10,
//     marginTop: 20,
//   },
//   detailsCard: {
//     backgroundColor: '#f9f9f9',
//     marginTop: 20,
//     padding: 16,
//     borderRadius: 10,
//     width: width * 0.9,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 4,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 6,
//   },
//   category: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 10,
//   },
//   description: {
//     fontSize: 14,
//     lineHeight: 20,
//     color: '#333',
//     marginBottom: 10,
//   },
//   price: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#007bff',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     position: 'absolute',
//     bottom: 0,
//     width: '100%',
//     padding: 16,
//     // backgroundColor: '#fff',
//     justifyContent: 'space-between',
//     borderTopWidth: 1,
//     borderColor: '#ddd',
//   },
//   button: {
//     flex: 0.48,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   cartButton: {
//     backgroundColor: '#6c757d',
//   },
//   buyButton: {
//     backgroundColor: '#28a745',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../slices/cartSlice';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../component/header';
import useTheme from '../../hooks/useTheme';

const { width } = Dimensions.get('window');

const ProductScreen = ({ route }) => {
  const { category, subcategory, product } = route.params || {};
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { theme } = useTheme();

  const cartItems = useSelector(state => state.cart.items || []);
  const cartCount = cartItems.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  // const productData = product || {
  //   name: subcategory,
  //   images: [
  //     'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
  //     'https://images.unsplash.com/photo-1564468781191-2f3eec8aa005',
  //     'https://images.unsplash.com/photo-1618354691224-05b6ff1c157f',
  //   ],
  //   price: '₹ 2,499',
  //   category,
  // };
  const productData = {
  name: product?.name || subcategory,
  images: product?.images && Array.isArray(product.images)
    ? product.images
    : [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
       'https://images.unsplash.com/photo-1575936123452-b67c3203c357',

        'https://images.unsplash.com/photo-1618354691224-05b6ff1c157f',
      ],
  price: product?.price || '₹ 2,499',
  category: product?.category || category,
};


  const isProductInCart = cartItems.some(
    item => item.name === productData.name
  );

  const handleAddToCart = () => {
    if (!isProductInCart) {
      dispatch(addToCart(productData));
    }
  };

  const renderCartIcon = () => (
    <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={{ padding: 4 }}>
      <Icon name="cart-outline" size={24} color={theme.$lightText} />
      {cartCount > 0 && (
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>{cartCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const handleScroll = event => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.$background }]}>
      <Header title="Product" showBack={true} rightComponent={renderCartIcon()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          ref={scrollRef}
          style={styles.imageScroll}
        >
          {productData.images.map((img, index) => (
            <Image
              key={index}
              source={{ uri: img }}
              style={styles.image}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        <View style={styles.pagination}>
          {productData.images.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex && styles.activeDot]}
            />
          ))}
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.name}>{productData.name}</Text>
          <Text style={styles.description}>
            This is a beautiful {subcategory} from our {category} collection. Crafted with care and designed to impress.
          </Text>
          <Text style={styles.price}>{productData.price}</Text>
        </View>
      </ScrollView>

      <View style={[styles.buttonContainer, { backgroundColor: theme.$background }]}>
        <TouchableOpacity
          style={[
            styles.button,
            isProductInCart ? styles.buyButton : styles.cartButton,
          ]}
          onPress={() =>
            isProductInCart ? navigation.navigate('Cart') : handleAddToCart()
          }
        >
          <Text style={styles.buttonText}>
            {isProductInCart ? 'Go to Cart' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.buyButton]}>
          <Text style={styles.buttonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
    alignItems: 'center',
  },
  // imageScroll: {
  //   width: width,
  // },
  // image: {
  //   width: width,
  //   height: width,
  // },
  imageScroll: {
  width: width,
  alignSelf: 'center',
},
image: {
  width: width * 0.9,
  height: width * 0.6,
  borderRadius: 10,
  marginTop: 16,
  marginHorizontal: width * 0.05,
},

  pagination: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 8,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#007bff',
  },
  detailsCard: {
    backgroundColor: '#f9f9f9',
    marginTop: 20,
    padding: 16,
    borderRadius: 10,
    width: width * 0.9,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  buttonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16,
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    flex: 0.48,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cartButton: {
    backgroundColor: '#6c757d',
  },
  buyButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    borderRadius: 8,
    paddingHorizontal: 4,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

