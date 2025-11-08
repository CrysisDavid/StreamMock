import { Search, Bell, User, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background via-background/95 to-background/0 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <Link href="/">
              <h1 className="text-primary text-2xl md:text-3xl font-bold cursor-pointer" data-testid="link-home">
                CineStream
              </h1>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" data-testid="link-browse">
                <button className="text-sm font-medium hover-elevate active-elevate-2 px-3 py-1.5 rounded-md transition-all">
                  Inicio
                </button>
              </Link>
              <Link href="/my-list" data-testid="link-mylist">
                <button className="text-sm font-medium hover-elevate active-elevate-2 px-3 py-1.5 rounded-md transition-all">
                  Mi Lista
                </button>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar películas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-secondary border-0"
                data-testid="input-search"
              />
            </div>

            {isAuthenticated && (
              <>
                <Button size="icon" variant="ghost" data-testid="button-notifications">
                  <Bell className="w-5 h-5" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" data-testid="button-profile">
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      {user?.nombre || 'Usuario'}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} data-testid="button-logout">
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {!isAuthenticated && (
              <Link href="/login">
                <Button variant="default" size="sm" data-testid="button-login-header">
                  Iniciar sesión
                </Button>
              </Link>
            )}

            <Button
              size="icon"
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-menu-toggle"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border space-y-4">
            <Input
              type="search"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary border-0"
              data-testid="input-search-mobile"
            />
            <nav className="flex flex-col gap-2">
              <Link href="/">
                <button className="w-full text-left px-3 py-2 rounded-md hover-elevate active-elevate-2" data-testid="link-browse-mobile">
                  Inicio
                </button>
              </Link>
              <Link href="/my-list">
                <button className="w-full text-left px-3 py-2 rounded-md hover-elevate active-elevate-2" data-testid="link-mylist-mobile">
                  Mi Lista
                </button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
