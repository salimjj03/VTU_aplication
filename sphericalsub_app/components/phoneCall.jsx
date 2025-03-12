import React, {useContext} from 'react';
import { Alert, View, Text, TouchableOpacity } from 'react-native';
import * as Linking from 'expo-linking';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {GlobalContext} from "@/context/globalProvider"

const PhonCall = () => {

  const {info} = useContext(GlobalContext)
  const handlePhoneCall = () => {
    const phoneNumber = info?.phone; // Replace with the desired phone number

    const url = `tel:${phoneNumber}`;

    Linking.openURL(url).catch((err) => {
      Alert.alert('Error', 'Unable to open the phone dialer.');
      console.error('An error occurred:', err);
    });
  };

  return (
    <TouchableOpacity
    onPress={handlePhoneCall}
    className="flex-row  gap-4 p-2 items-center">
        <View className="w-[50] h-[50] items-center justify-center rounded-full bg-background">
            <FontAwesome name="phone" size={24} color="black" />
        </View>

        <View className="gap-2">
            <Text className="font-semibold">Call</Text>
            <Text className="regular">{info?.phone}</Text>
        </View>
    </TouchableOpacity>
  );
};

export default PhonCall;
