import { createContext, useContext } from 'react';

export const AuthContext = createContext(); // Holds the context

export function useAuth() { 
  return useContext(AuthContext); // hook to use this context
}