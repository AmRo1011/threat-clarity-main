import React from "react";
import ReactDOM from "react-dom/client";
import { ensureDevToken } from "@/lib/bootstrap";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import App from "./App";
import "./index.css";

const qc = new QueryClient();

ensureDevToken().finally(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={qc}>
        <App />
        <Toaster richColors closeButton />
      </QueryClientProvider>
    </React.StrictMode>
  );
});
