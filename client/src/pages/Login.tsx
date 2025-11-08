import LoginForm from "@/components/LoginForm";
import { useLocation } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();

  const handleLogin = (email: string, password: string) => {
    console.log('Login attempt:', { email, password });
    // Simulate successful login
    setTimeout(() => {
      setLocation('/');
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
}
