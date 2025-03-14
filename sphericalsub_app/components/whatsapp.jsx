import React, {useContext} from 'react';
import {Alert, Text, View, TouchableOpacity} from 'react-native';
import * as Linking from 'expo-linking';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {GlobalContext} from "@/context/globalProvider"

const WhatsApp = () => {
      const {info} = useContext(GlobalContext)
      const handleOpenWhatsApp = () => {
        const phoneNumber = info?.whatsapp; // Include country code without "+" (e.g., 234 for Nigeria)
        const message = 'Hello, how are you?';

        // WhatsApp deep link URL
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        // Open WhatsApp
        Linking.openURL(url).catch((err) => {
          Alert.alert('Error', 'Unable to open WhatsApp.');
          console.error('An error occurred:', err);
        });
      };

  return (
      <TouchableOpacity
       onPress={handleOpenWhatsApp}
       className="flex-row  gap-4 p-2 items-center"
       >
        <View className="w-[50] h-[50] items-center justify-center rounded-full bg-background">
            <FontAwesome name="whatsapp" size={30} color="green" />
        </View>

        <View className="gap-2">
            <Text className="font-semibold">Whatsapp Chat</Text>
            <Text className="regular text-wrap">Chart with an agent </Text>
        </View>
     </TouchableOpacity>
  );
};

export default WhatsApp;
