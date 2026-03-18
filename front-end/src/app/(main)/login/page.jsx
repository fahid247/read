import { Suspense } from "react";
import LoginForm from "./LoginForm";


export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-[#0A0F1E]">
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center">
          <span className="loading loading-spinner text-primary loading-lg"></span>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}