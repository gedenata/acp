// import React in our code
import React from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LOGOSVG from 'AnRNApp/Image/svg_logo/emptystate_staytune.svg';

const { width } = Dimensions.get('window');
const widthMultiplier = width / 400;

const PhaseTwoScreen = ({route, navigation}) => {

    const goBackToPage = () => {
      navigation.goBack()
    };
  
    return (
      <SafeAreaView style={styles.mainBody}>
      <ScrollView>
      <View>    
        <Image
          source={require('AnRNApp/Image/bar.png')}
          style={{
            width: '100%',
            height: 100,
            top:-30,
            resizeMode:'contain',
            borderRadius: 1000,
            borderTopLeftRadius:0,
            borderTopRightRadius:0,
            transform: [
              {scaleX: 8*widthMultiplier}
            ]
          }}
        />
      </View>
      <View style={{ alignItems: 'center', position:'absolute', top:10, left:0, right:0 }}>
          <TouchableOpacity 
            style={{position:'absolute',left:0,marginLeft:20,marginTop:16,}}
            onPress={goBackToPage}
          >
            <Icon raised name="arrow-left" size={30} color="#FDFDFD"/>          
          </TouchableOpacity>
          <Text style={{ marginTop:7,color:'#FDFDFD',fontSize:19}}></Text>
      </View>      
      <View>
        <LOGOSVG
          style={{marginTop:20,alignSelf:'center',alignItems:'center'}}
          width={300}
          height={140}
        />
        <Text
          style={{
            alignSelf:'center',
            alignItems:'center',
            marginTop:20,
            width:'60%',
            textAlign:'center'
          }}
        >Stay Tuned, This Feature Will Be Coming Soon</Text>
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
export default PhaseTwoScreen;