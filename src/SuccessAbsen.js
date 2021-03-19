import React, { Component } from "react";
import { 
  View,
  Text,
  StyleSheet, TouchableOpacity
} from "react-native";
import { StackActions } from '@react-navigation/native';

class SuccessAbsen extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props){
    super(props)
    this.state={
      tanggal:this.props.route.params.tanggal,
      jam:this.props.route.params.jam
    }
    console.log(this.state.tanggal);
    console.log(this.state.jam);
  }

  reset = () => {    
    this.props.navigation.dispatch(
    StackActions.replace('Home'));  
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{fontWeight:'bold',fontSize:16,color:'#2D3137',textAlign:'center'}}>Terima Kasih Anda Telah Mengambil Absen</Text>
        <View style={{marginTop:20, borderWidth:1, borderColor:'1095E8',borderRadius:5, padding:20}}>
          <Text style={{fontWeight:'bold',fontSize:15,color:'#2D3137',textAlign:'center'}}>Tanggal : {this.state.tanggal}</Text>
          <Text style={{fontWeight:'bold',fontSize:15,color:'#2D3137',textAlign:'center'}}>Jam : {this.state.jam}</Text>
        </View>
        <TouchableOpacity onPress={this.reset} style={{marginTop:20,backgroundColor:'#1095E8',paddingVertical:10, paddingHorizontal:30,borderRadius:9}}>
          <Text style={{fontSize:13,textAlign:'center',color:'#fff'}}>Oke</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
export default SuccessAbsen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal:20,
    flexDirection:'column'
  }
});