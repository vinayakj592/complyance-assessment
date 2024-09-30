// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "employee" | "manager";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role?: "employee" | "manager";
  }
}
