import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Lafaktur",
};

export type AuthLayout = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayout) {
  return (
    <main className="container relative max-w-md flex-col items-center justify-center px-4 py-8 md:py-12">
      {children}
    </main>
  );
}
