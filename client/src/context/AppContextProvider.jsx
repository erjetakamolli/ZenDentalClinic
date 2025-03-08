import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "./AppContext";

const AppContextProvider = ({ children }) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [services, setServices] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );
  const [userData, setUserData] = useState(false);

  const getServicesData = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/service/list");
      if (data.success) {
        setServices(data.services);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }, [backendUrl]); 

  const loadUserProfileData = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { token },
      });
      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }, [backendUrl, token]); 

  useEffect(() => {
    getServicesData();
  }, [getServicesData]); 

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token, loadUserProfileData]); 

  return (
    <AppContext.Provider
      value={{
        services,
        getServicesData,
        currencySymbol,
        token,
        setToken,
        backendUrl,
        userData,
        setUserData,
        loadUserProfileData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
