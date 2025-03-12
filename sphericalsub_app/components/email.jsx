import React, {useContext} from 'react';
import { Alert, TouchableOpacity, View, Text } from 'react-native';
import * as Linking from 'expo-linking';
import Fontisto from '@expo/vector-icons/Fontisto';
import {GlobalContext} from "@/context/globalProvider"

const Email = () => {
    const {info} = useContext(GlobalContext)
  const handleOpenGmail = () => {
    const email = info?.email;
    const subject = 'Subject Here';
    const body = 'Write your message here';

    // Compose the mailto URL
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open the Gmail compose screen
    Linking.openURL(url).catch((err) => {
      Alert.alert('Error', 'Unable to open the email app.');
      console.error('An error occurred:', err);
    });
  };

  return (
      <TouchableOpacity
      onPress={handleOpenGmail}
      className="flex-row  gap-4 p-2 items-center w-[80%]"
      >
        <View
           className="w-[50] h-[50] items-center justify-center
           rounded-full bg-background"
        >
            <Fontisto name="email" size={24} color="blue" />
      </View>

        <View className="gap-2 ">
            <Text className="font-semibold">Email</Text>
            <Text className="regular">{info?.email} </Text>
        </View>
      </TouchableOpacity>

  );
};

export default Email;
