import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Image,
  View,
  Text,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {ACCESS_API, CONTACT_US_URL} from '@env';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import LOGOSVG from 'AnRNApp/Image/aprilconnect_horinzontallogo.svg';
import Loader from './../Components/loader';
import {InternetLinkHandler} from './../Components/InternetLinkHandler';

const {width} = Dimensions.get('window');
const widthMultiplier = width / 400;
import AsyncStorage from '@react-native-community/async-storage';
import AESEncryption from './../Components/AESEncryption';
import {
  fetchMarketUpdates,
  checkUnreadMarketUpdates,
  markReadMarketUpdates,
} from './../Components/marketUpdateUtils';

const MoreScreen = ({route, navigation}) => {
  const [unreadMarketUpdates, setUnreadMarketUpdates] = useState(0);
  const [numberOfMarketSurvey, setNumberOfMarketSurvey] = useState(0);
  const [numberOfFinanceMatter, setNumberOfFinanceMatter] = useState(0);
  const [financeMatterEnabled, setFinanceMatterEnabled] = useState(false);
  const [isLoadingNotification, setLoadingNotification] = useState(false);
  const [loading, setLoading] = useState(false);

  const goToPage = (targetPage) => {
    if (targetPage === 'TermsofService') {
      navigation.navigate('TnC');
    } else if (targetPage === 'ContactSupport') {
      InternetLinkHandler(CONTACT_US_URL);
    } else {
      navigation.navigate(targetPage);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);

    (async () => {
      AsyncStorage.getItem('user_id').then((value) => {
        AESEncryption('decrypt', value).then((res) => {
          const dataSend = {Token: '' + JSON.parse(res).data.Token};
          const formBody = [];
          for (let key in dataSend) {
            const encodedKey = encodeURIComponent(key);
            const encodedValue = encodeURIComponent(dataSend[key]);
            formBody.push(encodedKey + '=' + encodedValue);
          }

          const urlParams = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: formBody.join('&'),
          };

          const urlFinanceMatterAPI = `${ACCESS_API}/financematterinfo`;
          const fetchFinanceMatterNumber = fetch(urlFinanceMatterAPI, urlParams)
            .then((response) => {
              return response.json();
            })
            .then((json) => {
              if (json.FinanceMatterEnabled === true) {
                setFinanceMatterEnabled(true);
                setNumberOfFinanceMatter(true);
              } else {
                setFinanceMatterEnabled(false);
              }
              setNumberOfFinanceMatter(json.Data.length);
              setLoading(false);
            })
            .catch(() => {
              setNumberOfFinanceMatter(0);
              setLoading(false);
            });

          const urlMarketSurveyAPI = `${ACCESS_API}/marketsurveyqna`;
          const fetchMarketSurveyNumber = fetch(urlMarketSurveyAPI, urlParams)
            .then((response) => {
              return response.json();
            })
            .then((json) => {
              setNumberOfMarketSurvey(json.length);
              setLoading(false);
            })
            .catch(() => {
              setNumberOfMarketSurvey(0);
              setLoading(false);
            });
          return [fetchFinanceMatterNumber, fetchMarketSurveyNumber];
        });
      });
      await loadMarketUpdates();
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await loadMarketUpdates();
    });

    return unsubscribe;
  }, [navigation]);

  const loadMarketUpdates = async () => {
    const value = await AsyncStorage.getItem('user_id');
    if (value) {
      const respp = await AESEncryption('decrypt', value);
      if (respp) {
        await markReadMarketUpdates();
        await fetchMarketUpdates(JSON.parse(respp).data.Token);
        const marketUpdatesCount = await checkUnreadMarketUpdates();
        setUnreadMarketUpdates(marketUpdatesCount);
      }
    }
  };

  return (
    <SafeAreaView style={styles.mainBody}>
      <Loader loading={loading} />
      <ScrollView>
        <KeyboardAvoidingView enabled>
          <View>
            <Image
              source={require('AnRNApp/Image/bar.png')}
              style={styles.image}
            />
          </View>
          <View style={styles.logoView}>
            <LOGOSVG width={150} height={40} />
          </View>

          {/* For Our Customers */}
          <TouchableOpacity style={styles.menuLabel}>
            <View style={styles.viewLabel}>
              <Text style={styles.textLabel}>For Our Customers</Text>
            </View>
          </TouchableOpacity>

          {/* Market Update */}
          <TouchableOpacity
            style={styles.menuChildLabel}
            onPress={goToPage.bind(this, 'MarketUpdate')}>
            <View style={styles.viewChildIconLabel}>
              <Ionicons
                raised
                name="ios-book-outline"
                size={25}
                color="#00854F"
              />
            </View>
            <View style={styles.viewChildLabel}>
              <Text style={styles.textChildLabel}>Market Update</Text>
            </View>
            {unreadMarketUpdates > 0 ? (
              <View style={styles.viewChildBadge}>
                <Text style={styles.textChildBadge}>{unreadMarketUpdates}</Text>
              </View>
            ) : (
              <></>
            )}
            <View style={styles.viewChildIconNavigate}>
              <Icon raised name="navigate-next" size={21} />
            </View>
          </TouchableOpacity>

          {/* Product Catalogue */}
          <TouchableOpacity
            style={styles.menuChildLabel}
            onPress={goToPage.bind(this, 'ProductCatalogue')}>
            <View style={styles.viewChildIconLabel}>
              <Icon raised name="list-alt" size={28} color="#00854F" />
            </View>
            <View style={styles.viewChildLabel}>
              <Text style={styles.textChildLabel}>Product Catalogue</Text>
            </View>
            <View style={styles.viewChildIconNavigate}>
              <Icon raised name="navigate-next" size={21} />
            </View>
          </TouchableOpacity>

          {/* Rewards */}
          <TouchableOpacity
            style={styles.menuChildLabel}
            onPress={goToPage.bind(this, 'Rewards')}>
            <View style={styles.viewChildIconLabel}>
              <Icon raised name="star-outline" size={28} color="#00854F" />
            </View>
            <View style={styles.viewChildLabel}>
              <Text style={styles.textChildLabel}>Rewards</Text>
            </View>
            <View style={styles.viewChildIconNavigate}>
              <Icon raised name="navigate-next" size={21} />
            </View>
          </TouchableOpacity>

          {/* Finance Matter */}
          {financeMatterEnabled ? (
            <TouchableOpacity
              style={styles.menuChildLabel}
              onPress={goToPage.bind(this, 'FinanceMatter')}>
              <View style={styles.viewChildIconLabel}>
                <Ionicons
                  raised
                  name="receipt-outline"
                  size={25}
                  color="#00854F"
                />
              </View>
              <View style={styles.viewChildLabel}>
                <Text style={styles.textChildLabel}>Finance Matter</Text>
              </View>
              {numberOfFinanceMatter > 0 ? (
                <View style={styles.viewChildBadge}>
                  <Text style={styles.textChildBadge}>
                    {numberOfFinanceMatter}
                  </Text>
                </View>
              ) : (
                <></>
              )}
              <View style={styles.viewChildIconNavigate}>
                <Icon raised name="navigate-next" size={21} />
              </View>
            </TouchableOpacity>
          ) : (
            <></>
          )}

          {/* Market Survey */}
          <TouchableOpacity
            style={styles.menuChildLabel}
            onPress={goToPage.bind(this, 'PulpAndPaperUpdate')}>
            <View style={styles.viewChildIconLabel}>
              <Icon raised name="content-paste" size={28} color="#00854F" />
            </View>
            <View style={styles.viewChildLabel}>
              <Text style={styles.textChildLabel}>Market Survey</Text>
            </View>
            {numberOfMarketSurvey > 0 ? (
              <View style={styles.viewChildBadge}>
                <Text style={styles.textChildBadge}>
                  {numberOfMarketSurvey}
                </Text>
              </View>
            ) : (
              <></>
            )}
            <View style={styles.viewChildIconNavigate}>
              <Icon raised name="navigate-next" size={21} />
            </View>
          </TouchableOpacity>

          {/* Customer Support */}
          <TouchableOpacity
            style={styles.menuChildLabel}
            onPress={goToPage.bind(this, 'CustomerFeedback')}>
            <View style={styles.viewChildIconLabel}>
              <Icon raised name="insert-comment" size={28} color="#00854F" />
            </View>
            <View style={styles.viewChildLabel}>
              <Text style={styles.textChildLabel}>Customer Support</Text>
            </View>
            <View style={styles.viewChildIconNavigate}>
              <Icon raised name="navigate-next" size={21} />
            </View>
          </TouchableOpacity>

          {/* Supports */}
          <TouchableOpacity style={styles.menuLabel}>
            <View style={styles.viewLabel}>
              <Text style={styles.textLabel}>Supports</Text>
            </View>
          </TouchableOpacity>

          {/* Contact Support */}
          <TouchableOpacity
            style={styles.menuChildLabel}
            onPress={goToPage.bind(this, 'ContactSupport')}>
            <View style={styles.viewChildIconLabel}>
              <SimpleLineIcons
                raised
                name="earphones-alt"
                size={20}
                color="#00854F"
              />
            </View>
            <View style={styles.viewChildLabel}>
              <Text style={styles.textChildLabel}>Contact Support</Text>
            </View>
            <View style={styles.viewChildIconNavigate}>
              <Icon raised name="navigate-next" size={21} />
            </View>
          </TouchableOpacity>

          {/* Privacy Policy */}
          <TouchableOpacity
            style={styles.menuChildLabel}
            onPress={goToPage.bind(this, 'PhaseTwo')}>
            <View style={styles.viewChildIconLabel}>
              <Icon raised name="privacy-tip" size={20} color="#00854F" />
            </View>
            <View style={styles.viewChildLabel}>
              <Text style={styles.textChildLabel}>Privacy Policy</Text>
            </View>
            <View style={styles.viewChildIconNavigate}>
              <Icon raised name="navigate-next" size={21} />
            </View>
          </TouchableOpacity>

          {/* Terms of Service */}
          <TouchableOpacity
            style={styles.menuChildLabel}
            onPress={goToPage.bind(this, 'TermsofService')}>
            <View style={styles.viewChildIconLabel}>
              <Ionicons
                raised
                name="document-text-outline"
                size={25}
                color="#00854F"
              />
            </View>
            <View style={styles.viewChildLabel}>
              <Text style={styles.textChildLabel}>Terms of Service</Text>
            </View>
            <View style={styles.viewChildIconNavigate}>
              <Icon raised name="navigate-next" size={21} />
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
      {isLoadingNotification ? (
        <View>
          <View>
            <TouchableOpacity
              visible={isLoadingNotification}
              style={styles.notificationViewMore}
              onPress={() => {
                navigation.navigate('More', {notificationText: '', status: ''});
              }}>
              <AntDesign
                name="closesquare"
                size={20}
                color="#686a4a"
                style={styles.notificationCloseIcon}
              />
            </TouchableOpacity>
          </View>
          <View
            visible={isLoadingNotification}
            style={styles.notificationCircle}>
            <AntDesign
              name={
                route.params.status === 'ok' ? 'checkcircle' : 'closecircle'
              }
              size={35}
              color="#FDFDFD"
              style={styles.notificationCircleIcon}
            />
            <Text style={styles.notificationCircleText}>
              {route.params ? route.params.notificationText : ''}
            </Text>
          </View>
        </View>
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: '#fdfdfd',
  },
  image: {
    width: '100%',
    height: 100,
    top: 0,
    resizeMode: 'contain',
    borderRadius: 1000,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    transform: [{scaleX: 7 * widthMultiplier}],
  },
  logoView: {
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
  },
  menuLabel: {
    height: 25,
    marginTop: 20,
    width: '100%',
    right: 2,
    left: 5,
    flexDirection: 'row',
    borderStyle: 'solid',
    borderWidth: 0,
    borderColor: '#dbd4d4',
    borderBottomWidth: 0.4,
  },
  viewLabel: {
    left: 0,
    position: 'absolute',
    marginLeft: 10,
  },
  textLabel: {
    color: '#191E24',
    opacity: 0.6,
    fontWeight: 'bold',
    fontFamily: 'HelveticaNeue-Bold',
  },
  menuChildLabel: {
    height: 45,
    width: '100%',
    right: 2,
    left: 2,
    marginTop: 10,
    flexDirection: 'row',
    borderStyle: 'solid',
    borderWidth: 0,
    borderColor: '#dbd4d4',
    borderBottomWidth: 1,
  },
  viewChildIconLabel: {
    left: 0,
    width: 25,
    marginLeft: 10,
    marginTop: 4,
    marginBottom: 10,
    position: 'absolute',
  },
  viewChildLabel: {
    left: 40,
    position: 'absolute',
    marginLeft: 10,
    marginTop: 8,
    marginBottom: 8,
  },
  textChildLabel: {
    fontFamily: 'HelveticaNeue',
    fontSize: 16,
    lineHeight: 24,
  },
  viewChildIconNavigate: {
    right: 0,
    marginTop: 10,
    marginBottom: 10,
    position: 'absolute',
    marginRight: 20,
  },
  viewChildBadge: {
    height: 24,
    width: 24,
    borderRadius: 24,
    backgroundColor: '#FF3A3A',
    justifyContent: 'center',
    right: 50,
    marginTop: 10,
    marginBottom: 10,
    position: 'absolute',
  },
  textChildBadge: {
    fontFamily: 'HelveticaNeue-Bold',
    fontSize: 14,
    lineHeight: 24,
    textAlign: 'center',
    color: '#FFF',
  },
  notificationViewMore: {
    bottom: 60,
    right: 10,
    position: 'absolute',
    height: 20,
    width: 20,
  },
  notificationCloseIcon: {
    borderRadius: 5,
  },
  notificationCircle: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    height: 50,
    borderRadius: 7,
    backgroundColor: '#686a4a',
    paddingTop: 10,
    paddingBottom: 10,
  },
  notificationCircleIcon: {
    margin: 6,
    marginLeft: 10,
    position: 'absolute',
  },
  notificationCircleText: {
    color: '#FDFDFD',
    position: 'absolute',
    left: 60,
    right: 60,
    top: 7,
    fontSize: 12,
  },
});

export default MoreScreen;
