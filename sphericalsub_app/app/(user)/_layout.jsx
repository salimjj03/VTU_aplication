import React from "react"
import {Stack} from "expo-router"

export default function UserLayout() {

    return (
        <Stack>
            <Stack.Screen
            name="addMoney"
            options={{ title: "Add Money", headerTitleAlign: 'center'}}
            />

            <Stack.Screen
            name="apiDoc"
            options={{ title: "API Documentation", headerTitleAlign: 'center'}}
            />


            <Stack.Screen
            name="cable"
            options={{ title: "Cable", headerTitleAlign: 'center'}}
            />

            <Stack.Screen
            name="bundle"
            options={{ title: "Available Bundles ", headerTitleAlign: 'center'}}
            />

            <Stack.Screen
            name="airtime"
            options={{ title: "Buy Airtime", headerTitleAlign: 'center'}}
            />

            <Stack.Screen
            name="electricity"
            options={{ title: "Electricity", headerTitleAlign: 'center'}}
            />

            <Stack.Screen
            name="data"
            options={{ title: "Buy Data", headerTitleAlign: 'center'}}
            />


            <Stack.Screen
            name="commission"
            options={{ title: "Withdraw Commission ", headerTitleAlign: 'center'}}
            />



            <Stack.Screen
            name="more"
            options={{ title: "More", headerTitleAlign: 'center'}}
            />

            <Stack.Screen
            name="notifications"
            options={{ title: "Notifications", headerTitleAlign: 'center'}}
            />

            <Stack.Screen
            name="transfer"
            options={{ title: "Send Money", headerTitleAlign: 'center'}}
            />

            <Stack.Screen
            name="profileUpdate"
            options={{ title: "Update Profile", headerTitleAlign: 'center'}}
            />

        </Stack>

        )

    }