import { PropsWithChildren } from "react";
import Header from "./header";
import Sidebar from "./sidebar";

export default function LayoutWrapper({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

