import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const MyInputSpinner = (props) => {
    const {min, max, year, setYear} = props;
    //const [year, setYear] = useState(new Date().getFullYear());

    function handleChange(event) {
        let y = year;

        if (event === 'FORWARD' && year < max) {
            y = y + 1;
            setYear(y);
        } else if (event === 'BACKWORD' && year > min){
            y = y - 1;
            setYear(y);
        }

        props.onChange(y);
    }

    return (
        <View style={styles.box}>
            <TouchableOpacity onPress={() => handleChange('BACKWORD')}>
                <View style={styles.button}><Text style={styles.buttonText}>-</Text></View>
            </TouchableOpacity>
            <View style={styles.input}>
                <Text style={styles.inputText}>{year}</Text>
            </View>
            <TouchableOpacity onPress={() => handleChange('FORWARD')}>
                <View style={styles.button}><Text style={styles.buttonText}>+</Text></View>
            </TouchableOpacity>
        </View>
    );
};

export default MyInputSpinner;

const styles = StyleSheet.create({
    box: {
        paddingLeft: 16,
        paddingRight: 16,
        flexDirection: 'row',
        flex: 1
    },
    button: {
        width: 37,
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
        borderRadius: 5,
        backgroundColor: '#565957'
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
    input: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputText: {
        fontSize: 18
    },
});
