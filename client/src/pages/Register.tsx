import RegisterForm from "@/components/RegisterForm";
import { useLocation } from "wouter";

export default function Register() {
  const [, setLocation] = useLocation();

  const handleRegister = (name: string, email: string, password: string) => {
    console.log('Register attempt:', { name, email, password });
    // Simulate successful registration
    setTimeout(() => {
      setLocation('/login');
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <RegisterForm onSubmit={handleRegister} />
    </div>
  );
}
