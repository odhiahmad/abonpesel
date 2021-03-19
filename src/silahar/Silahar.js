import React, {useEffect, useState} from 'react';
import {Button, Container, Fab, Form, Input, Item, Label, Textarea} from 'native-base';
import {Header} from "react-native-elements";
import {
    Dimensions, FlatList,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {LinearGradient} from "expo-linear-gradient";
import Icon from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from '@react-native-community/datetimepicker';
import {_baseURL_} from "../../constant";
import LoaderModal from "../components/loader";

function Silahar({navigation}) {
    const [active, setActive] = useState(false);

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const [data, setData] = React.useState({
        tanggal: '',
        tanggalShow: false,
        jamMulai: '',
        jamMulaiShow: false,
        jamAkhir: '',
        jamAkhirShow: false,
        jumlahKegiatan: '',
        kegiatan: '',
        keterangan: '',
        volume: '',
        showTryAgain:false,
        data:'',
        loading:false,

    });

    useEffect(() => {
        getIndex()
    },[])

    const [text, setText] = React.useState('');

    const onChangeTanggal = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        var tahun = currentDate.getFullYear();
        var bulan = currentDate.getMonth();
        var tanggal = currentDate.getDate();

        setData({
            ...data,
            tanggalShow: false,
            tanggal: tahun + '-' + bulan + '-' + tanggal
        })

    };

    const getIndex = () =>{
        setData({
            ...data,
            loading: false,
            showTryAgain: false,
        });
        return fetch(_baseURL_ + '/potensi-kecelakaan/latlng').then((response) => response.json()).then((responseJson) => {
            setData({
                ...data,
                data: responseJson.results,
                showTryAgain: false,
            });
        }).catch((error) => {
            console.log(error);
            setData({
                ...data,
                loading: false,
                showTryAgain: true,
            });
        });
    }

    const renderRow = ({item,index}) =>{
        return(
            <ListItem
                onPress={() => {
                    this.props.navigation.navigate('PetaUmumDetail',{'dataItem':item})
                }}

                key={index} bottomDivider>
                <Avatar rounded={true} avatarStyle={{width: 80, height: 80}} source={{uri: item.picture}}/>
                <ListItem.Content>
                    <ListItem.Subtitle style={{fontSize: 17}}>{item.sumber_data}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron/>
            </ListItem>
        )
    }
    const onChangeJamMulai = (event, selectedDate) => {
        const currentDate = selectedDate || date;

        var jam = currentDate.getHours();
        var menit = currentDate.getMinutes();
        var detik = currentDate.getSeconds();

        setData({
            ...data,
            jamMulaiShow: false,
            jamMulai: jam + ':' + menit +':00'
        })

    };
    const onChangeJamAkhir = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);

        var jam = currentDate.getHours();
        var menit = currentDate.getMinutes();
        var detik = currentDate.getSeconds();


        setData({
            ...data,
            jamAkhirShow: false,
            jamAkhir: jam + ':' + menit+':00'
        })
    };


    const showTanggal = () => {
        setData({
            ...data,
            tanggalShow: true
        })

    };

    const showjamMulai = () => {
        setData({
            ...data,
            jamMulaiShow: true
        })
    };

    const showJamAkhir = () => {
        setData({
            ...data,
            jamAkhirShow: true
        })
    };

    const modalTambahAktif = () => {
        setData({
            ...data,
            tanggal: '',
            tanggalShow: false,
            jamMulai: '',
            jamMulaiShow: false,
            jamAkhir: '',
            jamAkhirShow: false,
            jumlahKegiatan: '',
            kegiatan: '',
            keterangan: '',
            volume: ''
        })
        setActive(true)
    }
    const submit = () => {
        this.setState({
            loading: true,
        });
        fetch(_baseURL_ + '/silahar', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                    nama_lengkap: this.state.nama,
                    email: this.state.email,
                    no_telp: this.state.no_hp,
                    file: this.state.gambar,
                    pesan: this.state.pesan,
                    file_ext: this.state.file_ext
                },
            ),

        }).then((response) => response.json()).then((responseJson) => {


            if (responseJson.status === true) {


                Alert.alert(
                    "Notifikasi",
                    "Berhasil menginputkan data laporan",
                    [
                        {text: "OK", onPress: () => console.log("OK Pressed")}
                    ],
                    {cancelable: false}
                );


            } else {

                this.setState({
                    loading: false,

                });

                Alert.alert(
                    "Notifikasi",
                    "Gagal",
                    [
                        {text: "OK", onPress: () => console.log("OK Pressed")}
                    ],
                    {cancelable: false}
                );

            }


        }).catch((error) => {


            this.setState({
                loading: false,
            });

            Alert.alert(
                "Notifikasi",
                "Gagal",
                [
                    {text: "OK", onPress: () => console.log("OK Pressed")}
                ],
                {cancelable: false}
            );
        });

    }

    return (
        <Container>
            <LoaderModal
                loading={data.loading}/>
            <StatusBar translucent backgroundColor="rgba(0,0,0,0.4)"/>
            <Header
                containerStyle={{
                    height: 80,
                }}
                barStyle="light-content"
                statusBarProps={{barStyle: 'light-content'}}
                centerComponent={{text: 'Pekerjaan', style: {color: '#fff', fontSize: 16, fontWeight: 'bold'}}}
            />
            <View style={{flex: 1}}>
                <View style={{
                    paddingHorizontal: 5,
                    marginTop: 10,
                    marginBottom: 10,
                }}>
                    <TouchableOpacity
                        // onPress={() => navigate("AmbilAbsen", {absen_type: this.state.tap_in ? 2 : 1})}
                    >

                        <LinearGradient
                            colors={['#7868e6', '#b8b5ff']}
                            style={{
                                // backgroundColor:'#7868e6',
                                borderRadius: 10,
                                paddingHorizontal: 20,
                                paddingVertical: 20,
                                flexDirection: 'row',
                                alignItems: 'center',
                                shadowOffset: {width: 2, height: 2,},
                                shadowColor: '#e0e0e0',
                                shadowOpacity: 1.0,
                                elevation: 1
                            }}
                            start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
                            <Icon name={'list'} size={61} style={{color: '#74C6F4', textAlign: 'center'}}/>
                            <View style={{flexShrink: 1, marginLeft: 20}}>
                                <Text style={{fontSize: 17, color: '#fff'}}>List Semua Pekerjaan</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                {data.showTryAgain === true ?
                    <View style={styles.container}>
                        <Text style={{color: 'gray'}}>Koneksi Bermasalah :(</Text>
                        <TouchableOpacity style={{
                            width: 200,
                            backgroundColor: 'red',
                            borderRadius: 25,
                            marginVertical: 2,
                            paddingVertical: 13,
                        }} onPress={getIndex}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '500',
                                color: '#ffffff',
                                textAlign: 'center',
                            }}>Refresh </Text>
                        </TouchableOpacity></View> : <FlatList
                        renderItem={renderRow}
                        keyExtractor={(item, index) => index.toString()}
                        data={data.data}/>}
                <Fab
                    // active={setActive(!active)}
                    direction="up"
                    containerStyle={{}}
                    style={{backgroundColor: '#5067FF'}}
                    position="bottomRight"
                    onPress={ modalTambahAktif }
                >
                    <Icon name={'plus'} size={16} style={{color: '#74C6F4', textAlign: 'center'}}/>
                </Fab>

            </View>
        </Container>
    );

}

const windoWidth = Dimensions.get('window').width; // berguna untuk menyesuaikan ukuran gamabar dengan hp
const windowHeight = Dimensions.get('window').height; // sama seperti comment di atas
export default Silahar
const styles = StyleSheet.create({
    pickerStyle:{
        height: 60,width:350,backgroundColor:'#28527a'
    },
    inputTextStyle: {
        paddingTop: 30
    },
    inputBox: {
        height: 60,
        width: 350,
        maxWidth: 400,
        paddingHorizontal: 5,
        fontSize: 16,
        color: '#000',
        marginTop: 10,
    },
    inputTextBox: {
        width: 350,
        maxWidth: 400,
        // backgroundColor: 'white',
        borderRadius: 40,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#000',
        marginTop: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});
