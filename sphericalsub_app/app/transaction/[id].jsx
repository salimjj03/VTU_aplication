import React, {useEffect, useContext, useState} from "react"
import {View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator} from "react-native"
import {useLocalSearchParams, useRouter} from "expo-router"
import axios from "axios"
import {SafeAreaView} from "react-native-safe-area-context"
import {config} from "../../config"
import {GlobalContext} from "@/context/globalProvider"
import {router} from "expo-router"
import {Colors} from "@/constants/Colors"
import images from "@/constants/images"
import {handleLogout} from "@/components/logout";
import * as Clipboard from "expo-clipboard"
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import CustomButton from "@/components/customButton";

const Transaction = () => {
    const {id} = useLocalSearchParams()
    const {user, setIsLogIn} = useContext(GlobalContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [refresh, setRefresh] = useState(false);

    const [transaction, setTransaction] = useState(null)
    const handleCopy = async (text) => {
        await Clipboard.setStringAsync(text)
        }
    useEffect( () => {
        if (user) {
            setLoading(true)
            axios.get(`${config.API_URL}/transactions/${id}`, {
                headers: {
                    "Authorization": `Bearer ${user.token}`
                    }
                })
            .then( (res) => {
                setTransaction(res?.data)
                setLoading(false)
                } )
            .catch( (err) => {
                if (err?.response?.status === 401) {
                    handleLogout(setIsLogIn)
                    }
                setError(true)
                setLoading(false)
                console.log(err)
                } )
        }
        }, [user, refresh] )

    const handleNum = (amount) => {
        return !isNaN(amount) && typeof Number(amount) === "number" && !/\D/.test(amount)
              ? new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount)
              : amount
        }
    return (
            <SafeAreaView
               style={{ flex: 1,
                  alignItems: "center",
                  //justifyContent: "center",
                  backgroundColor:
                  Colors.background.DEFAULT,
                  gap: 15
                  }}
            >
             <ScrollView
                showsVerticalScrollIndicator = {false}
                showsHorizontalScrollIndicator ={false}
                contentContainerStyle={{
                    flexGrow: 1,
                     gap: 10,
                     alignItems: "center"
                     }}
                >
                {loading || error ? (
                    <View>
                      {error ? (
                        <View>
                          <Text>Network problem</Text>
                          <CustomButton
                            title="Refresh"
                            onPress={() => {
                              setError(false);
                              setRefresh((r) => !r);
                            }}
                            containerStyle="bg-primary w-[100]"
                          />
                        </View>
                      ) : (
                        <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
                      )}
                    </View>
                  ) : (
                      <>
                <View className="bg-white w-[95%] gap-1 p-4 items-center rounded-lg">
                    <View className="">
                        <Image
                        className="rounded-full shadow shadow-primary"
                        style={{ width: 60, height: 60 }}
                        source={images.logo}
                        resizeMode="contain"
                        />
                    </View>
                    <Text className="font-pregular text-center">{transaction?.t_disc}</Text>
                    <Text className="font-semibold text-2xl">
                        {
                            handleNum(transaction?.amount)
                            }
                    </Text>
                    <Text
                    className={
                        `font-regular ${
                        transaction?.status === "failed" ?
                        "text-red-400" :
                        "text-green-400"}`
                        }
                    >
                        {transaction?.status}
                    </Text>
                </View>

                <View className="bg-white w-[95%] p-4  rounded-lg">
                    <Text className="font-psemibold mb-2">Transaction Details</Text>

                    <View className="flex-row justify-between">
                        <Text className="font-pthin">User</Text>
                        <Text className="font-pregular">{transaction?.user_name}</Text>
                    </View>

                    <View className="flex-row justify-between">
                        <Text className="font-pthin">Type</Text>
                        <Text className="font-pregular">{transaction?.t_type}</Text>
                    </View>

                    <View className="flex-row justify-between">
                        <Text className="font-pthin">Status</Text>
                        <Text className="font-pregular ">{transaction?.status}</Text>
                    </View>

                    <View className="flex-row justify-between">
                        <Text className="font-pthin">Amount</Text>
                        <Text className="font-pregular ">
                            {
                                handleNum(transaction?.amount)
                            }
                        </Text>
                    </View>

                    <View className="flex-row justify-between">
                        <Text className="font-pthin">Amount Before</Text>
                        <Text className="font-pregular ">
                            {
                                handleNum(transaction?.amount_before)
                            }
                        </Text>
                    </View>

                    <View className="flex-row justify-between">
                        <Text className="font-pthin">Amount After</Text>
                        <Text className="font-pregular ">
                            {
                                handleNum(transaction?.amount_after)
                            }
                        </Text>
                    </View>

                    <View className="flex-row justify-between">
                        <Text className="font-pthin">Date</Text>
                        <Text className="font-pregular ">{transaction?.t_date}</Text>
                    </View>

                    <View className="flex-row justify-between">
                        <Text className="font-pthin">Reference</Text>
                        <Text className="font-pregular text-right flex-1">{transaction?.ref}</Text>
                    </View>
                </View>

                <View className="bg-white w-[95%] p-4  rounded-lg">
                    <View className="justify-between">
                        <Text className="font-psemibold mb-2">API response</Text>
                   { transaction?.rtr && (
                    <TouchableOpacity
                        className="flex-row gap-5"
                        onPress={ () => handleCopy(transaction?.rtr) }
                    >
                      <Text className="font-pregular">{transaction?.rtr}</Text>
                      <FontAwesome6 name="copy" size={24} color="" />
                    </TouchableOpacity>
                    )}


                    </View>
                </View>
                </>
                )}
              </ScrollView>
            </SafeAreaView>
        )
    }

export default Transaction