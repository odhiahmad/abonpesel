import React, {Component} from "react";
import {
    ActivityIndicator,
    AsyncStorage,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {Camera} from 'expo-camera';
import * as Device from 'expo-device';
import * as Permissions from 'expo-permissions';
import Icon from 'react-native-vector-icons/Feather';
import {StackActions} from '@react-navigation/native';
import {_baseURL_} from "../constant";
import * as ImageManipulator from "expo-image-manipulator";
// import { StackActions, NavigationActions } from 'react-navigation';

class TakePhoto extends Component {
    static navigationOptions = {
        title: 'Ambil Foto Absen',
    }

    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
        uri: '',
        fileName: '',
        absen_type: this.props.route.params.absen_type,
        lat: this.props.route.params.lat,
        long: this.props.route.params.long,
        isLoading: false,
        loadingUpload: false
    };

    async componentDidMount() {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({hasCameraPermission: status === 'granted'});
    }

    ambilFoto = () => {
        this.setState({loadingUpload: true})
        // this.snap();
        setTimeout(() => {
            this.snap();
        }, 1000);
    }

    snap = async () => {
        if (this.camera) {
            const optionsCamera = {quality: 0.5, base64: true, skipProcessing: true};
            let photo = await this.camera.takePictureAsync(
                optionsCamera
            );

            let resizedPhoto = await ImageManipulator.manipulateAsync(
                photo.uri,
                [{ resize: { width: 300, height: 300 } }],
                { compress: 1, format: "jpeg", base64: true }
            );

            console.log('mulai upload');
            this.setState({loading: true, uri: photo.uri})
            // ImagePicker saves the taken photo to disk and returns a local URI to it
            let localUri = resizedPhoto.uri;
            let filename = localUri.split('/').pop();
            console.log('Nama', filename);
            // Infer the type of the image
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;
            console.log("Tes base 64 :" + filename)
            const token = await AsyncStorage.getItem('username');
            let details = {
                nip: token,
                image_tag: filename,
                image_data: resizedPhoto.base64,
                // image_data: {uri: photo.base64, name: filename, type},
                lattitude: this.state.lat,
                longitude: this.state.long,
                store_device_id: Expo.Constants.deviceId,
                device_model: Device.modelName,
                device_device: Device.brand,
                device_hardware: Device.manufacturer
            };
            console.log("data :"+details)
            let formBody = [];

            for (let property in details) {
                let encodedKey = encodeURIComponent(property);
                let encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join('&');
            // -------------

            this.setState({
                isLoading: true
            })

            const url = _baseURL_ + 'tap_in_out_outdor'
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }, body: formBody
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    this.setState({
                        isLoading: false
                    })
                    this.reset(responseJson.time, responseJson.date);
                })
                .catch((error) => {
                    console.error(error);
                    alert('Anda sedang tidak terhubung ke jaringan internet')
                });
        }
    };

    reset(time, date) {
        this.props.navigation.dispatch(
            StackActions.replace('SuccessAbsen', {jam: time, tanggal: date}));
    }


    render() {
        const {hasCameraPermission} = this.state;

        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator
                        style={styles.indicator}
                        animating={true}
                        size="large"
                    />
                    <Text>Sedang Mengupload Photo</Text>
                </View>
            );
        }

        if (hasCameraPermission === null) {
            return <View/>;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
                <ScrollView style={{flex: 1}}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

                        <Camera
                            ref={ref => {
                                this.camera = ref;
                            }}
                            style={{
                                flex: 1,
                                marginTop: 5,
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                height: Dimensions.get('window').height - 200,
                                width: Dimensions.get('window').width,
                            }}
                            type={this.state.type}>
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: 'transparent',
                                    flexDirection: 'column',
                                }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            type: this.state.type === Camera.Constants.Type.back
                                                ? Camera.Constants.Type.front
                                                : Camera.Constants.Type.back,
                                        });
                                    }}>
                                    <Icon name="refresh-cw" size={30}
                                          style={{color: '#00AEEF', marginLeft: 10, marginTop: 50}}/>
                                </TouchableOpacity>
                            </View>
                        </Camera>

                        <View>
                            <TouchableOpacity onPress={this.ambilFoto}>
                                <Icon name="aperture" size={70} style={{color: '#2D3137', marginTop: 20}}/>
                                <Text>Ambil Foto</Text>
                            </TouchableOpacity>
                        </View>
                        {/* <View>
            <Text style={{fontSize:9, color:'red',textAlign:'center',fontWeight:'bold',paddingHorizontal:10,marginTop:5}}>*Anda cukup menekan tombol Ambil Foto sekali saja, dan silahkan tunggu sampai foto berhasil terupload</Text>
              <Text style={{fontSize: 12, textAlign:'center', paddingVertical:10}}>atau</Text>
            </View> */}
                        {/* <View>
              <TouchableOpacity onPress={this._pickDocument}>
                <Text style={{color:'#00AEEF'}}>Upload Dokumen</Text>
              </TouchableOpacity>
            </View> */}
                    </View>
                    {/* {
            this.state.loadingUpload &&
            <View style={{width:'100%', height:'100%', backgroundColor:'#fff',flex: 1,alignItems: 'center',justifyContent: 'center',position:'absolute',paddingHorizontal:20}}>
              <Text style={{fontWeight:'bold', fontSize:18,textAlign:'center'}}>Mohon Tunggu Sedang Memproses Foto ...</Text>
            </View>
          } */}
                </ScrollView>
            );
        }
    }
}

export default TakePhoto;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
