import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
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
  Alert,
  findNodeHandle,
  ToastAndroid,
  TouchableWithoutFeedback,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {useNavigation, useIsFocused, useFocusEffect} from '@react-navigation/native';
import Video from 'react-native-video';
import useTheme from '../hooks/useTheme';
import AuthStorage from '../utils/authStorage';
import Icon from '../component/icon';
import Header from '../component/header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Avatar} from 'react-native-elements';
import Text from '../component/Text';
import MenuModal from '../component/menuModal';
import Modal from 'react-native-modal';
import PrimaryButton from '../component/prButton';
import Card from '../component/card';
import CommentInterface from '../component/Comment';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';


const HEADER_HEIGHT = 65;
const HomeScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
    const [selectedPostId, setSelectedPostId] = useState(null);
  const {theme} = useTheme();
  // const { width: screenWidth } = useWindowDimensions();
  console.log('videos', videos);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  console.log("selectedI",selectedItemId)
  const [menuPosition, setMenuPosition] = useState({x: 0, y: 0});
  const iconRefs = useRef({});
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
    const [comment, setComment] = useState('');
    const bottomSheetRef = useRef(null);
    const [posts, setPosts] = useState([]);
const [pages, setPages] = useState(1);

      const [modalVisible, setModalVisible] = useState(false);
