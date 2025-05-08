import React, { useRef, useState } from 'react';
import {
  FlatList,
  View,
  Dimensions,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Video from 'react-native-video';
import Header from '../component/header';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useTheme from '../hooks/useTheme';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const PostDetailScreen = ({ route }) => {
  const { postId, allPosts } = route.params;
  const flatListRef = useRef(null);
  const { theme } = useTheme();
  const initialIndex = allPosts.findIndex(p => p.id === postId);
  const [currentPlaying, setCurrentPlaying] = useState(null);

  const getTimeAgo = timestamp => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diff = now - postDate;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
    return `${years} year${years > 1 ? 's' : ''} ago`;
  };

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const firstVisibleItem = viewableItems[0];
      if (firstVisibleItem.item.media_type === 'video') {
        setCurrentPlaying(firstVisibleItem.item.id);
      } else {
        setCurrentPlaying(null);
      }
    }
  });

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
  };

  const renderItem = ({ item }) => {
    const isImage = item.media_type === 'image';
  
    return (
      <View style={[styles.postContainer, { height: screenHeight }]}>
        {/* User Info (Above media) */}
        <View style={styles.userInfo}>
          <Avatar
            size={40}
            rounded
            overlayContainerStyle={{
              backgroundColor: theme.$surface,
              borderColor: theme.$secondaryText,
              borderWidth: 1,
            }}
            source={{ uri: item.user_profile_pic }}
          />
          <View>
            <Text style={{ fontWeight: 'bold', color: '#fff' }}>{item.user}</Text>
            <Text style={{ color: '#fff' }}>{getTimeAgo(item.created_at)}</Text>
          </View>
        </View>
  
        {/* Media */}
        <View style={{ width: screenWidth, height: screenHeight * 0.7, backgroundColor: isImage ? '#fff' : '#000' }}>
          {isImage ? (
            <Image
              source={{ uri: item.media_url }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          ) : (
            <Video
              source={{ uri: item.media_url }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
              paused={currentPlaying !== item.id}
              repeat
              controls={false}
              muted={false}
            />
          )}
        </View>
  
        {/* Caption */}
        {item.caption ? (
          <Text style={styles.caption}>
            {item.caption} {item.hashtags}
          </Text>
        ) : null}
  
        {/* Action Icons (Below media) */}
        <View style={styles.actionIconsContainer}>
          <TouchableOpacity onPress={() => alert('Comment clicked!')}>
            <Icon name="comment-multiple" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('View clicked!')}>
            <Icon name="eye" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('Share clicked!')}>
            <Icon name="share-all" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Header showBack={true} title="Posts" />
      <FlatList
        ref={flatListRef}
        data={allPosts}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        pagingEnabled
        initialScrollIndex={initialIndex}
        getItemLayout={(data, index) => ({
          length: screenHeight,
          offset: screenHeight * index,
          index,
        })}
        onScrollToIndexFailed={info => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
          }, 500);
        }}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewabilityConfig}
        snapToInterval={screenHeight}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default PostDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  postContainer: {
    width: screenWidth,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 16,
    gap: 10,
  },
  overlayBottom: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  caption: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  actionIconsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 10,
  },
  
  caption: {
    fontSize: 14,
    color: '#fff',
    marginHorizontal: 16,
    marginTop: 8,
  },
  
  actionIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 16,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  
});
