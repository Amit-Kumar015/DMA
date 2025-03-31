import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../slices/userSlice";
import { useEffect, useState } from "react";
import Appstack from "./AppStack/appStack";
import AuthStack from "./AuthStack/authStack";
import AuthStorage from "../utils/authStorage";

export const RootNavigator = () => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user.userData);
  const userToken = userData?.authtoken; 
  const [isLoading, setIsLoading] = useState(true);

  console.log("📌 Redux userData:", userData);  // ✅ Debug Redux state
  console.log("📌 Extracted Token:", userToken);  // ✅ Debug Token

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await AuthStorage.getAccessToken();
      console.log("🔍 Retrieved Token from Storage:", accessToken);  // ✅ Debug AsyncStorage

      if (accessToken) {
        dispatch(setUserData({ authtoken: accessToken }));
      }
      setIsLoading(false); 
    };
    fetchData();
  }, [dispatch]);

  if (isLoading) return null;

  return userToken ? <Appstack /> : <AuthStack />;
};
