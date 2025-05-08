import React, {useRef, useState, useEffect} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  ActivityIndicator,
  AppState,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useIsFocused} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import Text from '../component/Text';
import AuthStorage from '../utils/authStorage';
import { Image } from 'react-native';

const {width, height} = Dimensions.get('window');
const ReelScreen = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pausedVideos, setPausedVideos] = useState({});
  const [isBuffering, setIsBuffering] = useState(false);
  const flatListRef = useRef(null);
  const appState = useRef(AppState.currentState);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const viewabilityConfig = {itemVisiblePercentThreshold: 80};
  // console.log('videos', videos);
  const onViewRef = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    setHasMore(true);
    setPage(1);
    setVideos([]); // Clear previous videos
    await fetchReels(1); // Reload from page 1
    setRefreshing(false);
  };
  // useEffect(() => {
  //   const handleAppStateChange = nextAppState => {
  //     if (nextAppState !== 'active') {
  //       const pausedState = {};
  //       videos.forEach((_, i) => {
  //         pausedState[i] = true;
  //       });
  //       setPausedVideos(pausedState);
  //     }
  //   };

  //   const subscription = AppState.addEventListener(
  //     'change',
  //     handleAppStateChange,
  //   );
  //   return () => subscription.remove();
  // }, []);
  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (nextAppState !== 'active') {
        // App went to background, pause all
        const pausedState = {};
        videos.forEach((_, i) => {
          pausedState[i] = true;
        });
        setPausedVideos(pausedState);
      } else if (isFocused) {
        // App is active again, but only resume if on this screen
        const resumedState = {};
        videos.forEach((_, i) => {
          resumedState[i] = i !== currentIndex;
        });
        setPausedVideos(resumedState);
      }
    };
  
    const subscription = AppState.addEventListener('change', handleAppStateChange);
  
    return () => {
      subscription.remove();
    };
  }, [isFocused, currentIndex, videos]);
  
  useEffect(() => {
    if (isFocused) {
      const resumedState = {};
      videos.forEach((_, i) => {
        resumedState[i] = i !== currentIndex;
      });
      setPausedVideos(resumedState);
    } else {
      const pausedState = {};
      videos.forEach((_, i) => {
        pausedState[i] = true;
      });
      setPausedVideos(pausedState);
    }
  }, [isFocused, currentIndex]);

  useEffect(() => {
    fetchReels(1); // Start from page 1
  }, []);

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
  const renderItem = ({item, index}) => {
    const isCurrent = index === currentIndex;
    const isPaused = pausedVideos[index] || false;
    const videoUrl = item?.media_url;
    const imageUrl = item?.media_url;
    return (
      <View style={styles.reelContainer}>
       {item?.is_video ? (
        <Video
          source={{uri: videoUrl}}
          style={styles.video}
          resizeMode="cover"
          repeat
          paused={!isCurrent || isPaused}
          onBuffer={() => isCurrent && setIsBuffering(true)}
          onReadyForDisplay={() => isCurrent && setIsBuffering(false)}
          onError={error => console.error('Video Error:', error)}
        />
      ) : (
        <Image
          source={{uri: imageUrl}}
          style={styles.video} // reuse same style so image and video fit equally
          resizeMode="contain"
        />
      )}

        {isBuffering && (
          <ActivityIndicator size="large" color="#fff" style={styles.loader} />
        )}

        <TouchableOpacity
          activeOpacity={1}
          style={styles.touchableOverlay}
          onPress={() => {
            setPausedVideos(prev => ({...prev, [index]: !isPaused})); // Toggle pause for the current video
          }}>
          {isPaused && isCurrent && (
            <Icon
              name="play-circle-filled"
              size={60}
              color="#fff"
              style={styles.pauseIcon}
            />
          )}

          <View style={styles.bottomInfo}>
            <View style={styles.userRow}>
              <View style={styles.profileImage} />
              <Text h5 bold style={styles.username}>
                {item?.user || 'Unknown User'}
              </Text>
              {/* <TouchableOpacity style={styles.followButton}>
                <Text style={styles.followText}>Follow</Text>
              </TouchableOpacity> */}
            </View>

            <Text h5 bold style={styles.caption}>
              {item?.caption} {item?.hashtags}
            </Text>
          </View>

          <View style={styles.rightIcons}>
            <Icon name="favorite" size={30} color="#fff" style={styles.icon} />
            <Text style={styles.iconText}>24.5k</Text>
            <Icon
              name="chat-bubble"
              size={30}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.iconText}>1.2k</Text>
            {/* <Icon name="send" size={30} color="#fff" style={styles.icon} />
            <Icon name="more-vert" size={30} color="#fff" style={styles.icon} /> */}
          </View>
        </TouchableOpacity>
      </View>
      // </SafeAreaView>
    );
  };

  useEffect(() => {
    // Pause all videos when the component unmounts
    return () => {
      setPausedVideos({});
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* <SafeAreaView> */}
      {/* <Header showBack={true}    customBackEvent={() => navigation.goBack()}/> */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Icon name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
      <FlatList
  data={videos}
  keyExtractor={(item, index) => index.toString()}
  renderItem={renderItem}
  pagingEnabled
  horizontal={false}
  ref={flatListRef}
  onViewableItemsChanged={onViewRef.current}
  viewabilityConfig={viewabilityConfig}
  showsVerticalScrollIndicator={false}
  snapToInterval={height}
  decelerationRate="fast"
  onEndReachedThreshold={0.5}
  onEndReached={() => {
    if (!loading && hasMore) {
      fetchReels(page + 1);
    }
  }}
  refreshing={refreshing}
  onRefresh={handleRefresh}
/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#000',
  },
  reelContainer: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    position: 'relative',
    backgroundColor: '#000', // optional: helps with black background while buffering
  },
  video: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  touchableOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseIcon: {
    position: 'absolute',
  },
  loader: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#555',
    marginRight: 10,
  },
  username: {
    color: '#fff',
    // fontSize: 16,
    // fontWeight: 'bold',
  },
  followButton: {
    marginLeft: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: '#0095f6',
    borderRadius: 5,
  },
  followText: {
    color: '#fff',
    // fontWeight: 'bold',
  },
  caption: {
    color: '#fff',
    // fontSize: 14,
    marginBottom: 70,
  },
  rightIcons: {
    position: 'absolute',
    right: 15,
    bottom: 100,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 20,
  },
  iconText: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 15,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 6,
    borderRadius: 20,
  },
});

export default ReelScreen;
