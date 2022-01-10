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
import Ionicons from 'react-native-vector-icons/Ionicons';

import Loader from './../Components/loader';
import EmptyIcon from 'AnRNApp/Image/svg_logo/emptystate_noresults.svg';

const {width} = Dimensions.get('window');
const widthMultiplier = width / 400;
const API = 'https://m.averis.biz/WebApi1/access/api';

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

const FinanceMatterScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [, setFontScale] = useState(1);
  const [tokenValue, setTokenValue] = useState('');
  const [pdfItemName, setPdfItemName] = useState('');
  const [pdfString, setPdfString] = useState('');
  const [pdfSource, setPdfSource] = useState({});
  const [
    isLoadingPopupSendConfirmation,
    setLoadingPopupSendConfirmation,
  ] = useState(false);

  DeviceInfo.getFontScale().then((fontScaleTemp) => {
    setFontScale(fontScaleTemp);
  });

  const goBackToPage = () => {
    navigation.goBack();
  };

  const Item = ({date, company, title, subTitle}) => (
    <View style={styles.item}>
      <View style={styles.tagItem} />
      <Text style={styles.date}>{date}</Text>
      <Text style={styles.company}>{company}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subTitle}>{subTitle}</Text>
      <View>
        <TouchableOpacity
          style={styles.viewPdfButton}
          onPress={() => {
            handleViewPdf(Item.ID, Item.title);
          }}>
          <Ionicons raised name="md-open-outline" size={18} color="#00854F" />
          <Text style={styles.textPdfButton}>View PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFinanceMatterItem = ({item}) => {
    return (
      <Item
        date={item.date}
        company={item.company}
        title={item.title}
        subTitle={item.subTitle}
      />
    );
  };

  const handleViewPdf = (id, title) => {
    setLoading(true);
    setPdfItemName(title);

    const data = {Token: '' + tokenValue};
    const body = [];
    for (let key in data) {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(data[key]);
      body.push(encodedKey + '=' + encodedValue);
      body.push('ID' + '=' + id);
    }

    const url = `${API}/productcataloguefile`;
    fetch(url, {
      method: 'POST',
      body: body.join('&'),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setPdfString(json[0].FileData);
        setPdfSource({uri: 'data:application/pdf;base64,' + json[0].FileData});
        setLoadingPopupSendConfirmation(true);
        setLoading(false);
      })
      .catch((error) => console.error(error));

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loader loading={loading} />
      <Image source={require('AnRNApp/Image/bar.png')} style={styles.imgBar} />
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
          nestedScrollEnabled={true}
          renderItem={renderFinanceMatterItem}
          keyExtractor={(item) => item.id}
        />
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
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingBottom: 20,
    marginVertical: 16,
    marginHorizontal: 32,
    borderRadius: 16,
    borderWidth: 0.4,
    borderColor: '#75787C',
  },
  tagItem: {
    position: 'absolute',
    height: 30,
    marginTop: 22,
    borderBottomRightRadius: 2,
    borderTopRightRadius: 2,
    backgroundColor: '#00854F',
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
    paddingBottom: 20,
    borderBottomWidth: 0.4,
    borderBottomColor: '#75787C',
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
  viewPdfButton: {
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textPdfButton: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#00854F',
    paddingLeft: 4,
    fontFamily: 'HelveticaNeue',
  },
});

export default FinanceMatterScreen;
