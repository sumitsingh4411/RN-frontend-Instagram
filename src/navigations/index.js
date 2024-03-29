import React, { useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import { GlobalContext } from '../context/Provider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';


const AppNavContainer = () => {
  const {
    authState: { isLoggedIn },
  } = useContext(GlobalContext);

  const [isAuthenticated, setIsAuthenticated] = React.useState(true);
  const [authLoaded, setAuthLoaded] = React.useState(false);

  const getUser = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        setAuthLoaded(true);

        setIsAuthenticated(true);
      } else {
        setAuthLoaded(true);

        setIsAuthenticated(false);
      }
    } catch (error) { }
  };
  useEffect(() => {
    getUser();
  }, [isLoggedIn]);



  return (
    <>
      {authLoaded ? (
        <NavigationContainer>
          {isAuthenticated ? <TabNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      ) : (
        <ActivityIndicator />
      )}
    </>
  );
};

export default AppNavContainer;
