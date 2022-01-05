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
import EmptyIcon from 'AnRNApp/Image/svg_logo/emptystate_noresults.svg';

const {width} = Dimensions.get('window');
const widthMultiplier = width / 400;

// const DATA = [
//   {
//     id: '1',
//     title: '1st - Reminder',
//   },
//   {
//     id: '2',
//     title: '2nd - Reminder',
//   },
//   {
//     id: '3',
//     title: '3rd - Reminder',
//   },
// ];

const Item = ({title}) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const FinanceMatterScreen = ({navigation}) => {
  const [loading] = useState(false);
  const [, setFontScale] = useState(1);
  const [itemList, setItemList] = useState([]);

  const goBackToPage = () => {
    navigation.goBack();
  };

  DeviceInfo.getFontScale().then((fontScaleTemp) => {
    setFontScale(fontScaleTemp);
  });

  const renderItem = ({item}) => {
    return (
      <View style={styles.renderItemView} key="">
        <TouchableOpacity style={styles.itemTouch}>
          <Item title={item.title} />
        </TouchableOpacity>
      </View>
    );
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
        {itemList.length === 0 ? (
          <View>
            <EmptyIcon style={styles.emptyIcon} width={300} height={140} />
            <Text style={styles.emptyText}>No data is available now</Text>
          </View>
        ) : (
          <FlatList
            data={itemList}
            renderItem={renderItem}
            keyExtractor={(index) => 'ItemList_' + index.toString()}
          />
        )}
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
  emptyIcon: {
    marginTop: 20,
    alignSelf: 'center',
    alignItems: 'center',
  },
  emptyText: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  renderItemView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    minHeight: 56,
    marginRight: width <= 360 || 1 > 1.2 ? 7 : 30,
    marginLeft: width <= 360 || 1 > 1.2 ? 7 : 30,
    color: '#000000',
    marginBottom: 10,
    marginTop: 10,
  },
});

export default FinanceMatterScreen;
