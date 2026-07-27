import { supabase } from './supabase';

export const signIn = async (email, password) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  console.log("Triggering Supabase signOut");
  const result = await supabase.auth.signOut();
  console.log("SignOut resolved", result);
  return result;
};

export const getSession = async () => {
  return await supabase.auth.getSession();
};

export const onAuthChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};
