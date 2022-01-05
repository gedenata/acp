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
import Pdf from 'react-native-pdf';

import Loader from './../Components/loader';
import EmptyIcon from 'AnRNApp/Image/svg_logo/emptystate_noresults.svg';

const {width} = Dimensions.get('window');
const widthMultiplier = width / 400;

export const DATA = [
  {
    id: '1',
    date: '21/12/2021',
    company: 'PT. Bintang Obormas Jaya',
    title: '1st Reminder',
    subTitle: '(Payment overdue statement of November)',
  },
  {
    id: '2',
    date: '22/12/2021',
    company: 'PT. Bintang Obormas Jaya',
    title: '2nd Reminder',
    subTitle: '(Payment overdue statement of November)',
  },
  {
    id: '3',
    date: '23/12/2021',
    company: 'PT. Bintang Obormas Jaya',
    title: '3rd Reminder',
    subTitle: '(Payment overdue statement of November)',
  },
];

const source = {
  uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf',
  cache: true,
};

const Item = ({date, company, title, subTitle}) => (
  <View style={styles.item}>
    <Text style={styles.date}>{date}</Text>
    <Text style={styles.company}>{company}</Text>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subTitle}>{subTitle}</Text>
    <View style={styles.borderCard} />
    <View>
      <Pdf
        source={source}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={(error) => {
          console.log(error);
        }}
        onPressLink={(uri) => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={styles.pdf}
      />
    </View>
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
      <Item
        date={item.date}
        company={item.company}
        title={item.title}
        subTitle={item.subTitle}
      />
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
        {DATA.length === 0 ? (
          <View>
            <EmptyIcon style={styles.emptyIcon} width={300} height={140} />
            <Text style={styles.emptyText}>No data is available now</Text>
          </View>
        ) : (
          <FlatList
            data={DATA}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        )}
        {/* {itemList.length === 0 ? (
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
        )} */}
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
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingBottom: 58,
    marginVertical: 25,
    marginHorizontal: 32,
    borderRadius: 16,
    shadowOffset: {width: 10, height: 10},
    shadowColor: 'black',
    shadowOpacity: 0.5,
  },
  date: {
    fontSize: 14,
    fontFamily: 'HelveticaNeue-Bold',
    fontWeight: 'bold',
    lineHeight: 16,
    paddingLeft: 28,
    paddingRight: 28,
  },
  company: {
    color: '#75787C',
    fontSize: 14,
    fontFamily: 'HelveticaNeue',
    fontWeight: 'normal',
    lineHeight: 16,
    paddingLeft: 28,
    paddingRight: 28,
  },
  title: {
    paddingTop: 20,
    fontSize: 14,
    fontFamily: 'HelveticaNeue-Bold',
    fontWeight: 'bold',
    lineHeight: 12,
    paddingLeft: 28,
    paddingRight: 28,
  },
  subTitle: {
    fontSize: 14,
    fontFamily: 'HelveticaNeue',
    fontWeight: 'normal',
    lineHeight: 16,
    paddingLeft: 28,
    paddingRight: 28,
  },
  borderCard: {
    height: 40,
    borderBottomColor: '#75787C',
    borderBottomWidth: 0.2,
  },
  pdf: {
    flex: 1,
    width: 20,
  },
  emptyIcon: {
    marginTop: 64,
    alignSelf: 'center',
    alignItems: 'center',
  },
  emptyText: {
    paddingTop: 18,
    alignSelf: 'center',
    alignItems: 'center',
    color: '#75787C',
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
