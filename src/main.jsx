// main.jsx
import "./index.css";
import App from "./App.jsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { HeroUIProvider } from "@heroui/react";
// import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <HeroUIProvider>
        {/* <BrowserRouter> */}
          <ConvexProvider client={convex}>
            <App />
          </ConvexProvider>
        {/* </BrowserRouter> */}
      </HeroUIProvider>
    </ClerkProvider>
  </StrictMode>
);
