import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  SafeAreaView,
  Dimensions,
  Share,
  Alert
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Video from 'react-native-video';
import useTheme from '../hooks/useTheme';
import AuthStorage from '../utils/authStorage';
import Icon from '../component/icon';
import Header from '../component/header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Avatar } from 'react-native-elements';
import Text from '../component/Text';

const HomeScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const { theme } = useTheme();
  // const { width: screenWidth } = useWindowDimensions();
  console.log("videos",videos)
  const screenWidth = Dimensions.get('window').width;
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentPlayingId(viewableItems[0].item.id);
    }
  });

  useEffect(() => {
    fetchReels(1);
  }, []);
  const onShare = async () => {
    try {
          const profileUrl = `https://yourapp.com/profile/${videos.id}`
      const result = await Share.share({
        message: `Check out my profile! Here is my ID: ${profileUrl}`, 
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type: ', result.activityType);
        } else {
          console.log('Content shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      alert(error.message);
    }
  };
  const getTimeAgo = (timestamp) => {
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

 
   const fetchReels = async (pageNumber = 1) => {
    if (loading || (!hasMore && pageNumber !== 1)) return;
    setLoading(true);
    try {
      const accessToken = await AuthStorage.getAccessToken();
      const response = await fetch(
        `http://52.70.194.52/api/feed/posts/list/?page=${pageNumber}&page_size=5`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const result = await response.json();
      if (response.ok) {
        const newVideos = result.results || [];
        if (newVideos.length === 0) {
          setHasMore(false);
        }
        setVideos(prev => (pageNumber === 1 ? newVideos : [...prev, ...newVideos]));
        setPage(pageNumber);
      } else {
        console.error('❌ Error Fetching Reels:', result);
      }
    } catch (error) {
      console.error('🔥 Network Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const renderItem = ({ item }) => {
    const isImage = item.media_type === 'image';
  
    // Calculate media aspect ratio and height
    const mediaAspectRatio = item.media_width && item.media_height
      ? item.media_width / item.media_height
      : 9 / 16;
    const mediaHeight = screenWidth / mediaAspectRatio;
    const maxHeight = 600;
    const finalMediaHeight = Math.min(mediaHeight, maxHeight);
  
    return (
      <View style={styles.postContainer}>
        {/* User Info Section */}
        <View style={{ ...styles.userInfo, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
    <View style={{ marginLeft: 10 }}>
      <Text h5 bold>{item.user}</Text>
      <Text h5>{getTimeAgo(item.created_at)}</Text>
    </View>
  </View>

  <TouchableOpacity onPress={() => Alert.alert('Coming Soon')}>
    <Icon name="dots-three-vertical" type="entypo" size={20} color={theme.$secondaryText} />
  </TouchableOpacity>
</View>

        {/* Media Section: Image or Video */}
        <View style={{ width: screenWidth, height: finalMediaHeight, backgroundColor: isImage ? '#fff' : '#000' }}>
          {isImage ? (
            <Image
              source={{ uri: item.media_url }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain" // Use contain to show the full image
            />
          ) : (
            <Video
              source={{ uri: item.media_url }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain" // Use contain for videos as well
              controls={true}
              paused={!isFocused || currentPlayingId !== item.id}
              repeat={true}
            />
          )}
        </View>
  

        {item.caption ? (
          <Text h5 style={styles.caption}>
            {item.caption} {item.hashtags}
          </Text>
        ) : null}
          <View style={styles.actionIconsContainer}>
        <TouchableOpacity onPress={() => alert('Comment clicked!')}>
          <Icon name="comment-multiple" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert('View clicked!')}>
          <Icon name="eye" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onShare()}>
          <Icon name="share-all" size={24} color="black" />
        </TouchableOpacity>
      </View>
      </View>
    );
  };

  const renderHeader = () => (
    <Header
      showBack={false}
      title="FAB SPORTS"
      rightComponent={
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate('uploadreels')}>
            <AntDesign name="plussquareo" size={26} color={'black'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('Bell Icon Clicked!')}>
            <Icon name="bell" size={26} color={'black'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
            <Icon name="menu" size={26} color={'black'} />
          </TouchableOpacity>
        </View>
      }
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={videos}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        onEndReached={() => fetchReels(page + 1)}
        onEndReachedThreshold={0.1}
        ListFooterComponent={loading ? <ActivityIndicator size="large"  /> : null}
        showsVerticalScrollIndicator={false}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged.current}
        ListHeaderComponent={renderHeader}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  actionIconsContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    paddingHorizontal: 16,
    gap:10
    // borderTopWidth: 1,
    // borderTopColor: '#ccc',
  },
  postContainer: {
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'flex-start',
    gap: 10,
  },
  caption: {
    marginHorizontal: 16,
    marginTop: 10,
    fontSize: 14,
    color: '#333',
  },
});

export default HomeScreen;
