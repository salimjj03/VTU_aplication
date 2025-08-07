import "bootstrap/dist/css/bootstrap.min.css";
// import 'react-confirm-alert/src/react-confirm-alert.css';
import React from "react"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
  useLocation
} from "react-router-dom";
import Login from "./pages/login";
import Index from "./pages/index";
import Layout from "./layout/layout";
import AdminHome from "./pages/admin/home";
import ViewAirtime from "./pages/admin/viewAirtime";
import SwitchPlan from "./pages/admin/switchPlan";
import ViewData from "./pages/admin/viewData";
import ViewNetwork from "./pages/admin/viewNetwork";
import UserFunding from "./pages/admin/userFunding";
import Transactions from "./pages/admin/transactions";
import ActivityLog from "./pages/admin/activity_log";
import Analysis from "./pages/admin/analysis";
import Notification from "./pages/admin/notification";
import Users from "./pages/admin/users";
import AddPlan from "./pages/admin/addPlan";
import Config from "./pages/admin/config";
import Network from "./pages/admin/network";
import Airtime from "./pages/admin/airtime";
import ViewElectricity from "./pages/admin/viewElectricity";
import ViewCable from "./pages/admin/viewCable";
import UserDashBoard from "./pages/user/home"
import SendMoney from "./pages/user/transfer"
import BuyData from "./pages/user/buyData"
import BuyAirtime from "./pages/user/buyAirtime"
import UserTransactions from "./pages/user/transactions";
import DataProvider from "./apiRequest"

function AuthCheck({children}) {
    const  location = useLocation()
    const data = JSON.parse(localStorage.getItem("data"))
    if (data?.token && location.pathname.startsWith(`/${data?.role}`)) {
        return children
        }
            localStorage.removeItem("data")
            return <Navigate to="/" replace />;
}


function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route index element={<Index />} />

        <Route path="/403_admn_auth25_login" element={<Login />} />
            <Route path="/admin" element={<AuthCheck><Layout /> </AuthCheck>}>
              <Route index element={<AdminHome />} />
              <Route path="view_airtime" element={<DataProvider> <ViewAirtime /> </DataProvider>} />
              <Route path="view_plan" element={<DataProvider> <ViewData /> </DataProvider>} />
              <Route path="add_plan" element={<AddPlan />} />
              <Route path="view_electricity" element={<DataProvider> <ViewElectricity /> </DataProvider>} />
              <Route path="view_cable" element={<DataProvider> <ViewCable /> </DataProvider>} />
              <Route path="config" element={<Config />} />
              <Route path="network" element={<Network />} />
              <Route path="airtime" element={<Airtime />}  />
              <Route path="switch_Plan" element={<SwitchPlan />}  />
              <Route path="view_network" element={<DataProvider> <ViewNetwork /> </DataProvider>}  />
              <Route path="transactions" element={<DataProvider> <Transactions /> </DataProvider>}  />
              <Route path="activity_log" element={<DataProvider> <ActivityLog /> </DataProvider>}  />
              <Route path="analysis" element={<DataProvider> <Analysis /> </DataProvider>}  />
              <Route path="users" element={<DataProvider> <Users /> </DataProvider>}  />
              <Route path="users_funding" element={<UserFunding />}  />
              <Route path="notification" element={<Notification />}  />

            </Route>

            <Route path="/user" element={<AuthCheck><Layout /> </AuthCheck>}>
              <Route index element={<UserDashBoard />} />
              <Route path="buy_data" element={<BuyData />} />
              <Route path="buy_airtime" element={<BuyAirtime />} />
              <Route path="send_money" element={<SendMoney />} />
              <Route path="transactions" element={<DataProvider> <UserTransactions /> </DataProvider>}  />
            </Route>
      </>
    )
  );

  return (
    <>
      <ToastContainer />

      <RouterProvider router={router}  />
    </>
  );
}

export default App;
