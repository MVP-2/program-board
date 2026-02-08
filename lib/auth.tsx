"use client";

import type { User } from "@supabase/supabase-js";
import type { JSX } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { AppRole } from "@/lib/supabase/middleware";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
  user: User | null;
  role: AppRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      setRole((u?.app_metadata["role"] as AppRole) ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      setRole((u?.app_metadata["role"] as AppRole) ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await createClient().auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    },
    []
  );

  const signOut = useCallback(async () => {
    await createClient().auth.signOut();
  }, []);

  const refreshUser = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    setUser(u);
    setRole((u?.app_metadata["role"] as AppRole) ?? null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, role, loading, signIn, signOut, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
