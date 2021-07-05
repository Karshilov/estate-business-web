/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
import { message } from 'antd'
import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { UserInfoModel } from '../utils/DataModel'
export interface StoreState {
  isLogin: boolean;
  apiToken?: string;
  user?: UserInfoModel;
  hasMessage?:boolean;
}

const initialState: StoreState = {
  isLogin: false
}

const actions: Actions = {
  login (state, payload) {
    message.success('登录成功')
    state.apiToken = payload
    state.isLogin = true
    return state
  },
  logout (state) {
    message.warning('登录已过期～')
    state.isLogin = false
    state.apiToken = undefined
    state.user = undefined
    state.hasMessage = undefined
    return state
  },
  user (state, payload) {
    state.user = payload
    return state
  },
  setMessageStatus (state,payload) {
    state.hasMessage = payload
    return state
  }
}

const reducer = (state: StoreState = initialState, action: Action) => {
  if (typeof actions[action.type] === 'function') {
    const newState = JSON.parse(JSON.stringify(state))
    return actions[action.type](newState, action.payload)
  }
  return initialState
}

const persistedReducer = persistReducer({
  key: 'Karshilov',
  storage
}, reducer)

const store = createStore(persistedReducer)
const persistor = persistStore(store)

export { store, persistor }

type ActionFunc = (state: StoreState, payload?: any) => StoreState;

interface Action {
    type: string;
    payload?: any;
}

interface Actions {
    [propName: string]: ActionFunc;
}
