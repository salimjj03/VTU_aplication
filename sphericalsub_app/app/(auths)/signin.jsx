import React, {useState, useContext} from "react";
import {View, Text, StyleSheet, ScrollView,
    Image, TouchableOpacity} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context"
import FormField from "@/components/formField"
import CustomButton from "@/components/customButton"
import images from "@/constants/images"
import {Colors} from "@/constants/Colors"
import {Link, router} from "expo-router"
import axios from "axios"
import {config} from "@/config"
import * as SecureStore from "expo-secure-store"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {setItem} from "@/components/localStorage";
import {GlobalContext} from "@/context/globalProvider"
import CustomAlert from "@/components/customAlert"
import Whatsapp from "@/components/whatsapp"
import * as Linking from 'expo-linking';



function SignIn(){

    const [form, setForm] = useState(
        {
            user_name: "",
            password: ""
         }
        )

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {setUser, setIsLogIn, info} = useContext(GlobalContext);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(false);

    const required = ["password", "user_name"];

      const handleOpenWhatsApp = () => {
        const phoneNumber = info?.whatsapp; // Include country code without "+" (e.g., 234 for Nigeria)
        const message = 'Request for password reset?';

        // WhatsApp deep link URL
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        // Open WhatsApp
        Linking.openURL(url).catch((err) => {
          Alert.alert('Error', 'Unable to open WhatsApp.');
          console.error('An error occurred:', err);
        });
      };

    function submitLogging(){
        let error = false
        setIsSubmitted(true);
        for(let i of required) {
            if (!form[i].trim()) {
                error = true
                return
                }
            }
        if (error) {
            return
            }
        setIsLoading(true)
        axios.post(`${config.API_URL}/login`, form)
        .then((res) => {
            setIsLoading(false);
            setUser(res.data);
            setItem("userData", JSON.stringify(res.data))
            setIsLogIn(true);
            router.replace("/home")
            })
        .catch((err) => {
            setIsLoading(false)
            setError(true)
            setResponse({status: "error", message: err?.response?.data?.message})
            })
        }

    return (
        <SafeAreaView className="h-full">
            { error && (
            <CustomAlert
            title={response?.status}
            response={response.message}
            onClose={() => setError(false)}
            />
            )
            }
            <ScrollView
            contentContainerStyle={{
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100%",
                gap: 20
                }}>
                <TouchableOpacity
                onPress={ () => router.push("/")}>
                <Image
                source={images.logo}
                style={{
                    width: 100,
                    height: 100,
                    shadowColor: Colors.primary.DEFAULT,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    }}
                className="rounded-full"
                resizeMode="contain"
                />
                </TouchableOpacity>

                <Text className="font-psemibold text-xl">Welcome Back</Text>
                <View className="bg-white justify-center
                rounded-xl px-4  w-[90vw] "
                style={{
                    shadowColor: Colors.primary.DEFAULT,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    }}
                >
                    <FormField
                     title="UserName"
                     value={form.user_name}
                     placeholder=" User name"
                     onChange={(e) => setForm({...form, user_name: e})}
                     otherStyles="my-4"
                     required={true}
                     isSubmitted={isSubmitted}
                     />

                    <FormField
                     title="Password"
                     value={form.password}
                     placeholder=" Password"
                     onChange={(e) => setForm({...form, password: e})}
                     required={true}
                     isSubmitted={isSubmitted}
                     //otherStyles="mb-[2]"
                     />

                     <CustomButton
                     containerStyle="my-5"
                     title="Login"
                     onPress={submitLogging}
                     isLoading={isLoading}
                     containerStyle="bg-primary my-4"
                     />
                </View>

                <View>
                    <Text className="font-psemibold text-xl">
                        <TouchableOpacity onPress={ () => handleOpenWhatsApp() }>
                            <Text className="text-black-200">Forgot Password </Text>
                        </TouchableOpacity>
                         |
                         <Link href="/signup">
                            <Text className="text-primary"> Register</Text>
                         </Link>
                    </Text>
                </View>


            </ScrollView>
        </SafeAreaView>
        )
    }

export default SignIn