useEffect(() => {
  const loadInitialPosts = async () => {
    await fetchPosts(1); // Start from page 1
  };

  loadInitialPosts();
}, []);
useEffect(() => {
  if (posts.length > 0) {
    console.log('Posts fetched:', posts);
    // You can perform any logic here
  }
}, [posts]);
    const suggestedProfiles = [
  { id: 1, name: 'Ravi Kumar', profile_pic: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: 2, name: 'Anjali Singh', profile_pic: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: 3, name: 'Mohit Verma', profile_pic: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: 4, name: 'Ritika Shah', profile_pic: 'https://randomuser.me/api/portraits/women/4.jpg' },
  { id: 5, name: 'Aman Yadav', profile_pic: 'https://randomuser.me/api/portraits/men/5.jpg' },
  { id: 6, name: 'Preeti Mehra', profile_pic: 'https://randomuser.me/api/portraits/women/6.jpg' },
  { id: 7, name: 'Deepak Joshi', profile_pic: 'https://randomuser.me/api/portraits/men/7.jpg' },
  { id: 8, name: 'Neha Kapoor', profile_pic: 'https://randomuser.me/api/portraits/women/8.jpg' },
  { id: 9, name: 'Suresh Rana', profile_pic: 'https://randomuser.me/api/portraits/men/9.jpg' },
];
const selectedVideo = videos.find(video => video.id === selectedItemId);
const comments=[
  "Great post!",
  "Very informative, thanks!",
  "I totally agree with this.",
  "Can you provide more details?",
  "Awesome content!",
    "Great post!",
  "Very informative, thanks!",
  "I totally agree with this.",
  "Can you provide more details?",
  "Awesome content!",
    "Great post!",
  "Very informative, thanks!",
  "I totally agree with this.",
  "Can you provide more details?",
  "Awesome content!"
];
  const reportPost = (postId, reason) => {
    // Replace with your actual API logic
    console.log(`Reporting post ${postId} for: ${reason}`);
    ToastAndroid.show('Reported successfully', ToastAndroid.SHORT);
  };
    const handleSelectPost = (id) => {
    setSelectedPostId(id); // Store in state
    console.log('Selected post ID:', id);
  };

  const fetchPosts = async (currentPage = 1) => {
  try {
    setLoading(true);
       const accessToken = await AuthStorage.getAccessToken();
    const response = await fetch(`http://52.70.194.52/api/feed/posts/list/?page=${currentPage}&page_size=1`, {
      method: 'GET',
      headers: {
         Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      setPosts((prevPosts) => [...prevPosts, ...data.results]); // Append new page
      setPages(currentPage + 1); // Next page for next fetch
    } else {
      const errorData = await response.json();
      console.warn('Failed to fetch posts:', errorData);
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
  } finally {
    setLoading(false);
  }
};

const handleSend = async (id, commentText) => {
  console.log('Sending ID:', id);
  if (commentText.trim() === '') return;

  const formData = new FormData();
  formData.append('text', commentText);

  try {
    const accessToken = await AuthStorage.getAccessToken();
    const response = await fetch(`http://52.70.194.52/api/feed/posts/${id}/comment/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json(); // data.comment contains text
      console.log('Comment posted successfully:', data);

      setComment(''); // Optional: clear input

      const newComment = {
        user: 'You', // Replace this with the logged-in user's name
        text: data.comment,
        created_at: new Date().toISOString(),
      };

      // Update the video in the videos array
      setVideos(prevVideos =>
        prevVideos.map(video =>
          video.id === id
            ? {
                ...video,
                comments: [...(video.comments || []), newComment],
              }
            : video
        )
      );
    } else {
      const errorData = await response.json();
      console.warn('Failed to post comment:', errorData);
    }
  } catch (error) {
    console.error('Error posting comment:', error);
  }
};


  // const openBottomSheet = () => {
  //   console.log("Opening Bottom Sheet...");
  //    bottomSheetRef.current?.scrollTo(-SCREEN_HEIGHT + 100);
  // };

// const openBottomSheet = (itemId) => {
//    setSelectedItemId(itemId);      // 👈 store the selected post
//  bottomSheetRef.current?.scrollTo(-SCREEN_HEIGHT + 100);  // 👈 open the BottomSheet
// };
  const snapPoints = useMemo(() => ['50%'], []);

  const handleSheetChanges = useCallback((index) => {
    console.log('Sheet index changed:', index);
  }, []);

  const openBottomSheet = itemId => {
      setSelectedItemId(itemId);  
   setModalVisible(true); // open to 50%
  };

  const scrollY = useRef(new Animated.Value(0)).current;

  const diffClampScrollY = Animated.diffClamp(scrollY, 0, HEADER_HEIGHT);

  const translateY = diffClampScrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  const data = Array.from({length: 30}, (_, i) => `Item ${i + 1}`);
  const handleMenuOptionClick = optionKey => {
    setMenuVisible(false);

    if (optionKey === 'report') {
      setShowReportModal(true);
    }

    // handle other options
  };
  const menuOptions = [
    // { label: 'Edit', onPress: () => console.log('Edit') },
    // { label: 'Delete', onPress: () => console.log('Delete') },
    {label: 'Report', onPress: () => setShowReportModal(true)},
  ];
  const handleMenuOpen = itemId => {
    const ref = iconRefs.current[itemId];
    if (ref) {
      ref.measure((x, y, width, height, pageX, pageY) => {
        const menuWidth = 160; // Same as your menu container width
        const menuHeight = 20; // Estimated height of your menu
        const padding = 10;
        const screenHeight = Dimensions.get('window').height;

        // Adjust X to keep menu within horizontal bounds
        const adjustedX =
          pageX + menuWidth + padding > screenWidth
            ? screenWidth - menuWidth - padding
            : pageX;

        // Adjust Y to show the menu above the icon and avoid going off top
        const aboveY = pageY - menuHeight;
        const adjustedY = aboveY < padding ? pageY + height + padding : aboveY;

        setMenuPosition({x: adjustedX, y: adjustedY});
        setSelectedItemId(itemId);
        setMenuVisible(true);
      });
    }
  };

  const screenWidth = Dimensions.get('window').width;
  // const viewabilityConfig = {
  //   itemVisiblePercentThreshold: 80,
  // };

  // const onViewableItemsChanged = useRef(({viewableItems}) => {
  //   if (viewableItems.length > 0) {
  //     setCurrentPlayingId(viewableItems[0].item.id);
  //      logViewToAPI(item.id);
  //   }
  // });
// const viewabilityConfig = {
//   itemVisiblePercentThreshold: 80, // Adjust threshold as needed
// };

// const viewedPostIds = useRef(new Set()); // Track already viewed items

// const onViewableItemsChanged = useRef(({ viewableItems }) => {
//   viewableItems.forEach((viewable) => {
//     const item = viewable.item;

//     if (item.id && !viewedPostIds.current.has(item.id) && item.media_url) {
//       viewedPostIds.current.add(item.id);
//       logViewToAPI(item.id);
//     }
//   });
// });
const viewabilityConfig = {
  itemVisiblePercentThreshold: 80,
};

const viewedPostIds = useRef(new Set()); // For logging API once per video

const onViewableItemsChanged = useRef(({ viewableItems }) => {
  if (viewableItems.length > 0) {
    const currentItem = viewableItems[0].item;

    // Set for autoplay
    setCurrentPlayingId(currentItem.id);

    // Log view only once
    if (
      currentItem.id &&
      !viewedPostIds.current.has(currentItem.id) &&
      currentItem.media_url // only if it has video
    ) {
      viewedPostIds.current.add(currentItem.id);
      logViewToAPI(currentItem.id);
    }
  }
});

  const onRefresh = () => {
    setRefreshing(true);
    setHasMore(true); // Reset this so we can paginate again
    fetchReels(1, true); // Refresh from page 1
      viewedPostIds.current.clear();
  };
  const onShare = async () => {
    try {
      const profileUrl = `https://yourapp.com/profile/${videos.id}`;
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
      Alert.alert(error.message);
    }
  };
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

  const shuffleArray = array => {
    return array.sort(() => Math.random() - 0.5);
  };
  const fetchReels = async (pageNumber = 1, refreshing = false) => {
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
        let newVideos = result.results || [];

        // 🔀 Shuffle new videos
        newVideos = shuffleArray(newVideos);

        if (newVideos.length === 0) setHasMore(false);

        setVideos(prev =>
          pageNumber === 1 || refreshing ? newVideos : [...prev, ...newVideos],
        );
        setPage(pageNumber);
      } else {
        console.error('❌ Error Fetching Reels:', result);
      }
    } catch (error) {
      console.error('🔥 Network Error:', error);
    } finally {
      setLoading(false);
      if (refreshing) setRefreshing(false);
    }
  };
const logViewToAPI = async (postId) => {
  try {
    console.log("postId",postId)
     const accessToken = await AuthStorage.getAccessToken();
    const response = await fetch(`http://52.70.194.52/api/feed/posts/view/${postId}/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`, // Replace with your auth token
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to log view:', response.status);
    }
  } catch (error) {
    console.error('Error logging view:', error);
  }
};

  const injectSuggestionsAfterEvery = (data, interval = 4) => {
  const result = [];
  let count = 0;

  for (let i = 0; i < data.length; i++) {
    result.push(data[i]);
    count++;
    if (count === interval) {
      result.push({ type: 'suggested_profiles', id: `suggestion-${i}` });
      count = 0;
    }
  }

  return result;
};
  const renderItem = ({item}) => {
     // Show Suggested Profiles Block
  if (item.type === 'suggested_profiles') {
    const mediaAspectRatio =
      item.media_width && item.media_height
        ? item.media_width / item.media_height
        : 9 / 16;
    const mediaHeight = screenWidth / mediaAspectRatio;
    const maxHeight = 600;
    const finalMediaHeight = Math.min(mediaHeight, maxHeight);

    return (
<View style={{ paddingVertical: 5 ,bottom:40}}>
  <Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 12 }}>
    Suggested for you
  </Text>
  <FlatList
    data={suggestedProfiles}
    horizontal
    keyExtractor={(item) => item.id.toString()}
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ padding: 10 }}
    renderItem={({ item }) => (
      <Card third style={{ marginRight: 12, }}>
        <View style={{ width: 100, alignItems: 'center' }}>
 <Image
  source={{ uri: item.profile_pic }}
  onError={(e) => console.log('Image load error:', e.nativeEvent)}
  style={{ width: 60, height: 60, borderRadius: 30 }}
/>
          <Text numberOfLines={1} style={{ fontSize: 12 }}>
            {item.name}
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 4,
              backgroundColor: '#007AFF',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 12,
            }}
            onPress={() => console.log('Follow', item.name)}
          >
            <Text style={{ fontSize: 12, color: 'white' }}>Follow</Text>
          </TouchableOpacity>
        </View>
      </Card>
    )}
  />
