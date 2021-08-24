/**
 * @format
 */

import {AppRegistry, BackHandler, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import JailMonkey from 'jail-monkey';
import RNExitApp from 'react-native-exit-app';

AppRegistry.registerComponent(appName, () => (JailMonkey.isJailBroken() ? ((Platform.OS === 'android') ? BackHandler.exitApp() : RNExitApp.exitApp()) : App));
