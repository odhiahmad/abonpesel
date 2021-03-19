import React, { Component } from "react";
import { 
  View,
  Text,
  StyleSheet, Image, TouchableOpacity
} from "react-native";
class ErrorState extends Component {
  render() {
    
    return (
      <View style={styles.container}>
        <Image source={require("../../assets/error_network.png")} style={{width:200, height:200}} />
        <View style={{alignItems:'center', paddingHorizontal:20,marginTop:10}}>
          <Text style={{fontSize:20, fontWeight:'bold',color:'#373737',textAlign:'center'}}>
            Mohon Maaf, Sepertinya anda tidak terhubung ke jaringan Internet...
          </Text>
          <TouchableOpacity style={{marginTop:10}} onPress={this.props.refresh}>
            <Text style={{fontSize:15}}>Ketuk Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
export default ErrorState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});