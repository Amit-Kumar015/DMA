import React, { useRef, useState } from 'react';
import {
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import useTheme from '../../hooks/useTheme';
import Header from '../../component/header';
import Text from '../../component/Text';
import { useNavigation } from '@react-navigation/native';

const categories = [
  {
    id: 'Sarees',
    subcategories: ['Silk Saree', 'Cotton Saree','My Saree','KanchiPuram Saree',],
  },
  {
    id: 'Kurtis',
    subcategories: ['Short Kurti', 'Anarkali Kurti'],
  },
  {
    id: 'Footwear',
    subcategories: ['Heels', 'Sneakers'],
  },
  {
    id: 'Jewelry',
    subcategories: ['Necklace', 'Earrings'],
  },
];
const products = [
  { id: 1, name: 'Red Saree', category: 'Sarees', image: 'https://images.unsplash.com/photo-1602810311611-b74a9f90b826' },
  { id: 2, name: 'Blue Saree', category: 'Sarees', image: 'https://images.unsplash.com/photo-1602810311611-b74a9f90b826' },
  { id: 3, name: 'Cotton Kurti', category: 'Kurtis', image: 'https://images.unsplash.com/photo-1618005198919-e71bd5710f94' },
  { id: 4, name: 'Fancy Kurti', category: 'Kurtis', image: 'https://images.unsplash.com/photo-1618005198919-e71bd5710f94' },
  { id: 5, name: 'Stylish Heels', category: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff' },
  { id: 6, name: 'Sneakers', category: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff' },
  { id: 7, name: 'Gold Necklace', category: 'Jewelry', image: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357' },
  { id: 8, name: 'Earrings', category: 'Jewelry', image: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357' },
   { id: 9, name: 'Sneakers', category: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff' },
  { id: 10, name: 'Gold Necklace', category: 'Jewelry', image: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357' },
  { id: 11, name: 'Earrings', category: 'Jewelry', image: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357' },
];
const AllCategories = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('Sarees');
  const scrollRef = useRef(null);
  const sectionRefs = useRef({});

  const scrollToCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    const yOffset = sectionRefs.current[categoryId];
    if (scrollRef.current && yOffset !== undefined) {
      scrollRef.current.scrollTo({ y: yOffset, animated: true });
    }
  };

  const onLayoutCapture = (categoryId, event) => {
    const layout = event.nativeEvent.layout;
    sectionRefs.current[categoryId] = layout.y;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.$background }]}>
      <Header title="Categories" showBack={true} />
      <View style={styles.content}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <FlatList
            data={categories}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  selectedCategory === item.id && styles.selectedCategory,
                ]}
                onPress={() => scrollToCategory(item.id)}
              >
                <Text h5 style={[
                  styles.categoryText,
                  selectedCategory === item.id && styles.selectedText,
                ]}>
                  {item.id}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Subcategories */}
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          style={styles.productList}
        >
          {categories.map(cat => (
            <View
              key={cat.id}
              onLayout={(e) => onLayoutCapture(cat.id, e)}
            >
              <Text h4 customColor={theme.$lightText} style={styles.sectionTitle}>{cat.id}</Text>
              <View style={styles.subcategoryGrid}>
                {cat.subcategories.map(sub => (
                  <TouchableOpacity
                    key={sub}
                    style={styles.subcategoryCircle}
                    onPress={() => navigation.navigate('ProductScreen', {
                      category: cat.id,
                      subcategory: sub,
                    })}
                  >
                    <Text style={styles.subcategoryText}>{sub}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default AllCategories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    flex: 1,
  },
  sidebar: {
    width: 90,
    backgroundColor: '#f0f0f0',
  },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  selectedCategory: {
    backgroundColor: '#d1e7ff',
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  categoryText: {
    color: '#555',
  },
  selectedText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  productList: {
    flex: 1,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    // marginTop: 12,
    marginBottom: 8,
    color: '#333',
  },
  subcategoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  subcategoryCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subcategoryText: {
    textAlign: 'center',
    paddingHorizontal: 4,
    fontSize: 12,
    color: '#333',
  },
});
