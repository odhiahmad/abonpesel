import React, { Component } from "react";
import { 
  View,
  Text,
  StyleSheet, Image
} from "react-native";

class EmptyState extends Component {
  render() {  
    return (
      <View style={styles.boxItem}>
        <Text style={{color:'#2D3137', fontSize:18}}>Belum Ada Data...</Text>
        <Image source={require("../../assets/search.png")}  style={{height:100, width:100}}/>
      </View>
    );
  }
}
export default EmptyState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  boxItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowOffset:{  width: 2,  height: 2,  },
    shadowColor: '#e0e0e0',
    shadowOpacity: 1.0,
    elevation:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between'
  }
});