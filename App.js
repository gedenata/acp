import React, {useState} from 'react';
import {ACCESS_API} from '@env';
import {View} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';

// import { NavigationContainer,useFocusEffect } from '@react-navigation/native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useIsFocused} from '@react-navigation/native';
import ReactNativeBiometrics from 'react-native-biometrics';

import SplashScreen from './Screen/SplashScreen';
import LoginScreen from './Screen/LoginScreen';
import LoginScreenNext from './Screen/LoginScreenNext';
import LoginPasswordScreen from './Screen/LoginPasswordScreen';
import CreatePasswordScreen from './Screen/CreatePasswordScreen';
import LoadingScreen from './Screen/LoadingScreen';
import TnCScreen from './Screen/TnCScreen';

import HomeScreen from './Screen/pages/HomeScreen';
import DetailsScreen from './Screen/pages/DetailsScreen';
import DetailsScreenNext from './Screen/pages/DetailsScreenNext';
import AllOrdersScreen from './Screen/pages/AllOrdersScreen';
import ProfileScreen from './Screen/pages/ProfileScreen';
import TnCFromMoreScreen from './Screen/pages/TnCFromMoreScreen';
import ChangePasswordScreen from './Screen/pages/ChangePasswordScreen';
import MoreScreen from './Screen/pages/MoreScreen';
import SearchScreen from './Screen/pages/SearchScreen';
import SearchOrdersResultScreen from './Screen/pages/SearchOrdersResultScreen';
import SearchOrdersResultETAProductDescScreen from './Screen/pages/SearchOrdersResultETAProductDescScreen';
import PhaseTwoScreen from './Screen/pages/PhaseTwoScreen';
import CustomerFeedbackScreen from './Screen/pages/CustomerFeedbackScreen';
import ProductCatalogueScreen from './Screen/pages/ProductCatalogueScreen';
import ProductCatalogueDetailScreen from './Screen/pages/ProductCatalogueDetailScreen';
import ProductCatalogueSearchScreen from './Screen/pages/ProductCatalogueSearchScreen';
import PulpAndPaperUpdateScreen from './Screen/pages/PulpAndPaperUpdateScreen';
import SurveyQuestionScreen from './Screen/pages/SurveyQuestionScreen';
import RewardsScreen from './Screen/pages/RewardsScreen';
import MarketUpdateScreen from './Screen/pages/MarketUpdateScreen';
import MarketUpdateDetailScreen from './Screen/pages/MarketUpdateDetailScreen';
import SetupBiometricsScreen from './Screen/pages/SetupBiometricsScreen';
import BiometricAuthenticationScreen from './Screen/pages/BiometricAuthenticationScreen';
import FinanceMatterScreen from './Screen/pages/FinanceMatterScreen';

import AESEncryption from './Screen/Components/AESEncryption';

import AsyncStorage from '@react-native-community/async-storage';
import {
  fetchMarketUpdates,
  checkUnreadMarketUpdates,
} from './Screen/Components/marketUpdateUtils';
import {
  fetchFinanceMatter,
  checkUnreadFinanceMatter,
} from './Screen/Components/financeMatterUtils';

const navigationRef = React.createRef();

