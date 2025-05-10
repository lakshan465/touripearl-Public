// src/recoil/atoms/userAtom.js
import { atom } from 'recoil';
import {recoilPersist} from 'recoil-persist';

const { persistAtom } = recoilPersist({
  key: "userState", // Custom key for storage
  storage: sessionStorage, // Use sessionStorage instead of localStorage
});

export const userState = atom({
  key: 'userState', // Unique key for this atom
  default: {
    isAuthenticated: false,
    user: null,
  },
  effects_UNSTABLE:[persistAtom],
});