</View>
    )
  };

    const isImage = item.media_type === 'image';

    // Calculate media aspect ratio and height
    const mediaAspectRatio =
      item.media_width && item.media_height
        ? item.media_width / item.media_height
        : 9 / 16;
    const mediaHeight = screenWidth / mediaAspectRatio;
    const maxHeight = 600;
    const finalMediaHeight = Math.min(mediaHeight, maxHeight);

    return (
      <View style={styles.postContainer}>
        {/* User Info Section */}
        <View
          style={{
            ...styles.userInfo,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Avatar
              size={40}
              rounded
              overlayContainerStyle={{
                backgroundColor: theme.$surface,
                borderColor: theme.$secondaryText,
                borderWidth: 1,
              }}
              source={
                item.user_profile_pic &&
                typeof item.user_profile_pic === 'string'
                  ? {uri: item.user_profile_pic}
                  : require('../assets/icon/profile.png')
              }
            />
            <View style={{marginLeft: 10}}>
              <Text h5 bold>
                {item.user}
              </Text>
              <Text h5>{getTimeAgo(item.created_at)}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => handleMenuOpen(item.id)}>
            <View
              ref={ref => {
                if (ref) iconRefs.current[item.id] = ref;
              }}
              collapsable={false} // important for Android
            >
              <Icon
                name="dots-three-vertical"
                type="entypo"
                size={20}
                color="#777"
              />
            </View>
          </TouchableOpacity>
          {menuVisible && selectedItemId === item.id && (
            <MenuModal
              isVisible={menuVisible}
              onClose={() => handleMenuOptionClick()}
              options={menuOptions}
              position={menuPosition}
            />
          )}
          <Modal visible={showReportModal} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={() => setShowReportModal(false)}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableWithoutFeedback>
                  <View
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: 16,
                      padding: 20,
                      width: '85%',
                      // elevation: 5, // Android shadow
                      shadowColor: '#000', // iOS shadow
                      shadowOffset: {width: 0, height: 2},
                      shadowOpacity: 0.25,
                      shadowRadius: 4,
                    }}>
                    <Text h5 bold style={{marginBottom: 15}}>
                      Report Content
                    </Text>

                    {['Spam', 'Inappropriate', 'Harassment', 'Other'].map(
                      reason => (
                        <TouchableOpacity
                          key={reason}
                          onPress={() => setSelectedReason(reason)}
                          style={{
                            padding: 10,
                            backgroundColor:
                              selectedReason === reason ? '#e0e0e0' : '#f9f9f9',
                            borderRadius: 6,
                            marginBottom: 10,
                          }}>
                          <Text h5>{reason}</Text>
                        </TouchableOpacity>
                      ),
                    )}

                    <PrimaryButton
                      title="Report"
                      disabled={!selectedReason}
                      onPress={() => {
                        reportPost(selectedItemId, selectedReason);
                        setShowReportModal(false);
                        setSelectedReason(null);
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => setShowReportModal(false)}
                      style={{marginTop: 10}}>
                      <Text style={{color: 'red', textAlign: 'center'}}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>

        {/* Media Section: Image or Video */}
        <View
          style={{
            width: screenWidth,
            height: finalMediaHeight,
            backgroundColor: isImage ? '#fff' : '#000',
          }}>
          {item.media_url && typeof item.media_url === 'string' ? (
            isImage ? (
              <Image
                source={{uri: item.media_url}}
                style={{width: '100%', height: '100%'}}
                resizeMode="contain"
              />
            ) : (
              <Video
                source={{uri: item.media_url}}
                style={{width: '100%', height: '100%'}}
                resizeMode="contain"
                controls={true}
                paused={!isFocused || currentPlayingId !== item.id}
                repeat={true}
              />
            )
          ) : (
            <View
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#eee',
              }}>
              <Text style={{color: '#999'}}>Media not available</Text>
            </View>
          )}
        </View>

        {item.caption ? (
          <Text h5 style={styles.caption}>
            {item.caption} {item.hashtags}
          </Text>
        ) : null}
        <View style={{ flex: 1 }}>
      {/* <View style={styles.actionIconsContainer}>
      <TouchableOpacity onPress={() => openBottomSheet(item.id)}>
  <Icon name="comment-multiple" size={24} color={'#888'} />
      <Text style={styles.iconCountText}>{item.
comments_count
 || 0}</Text>
</TouchableOpacity>

        <TouchableOpacity onPress={() => Alert.alert('View clicked!')}>
          <Icon name="eye" size={24} color={'#888'} />
              <Text style={styles.iconCountText}>{item.views_count
 || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onShare}>
          <Icon name="share-all" size={24} color={'#888'} />
        </TouchableOpacity>
      </View> */}
