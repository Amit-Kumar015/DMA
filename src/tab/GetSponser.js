import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import useTheme from '../hooks/useTheme';
import Card from '../component/card';
import {Avatar} from 'react-native-elements';
import Text from '../component/Text';
import Header from '../component/header';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Slide from '../assets/slide';
import Custominput from '../component/Custominput';
import ButtonWithPushBack from '../component/Button';
import PrimaryButton from '../component/prButton';
import Checkbox from '../component/checkbox';

const GetSponser = () => {
  const {theme} = useTheme();
  const [step, setStep] = useState(0);
  const [profilePic, setProfilePic] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [sportsName, setSportsName] = useState('');
  const [achievement1, setAchievement1] = useState('');
  const [achievement2, setAchievement2] = useState('');
  const [achievement3, setAchievement3] = useState('');
  const [selectedSponsorTypeId, setSelectedSponsorTypeId] = useState(null);
  const [selectedProductTypeId, setSelectedProductTypeId] = useState(null);

  const sponserData = [
    {id: '1', name: 'Professional Athlete'},
    {id: '2', name: 'Fitness Freak'},
    {id: '3', name: 'Sports/Fitness Influencer'},
  ];
  const sponsorTypes = [
    {id: 1, name: 'Corporate'},
    {id: 2, name: 'Government'},
    {id: 3, name: 'Private Individual'},
  ];
  const productTypes = [
    { id: 1, name: 'Clothing' },
    { id: 2, name: 'Supplements' },
    { id: 3, name: 'Equipment' },
    { id: 4, name: 'Accessories' },
  ];



  const handlegetSponser = () => {
    const selectedSponsor = sponsorTypes.find(
      type => type.id === selectedSponsorTypeId,
    );

    if (selectedSponsor) {
      console.log('Selected Sponsor Type:', selectedSponsor.name);
    } else {
      console.log('No sponsor type selected.');
    }
    setStep(3);
  };
  const handleSelectRole = roleName => {
    setSelectedRole(roleName);
    setStep(1);
  };

  const handleCreate = () => {
    // Handle create logic here
    console.log('Created:', {
      sportsName,
      achievement1,
      achievement2,
      achievement3,
    });
    setStep(2);
  };

  return (
    <View style={styles.container}>
      {step === 0 && <Header showBack={true} title="Sponsor" />}

      {step === 0 && (
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Avatar
              rounded
              size={wp('25%')}
              source={require('../assets/icon/profiles.png')}
            />
            <Text h4 bold textAliments="center">
              Prince
            </Text>
          </View>
          <Text style={{marginTop: 50}} h4 bold>
            I am,
          </Text>
        </View>
      )}

      {step === 0 && (
        <FlatList
          data={sponserData}
          keyExtractor={item => item.id}
          numColumns={1}
          contentContainerStyle={styles.cardContainer}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleSelectRole(item.name)}>
              <Card third style={styles.card}>
                <Text h5 style={styles.nameText}>
                  {item.name}
                </Text>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}

      {step === 1 && (
        <Slide index={1}>
          <Header
            showBack={true}
            title="Prince"
            customBackEvent={() => setStep(0)}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            style={{flex: 1}}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.stepContainer}>
                <View style={styles.avatarWrapper}>
                  <Avatar
                    size={wp('25%')}
                    rounded
                    overlayContainerStyle={{
                      backgroundColor: theme.$surface,
                      borderColor: theme.$secondaryText,
                      borderWidth: 1,
                    }}
                    source={require('../assets/icon/profiles.png')}
                  />
                  <Text h4 bold textAliments="center">
                    Prince
                  </Text>
                </View>

                {/* <Card
                  third
                  style={{
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 20,
                  }}> */}
                <Text h4 bold textAliments="center">
                  I am a {selectedRole} of
                </Text>
                {/* </Card> */}
              </View>
              <View style={styles.inputContainer}>
                <Custominput
                  placeholder="sport"
                  value={sportsName}
                  onValueChange={setSportsName}
                />

                <Text
                  h4
                  bold
                  textAliments="center"
                  style={{marginVertical: 20}}>
                  3 Highest Achievements
                </Text>

                <Custominput
                  placeholder="Achievement 1"
                  value={achievement1}
                  onValueChange={setAchievement1}
                />
                <Custominput
                  placeholder="Achievement 2"
                  value={achievement2}
                  onValueChange={setAchievement2}
                />
                <Custominput
                  placeholder="Achievement 3"
                  value={achievement3}
                  onValueChange={setAchievement3}
                />
              </View>
            </ScrollView>
            <ButtonWithPushBack customContainerStyle={styles.buttonContainers}>
              <PrimaryButton title="Next" onPress={handleCreate} />
            </ButtonWithPushBack>
          </KeyboardAvoidingView>
        </Slide>
      )}
      {step === 2 && (
        <Slide index={2}>
          <Header
            showBack={true}
            title="Prince"
            customBackEvent={() => setStep(0)}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            style={{flex: 1}}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.stepContainer}>
                <View style={styles.avatarWrapper}>
                  <Avatar
                    size={wp('25%')}
                    rounded
                    overlayContainerStyle={{
                      backgroundColor: theme.$surface,
                      borderColor: theme.$secondaryText,
                      borderWidth: 1,
                    }}
                    source={require('../assets/icon/profiles.png')}
                  />
                  <Text h4 bold textAliments="center">
                    Prince
                  </Text>
                </View>

                {/* <Card
                  third
                  style={{
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 20,
                  }}> */}
                <Text h4 bold textAliments="center">
                  SponserShip Type
                </Text>
                {/* </Card> */}
              </View>
              <View style={{marginTop: 30}}>
                <Text h4 bold style={{top: 10,}}>
                  Select any one
                </Text>
                {sponsorTypes.map(item => (
                  <View
                    key={item.id}
                    style={{marginBottom: 10}}>
                    <Card
                      third
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10,
                        backgroundColor: '#F2F3F4',
                        borderRadius: 10,
                      }}>
                      <Text h4 bold style={{flex: 1}}>
                        {item.name}
                      </Text>
                      <Checkbox
                        checked={selectedSponsorTypeId === item.id}
                        onPress={() => setSelectedSponsorTypeId(item.id)}
                      />
                    </Card>
                  </View>
                ))}
              </View>
            </ScrollView>
            <ButtonWithPushBack customContainerStyle={styles.buttonContainers}>
            <PrimaryButton title="Next" onPress={handlegetSponser} />
          </ButtonWithPushBack>
          </KeyboardAvoidingView>
        </Slide>
      )}
      {step === 3 && (
  <Slide index={3}>
      <Header
            showBack={true}
            title="Prince"
            customBackEvent={() => setStep(0)}
          />

   
<KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            style={{flex: 1}}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.stepContainer}>
                <View style={styles.avatarWrapper}>
                  <Avatar
                    size={wp('25%')}
                    rounded
                    overlayContainerStyle={{
                      backgroundColor: theme.$surface,
                      borderColor: theme.$secondaryText,
                      borderWidth: 1,
                    }}
                    source={require('../assets/icon/profiles.png')}
                  />
                  <Text h4 bold textAliments="center">
                    Prince
                  </Text>
                </View>

                {/* <Card
                  third
                  style={{
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 20,
                  }}> */}
                <Text h4 bold textAliments="center">
                  Product Type
                </Text>
                {/* </Card> */}
              </View>
              <View style={{marginTop: 30}}>
                <Text h4 bold style={{top: 10,}}>
                  Select any one
                </Text>
                {productTypes.map(item => (
                  <View
                    key={item.id}
                    style={{marginBottom: 10}}>
                    <Card
                      third
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10,
                        backgroundColor: '#F2F3F4',
                        borderRadius: 10,
                      }}>
                      <Text h4 bold style={{flex: 1}}>
                        {item.name}
                      </Text>
                      <Checkbox
                        checked={selectedProductTypeId === item.id}
                        onPress={() => setSelectedProductTypeId(item.id)}
                      />
                    </Card>
                  </View>
                ))}
              </View>
            </ScrollView>
            <ButtonWithPushBack customContainerStyle={styles.buttonContainers}>
            <PrimaryButton title="Submit" onPress={handlegetSponser} />
          </ButtonWithPushBack>
          </KeyboardAvoidingView>
  </Slide>
)}

    </View>
  );
};

export default GetSponser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor:"white"
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 20,
    
  },
  avatarWrapper: {
    marginBottom: 20,
    alignItems: 'center',
  },
  cardContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  card: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
    paddingVertical: 16,
  },
  scrollContainer: {
    padding: 20,
  },
  stepContainer: {
    flex: 1,
  },
  inputContainer: {
    marginVertical: 10,
  },
  buttonContainers: {
    paddingHorizontal: 16,
    bottom: 30,
  },
});
