// import * as React from 'react';

// import {CommonActions} from '@react-navigation/native';

// export const navigationRef = React.createRef();

// export function navigate(name, params) {
//   navigationRef.current?.navigate(name, params);
// }

// export function getCurrentRoute() {
//   return navigationRef.current?.getCurrentRoute().name;
// }

// export function goBack() {
//   navigationRef.current?.goBack();
// }



// export function dispatch(name, params) {
//   navigationRef.current?.navigate?.dispatch(
//     CommonActions.reset({
//       index: 0,
//       routes: [{name, params}],
//     }),
//   );
// }
// export function resetNavigation(name) {
//   navigationRef.current.reset({
//     index: 0,
//     routes: [{name}],
//   });
// }
// add other navigation functions that you need and export them
// Assuming your navigationRef has a type definition, for example, NavigationContainerRef from React Navigation
import { NavigationContainerRef } from '@react-navigation/native';
import { navigationRef } from '../../App';





let pendingNavigation = null;

function navigateToScreen(screenName, params) {
  if (navigationRef.current) {
    (navigationRef.current).navigate(
      screenName,
      params,
    );
  } else {
    pendingNavigation = {screenName, params};
  }
}

function handleNavigationRefAvailable() {
  if (pendingNavigation) {
    const {screenName, params} = pendingNavigation;

    navigateToScreen(screenName, params);
    pendingNavigation = null;
  }
}

export {navigateToScreen, handleNavigationRefAvailable};