<View style={styles.actionIconsContainer}>

  {/* Comment icon and count */}
  <View style={styles.iconWithCount}>
    <TouchableOpacity onPress={() => openBottomSheet(item.id)}>
      <Icon name="comment-multiple" size={24} color={'#888'} />
    </TouchableOpacity>
    <Text h5 bold style={styles.iconCountText}>{item.comments_count || 0}</Text>
  </View>

  {/* View icon and count */}
  <View style={styles.iconWithCount}>
    <TouchableOpacity onPress={() => Alert.alert('View clicked!')}>
      <Icon name="eye" size={24} color={'#888'} />
    </TouchableOpacity>
    <Text h5 bold style={styles.iconCountText}>{item.views_count || 0}</Text>
  </View>

  {/* Share icon (no count) */}
  <TouchableOpacity onPress={onShare}>
    <Icon name="share-all" size={24} color={'#888'} />
  </TouchableOpacity>

</View>

      {/* BottomSheet should be outside of icon container */}
    
    </View>
    </View>
    );
  };

  const AnimatedHeader = ({translateY}) => {
    return (
      <Animated.View style={[styles.header, {transform: [{translateY}]}]}> 
        <Header
          showBack={false}
          title="FAB SPORTS"
          rightComponent={
            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={() => navigation.navigate('uploadreels')}>
                <AntDesign
                  name="plussquareo"
                  size={26}
                  color={theme.$lightText}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => alert('Bell Icon Clicked!')}>
                <Icon name="bell" size={26} color={theme.$lightText} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
                <Icon name="menu" size={26} color={theme.$lightText} />
              </TouchableOpacity>
            </View>
          }
        />
     
      </Animated.View>
    );
  };

  // screen time logger
  const startTimeRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      const startTime = Date.now();
      startTimeRef.current = startTime;

      return () => {
        const endTime = Date.now();
        const timeSpentInSeconds = Math.floor((endTime - startTimeRef.current) / 1000);

        (async () => {
          try {
            await analytics().logEvent("screen_time", {
              screen_name: 'reel_screen',
              duration_seconds: timeSpentInSeconds,
            });
            console.log('Time spent on reelScreen:', timeSpentInSeconds);
          } catch (error) {
            console.log("Analytics failed for reel screen:", error);
          }
        })();
      };
    }, [])
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.$background}, // ✅ dynamic background color
      ]}>
      <AnimatedHeader translateY={translateY} />

      <Animated.FlatList
       data={injectSuggestionsAfterEvery(videos, 4)} 
     keyExtractor={(item, index) =>
    item.id ? item.id.toString() : `suggestion-${index}`
  }
        contentContainerStyle={{paddingTop: HEADER_HEIGHT}}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}
        renderItem={renderItem}
        onEndReached={() => fetchReels(page + 1)}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" /> : null
        }
        showsVerticalScrollIndicator={false}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged.current}
        // ListHeaderComponent={renderHeader}
        //         onScrollBeginDrag={() => {
        //   setMenuVisible(false);
        //   setSelectedItemId(null);
        // }}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
{/* <BottomSheet ref={bottomSheetRef}>
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1 }}
    keyboardVerticalOffset={100} // adjust as needed
  > */}
  
      {/* Static content */}
     

      {/* Input fixed at the bottom */}
      {/* <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type your comment..."
          placeholderTextColor="#999"
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity onPress={() => handleSend(selectedItemId)}>
          <Icon name="send" size={24} color="#007AFF" style={styles.sendIcon} />
        </TouchableOpacity>
      </View>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
       <View style={{  }}>
        <Text>Scrollable content</Text>
        <Text>More content</Text>
      </View>
    </View>
    
  </KeyboardAvoidingView>
</BottomSheet> */}

  {/* <GestureHandlerRootView style={styles.container}> */}
 

    {/* <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      keyboardBehavior={Platform.OS === 'ios' ? 'interactive' : 'extend'}
      keyboardBlurBehavior="restore"
    >
      <BottomSheetView style={{ flex: 1 }}>
        <BottomSheetScrollView
          contentContainerStyle={[styles.sheetContent, { paddingBottom: 100 }]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Scrollable content</Text>
          <Text>Some more content here...</Text>
          <Text>Even more content to demonstrate scroll</Text>
          <Text>Extra line</Text>
          <Text>Another line</Text>
          <Text>Another line</Text>
          <Text>Another line</Text>
          <Text>Another line</Text>
          <Text>Another line</Text>
        </BottomSheetScrollView>

    
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your comment..."
            placeholderTextColor="#999"
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity onPress={() => handleSend(selectedItemId)}>
            <Icon name="send" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet> */}
 {/* <View style={styles.containers}> */}
{/* <Modal
  visible={modalVisible}
  transparent
  animationType="slide"
  onRequestClose={() => setModalVisible(false)}
>
  <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
    <View style={styles.overlay}>
      <TouchableWithoutFeedback onPress={() => {}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalContainer}
        >
          <View style={styles.innerContainer}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeIcon}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>

            <Text style={styles.header}>Comments</Text>

            <View style={styles.inputRow}>
              <TextInput
                value={comment}
                onChangeText={setComment}
                placeholder="Add a comment"
                style={styles.textInput}
              />
           
          <TouchableOpacity onPress={() => handleSend(selectedItemId)} style={styles.sendButton}>
  <Text style={{ color: '#fff' }}>Send</Text>
</TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
</Modal> */}
{/* <View style={styles.containers}>
  <Modal
    visible={modalVisible}
    transparent
    animationType="slide"
    onRequestClose={() => setModalVisible(false)}
  >
    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalContainer}
          >
            <View style={styles.innerContainer}>
            
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeIcon}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>

              <Text style={styles.header}>Comments</Text>

              
          <View style={{ flex: 1 }}>
  {comments.length > 0 ? (
    <FlatList
      data={comments}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <Text style={styles.commentText}>{item}</Text>
      )}
      contentContainerStyle={{ paddingBottom: 10 }}
      showsVerticalScrollIndicator={true}
    />
  ) : (
    <View style={styles.noCommentsContainer}>
      <Text style={styles.noCommentsText}>Not commented yet</Text>
    </View>
  )}
</View>

            
              <View style={styles.inputRow}>
                <TextInput
                  value={comment}
                  onChangeText={setComment}
                  placeholder="Add a comment"
                  style={styles.textInput}
                />
                <TouchableOpacity
                  onPress={() => handleSend(selectedItemId)}
                  style={styles.sendButton}
                >
                  <Text style={{ color: '#fff' }}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
</View> */}
 <CommentInterface
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  comments={selectedVideo?.comments || []}
  onAddComment={(text) => handleSend(selectedItemId, text)}
