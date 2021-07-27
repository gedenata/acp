import React, { useEffect, useState }  from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Image,  
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,  
} from 'react-native';

import {API_URL} from '@env';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment';

import DeviceInfo from 'react-native-device-info';

const DetailsScreen = ({route, navigation}) => {      

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [dataRows, setDataRows] = useState([]); 

  const [ fontScale, setFontScale ] = useState(1);

  DeviceInfo.getFontScale().then((fontScaleTemp) => {
    setFontScale(fontScaleTemp)
  });        
  
  Moment.locale('en');  

  const goBackToPage = () => {
    navigation.goBack()
  };     

  const showDetailsNext = (assignedValues) => {
    navigation.navigate('DetailsNext', {assignedValues:assignedValues})
  };

  var dataToSend = { SalesOrderID: route.params.SalesOrderID, Token: route.params.TokenValue };  
  var formBody = [];
  for (let key in dataToSend) {
    var encodedKey = encodeURIComponent(key);
    var encodedValue = encodeURIComponent(dataToSend[key]);
    formBody.push(encodedKey + '=' + encodedValue);
  }
  formBody = formBody.join('&');
  var rows = [];        

  useEffect(() => {
    let url = `${API_URL}/WebApi1/access/api/outstanding`;
    fetch(url,{
      method: 'POST',
      body: formBody,      
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then(json => {
          var orderStatus = "";
          var dateToBeDisplayed = "";
          for (var i = 0; i < json.Body.length; i++) {
            if(json.Body[i].ActualDelivered != ""){
              orderStatus="Delivered";
              dateToBeDisplayed = "" + Moment(json.Body[i].ActualDelivered + " 00:00:00.0000000").format('DD MMMM YYYY')
            }
            else if(json.Body[i].ActualShipped != ""){
              orderStatus="Shipped";  
              dateToBeDisplayed = "" + Moment(json.Body[i].ActualShipped + " 00:00:00.0000000").format('DD MMMM YYYY')              
            }
            else if(json.Body[i].ActualProduced != ""){
              orderStatus="Produced";
              dateToBeDisplayed = "" + Moment(json.Body[i].ActualProduced + " 00:00:00.0000000").format('DD MMMM YYYY')              
            }
            else if(json.Body[i].ActualConfirmed != ""){
              orderStatus="Confirmed";
              dateToBeDisplayed = "" + Moment(json.Body[i].ActualConfirmed + " 00:00:00.0000000").format('DD MMMM YYYY')
            }

            json.Body[i].OrderLastStatus = ""+orderStatus;
            json.Body[i].DateToBeDisplayed = ""+dateToBeDisplayed;

            rows.push(
              <View 
                style={{
                  marginTop:0, 
                  marginBottom:5,                  
                }} 
                key={i}
              >
                <View 
                  style={{
                    flexDirection:'row',
                    flex:3,
                    marginTop:2, 
                    minHeight:30,
                    flexWrap:'wrap',
                    color:'#FDFDFD',
                  }}
                >
                  <View 
                    style={{
                      left:'4%',
                      minHeight:27,
                      width:32,
                      backgroundColor:'#00854F',
                      borderRadius:4,
                      marginLeft:25,
                      paddingTop:4,
                      alignItem:'center',
                      textAlign:'center'
                    }}
                  >
                    <Text style={{color:'#FDFDFD', fontWeight:'bold', fontSize:13, textAlign:'center'}}>{i+1}</Text>
                  </View>
                  <View 
                    style={{
                      left:1,
                      minHeight:27,
                      width:112,
                      backgroundColor:'#EA6412',
                      borderRadius:4,
                      marginLeft:3,
                      paddingTop:4,
                      textAlign:'center',
                      alignItem:'center'
                    }}
                  >
                    <Text style={{color:'#FDFDFD', fontWeight:'bold', fontSize:13, textAlign:'center'}}>{orderStatus}</Text>
                  </View>
                  <View 
                    style={{
                      marginLeft:40
                    }}
                  > 
                    <Text style={{color:'#191E2460', fontFamily:'HelveticaNeue', fontSize:14, alignItems:'center'}}>{dateToBeDisplayed}</Text>
                  </View>
                </View>
                <View 
                  style={{
                    justifyContent:'flex-start',
                    flexDirection:'row',
                    color:'#000000',
                    minHeight:45,
                    left:'2%',
                    right:0,
                    alignItems:'center',
                  }}
                >
                  <View style={{ left:0,right:0,bottom:0,marginRight:'0%', top:0, }}>
                    <View
                      style={{ 
                        left:0, 
                        minHeight:45,
                        paddingRight:'20%',
                      }}
                    >
                      <Text 
                        style={{
                          marginTop:1,
                          color:'#000000',
                          marginLeft:56,
                          fontSize:13,
                          textAlign:'justify',
                          flex: 1, 
                          flexWrap: 'wrap', 
                          lineHeight:22
                        }}
                      >{json.Body[i].ProductDesc}</Text>
                    </View>
                    <TouchableOpacity  style={{position:'absolute', right:15}} >
                      <Icon 
                        raised 
                        name="chevron-right" 
                        size={35} 
                        color="#1d1c13" 
                        onPress={showDetailsNext.bind(this,json.Body[i])}
                      />   
                    </TouchableOpacity>
                  </View>
                </View>    
              </View>
            );          
          }
          setData(json);
          setDataRows(rows);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);  

  return (
    <SafeAreaView style={styles.mainBody}>
      <ScrollView>
      {isLoading ? <ActivityIndicator size="large" color="#00ff00"/> : (       
        <View>                 
          <View>    
          <Image
            source={require('AnRNApp/Image/bar.png')}
            style={{
              width: '100%',
              height: 250,
              top:0,
              resizeMode:'contain',
              borderRadius: 1000,
              borderTopLeftRadius:0,
              borderTopRightRadius:0,
              transform: [
                {scaleX: 7}
              ]
            }}
          />
          </View>
          <View style={{ alignItems: 'center', position:'absolute', top:10, left:0, right:0 }}>
              <TouchableOpacity 
                style={{position:'absolute',left:0,marginLeft:20,marginTop:3,}}
                onPress={goBackToPage}
              >
                <Icon raised name="arrow-left" size={30} color="#FDFDFD"/>          
              </TouchableOpacity>
              <Text style={{ marginTop:2,color:'#FDFDFD',fontSize:19}}>
                Order Detail
              </Text>
          </View>
          <View style={{
              justifyContent:'flex-start',
              flexDirection:'column',
              marginTop:50,
              position:'absolute', 
              left:0,
              right:0,
              minHeight:40,
              alignItems:'center',
              flex:2,
            }}
          >
            <View style={{
                justifyContent:'flex-start',
                flexDirection:'row', 
                left:0,
                right:0,
                alignItems:'center',
                flex:2,
                marginBottom:10,
                width:(fontScale > 1.2 ? '90%' : '80%'),
              }}
            >
                <View style={{ minHeight:34,width:2,backgroundColor:'#FDFDFD',marginTop:0}}/>
                <View style={{ left:0,right:0,marginLeft:'10%',marginRight:'20%',  }}>
                  <Text style={{marginTop:1,color:'#FDFDFD',fontWeight:'bold',fontSize:13}}>
                    Order Number {route.params.SalesOrderID}
                  </Text>
                  <Text style={{marginTop:1,color:'#FDFDFD',fontSize:13}}>{data.Header.CustomerName}</Text>          
                </View>
            </View>  
            <View style={{ width:(fontScale > 1.2 ? '90%' : '80%'), flex:2, flexDirection:'row',}}>
              <View style={{position:'absolute',left:0}}>
                <Text style={{marginTop:2,color:'#FDFDFD',fontWeight:'bold',fontSize:13}}>PO Number</Text>
                <Text style={{marginTop:2,color:'#FDFDFD',fontWeight:'bold',fontSize:13}}>Inco Term</Text>
                <Text style={{marginTop:2,color:'#FDFDFD',fontWeight:'bold',fontSize:13}}>Production Order</Text>
                <Text style={{marginTop:2,color:'#FDFDFD',fontWeight:'bold',fontSize:13}}>SO Number</Text>
              </View>
              <View style={{position:'absolute',right:0}}>
                <Text style={{marginTop:2,color:'#FDFDFD',fontSize:13, textAlign:'right'}}>{data.Header.PONumber}</Text>
                <Text style={{marginTop:2,color:'#FDFDFD',fontSize:13, textAlign:'right'}}>{data.Header.Incoterms}</Text>
                <Text style={{marginTop:2,color:'#FDFDFD',fontSize:13, textAlign:'right'}}>{data.Header.ProductionOrder}</Text>
                <Text style={{marginTop:2,color:'#FDFDFD',fontSize:13, textAlign:'right'}}>{data.Header.OrderNumber}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity  style={{height:25, width:'100%', right:2,left:2, flexDirection:'row',}}>
            <View style={{left:0, position:'absolute', marginLeft:'10%',}}>
              <Text style={{color:'#000000', fontWeight:'bold', fontSize:15}}>Item List</Text>
            </View>       
          </TouchableOpacity>
          {dataRows}
          <Text style={{alignItems:'center',marginTop:30,color:'#a86d6d',textAlign:'center',fontSize:12}}>End Of List</Text>
        </View>
        )}        
      </ScrollView>            
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: '#fdfdfd',
  },
});
export default DetailsScreen;