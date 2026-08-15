import { supabase } from './supabase';

export const signIn = async (email, password) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signUp = async (email, password) => {
  return await supabase.auth.signUp({ email, password });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getSession = async () => {
  return await supabase.auth.getSession();
};

export const onAuthChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};