renderItem={({ item }) => {
  const dateObj = new Date(item.created_at);
  const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = dateObj.toLocaleDateString([], {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
        paddingHorizontal: 10,
        backgroundColor:"#f2f3f4"
      }}
    >
      {/* Left side: User + Comment */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: 'bold', color: '#222' }}>{item.user}</Text>
        <Text style={{ color: '#333', marginTop: 2 }}>{item.text}</Text>
      </View>

      {/* Right side: Time + Date */}
      <View style={{ alignItems: 'flex-end', marginLeft: 12 }}>
        <Text style={{ fontSize: 12, color: '#666' }}>{timeString}</Text>
        <Text style={{ fontSize: 12, color: '#999',marginTop: 2 }}>{dateString}</Text>
      </View>
    </View>
  );
}}


/>
    {/* </GestureHandlerRootView> */}
{/* </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  


  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
  },
  itemText: {
    fontSize: 16,
  },
 
  sheetText: {
    fontSize: 16,
    marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
actionIconsContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10, // or use marginRight inside each block if not supported
  paddingHorizontal:16
},

iconWithCount: {
  flexDirection: 'row',
  alignItems: 'center',
  marginRight: 12, // spacing between groups
},

iconCountText: {
  marginLeft: 4,

},
  postContainer: {
    bottom: 60,
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
    // fontSize: 14,
    // color: '#333',
  },
  header: {
    position: 'absolute',
    top: 0,
    // height: HEADER_HEIGHT,
    left: 0,
    right: 0,
    // backgroundColor: '#fff',
    zIndex: 10,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // paddingHorizontal: 16,
    // borderBottomWidth: 1,
    // borderColor: '#ddd',
  },
   contentContainer: {
  flex: 1,
justifyContent: 'flex-end'
  },

  iconBtn: {
    marginTop: 60,
    marginLeft: 20,
  },

  title: {
    fontSize: 16,
    marginBottom: 8,
  },
  containers: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    // backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '100%',
    height: '70%', // 70% height of the screen
    justifyContent: 'flex-end',
    // top:20
  },
  innerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  closeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  commentText: {
    fontSize: 15,
    color: '#333',
    paddingVertical: 6,
  },
  noCommentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCommentsText: {
    fontSize: 16,
    color: '#999',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },



});

export default HomeScreen;
