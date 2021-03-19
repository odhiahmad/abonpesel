import React, {useContext, useEffect} from "react";
import {RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import ProgressCircle from 'react-native-progress-circle'
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/AntDesign';
import {_baseURL_} from "../constant";
import {Button, Header} from "react-native-elements";
import {AuthContext} from "./utils/authContext";

// export const onSignOut = () => AsyncStorage.clear();

const ProfileAbon = ({navigation}) =>{
    const  [data, setData] =  React.useState({
        nama_asn: '',
        username: '',
        jabatan: '',
        isError: false,
        refreshing: false,
        isLoading: true,
        average: '',
        average_color: '',
        jumlah_telat: '',
        jam_telat: '',
        average_percent: '',
        pulang_cepat: '',
        durasi: [],

    });

    const {signOut} = useContext(AuthContext);
    useEffect(() => {
        feedData();
    }, []);

    const _onRefresh = () => {
        setData({
            ...data,
            refreshing: true,
            isError: false,
        });

        feedData().then(() => {
            setData({
                ...data,
                refreshing: false,
            });
        });
    }

    const feedData = async () => {


        const token = await AsyncStorage.getItem('username');
        const nama_asn = await AsyncStorage.getItem('nama_asn');
        const jabatan = await AsyncStorage.getItem('jabatan');



        return fetch(_baseURL_ + 'biodata_pegawai?nip=' + token, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status === 'success') {
                    setData({
                        ...data,
                        nama_asn: nama_asn,
                        username: token,
                        jabatan: jabatan,
                        durasi: responseJson.durasi,
                        average_color: responseJson.durasi[0].average_color,
                        average_percent: responseJson.durasi[0].average_percent,
                        average: responseJson.durasi[0].average,
                        jumlah_telat: responseJson.rekap[0].jumlah_telat,
                        jam_telat: responseJson.rekap[0].jam_telat,
                        pulang_cepat: responseJson.rekap[0].pulang_cepat
                    });
                    console.log(nama_asn)
                } else {
                    alert('Sesi anda telah habis, silahkan Logout dan Login kembali')
                    setData({
                        ...data,
                        isLoading: false,
                        refreshing: false,
                    })
                }
            })
            .catch((error) => {
                // console.error(error);
                setData({
                    ...data,
                    isLoading: false,
                    isError: true
                })
            });
    }



    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="rgba(0,0,0,0.4)"/>
            <Header
                containerStyle={{
                    height: 80,
                }}
                statusBarProps={{barStyle: 'light-content'}}
                centerComponent={{text: 'Profile', style: {color: '#fff', fontSize: 16, fontWeight: 'bold'}}}
            />
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={data.refreshing}
                        onRefresh={_onRefresh}
                    />
                }>
                <View style={styles.wrapper}>
                    <View style={styles.boxHeader}>
                        <View style={{alignItems: 'center'}}>
                            <Text style={{
                                fontSize: 23,
                                fontWeight: 'bold',
                                marginBottom: 3,
                                color: '#2D3137'
                            }}>{data.nama_asn}</Text>
                            <Text style={{
                                fontSize: 12,
                                fontWeight: 'normal',
                                marginBottom: 3
                            }}> {data.username}</Text>
                            <Text style={{
                                fontSize: 12,
                                fontWeight: '200',
                                marginBottom: 5,
                                fontStyle: 'italic'
                            }}>{data.jabatan}</Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate("PdfViewer")}
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#FF6063',
                                    padding: 5,
                                    borderRadius: 3,
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'center'
                                }}>
                                <Icon name={'book'} size={15}
                                      style={{color: '#FF565E', textAlign: 'center', padding: 3}}/>
                                <Text style={{
                                    color: '#FF565E',
                                    fontWeight: 'bold',
                                    paddingHorizontal: 3,
                                    paddingVertical: 3,
                                    fontSize: 14
                                }}>Panduan</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.boxProgress}>
                        <Text style={{fontSize: 18, fontWeight: 'bold', color: '#2D3137', marginBottom: 20}}>Rata-rata
                            Bulan ini</Text>
                        <ProgressCircle
                            percent={parseInt(data.average_percent)}
                            radius={60}
                            borderWidth={8}
                            color={data.average_color}
                            shadowColor="#f4f4f4"
                            bgColor="#fff">
                            <View style={{flexDirection: 'column', alignItems: 'center'}}>
                                <Text style={{fontSize: 25}}>{data.average}</Text>
                            </View>
                        </ProgressCircle>
                        <View style={{marginTop: 10, flexDirection: 'row'}}>
                            <View style={{
                                flexDirection: 'column',
                                marginRight: 10,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <View style={{flexDirection: 'row', marginVertical: 10}}>
                                    <Text style={{fontWeight: 'bold'}}>Terlambat : </Text>
                                    <Text>{data.jumlah_telat} kali ({data.jam_telat})</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{fontWeight: 'bold'}}>Pulang Cepat : </Text>
                                    <Text>{data.pulang_cepat}</Text>
                                </View>
                            </View>
                        </View>
                        <Button
                            onPress={() => signOut()}
                            buttonStyle={{
                                paddingHorizontal: 40, paddingVertical: 15,
                                margin: 20,
                                borderRadius: 10
                            }}
                            icon={
                                <Icon
                                    name="logout"
                                    size={15}
                                    color="white"
                                />
                            }
                            title=" Log Out"
                        />
                        {/*<View style={{alignItems: 'center'}}>*/}
                        {/*    <LinearGradient colors={['#00AEEF', '#00B9F2']}*/}
                        {/*                    style={{borderRadius: 10, margin: 20, width: 131}}>*/}
                        {/*        <TouchableOpacity style={{paddingHorizontal: 40, paddingVertical: 15}}*/}
                        {/*                          onPress={() => onSignOut().then(() => this.props.navigation.navigate("Auth"))}>*/}
                        {/*            <Text style={{color: '#fff', fontWeight: 'bold'}}>Log Out</Text>*/}
                        {/*        </TouchableOpacity>*/}
                        {/*    </LinearGradient>*/}
                        {/*</View>*/}
                    </View>
                </View>
            </ScrollView>

        </View>
    );

}

export default ProfileAbon;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white'
    },
    headerBanner: {
        height: 170,
        width: '100%',
        borderBottomLeftRadius: 90,
        borderBottomRightRadius: 90,
    },
    wrapper: {
        paddingHorizontal: 20,
        paddingVertical: 20
    },
    boxHeader: {
        elevation: 1,
        backgroundColor: '#fff',
        shadowOffset: {width: 2, height: 2,},
        shadowColor: '#e0e0e0',
        shadowOpacity: 1.0,
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    boxProgress: {
        elevation: 1,
        backgroundColor: '#fff',
        shadowOffset: {width: 2, height: 2,},
        shadowColor: '#e0e0e0',
        shadowOpacity: 1.0,
        paddingHorizontal: 10,
        paddingVertical: 20,
        marginTop: 15,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0'
    },
    floatButton: {
        borderRadius: 30,
        backgroundColor: '#ee6e73',
        position: 'absolute',
        bottom: 10,
        alignItems: 'center'
    }
});
