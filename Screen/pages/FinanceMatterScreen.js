import React, {useState} from 'react';
import {
  Image,
  Dimensions,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DeviceInfo from 'react-native-device-info';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Loader from './../Components/loader';

const {width} = Dimensions.get('window');
const widthMultiplier = width / 400;

const FinanceMatterScreen = ({route, navigation}) => {
  const [loading] = useState(false);
  const [, setFontScale] = useState(1);
  const [itemList, setItemList] = useState([]);

  const goBackToPage = () => {
    navigation.goBack();
  };

  DeviceInfo.getFontScale().then((fontScaleTemp) => {
    setFontScale(fontScaleTemp);
  });

  return (
    <SafeAreaView>
      <Loader loading={loading} />
      <ScrollView>
        <Image
          source={require('AnRNApp/Image/bar.png')}
          style={styles.imgBar}
        />
        <View style={styles.viewOpacity}>
          <TouchableOpacity style={styles.iconTouch} onPress={goBackToPage}>
            <Icon raised name="arrow-left" size={30} color="#FDFDFD" />
          </TouchableOpacity>
          <Text style={styles.textBar}>Finance Matter</Text>
        </View>
        {itemList.length === 0 ? (
          <View>
            <Text style={{padding: 120}}>No data is available now</Text>
          </View>
        ) : (
          <FlatList data={itemList} />
        )}
      </ScrollView>
      {route.params ? (
        route.params.notificationText !== '' ? (
          <View>
            <TouchableOpacity>
              <AntDesign name="closesquare" size={20} color="#00854F" />
            </TouchableOpacity>
          </View>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imgBar: {
    width: '100%',
    height: 100,
    top: -30,
    resizeMode: 'contain',
    borderRadius: 1000,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    transform: [{scaleX: 8 * widthMultiplier}],
  },
  viewOpacity: {
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
  },
  iconTouch: {
    position: 'absolute',
    left: 0,
    marginLeft: 10,
    marginTop: 4,
  },
  textBar: {
    marginTop: 7,
    color: '#FDFDFD',
    fontFamily: 'HelveticaNeue-Bold',
    fontSize: 20,
  },
});

export default FinanceMatterScreen;
