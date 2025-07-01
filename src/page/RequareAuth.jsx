// components/RequireAuth.jsx
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

export default function RequireAuth({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
