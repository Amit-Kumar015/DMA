import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../slices/userSlice";
import { useEffect, useState } from "react";
import Appstack from "./AppStack/appStack";
import AuthStack from "./AuthStack/authStack";
import AuthStorage from "../utils/authStorage";
import BottomTabNavigator from "./bottomTab/BottomTab";

export const RootNavigator = () => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user.userData);
  const userToken = userData?.authtoken; 
  const userType = userData?.user?.user_type; // ✅ Extract userType
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await AuthStorage.getAccessToken();
      if (accessToken) {
        dispatch(setUserData({ authtoken: accessToken }));
      }
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch]);

  if (isLoading) return null;

  // return userToken ? <AuthStack  /> : < />;
  return (
    <>
      {userToken == null || userToken == "" ? (
        <AuthStack userType={userType} />
      ) : (
        <Appstack />
      )}
   </>
  );

};
