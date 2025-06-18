import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Text from './Text';
import useTheme from '../hooks/useTheme';

const ContributorsCard = ({
  title,
  contributors,
  showAddIcon = false,
  onAddPress,
  onViewPress, // 👈 New prop
   getItemActionText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
    const {theme} = useTheme();

  const toggleList = () => {
    setIsOpen(!isOpen);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={[styles.avatar, { backgroundColor: getColor(item.name) }]}>
        <Text h5 bold  customColor="black" style={styles.avatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={styles.textContainer}>
        <Text  h6 semiBold customColor="black" style={styles.name}>
          {item.name}
          {item.isYou ? ' (You)' : ''}
        </Text>
        {item.subtitle ? (
          <Text h6 semiBold customColor="black"  style={styles.subtitle}>{item.subtitle}</Text>
        ) : null}
      </View>

      {/* <TouchableOpacity>
        <Icon name="ellipsis-vertical" size={18} color="#555" />
      </TouchableOpacity> */}
       {getItemActionText && getItemActionText(item) ? (
      <Text h5 semiBold customColor="black" style={styles.actionText}>{getItemActionText(item)}</Text>
    ) : null}
    </View>
  );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text h5 bold customColor="black"  style={styles.headerText}>
          {title} ({contributors.length})
        </Text>

        <View style={styles.iconContainer}>
          {/* View Icon */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onViewPress && onViewPress();
            }}
            style={styles.iconButton}
          >
            <Icon name="eye-outline" size={20} color="#555" />
          </TouchableOpacity>

          {/* Add Icon */}
          {showAddIcon && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onAddPress && onAddPress();
              }}
              style={styles.iconButton}
            >
              <Icon name="person-add-outline" size={20} color="#555" />
            </TouchableOpacity>
          )}

          {/* Expand/Collapse */}
          <TouchableOpacity onPress={toggleList} style={styles.iconButton}>
            <Icon
              name={isOpen ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#000"
            />
          </TouchableOpacity>
        </View>
      </View>

      {isOpen && (
        <FlatList
          data={contributors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const getColor = (name) => {
  const colors = ['#2196F3', '#4CAF50', '#FF5722', '#9C27B0'];
  return colors[name.length % colors.length];
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f2f3f4',
    margin: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    // fontSize: 16,
    // fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    paddingLeft: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    // color: '#fff',
    // fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    // fontSize: 12,
    // color: '#777',
  },
  actionText: {
  // fontSize: 12,
  // color: '#777',
  paddingLeft: 10,
},

});

export default ContributorsCard;
