import React, { useState }  from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Image,  
  View,
  Text,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Moment from 'moment';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconEntypo from 'react-native-vector-icons/Entypo';

import DeviceInfo from 'react-native-device-info';

const DetailsScreenNext = ({route, navigation}) => {
  Moment.locale('en');

  const goBackToPage = () => {
    navigation.goBack()
  }; 

  const [ fontScale, setFontScale ] = useState(1);

  DeviceInfo.getFontScale().then((fontScaleTemp) => {
    setFontScale(fontScaleTemp)
  });          


  const buildItem = (label, takenDate, actualDate, quantity, itemColor) => {
    return (
        <View style={{flex:1, width:'100%',minHeight:20,}}>
          <View style={{flex:1, flexDirection:'row', marginTop:2, marginBottom:2 }}>
            <View style={{left:20, flex:2, top:10, flexDirection:'row' }}>
              <Icon name="radiobox-marked" size={16} color={itemColor} style={{top:2}}/>
              <Text style={{color:'#191E24',fontSize:13, left:10, top:0,  fontWeight:'bold'}} >{label}</Text>
            </View>
          </View> 
          <View style={{ flex:1, flexDirection:'row', marginTop:2, marginBottom:2 }}> 
            <View style={{ left:20,  flex:2, top:10, flexDirection:'row', }}>
              <IconEntypo name="dot-single" size={14} color={itemColor} style={{position:'absolute', left:1, top:2}}/>
              <View style={{ flex:1,}}>
                <Text style={{color:'#75787C',fontSize:12, left:25, top:0, textAlign:'left'}}>Estimated Date</Text>
              </View>            
              <View style={{ flex:1, }}>
                <Text style={{color:'#75787C',fontSize:12, top:0, textAlign:'right', right:35, }}>{Moment(takenDate + " 00:00:00.0000000").format('DD MMMM YYYY')}</Text>
              </View>
            </View>
          </View>
          <View style={{ flex:1, flexDirection:'row', marginTop:2, marginBottom:2 }}> 
            <View style={{ left:20,  flex:2, top:8, flexDirection:'row', }}>
              <IconEntypo name="dot-single" size={14} color={itemColor} style={{position:'absolute', left:1, top:2}}/>
              <View style={{ flex:1,}}>
                <Text style={{color:'#75787C',fontSize:12, left:25, top:0, textAlign:'left'}}>Actual Date</Text>
              </View>            
              <View style={{ flex:1, }}>
                <Text style={{color:'#75787C',fontSize:12, top:0, textAlign:'right', right:35, }}>{Moment(actualDate + " 00:00:00.0000000").format('DD MMMM YYYY')}</Text>
              </View>
            </View>
          </View>
          <View style={{ flex:1, flexDirection:'row', marginTop:2, marginBottom:2 }}> 
            <View style={{ left:20,  flex:2, top:6, flexDirection:'row', }}>
              <IconEntypo name="dot-single" size={14} color={itemColor} style={{position:'absolute', left:1, top:2}}/>
              <View style={{ flex:1,}}>
                <Text style={{color:'#75787C',fontSize:12, left:25, top:0, textAlign:'left'}}>Quantity</Text>
              </View>            
              <View style={{ flex:1, }}>
                <Text style={{color:'#75787C',fontSize:12, top:0, textAlign:'right', right:35, }}>{quantity}</Text>
              </View>
            </View>
          </View>
        </View>        
    )
  }

  return (
    <SafeAreaView style={styles.mainBody}>
      <ScrollView>
      <View>
      <Image
            source={require('AnRNApp/Image/bar.png')}
            style={{
              width: '100%',
              height: 250,
              top:-15,
              resizeMode:'contain',
              borderRadius: 1000,
              borderTopLeftRadius:0,
              borderTopRightRadius:0,
              transform: [
                {scaleX: 3}
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
          <Text style={{ marginTop:7,color:'#FDFDFD',fontSize:19}}>
            Order Detail
          </Text>
      </View>
      <View style={{
          marginTop:-190, 
          backgroundColor:'#FDFDFD',
          borderTopLeftRadius:10,
          borderTopRightRadius:10,
          borderTopEndRadius:15,
          borderTopStartRadius:15,
          top:0,
          left:0,
          right:0,
          paddingLeft:(fontScale > 1.2 ? 0 : 10),          
          paddingRight:(fontScale > 1.2 ? 0 : 10),          
          alignItems:'center',
          borderStyle:'solid', 
          borderColor:'#FDFDFD',
        }}
      >  
        <View 
          style={{ 
            left:0,
            right:0,
            borderBottomWidth:2,
            borderColor:'#dddbce',
            borderRightWidth:0,
            borderTopWidth:0,
            borderLeftWidth:0,
            alignItems:'center',
            height:55,
            width:'100%'
          }}
        >
          <TouchableOpacity  style={{position:'absolute', left:20, top:7}} >
            <Icon 
              raised 
              name="chevron-down" 
              size={35} 
              color="#1d1c13" 
              onPress={() => navigation.goBack()}
            />   
          </TouchableOpacity>            
          <Text style={{marginTop:1,color:'#000000',fontSize:16, paddingTop:12}}>
            Item Number {route.params.assignedValues.ItemNumber}
          </Text>
        </View>
        <View 
          style={{
            flexDirection:'row',
            marginTop:20, 
            width:'100%',
          }}
        >
          <View 
            style={{
                left:20,
                height:27,
                width:115,
                backgroundColor:'#EA6412',
                borderRadius:4,
                paddingTop:4,
                alignItem:'center'
            }}
          >
            <Text style={{color:'#FDFDFD', fontWeight:'bold', fontSize:13, textAlign:'center'}}>{route.params.assignedValues.OrderLastStatus}</Text>
          </View>
          <View 
            style={{
                  right:'3%',
                  height:30,
                  paddingTop:4,
                  position:'absolute'
                }}
          >
            <Text style={{color:'#000000', fontWeight:'bold', fontSize:14, alignItems:'center'}}>{route.params.assignedValues.DateToBeDisplayed}</Text>
          </View>          
        </View>
        <View 
          style={{
            marginTop:10, 
            flex:1,
            paddingLeft:20,
            paddingRight:20,
          }}
        >
          <Text style={{color:'#000000', fontWeight:'bold', fontSize:13, alignItems:'center',flex: 1, flexWrap: 'wrap', lineHeight:22}}>{route.params.assignedValues.ProductDesc}</Text>        
        </View>   
        <View 
          style={{
            marginTop:17, 
            flex:2,
            flexDirection:'row',
          }}
        >
          <View
            style={{ 
              left:20,
              flex:1,
            }}
          >
            <Text style={{marginTop:3,color:'#000000',fontSize:13}}>Item Number</Text>
            <Text style={{marginTop:3,color:'#000000',fontSize:13}}>Quantity</Text>
            <Text style={{marginTop:3,color:'#000000',fontSize:13}}>ETA</Text>
          </View>
          <View
            style={{ 
              right:20, 
              height:80,
              flex:1,              
            }}
          >
            <Text style={{marginTop:3,color:'#757045',fontSize:13, textAlign:'right'}}>{route.params.assignedValues.ItemNumber}</Text>
            <Text style={{marginTop:3,color:'#757045',fontSize:13, textAlign:'right'}}>{route.params.assignedValues.ProductQty}</Text>
            <Text style={{marginTop:3,color:'#757045',fontSize:13, textAlign:'right'}}>{route.params.assignedValues.RevisedETA}</Text>
          </View>
        </View> 
        {buildItem("Taken", route.params.assignedValues.OrderTaken, route.params.assignedValues.OrderTaken, route.params.assignedValues.ProductQty, "#00854F")}
        {buildItem("Confirmed", route.params.assignedValues.TargetConfirmed, ((route.params.assignedValues.ActualConfirmed != "") ? route.params.assignedValues.ActualConfirmed : ""), route.params.assignedValues.ProductQty, ((route.params.assignedValues.ActualConfirmed != "" || route.params.assignedValues.ActualProduced != "" || route.params.assignedValues.ActualShipped != "" || route.params.assignedValues.ActualDelivered != "") ? "#00854F" : "#b18787"))}
        {buildItem("Produced", route.params.assignedValues.TargetProduced, ((route.params.assignedValues.ActualProduced != "") ? route.params.assignedValues.ActualProduced : ""), route.params.assignedValues.ProductQty, ((route.params.assignedValues.ActualProduced != "" || route.params.assignedValues.ActualShipped != "" || route.params.assignedValues.ActualDelivered != "") ? "#00854F" : "#b18787") ) }
        {buildItem("Shipped", route.params.assignedValues.TargetShipped, ((route.params.assignedValues.ActualShipped != "") ? route.params.assignedValues.ActualShipped : ""), route.params.assignedValues.ProductQty, ((route.params.assignedValues.ActualShipped != "" || route.params.assignedValues.ActualDelivered != "") ? "#00854F" : "#b18787") ) }
        {buildItem("Delivered", route.params.assignedValues.TargetDelivered, ((route.params.assignedValues.ActualDelivered != "") ? route.params.assignedValues.ActualDelivered : ""), route.params.assignedValues.ProductQty, ((route.params.assignedValues.ActualDelivered != "") ? "#00854F" : "#b18787") ) }
        <View style={{height:30,width:'100%'}}></View>
      </View>  
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
export default DetailsScreenNext;