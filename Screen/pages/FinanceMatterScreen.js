import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Alert,
  Image,
  Modal,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  ToastAndroid,
  TouchableOpacity,
  ActivityIndicator,
  PermissionsAndroid,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
var RNFS = require('react-native-fs');
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-community/async-storage';

import {ACCESS_API} from '@env';
import AESEncryption from '../Components/AESEncryption';

const assets = {
  externalLink: require('../../Image/external-link.png'),
  arrowLeft: require('../../Image/arrow-left.png'),
  chevronDown: require('../../Image/chevron-down.png'),
  emptyIcon: require('../../Image/empty-data.png'),
  download: require('../../Image/download.png'),
  topBar: require('../../Image/top-bar.png'),
  bar: require('../../Image/bar.png'),
};

const {width} = Dimensions.get('window');
const widthMultiplier = width / 400;

const FinanceMatterScreen = ({navigation}) => {
  const [data, setData] = useState([]);
  const [token, setToken] = useState('');
  const [pdfName, setPdfName] = useState('');
  const [pdfStream, setPdfStream] = useState('');
  const [pdfSource, setPdfSource] = useState('');
  const [isPopup, setPopup] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);

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
        const fetchFinanceMatterInfo = fetch(url, urlParams)
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
        return fetchFinanceMatterInfo;
      });
    });
    setLoading(false);
  }, []);

  const handleViewPdf = (financeMatterID, fileName) => {
    setPdfName(fileName);
    setLoading(true);

    const formBody = [];
    const dataSend = {
      Token: '' + token,
      FinanceMatterID: '' + financeMatterID,
    };
    for (let key in dataSend) {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(dataSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
      formBody.push('FinanceMatterID' + '=' + financeMatterID);
    }

    const url = `${ACCESS_API}/financematterfile`;
    const urlParams = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: formBody.join('&'),
    };
    const fetchFinanceMatterFile = fetch(url, urlParams)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        setPdfStream(json.FileData);
        setPdfSource({
          uri: 'data:application/pdf;base64,' + json.FileData,
        });
        setPopup(true);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
    return fetchFinanceMatterFile;
  };

  const Item = ({
    OverdueDate,
    Company,
    Reminder,
    Description,
    FileName,
    FinanceMatterID,
  }) => {
    return (
      <View style={styles.item}>
        <View style={styles.tagItem} />
        <Text style={styles.date}>{OverdueDate}</Text>
        <Text style={styles.company}>{Company}</Text>
        <Text style={styles.reminder}>{Reminder}</Text>
        <Text style={styles.description}>{Description}</Text>
        <View>
          <TouchableOpacity
            style={styles.viewPdfButton}
            onPress={() => {
              handleViewPdf(FinanceMatterID, FileName);
            }}>
            <Image source={assets.externalLink} />
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
        FileName={item.FileName}
        FinanceMatterID={item.FinanceMatterID}
      />
    );
  };

  const androidPath =
    Platform.OS === 'android'
      ? RNFS.DownloadDirectoryPath
      : RNFS.LibraryDirectoryPath;

  const savePdfInAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'April Connect Permission',
          message: 'April Connect needs access to your storage to save the PDF',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        RNFS.writeFile(
          androidPath + '/' + pdfName + '.pdf',
          pdfStream,
          'base64',
        )
          .then(() =>
            ToastAndroid.show(
              'File ' + pdfName + ' successfully saved in ' + androidPath,
              ToastAndroid.LONG,
            ),
          )
          .catch((error) => {
            console.log(error.message);
            ToastAndroid.show('Failed to save file', ToastAndroid.LONG);
          });
        return true;
      } else {
        console.log('Permission Denied');
        return false;
      }
    } catch (error) {
      console.log(error.message);
      return false;
    }
  };

  const savePdfInIOS = async () => {
    const file = RNFetchBlob.fs.dirs.DocumentDir + '/' + pdfName + '.pdf';
    RNFS.writeFile(file, pdfStream, 'base64').then(() => {
      Alert.alert('Download', 'Download Successful', [
        {
          text: 'OK',
          onPress: () => {},
        },
      ]).catch(() => {
        Alert.alert('Download', 'Download Failed', [
          {
            text: 'OK',
            onPress: () => {},
          },
        ]);
      });
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <KeyboardAvoidingView>
        <Modal
          transparent={true}
          animationType="none"
          visible={isPopup}
          onRequestClose={() => {
            setPopup(false);
          }}>
          <View style={styles.pdfPopup}>
            <View style={styles.pdfPopupHeader}>
              <TouchableOpacity
                style={styles.pdfPopupClose}
                onPress={() => {
                  setPopup(false);
                }}>
                <Image source={assets.chevronDown} />
              </TouchableOpacity>
              <View style={styles.pdfPopupHeaderContent}>
                <Text style={styles.pdfPopupTitle} numberOfLines={1}>
                  {pdfName} (Pdf File)
                </Text>
              </View>
              <TouchableOpacity
                style={styles.pdfPopupDownload}
                onPress={() => {
                  Platform.OS === 'android'
                    ? savePdfInAndroid()
                    : savePdfInIOS();
                }}>
                <Image source={assets.download} />
              </TouchableOpacity>
            </View>
            <View style={styles.pdfPopupBody}>
              <Pdf
                style={styles.pdfPopupFile}
                source={pdfSource}
                onLoadComplete={(numberOfPages, filePath) => {
                  console.log(`Number of pages: ${numberOfPages}`, filePath);
                }}
                onPageChanged={(page, numberOfPages) => {
                  console.log(`Current page: ${page}`, numberOfPages);
                }}
                onError={(error) => {
                  console.log(error);
                }}
                onPressLink={(uri) => {
                  console.log('uri =>', uri);
                  console.log(`Link pressed: ${uri}`);
                }}
              />
            </View>
          </View>
        </Modal>
        <Image style={styles.bar} source={assets.bar} />
        <View style={styles.viewOpacity}>
          <TouchableOpacity
            style={styles.iconTouch}
            onPress={() => navigation.goBack()}>
            <Image source={assets.arrowLeft} />
          </TouchableOpacity>
          <Text style={styles.textBar}>Finance Matter</Text>
        </View>
        <View style={styles.viewObject}>
          {isLoading ? (
            <ActivityIndicator
              style={styles.activityIndicator}
              size="large"
              color="#002369"
            />
          ) : data.length > 0 ? (
            <View style={styles.emptyData}>
              <Image source={assets.emptyIcon} />
              <Text style={styles.emptyText}>No data is available now</Text>
            </View>
          ) : (
            <FlatList
              data={data.Data}
              nestedScrollEnabled={true}
              renderItem={renderListItem}
              keyExtractor={(item) => item.FinanceMatterID}
            />
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
    borderRadius: 12,
    borderColor: '#75787C',
  },
  bar: {
    width: '100%',
    height: 120,
    top: -30,
    resizeMode: 'contain',
    borderRadius: 1000,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    transform: [{scaleX: 8 * widthMultiplier}],
  },
  tagItem: {
    left: 0,
    position: 'absolute',
    height: 30,
    width: 3,
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
  viewObject: {
    paddingTop: 32,
    paddingLeft: 32,
    paddingRight: 32,
  },
  activityIndicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '50%',
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
  pdfPopup: {
    flex: 1,
    marginTop: 50,
  },
  pdfPopupHeader: {
    flex: 1,
    paddingBottom: 20,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  pdfPopupBody: {
    flex: 10,
  },
  pdfPopupClose: {
    position: 'absolute',
    left: 32,
    paddingTop: 24,
  },
  pdfPopupHeaderContent: {
    paddingTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    textAlign: 'center',
  },
  pdfPopupTitle: {
    width: 250,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'HelveticaNeue',
  },
  pdfPopupDownload: {
    position: 'absolute',
    right: 32,
    paddingTop: 24,
  },
  pdfPopupFile: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C4C4C4',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default FinanceMatterScreen;
