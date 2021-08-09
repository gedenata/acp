// import React in our code
import React, {useState} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';

import Moment from 'moment';

import DeviceInfo from 'react-native-device-info';
import {ACCESS_API} from '@env';

const AllOrdersScreen = ({route, navigation}) => {

  const [loadingOutstandingFlatlist, setLoadingOutstandingFlatlist] = useState(false);
  const [isListEndOutstandingFlatlist, setIsListEndOutstandingFlatlist] = useState(false);

  const [searchDataResultOutstandingFlatlist, setSearchDataResultOutstandingFlatlist] = useState([]);
  const [skipValueOutstandingFlatlist, setSkipValueOutstandingFlatlist] = useState(0);

  const [tokenValueOutstandingFlatlist, setTokenValueOutstandingFlatlist] = useState('');
  const [firstLoadStatus, setFirstLoadStatus] = useState(true);

  const showDetailOrder = (SalesOrderID, category) => {
      navigation.navigate('Details', {SalesOrderID:SalesOrderID,Category:category,TokenValue:tokenValueOutstandingFlatlist})
  };

  const goDelivered = (SalesOrderID, category) => {
    navigation.push('AllOrders', {TokenValue:tokenValueOutstandingFlatlist, OrderType:'Delivered'})
  };
  const goOutstanding = (SalesOrderID, category) => {
    navigation.push('AllOrders', {TokenValue:tokenValueOutstandingFlatlist, OrderType:'Outstanding'})
  };
  Moment.locale('en');  

  const [ fontScale, setFontScale ] = useState(1);

  DeviceInfo.getFontScale().then((fontScaleTemp) => {
    setFontScale(fontScaleTemp)
  });

  const getDataOutstandingFlatlistScreen = () => {  
      setFirstLoadStatus(false);
      if (!loadingOutstandingFlatlist && !isListEndOutstandingFlatlist)
      {
          var tokenValueOutstandingFlatlistTemp = route.params.TokenValue;
          if(tokenValueOutstandingFlatlistTemp != "")
          {
            setTokenValueOutstandingFlatlist(tokenValueOutstandingFlatlistTemp)

            var APITarget = "";
            APITarget = `${ACCESS_API}/outstanding`;
            if(route.params.OrderType == "Delivered"){
              APITarget = `${ACCESS_API}/delivered`;
            }
            let dataToSend = { SalesOrderID: '', Token: ''+tokenValueOutstandingFlatlistTemp, Skip:skipValueOutstandingFlatlist /* route.params.SalesOrderID */ };
    
            var formBody = [];
            for (let key in dataToSend) {
                let encodedKey = encodeURIComponent(key);
                let encodedValue = encodeURIComponent(dataToSend[key]);
                formBody.push(encodedKey + '=' + encodedValue);
            }
            formBody = formBody.join('&');

            // console.log('getDataOutstandingFlatlistScreen dengannn ' + JSON.stringify(formBody));
            setLoadingOutstandingFlatlist(true);

            fetch(APITarget,{
                method: 'POST',
                body: formBody,      
                headers: {
                //Header Defination
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                },
            })
            .then((response) => response.json())
            .then(json => {
                // console.log("JSON : " + APITarget + "::" + json + "::" + formBody);
                setSkipValueOutstandingFlatlist((skipValueOutstandingFlatlist+((json.length) ? json.length : 0)))
                // console.log("LLLL" + json.length);

                if(json.length > 0){

                    for(var i = 0; i < json.length; i++){
                      var orderNumber = "" + json[i].OrderNumber;
                      let soDataToSend = { SalesOrderID: ''+orderNumber, Token: ''+tokenValueOutstandingFlatlistTemp };
                      var formBodyLocal = [];
                      for (let key in soDataToSend) {
                        let encodedKey = encodeURIComponent(key);
                        let encodedValueOutstanding = encodeURIComponent(soDataToSend[key]);
                        formBodyLocal.push(encodedKey + '=' + encodedValueOutstanding);
                      }
                      formBodyLocal = formBodyLocal.join('&'); 
                      let url = `${ACCESS_API}/outstanding`;
                      fetch(url,{
                        method: 'POST',
                        body: formBodyLocal, 
                        headers: {
                          //Header Defination
                          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                        },
                      })
                      .then((responseAgain) => responseAgain.json())
                      .then(responseAgainJSON => {
                        var totalItemValueOutstanding = responseAgainJSON.Body.length;
                        var completedAsyn = true;
                        
                        for(var j = 0; j < json.length; j++){
                            if(json[j].OrderNumber == responseAgainJSON.Header.OrderNumber){
                              json[j].TotalItem = totalItemValueOutstanding;
                              json[j].FinalDestination = responseAgainJSON.Body[0].FinalDestination;
                            }
                            completedAsyn = (!json[j].TotalItem) ? false : completedAsyn;
                        }
                        if(completedAsyn){
                          setSearchDataResultOutstandingFlatlist([...searchDataResultOutstandingFlatlist, ...json]);
                        }
                      })
                    }
                }else{
                    // console.log("skipValueOutstandingFlatlist: " + skipValueOutstandingFlatlist);
                    if(skipValueOutstandingFlatlist == 0){
                      var notFoundData = [];
                      notFoundData.push("notFound=true");
                      setSearchDataResultOutstandingFlatlist(notFoundData);
                      // console.log("Finish push data");
                    }
                    setIsListEndOutstandingFlatlist(true);
                }
                setLoadingOutstandingFlatlist(false);                     
                // setRaws(rowsTemp);
            })
            .catch((error) => console.error(error))
            // .finally(() => setLoadingOutstandingFlatlistOutstanding(false));     
          }      
      }
  };

  if(firstLoadStatus){
    setFirstLoadStatus(false);
    getDataOutstandingFlatlistScreen();
  }

  const renderFooter = () => {
    return (
      // Footer View with Loader
      <View style={styles.footer}>
        {loadingOutstandingFlatlist ? (
          <ActivityIndicator
            color="black"
            style={{margin: 15}} />
        ) : null}
      </View>
    );
  };

  const ItemViewOutstandingFlatlist = ({item}) => {
      if(item == "notFound=true") {
        return (
          <View>
          <Image
                source={require('AnRNApp/Image/NotFound.png')}
                style={{
                  width: '20%',
                  height: 100,
                  alignSelf:'center',
                  alignItems:'center'
                }}
          />            
          <Text
              style={{
                alignSelf:'center',
                alignItems:'center'
              }}
          >No Result Found</Text>
          </View>
        )
      }

      return (
          <View 
            style={{
              overflow: "hidden",
              marginRight:(fontScale > 1.2 ? 4 : 20), 
              marginLeft:(fontScale > 1.2 ? 4 : 20),              
            }} 
            key={item.OrderNumber}
          >
            <TouchableOpacity 
              key="outstanding{item.OrderNumber}"
              style={{
                borderRadius:12,
                backgroundColor:'#FFFFFF',
                minHeight:190,
                borderColor:'#ccc',
                borderWidth:1,
                color:'#000000',
                marginBottom:5, 
                marginTop:5,
                paddingLeft:8,
              }}
              onPress={showDetailOrder.bind(this,item.OrderNumber, 'outstanding')}
            >
              <View style={{position:'absolute',left:0,height:30,width:3,backgroundColor:'#000000',marginTop:8}}/>                              
              <View style={{flex:2,flexDirection:'column',top:0}}>
                <Text style={{color:'#000000',paddingLeft:5,paddingTop:5,fontSize:13,fontWeight:'bold'}}>Order Number {item.OrderNumber}</Text>
                <Text style={{color:'#b58e8e',paddingLeft:5,paddingTop:2,fontSize:11,}}>{item.CustomerName}</Text>
              </View>
              <View 
                  style={{
                    flexDirection:'column',
                    flex:1,
                    minHeight:50,
                    width:'100%', 
                  }}
              >
                <View style={{ flex:2, flexDirection:'row',}}>
                  <View style={{flex:1, paddingLeft:2,}}>
                    <Text style={{marginTop:1,color:'#000000',fontWeight:'bold',fontSize:13, textAlign:'left'}}>PO Number</Text>
                  </View>
                  <View style={{flex:1, paddingRight:10,}}>
                    <Text style={{marginTop:1,color:'#000000',fontSize:13, textAlign:'right'}}>{item.PONumber}</Text>
                  </View>
                </View>
                <View style={{ flex:2, flexDirection:'row',}}>
                  <View style={{flex:1, paddingLeft:2,}}>
                    <Text style={{marginTop:1,color:'#000000',fontWeight:'bold',fontSize:13, textAlign:'left'}}>ETA</Text>
                    <Text style={{marginTop:1,color:'#000000',fontWeight:'bold',fontSize:13, textAlign:'left'}}>Order Taken</Text>
                    <Text style={{marginTop:1,color:'#000000',fontWeight:'bold',fontSize:13, textAlign:'left'}}>Total Quantity</Text>
                  </View>
                  <View style={{flex:1, paddingRight:10,marginBottom:5}}>
                    <Text style={{marginTop:1,color:'#000000',fontSize:13, textAlign:'right'}}>{(item.ETA != "") ? Moment(item.ETA).format('D MMMM YYYY') : ""}</Text>
                    <Text style={{marginTop:1,color:'#000000',fontSize:13, textAlign:'right'}}>{(item.OrderTaken != "") ? Moment(item.OrderTaken).format('D MMMM YYYY') : ""}</Text>
                    <Text style={{marginTop:1,color:'#000000',fontSize:13, textAlign:'right'}}>{item.Quantity}</Text>
                  </View>
                </View>                
              </View>
              <View style={{minHeight:30,borderTopWidth:1,borderColor:'#efdddd',alignItems:'center', flex:2, flexDirection:'row'}}>
                <View style={{flex:1}}>
                  <Text style={{color:'#865959',marginTop:4, fontSize:14, fontWeight:'bold', textAlign:'left',paddingLeft:12}}>{item.TotalItem} ITEM(s)</Text>
                </View>
                <View style={{flex:1}}>
                  <Text style={{color:'#b09b9b',marginTop:4, fontSize:14, fontWeight:'bold', textAlign:'right',paddingRight:12}}>{item.FinalDestination}</Text>
                </View>
              </View>              
            </TouchableOpacity>                     
          </View>
      )
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  return (
    <SafeAreaView>
      <View
        style={{
          marginTop:0,
          left:0,
          right:0,
          flex:1,
          position:'absolute',
          borderBottomWidth:1,
          borderColor:'#eac3c3',  
          backgroundColor:'#FDFDFD',
          height:37,
        }}
      >
        <TouchableOpacity
          style={{
            marginTop:0,
            left:0,
            right:'50%',
            position:'absolute',
            borderBottomWidth:(route.params.OrderType == "Outstanding" ? 2 : 0),
            borderColor:'#182175',
            height:36,
          }}
          onPress={goOutstanding}
        >
          {
            route.params.OrderType == "Outstanding"
            ?
            <Text style={{alignItems:'center',alignSelf:'center',fontWeight:'bold',paddingTop:8, color:'#141c6d'}}>OUTSTANDING</Text>
            :
            <Text style={{alignItems:'center',alignSelf:'center',fontWeight:'bold',paddingTop:8, color:'#898d92'}}>OUTSTANDING</Text>
          }            
        </TouchableOpacity>
        <TouchableOpacity 
          style={{
            marginTop:0,
            right:0,
            left:'50%',
            borderBottomWidth:(route.params.OrderType == "Delivered" ? 2 : 0),
            borderColor:'#182175',            
            position:'absolute',
            height:36,
          }}
          onPress={goDelivered}
        >
          {
            route.params.OrderType == "Delivered"
            ?          
            <Text style={{alignItems:'center',alignSelf:'center', fontWeight:'bold',paddingTop:8,color:'#141c6d',fontSize:14}}>DELIVERED</Text>
            :
            <Text style={{alignItems:'center',alignSelf:'center', fontWeight:'bold',paddingTop:8,color:'#898d92',fontSize:14}}>DELIVERED</Text>
          }
        </TouchableOpacity>
      </View>
      <FlatList
        style={{  
          marginTop:40,
        }}            
        data={searchDataResultOutstandingFlatlist}
        keyExtractor={(item, index) => "Delivered_" + index.toString()}
        ItemSeparatorComponent={ItemSeparatorView}
        renderItem={ItemViewOutstandingFlatlist}
        ListFooterComponent={renderFooter}
        onMomentumScrollEnd={(info) => {
            // console.log("Check navigationnya : ");
            getDataOutstandingFlatlistScreen();
          }
        }
        onEndReachedThreshold={0}
      />
      </SafeAreaView>
  );  
};
  
  const styles = StyleSheet.create({
    footer: {
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
  });

export default AllOrdersScreen;