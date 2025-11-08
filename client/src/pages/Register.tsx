import RegisterForm from "@/components/RegisterForm";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const { register } = useAuth();
  const { toast } = useToast();

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      await register(name, email, password);
      toast({
        title: "Cuenta creada",
        description: "Tu cuenta ha sido creada exitosamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la cuenta",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <RegisterForm onSubmit={handleRegister} />
    </div>
  );
}
