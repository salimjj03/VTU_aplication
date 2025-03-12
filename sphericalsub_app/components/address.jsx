import React, {useContext} from 'react';
import { Alert, View, Text, TouchableOpacity } from 'react-native';
import * as Linking from 'expo-linking';
import Entypo from '@expo/vector-icons/Entypo';
import {GlobalContext} from "@/context/globalProvider"

const Address = () => {

  const {info} = useContext(GlobalContext)
  const handleAddress = () => {
    null
  };

  return (
    <TouchableOpacity
    onPress={handleAddress}
    className="flex-row  gap-4 p-2 items-center">
        <View className="w-[50] h-[50] items-center justify-center rounded-full bg-background">
            <Entypo name="address" size={24} color="green" />
        </View>

        <View className="gap-2 w-[80%]">
            <Text className="font-semibold">Address</Text>
            <Text className="regular">{info?.address}</Text>
        </View>
    </TouchableOpacity>
  );
};

export default Address;
