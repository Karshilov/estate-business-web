import React from 'react';
import { store, persistor } from './store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import RootRouter from './router'
import AuthGuard from './components/AuthGuard';
import './App.less';

const App: React.FC = () => {

  //  return <RootRouter />;
  return <Provider store={store} >
  <PersistGate loading={null} persistor={persistor}>
    <AuthGuard >
      <RootRouter />
    </AuthGuard>
  </PersistGate>
</Provider >
}

export default App;

