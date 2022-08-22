import {StyleSheet} from 'react-native';
import React from 'react';
import NavigationScreen from './src/routes';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/lib/integration/react';
import {store, persistor} from './src/redux/store';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationScreen />
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({});
