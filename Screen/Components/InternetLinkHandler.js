import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import {  StatusBar } from 'react-native';


function sleep(timeout: number) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

async function openLink(linkTarget) 
{
  // const {url, statusBarStyle} = this.state;
  try {
    if (await InAppBrowser.isAvailable()) {
      // A delay to change the StatusBar when the browser is opened
      const animated = true;
      const delay = animated && Platform.OS === 'ios' ? 400 : 0;
      setTimeout(() => StatusBar.setBarStyle('light-content'), delay);
      await InAppBrowser.open(linkTarget, {
        // iOS Properties
        dismissButtonStyle: 'cancel',
        preferredBarTintColor: '#453AA4',
        preferredControlTintColor: 'white',
        readerMode: true,
        animated,
        modalPresentationStyle: 'fullScreen',
        modalTransitionStyle: 'flipHorizontal',
        modalEnabled: true,
        enableBarCollapsing: true,
        // Android Properties
        showTitle: true,
        toolbarColor: '#6200EE',
        secondaryToolbarColor: 'black',
        enableUrlBarHiding: true,
        enableDefaultShare: true,
        forceCloseOnRedirection: false,
        // Specify full animation resource identifier(package:anim/name)
        // or only resource name(in case of animation bundled with app).
        animations: {
          startEnter: 'slide_in_right',
          startExit: 'slide_out_left',
          endEnter: 'slide_in_left',
          endExit: 'slide_out_right',
        },
        headers: {
          'my-custom-header': 'my custom header value',
        },
        hasBackButton: true,
        browserPackage: null,
        showInRecents: false
      });
      // A delay to show an alert when the browser is closed
      await sleep(800);
    } else {
      Linking.openURL(linkTarget);
    }
  } catch (error) {
  } finally {
    // Restore the previous StatusBar of the App
    // console.log(linkTarget);
    StatusBar.setBarStyle('dark-content');
  }
}

export const InternetLinkHandler = (targetLink)=>{
     openLink(targetLink);
}