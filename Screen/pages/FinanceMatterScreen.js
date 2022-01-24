import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';

import {ACCESS_API} from '@env';
import Loader from '../Components/loader';
import AESEncryption from '../Components/AESEncryption';

const assets = {
  arrowLeft: require('../../Image/arrow-left.png'),
  emptyIcon: require('../../Image/empty-data.png'),
  topBar: require('../../Image/top-bar.png'),
};

const FinanceMatterScreen = ({navigation}) => {
  const [data, setData] = useState([]);
  const [token, setToken] = useState('');
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    AsyncStorage.getItem('user_id').then((value) => {
      AESEncryption('decrypt', value).then((res) => {
        setToken('' + JSON.parse(res).data.Token);
        const dataSend = {Token: '' + JSON.parse(res).data.Token};
        const formBody = [];
        for (let key in dataSend) {
          const encodedKey = encodeURIComponent(key);
          const encodedValue = encodeURIComponent(dataSend[key]);
          formBody.push(encodedKey + '=' + encodedValue);
        }

        const url = `${ACCESS_API}/financematterinfo`;
        const urlParams = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: formBody.join('&'),
        };
        const fetchFinanceMatter = fetch(url, urlParams)
          .then((response) => {
            return response.json();
          })
          .then((json) => {
            setData(json);
            setLoading(false);
          })
          .catch(() => {
            setData([]);
            setLoading(false);
          });
        return fetchFinanceMatter;
      });
    });
    setLoading(false);
  }, []);

  const Item = ({OverdueDate, Company, Reminder, Description}) => {
    return (
      <View style={styles.item}>
        <View style={styles.tagItem} />
        <Text style={styles.date}>{OverdueDate}</Text>
        <Text style={styles.company}>{Company}</Text>
        <Text style={styles.reminder}>{Reminder}</Text>
        <Text style={styles.description}>{Description}</Text>
        <View>
          <TouchableOpacity style={styles.viewPdfButton} onPress={() => {}}>
            <Ionicons raised name="md-open-outline" size={18} color="#00854F" />
            <Text style={styles.textPdfButton}>View PDF</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderListItem = ({item}) => {
    return (
      <Item
        OverdueDate={item.OverdueDate}
        Company={item.Company}
        Reminder={item.Reminder}
        Description={item.Description}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <Loader loading={isLoading} />
      <KeyboardAvoidingView>
        <Image source={assets.topBar} />
        <View style={styles.viewOpacity}>
          <TouchableOpacity
            style={styles.iconTouch}
            onPress={() => navigation.goBack()}>
            <Image source={assets.arrowLeft} />
          </TouchableOpacity>
          <Text style={styles.textBar}>Finance Matter</Text>
        </View>
        <View style={styles.viewObject}>
          {data.length !== 0 ? (
            <FlatList
              data={data.Data}
              nestedScrollEnabled={true}
              renderItem={renderListItem}
              keyExtractor={(item) => item.FinanceMatterID}
            />
          ) : (
            <View style={styles.emptyData}>
              <Image source={assets.emptyIcon} />
              <Text style={styles.emptyText}>No data is available now</Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewOpacity: {
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
  },
  iconTouch: {
    left: 0,
    marginTop: 28,
    marginLeft: 28,
    position: 'absolute',
  },
  textBar: {
    color: '#FDFDFD',
    marginTop: 28,
    fontSize: 20,
    fontFamily: 'HelveticaNeue-Bold',
  },
  item: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 32,
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
  reminder: {
    paddingTop: 20,
    fontSize: 14,
    fontFamily: 'HelveticaNeue-Bold',
    fontWeight: 'bold',
    lineHeight: 12,
    paddingLeft: 28,
    paddingRight: 28,
  },
  description: {
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
  viewObject: {
    paddingTop: 32,
    paddingLeft: 32,
    paddingRight: 32,
  },
  emptyData: {
    paddingVertical: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    paddingTop: 20,
    textAlign: 'center',
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