const Stack = createStackNavigator();
const RootStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const [unreadMarketUpdates, setUnreadMarketUpdates] = useState(-1);
  const [numberOfFinanceMatter, setNumberOfFinanceMatter] = useState(-1);
  const [numberOfRemindedSurvey, setNumberOfRemindedSurvey] = useState(-1);
  const [biometricKeyExists, setBiometricKeyExists] = useState(false);
  const [biometricsNotSupported, setBiometricsNotSupported] = useState(false);

  const checkUpdate = async (fromMoreStack) => {
    const {keysExist} = await ReactNativeBiometrics.biometricKeysExist();
    setBiometricKeyExists(keysExist);
    const biometrics_not_supported = await AsyncStorage.getItem(
      'biometrics_not_supported',
    );
    setBiometricsNotSupported(biometrics_not_supported === 'true');
    AsyncStorage.getItem('user_id').then((value) => {
      AESEncryption('decrypt', value).then(async (respp) => {
        const dataSend = {Token: JSON.parse(respp).data.Token};
        const formBody = [];
        for (let key in dataSend) {
          const encodedKey = encodeURIComponent(key);
          const encodedValue = encodeURIComponent(dataSend[key]);
          formBody.push(encodedKey + '=' + encodedValue);
        }

        const urlFinanceMatterAPI = `${ACCESS_API}/financematterinfo`;
        const urlMarketSurveyAPI = `${ACCESS_API}/marketsurveyqna`;
        const urlParams = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: formBody.join('&'),
        };
        fetch(urlMarketSurveyAPI, urlParams)
          .then((response) => response.json())
          .then((json) => {
            setNumberOfRemindedSurvey(json.length);
          });
        if (!fromMoreStack) {
          await fetchMarketUpdates(JSON.parse(respp).data.Token);
          const marketUpdatesCount = await checkUnreadMarketUpdates();
          setUnreadMarketUpdates(marketUpdatesCount);
          await fetchFinanceMatter(JSON.parse(respp).data.Token);
          const financeMaterCount = await checkUnreadFinanceMatter();
          setNumberOfFinanceMatter(financeMaterCount);
        }
      });
    });
  };

  const SplashStack = () => {
    return (
      <Stack.Navigator
        initialRouteName="More"
        screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{title: 'Setting Page'}}
        />
      </Stack.Navigator>
    );
  };

  function LoginStack() {
    return (
      <Stack.Navigator
        initialRouteName="More"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      </Stack.Navigator>
    );
  }

  function LoginNextStack() {
    return (
      <Stack.Navigator
        initialRouteName="More"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="LoginScreenNext" component={LoginScreenNext} />
        <Stack.Screen name="CreatePassword" component={CreatePasswordScreen} />
        <Stack.Screen name="LoginPassword" component={LoginPasswordScreen} />
        <Stack.Screen
          name="SetupBiometrics"
          component={SetupBiometricsScreen}
        />
      </Stack.Navigator>
    );
  }

  function TnCStack() {
    return (
      <Stack.Navigator
        initialRouteName="More"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="TnCScreen" component={TnCScreen} />
        <Stack.Screen name="LoginPassword" component={LoginPasswordScreen} />
        <Stack.Screen name="CreatePassword" component={CreatePasswordScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    );
  }

  function LoginPasswordStack() {
    return (
      <Stack.Navigator
        initialRouteName="More"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="LoginPasswordScreen"
          component={LoginPasswordScreen}
        />
        <Stack.Screen name="CreatePassword" component={CreatePasswordScreen} />
      </Stack.Navigator>
    );
  }

  function LoadingStack() {
    return (
      <Stack.Navigator
        initialRouteName="More"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
      </Stack.Navigator>
    );
  }

  function DrawerNavigationRoutesStack() {
    return (
      <Tab.Navigator
        initialRouteName="Feed"
        tabBarOptions={{
          activeTintColor: '#27408B',
        }}>
        <Tab.Screen
          name="HomeStack"
          component={HomeStack}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="SearchStack"
          component={SearchStack}
          options={{
            tabBarLabel: 'Search',
            tabBarIcon: ({color, size}) => (
              <MaterialIcons name="search" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="ProfileStack"
          component={ProfileStack}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({color, size}) => (
              <View>
                {biometricKeyExists || biometricsNotSupported ? (
                  <></>
                ) : (
                  <Entypo
                    name="dot-single"
                    color="#FF3A3A"
                    size={25}
                    style={{position: 'absolute', right: -10, top: -10}}
                  />
                )}
                <MaterialIcons
                  name="account-circle"
                  color={color}
                  size={size}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="MoreStack"
          component={MoreStack}
          options={{
            tabBarLabel: 'More',
            tabBarIcon: ({color, size}) => (
              <View>
                {numberOfRemindedSurvey > 0 ||
                unreadMarketUpdates > 0 ||
                numberOfFinanceMatter > 0 ? (
                  <Entypo
                    name="dot-single"
                    color="#FF3A3A"
                    size={25}
                    style={{position: 'absolute', right: -10, top: -10}}
                  />
                ) : (
                  <></>
                )}
                <MaterialIcons name="more-horiz" color={color} size={size} />
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  function HomeStack() {
    let isFocused = useIsFocused();
    if (isFocused) {
      checkUpdate();
      return (
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="AllOrders"
            component={AllOrdersScreen}
            options={({navigation, route}) => ({
              title: 'My Orders',
              headerShown: true,
              headerLeft: (props) => (
                <MaterialIcons
                  name="arrow-back"
                  size={30}
                  style={{marginLeft: 5}}
                  onPress={() => navigation.navigate('Home')}
                  color="#000000"
                />
              ),
            })}
          />
          <Stack.Screen name="Details" component={DetailsScreen} />
          <Stack.Screen name="DetailsNext" component={DetailsScreenNext} />
          <Stack.Screen
            name="SurveyQuestion"
            component={SurveyQuestionScreen}
          />
        </Stack.Navigator>
      );
    } else {
      return <></>;
    }
  }

  function SearchStack() {
    let isFocused = useIsFocused();
    if (isFocused) {
      checkUpdate();
    }
    return (
      <Stack.Navigator
        initialRouteName="Search"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="DetailsNext" component={DetailsScreenNext} />
        <Stack.Screen
          name="SearchResult"
          component={SearchOrdersResultScreen}
          options={{
            title: 'Search Results',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="SearchResultETAProductDesc"
          component={SearchOrdersResultETAProductDescScreen}
          options={{
            title: 'Search Results',
            headerShown: true,
          }}
        />
      </Stack.Navigator>
    );
  }

  function MoreStack() {
    let isFocused = useIsFocused();
    if (isFocused) {
      checkUpdate(true);
    }
    return (
      <Stack.Navigator
        initialRouteName="More"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="More" component={MoreScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="TnC" component={TnCFromMoreScreen} />
        <Stack.Screen
          name="ProductCatalogue"
          component={ProductCatalogueScreen}
        />
        <Stack.Screen
          name="ProductCatalogueDetail"
          component={ProductCatalogueDetailScreen}
        />
        <Stack.Screen
          name="ProductCatalogueSearch"
          component={ProductCatalogueSearchScreen}
        />
        <Stack.Screen
          name="CustomerFeedback"
          component={CustomerFeedbackScreen}
        />
        <Stack.Screen
          name="PulpAndPaperUpdate"
          component={PulpAndPaperUpdateScreen}
        />
        <Stack.Screen name="MarketUpdate" component={MarketUpdateScreen} />
        <Stack.Screen
          name="MarketUpdateDetail"
          component={MarketUpdateDetailScreen}
        />
        <Stack.Screen
          name="SurveyQuestion"
          component={SurveyQuestionScreen}
          options={{
            headerShown: false,
            tabBarVisible: false,
          }}
        />
        <Stack.Screen name="Rewards" component={RewardsScreen} />
        <Stack.Screen name="FinanceMatter" component={FinanceMatterScreen} />
        <Stack.Screen name="PhaseTwo" component={PhaseTwoScreen} />
      </Stack.Navigator>
    );
  }

  function ProfileStack() {
    let isFocused = useIsFocused();
    if (isFocused) {
      checkUpdate();
    }
    return (
      <Stack.Navigator
        initialRouteName="Profile"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen
          name="BiometricAuthentication"
          component={BiometricAuthenticationScreen}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator>
        <RootStack.Screen
          name="SplashStack"
          component={SplashStack}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="LoginStack"
          component={LoginStack}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="LoginNextStack"
          component={LoginNextStack}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="LoginPasswordStack"
          component={LoginPasswordStack}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="LoadingStack"
          component={LoadingStack}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="DrawerNavigationRoutesStack"
          component={DrawerNavigationRoutesStack}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="TnCStack"
          component={TnCStack}
          options={{headerShown: false}}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
