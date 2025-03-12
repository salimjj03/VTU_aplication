import React, { useState, useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"
import {Colors} from "@/constants/Colors"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';
import Email from "@/components/email"
import Whatsapp from "@/components/whatsapp"
import PhoneCall from "@/components/phoneCall"
import Address from "@/components/address"
import WhatsAppCommunity from "@/components/whatsappcommunity"
import {GlobalContext} from "@/context/globalProvider"



export default function Support() {

  const [modalVisible, setModalVisible] = useState(false); // Modal visibility
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");
  const {info} = useContext(GlobalContext)

  return (
    <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.background.DEFAULT}}
    >
        <ScrollView
            showsVerticalScrollIndicator = {false}
            showsHorizontalScrollIndicator ={false}
            contentContainerStyle={{
            flexGrow: 1,
             gap: 15,
             padding: 15
             }}
        >
            <Text className="font-thin mt-2">Chart</Text>
            <View className=" rounded-xl bg-white p-2">

                <Whatsapp />

                <WhatsAppCommunity />
            </View>

             <Text className="font-thin mt-2">Call</Text>
             <View className="rounded-xl bg-white p-2">
                <PhoneCall
                phone={info?.phone}
                />
             </View>

             <Text className="font-thin mt-2">Email</Text>
             <View className="rounded-xl bg-white p-2">
                <Email/>
             </View>

             <Text className="font-thin mt-2">Address</Text>
             <View className="rounded-xl bg-white p-2">
                <Address />
             </View>
        </ScrollView>
    </SafeAreaView>
  );
}
