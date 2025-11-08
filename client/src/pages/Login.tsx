import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      toast({
        title: "Bienvenido",
        description: "Has iniciado sesión exitosamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo iniciar sesión",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
}
