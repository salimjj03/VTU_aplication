import React, {useState, useEffect, useRef,
    useContext, useMemo} from "react";
import {View, Text, Image, StyleSheet, FlatList,
    TouchableOpacity} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import axios from "axios";
import { handleLogout } from "@/components/logout"
import { config } from "../../config"
import {GlobalContext} from "@/context/globalProvider"
import CustomBottomSheet from "@/components/customBottomSheet"
import images from "@/constants/images"
import CustomButton from "@/components/customButton"
import FormField from "@/components/formField"
import AntDesign from '@expo/vector-icons/AntDesign';
import { Picker } from '@react-native-picker/picker';
import {Colors} from "@/constants/Colors"
import TransactionHistory from "@/components/transactionHistory"
import {useRouter} from "expo-router"
import Refresh from "@/components/refresh"

const Bundles = () => {

    const router = useRouter();
    const {user, setIsLogIn} = useContext(GlobalContext);
    const [bundle, setBundle] = useState(null)
    const [query, setQuery] = useState("")
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false)
    const [refresh, setRefresh] = useState(false)

    useEffect( () => {

        const fetchData = async () => {
            if (!user) {
                return
                }
            setLoading(true)
            setError(false)
//             console.log(`Axios API Token: ${user.token}`);

            try{
                  const [userData] = await Promise.all([
                        axios.get(`${config.API_URL}/bundle`, {
                            headers: {
                            "Authorization": `Bearer ${user.token}`
                            }
                        })
                      ])
                  setBundle(userData?.data?.bundles)

                } catch (err) {
                    if (err?.response?.status === 401) {
                        handleLogout(setIsLogIn)
                    }
                    //console.log(err)
                    //setError(true)
                    if (err?.response?.data?.message != "No transactions found") {
                        setError(true)
                    }
                    } finally {
                        setLoading(false)
                        }
        }
    fetchData()
    }, [user, refresh] )

  return (
    <SafeAreaView
    className="bg-background gap-4 my-4"
    style={styles.container}
    >

{/*        <View className="flex-1 w-[95vw] gap-3 my-4  items-center rounded-xl"> */}
            { (error || loading ) ?
            <View className="h-[70vh]">
            <Refresh
                loading={loading}
                setRefresh={setRefresh}
                error={error}
                setError={setError}
            />
            </View> :

            <View className="w-[90vw] flex-1 rounded-lg bg-white">
             <Text className="p-4 font-psemibold text-xl">Bundles</Text>
            <FlatList
                    data={bundle}
                    renderItem={ ({item}) => (
                        <View
                         className="items-center justify-center
                         w-[40vw] h-[100] bg-primary-200 m-2 gap-2
                         shadow-lg shadow-primary rounded-lg"
                         >
                            <Text className="text-lg">{`${item.id}`}</Text>
                            <Text>balance</Text>
                            <Text className="font-psemibold w-[100%] text-center text-2xl" style={{ flexWrap: "wrap" }}>{item.amount} GB</Text>
                        </View>
                        )}
                    keyExtractor={ (item) => item.name}
                    numColumns={2}
                     contentContainerStyle={{
                         flex: 1,
                         justifyContent: "center",
                         alignItems: "center",
                         backgroundColor: Colors.white,
                         padding: 15
                         }}
                />
            </View>
            }

            <TouchableOpacity
            className="bg-primary h-[60] w-[90%] rounded-xl justify-center items-center"
            onPress={ () => setRefresh( r => !r)}
            disabled={loading}
            >
                <Text className="text-white">Refresh</Text>
            </TouchableOpacity>
{/*        </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: "center",
      //justifyContent: "center",
      backgroundColor:
      Colors.background.DEFAULT
      },

});

export default Bundles;
