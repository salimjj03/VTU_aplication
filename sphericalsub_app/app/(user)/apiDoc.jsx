import React, { useContext, useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Linking } from "react-native";
import { handleLogout } from "@/components/logout";
import { config } from "../../config";
import { GlobalContext } from "@/context/globalProvider";
import { Colors } from "@/constants/Colors";
import axios from "axios";
import CustomButton from "@/components/customButton";
import * as Clipboard from "expo-clipboard"
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const TableScreen = () => {
  const { user, setIsLogIn } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState(null);
  const [error, setError] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [network, setNetworks] = useState(null);
  const [electricity, setElectricity] = useState(null);
  const [dstv, setDstv] = useState(null);
  const [gotv, setGotv] = useState(null);
  const [startime, setStartime] = useState(null);

   const handleCopy = async (text) => {
        await Clipboard.setStringAsync(text)
        }

  useEffect(() => {
    setError(false);
    if (!user) {
      return;
    } else {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [networkData, planData, billData, cableData] = await Promise.all([
            axios.get(`${config.API_URL}/networks`, {
              headers: { Authorization: `Bearer ${user?.token}` },
            }),
            axios.get(`${config.API_URL}/add_plan`, {
              headers: { Authorization: `Bearer ${user?.token}` },
            }),
            axios.get(`${config.API_URL}/electricity`, {
              headers: { Authorization: `Bearer ${user?.token}` },
            }),
            axios.get(`${config.API_URL}/cable`, {
              headers: { Authorization: `Bearer ${user?.token}` },
            }),
          ]);

          setNetworks(networkData?.data);
          setPlans(planData?.data);
          setElectricity(billData?.data);
          setDstv(cableData?.data?.cables?.dstv);
          setGotv(cableData?.data?.cables?.gotv);
          setStartime(cableData?.data?.cables?.startime)
        } catch (err) {
          setError(true);
          if (err?.response?.status === 401) {
            handleLogout(setIsLogIn);
          }
          console.log(err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [user, refresh]);

  const renderHeader = (columns) => (
    <View style={styles.header}>
      {columns.map((col, index) => (
        <Text key={index} style={styles.headerText}>{col}</Text>
      ))}
    </View>
  );

  const renderRow = (item, columns) => (
    <View style={styles.row}>
      {columns.map((col, index) => (
        <Text key={index} style={styles.cell}>{item[col]}</Text>
      ))}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {loading || error ? (
        <View style={styles.errorContainer}>
          {error ? (
            <View>
              <Text style={styles.errorText}>Network problem</Text>
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
           <TouchableOpacity
                onPress = {  () => {
                    const url = 'https://documenter.getpostman.com/view/42887324/2sAYk7QiZQ'; // Replace with your desired URL
                        Linking.openURL(url)
                        .catch(err => console.error('An error occurred', err));
                    }}
                className="bg-primary h-[40] items-center justify-center w-[120] rounded-lg">
                   <Text className="text-white">Documentation </Text>
               </TouchableOpacity>
               <View className="m-4 gap-3">
                   <Text>Token:</Text>
                   <TouchableOpacity
                        className="flex-row gap-5"
                        onPress={ () => handleCopy(user?.auth_token) }
                    >
                      <Text>{user?.auth_token}</Text>
                      <FontAwesome6 name="copy" size={24} color="" />
                    </TouchableOpacity>

               </View>
          {/* Network Table */}
          <Text style={styles.tableTitle}>Network Providers</Text>
          {renderHeader(["Name", "Network ID"])}
          <FlatList
            data={network}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderRow(item, ["name", "network_id"])}
            scrollEnabled={false} // Prevents nested scrolling issue
          />

          {/* Plan Table */}
          <Text style={styles.tableTitle}>Data Plan IDs</Text>
          {renderHeader(["Plan ID", "Size", "Network", "Type"])}
          <FlatList
            data={plans}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderRow(item, ["id", "plan_name", "network_id", "plan_type"])}
            scrollEnabled={false}
          />

          {/* Electricity Bills Table */}
          <Text style={styles.tableTitle}>Electricity Bills</Text>
          {renderHeader(["Name", "Plan ID"])}
          <FlatList
            data={electricity?.bills}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderRow(item, ["name", "plan_id"])}
            scrollEnabled={false}
          />

          <Text style={styles.tableTitle}>Dstv</Text>
          {renderHeader(["Name", "Plan ID"])}
          <FlatList
            data={dstv}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderRow(item, ["name", "plan_id"])}
            scrollEnabled={false}
          />

          <Text style={styles.tableTitle}>Gotv</Text>
          {renderHeader(["Name", "Plan ID"])}
          <FlatList
            data={gotv}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderRow(item, ["name", "plan_id"])}
            scrollEnabled={false}
          />

          <Text style={styles.tableTitle}>Startime</Text>
          {renderHeader(["Name", "Plan ID"])}
          <FlatList
            data={startime}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderRow(item, ["name", "plan_id"])}
            scrollEnabled={false}
          />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  errorContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },
  errorText: {
    marginBottom: 2,
    fontSize: 16,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 5,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    backgroundColor: Colors.primary.DEFAULT,
    padding: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginBottom: 5,
  },
  headerText: {
    flex: 1,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
});

export default TableScreen;
