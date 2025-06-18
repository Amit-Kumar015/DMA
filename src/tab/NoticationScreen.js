import {
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../component/header';
import useTheme from '../hooks/useTheme';
import AuthStorage from '../utils/authStorage';
import { Avatar } from 'react-native-elements';
import Text from '../component/Text';

const NotificationScreen = () => {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
console.log("not",notifications)
  const fetchNotifications = async () => {
    try {
           const accessToken = await AuthStorage.getAccessToken();
      const response = await axios.get('http://52.70.194.52/api/core/notifications/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
          console.log("res",response)
      setNotifications(response.data);
  
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);
 const timeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(seconds / 86400);

    if (seconds < 60) return 'Just now';
    else if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    else if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    else return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const renderItem = ({ item }) => {
    
  const handleMarkAsRead = async () => {
    try {
      const accessToken = await AuthStorage.getAccessToken();

      await fetch(`http://52.70.194.52/api/core/notifications/${item.id}/read/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      // Optional: update state to remove or mark the item as read
      console.log(`Notification ${item.id} marked as read.`);
      fetchNotifications()
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };
  const firstLetter = item.message?.charAt(0)?.toUpperCase() || '?';

  return (
    <View style={styles.notificationCard}>
      <View style={styles.avatarContainer}>
        <Avatar
          size={42}
          rounded
          activeOpacity={0.7}
          overlayContainerStyle={{
            backgroundColor: 'blue',
            borderColor: theme.$secondaryText,
            borderWidth: 1,
          }}
          source={
            item.profile_pic // if profile pic is added in future
              ? { uri: item.profile_pic }
              : undefined
          }
          title={!item.profile_pic ? firstLetter : ''}
        />
      </View>
      <View style={styles.messageContainer}>
        <Text h5 bold style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{timeAgo(item.created_at)}</Text>
      </View>
        <TouchableOpacity style={styles.closeButton} onPress={handleMarkAsRead}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
    </View>
  );
};
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.$background }]}>
      <Header showBack={true} title="Notifications" />
      {loading ? (
        <ActivityIndicator size="large" color={theme.$primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 16 }}
        />
      )}
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
    closeButton: {
    padding: 4,
  },
  closeIcon: {
    fontSize: 16,
    color: 'red',
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    // elevation: 1,
    borderBottomWidth:0.5
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#d1d1d1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  messageContainer: {
    flex: 1,
  },
  message: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
  time: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});