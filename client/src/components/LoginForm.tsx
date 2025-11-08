import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Link } from "wouter";

interface LoginFormProps {
  onSubmit?: (email: string, password: string) => void;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "El correo es requerido";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Ingresa un correo válido";
    }

    if (!password) {
      newErrors.password = "La contraseña es requerida";
    } else if (password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit?.(email, password);
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 md:p-12 bg-card rounded-md">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-primary" data-testid="text-login-title">
            CineStream
          </h1>
          <p className="text-muted-foreground" data-testid="text-login-subtitle">
            Inicia sesión para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "border-destructive" : ""}
              data-testid="input-email"
            />
            {errors.email && (
              <p className="text-sm text-destructive" data-testid="error-email">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? "border-destructive" : ""}
              data-testid="input-password"
            />
            {errors.password && (
              <p className="text-sm text-destructive" data-testid="error-password">
                {errors.password}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" data-testid="button-login">
            Iniciar Sesión
          </Button>
        </form>

        <div className="text-center space-y-4">
          <Link href="/forgot-password">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-forgot-password">
              ¿Olvidaste tu contraseña?
            </button>
          </Link>

          <div className="text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link href="/register">
              <button className="text-primary font-medium hover:underline" data-testid="link-register">
                Regístrate
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
