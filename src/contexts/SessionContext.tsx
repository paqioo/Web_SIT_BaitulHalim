"use client";

import { createContext, useContext, ReactNode } from "react";

interface UserSession {
  userId: number;
  nimNip: string;
  role: string;
  unitSekolah: string;
  namaLengkap: string;
  fotoProfilUrl: string | null;
}

interface SessionContextType {
  session: UserSession | null;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: UserSession | null;
}) {
  return (
    <SessionContext.Provider value={{ session }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  return context?.session || null;
}
