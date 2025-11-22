import { Bell, User, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import SearchDropdown from "@/components/SearchDropdown";
import MovieDetail from "@/components/MovieDetail";
import { useMovie } from "@/hooks/useMovies";
import { useFavorites } from "@/hooks/useFavorites";
import heroImage from "@assets/generated_images/Cityscape_hero_banner_7ee16f15.png";

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
	const { user, logout, isAuthenticated } = useAuth();

	const { data: selectedMovieData, isError: isDetailError, error: detailError, refetch: refetchDetail } = useMovie(selectedMovieId || 0);
	const { isFavorite, toggleFavorite } = useFavorites();

	const API_BASE_URL = "http://localhost:8000";

	const handleMovieSelect = (movieId: number) => {
		setSelectedMovieId(movieId);
		setIsMenuOpen(false);
	};

	return (
		<>
		<header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background via-background/95 to-background/0 backdrop-blur-sm">
			<div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
				<div className="flex items-center justify-between gap-8">
					<div className="flex items-center gap-8">
						<Link href="/">
							<h1 className="text-primary text-2xl md:text-3xl font-bold cursor-pointer" data-testid="link-home">
								StreamMock
							</h1>
						</Link>

						<nav className="hidden md:flex items-center gap-6">
							<Link href="/" data-testid="link-browse">
								<button className="text-sm font-medium hover-elevate active-elevate-2 px-3 py-1.5 rounded-md transition-all">Inicio</button>
							</Link>
							<Link href="/recent" data-testid="link-browse">
								<button className="text-sm font-medium hover-elevate active-elevate-2 px-3 py-1.5 rounded-md transition-all">Recientes</button>
							</Link>
							<Link href="/popular" data-testid="link-browse">
								<button className="text-sm font-medium hover-elevate active-elevate-2 px-3 py-1.5 rounded-md transition-all">Populares</button>
							</Link>
							{isAuthenticated && (
								<Link href="/my-list" data-testid="link-mylist">
									<button className="text-sm font-medium hover-elevate active-elevate-2 px-3 py-1.5 rounded-md transition-all">Mi Lista</button>
								</Link>
							)}
							{isAuthenticated && (
								<Link href="/created-list" data-testid="link-created">
									<button className="text-sm font-medium hover-elevate active-elevate-2 px-3 py-1.5 rounded-md transition-all">Mis Películas</button>
								</Link>
							)}
						</nav>
					</div>

					<div className="flex items-center gap-4">
						<SearchDropdown onMovieSelect={handleMovieSelect} className="hidden md:block w-64" />

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
										<DropdownMenuLabel>{user?.nombre || "Usuario"}</DropdownMenuLabel>
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

						<Button size="icon" variant="ghost" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} data-testid="button-menu-toggle">
							{isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
						</Button>
					</div>
				</div>

				{isMenuOpen && (
					<div className="md:hidden mt-4 pt-4 border-t border-border space-y-4">
						<SearchDropdown onMovieSelect={handleMovieSelect} className="w-full" placeholder="Buscar..." />

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
							{isAuthenticated && (
								<Link href="/created-list">
									<button className="w-full text-left px-3 py-2 rounded-md hover-elevate active-elevate-2" data-testid="link-created-mobile">
										Mis Películas
									</button>
								</Link>
							)}
						</nav>
					</div>
				)}
			</div>
		</header>
		
		{/* Modal de detalles de película */}
		{selectedMovieId !== null && (
				<>
					{isDetailError ? (
						<div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center">
							<div className="text-center max-w-md px-4">
								<h2 className="text-2xl font-semibold mb-3">Error al cargar detalles</h2>
								<p className="text-muted-foreground mb-6">{(detailError as any)?.message || "No se pudieron cargar los detalles de la película."}</p>
								<div className="flex gap-3 justify-center">
									<button onClick={() => refetchDetail()} className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover-elevate active-elevate-2">
										Reintentar
									</button>
									<button onClick={() => setSelectedMovieId(null)} className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md hover-elevate active-elevate-2">
										Cerrar
									</button>
								</div>
							</div>
						</div>
					) : (
						selectedMovieData && (
							<MovieDetail
								title={selectedMovieData.titulo}
								synopsis={selectedMovieData.sinopsis || "Sin sinopsis disponible"}
								backdrop={selectedMovieData.image_url ? `${API_BASE_URL}${selectedMovieData.image_url}` : heroImage}
								director={selectedMovieData.director}
								genre={selectedMovieData.genero}
								year={selectedMovieData.año}
								duration={selectedMovieData.duracion}
								rating={selectedMovieData.clasificacion}
								isFavorite={isFavorite(selectedMovieId)}
								onClose={() => setSelectedMovieId(null)}
								onPlay={() => console.log("Play from detail")}
								onToggleFavorite={() => toggleFavorite(selectedMovieId)}
							/>
						)
					)}
				</>
			)}
		</>
	);
}
