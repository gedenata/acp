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

import Loader from './../Components/loader';

const {width} = Dimensions.get('window');
const widthMultiplier = width / 400;

const DATA = [
  {
    id: '1',
    title: '1st - Reminder',
  },
  {
    id: '2',
    title: '2nd - Reminder',
  },
  {
    id: '3',
    title: '3rd - Reminder',
  },
];

const Item = ({title}) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const FinanceMatterScreen = ({navigation}) => {
  const [loading] = useState(false);
  const [, setFontScale] = useState(1);

  const goBackToPage = () => {
    navigation.goBack();
  };

  DeviceInfo.getFontScale().then((fontScaleTemp) => {
    setFontScale(fontScaleTemp);
  });

  const renderItem = ({item}) => {
    <Item title={item.title} />;
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </ScrollView>
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
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: '#d3d3d3',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default FinanceMatterScreen;
