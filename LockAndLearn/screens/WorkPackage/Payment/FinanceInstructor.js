import React from 'react';
import {
    ImageBackground,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';


const FinanceInstructor = ({ navigation, route }) => {

    return (
        <ImageBackground
            source={require('../../../assets/backgroundCloudyBlobsFull.png')}
            resizeMode="cover"
            style={styles.page}
        >
            <View style={styles.container}>
              
            </View>

        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        marginTop: '5%',
    },
 
});

export default FinanceInstructor;
