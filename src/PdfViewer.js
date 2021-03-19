import React, {Component} from "react";
import {TouchableOpacity, View} from 'react-native'
import PDFReader from 'rn-pdf-reader-js'
import {Header, Icon} from "react-native-elements";

export default class PdfViewer extends Component {
    render() {
        return (
            <View style={{flex:1}}>
                <Header
                    leftComponent={<TouchableOpacity
                        onPress={() => {
                            this.props.navigation.pop()
                        }}>
                        <Icon size={27} name='arrow-back' color='#fff'
                        /></TouchableOpacity>}
                    statusBarProps={{barStyle: 'light-content'}}
                    centerComponent={{text: 'Panduan', style: {color: '#fff', fontSize: 16, fontWeight: 'bold'}}}
                />
                <PDFReader
                    source={{
                        uri: 'https://absensi.sumbarprov.go.id/manual_book/office-assistant-manual-book.pdf',
                    }}
                />
            </View>
        )
    }
}
