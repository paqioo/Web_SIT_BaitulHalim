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
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context.session;
}
