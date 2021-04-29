import React from 'react';
import { StatusBar, StyleSheet, View, SafeAreaView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Home, OrderDelivery, Restaurant } from './screens';
import Tabs from './navigation/tabs';
import { COLORS } from './constants';
import { useDarkMode } from 'react-native-dynamic';

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <SafeAreaView>
      <StatusBar {...props} />
    </SafeAreaView>
  </View>
);

const Stack = createStackNavigator();

const App = () => {
  const isDarkMode = useDarkMode();

  return (
    <>
      <MyStatusBar
        backgroundColor={isDarkMode ? COLORS.black : COLORS.lightGray4}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Home">
          <Stack.Screen name="Home" component={Tabs} />
          <Stack.Screen name="Restaurant" component={Restaurant} />
          <Stack.Screen
            name="OrderDelivery"
            component={OrderDelivery}
            initialParams={{ isDarkMode: isDarkMode }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  appBar: {
    backgroundColor: '#79B45D',
    height: APPBAR_HEIGHT,
  },
  content: {
    flex: 1,
    backgroundColor: '#33373B',
  },
});
export default App;
