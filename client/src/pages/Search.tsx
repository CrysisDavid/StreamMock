import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MovieGrid from "@/components/MovieGrid";
import MovieDetail from "@/components/MovieDetail";
import { useSearchMovies, useMovie } from "@/hooks/useMovies";
import { useFavorites } from "@/hooks/useFavorites";

import heroImage from "@assets/generated_images/Cityscape_hero_banner_7ee16f15.png";

export default function Search() {
	const [location] = useLocation();
	const searchParams = new URLSearchParams(location.split("?")[1]);
	const query = searchParams.get("q") || "";

	const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

	const searchParamsObj = query
		? {
				titulo: query,
		  }
		: {};

	const { data: movies, isLoading, isError, error, refetch } = useSearchMovies(searchParamsObj);
	const { data: selectedMovieData, isError: isDetailError, error: detailError, refetch: refetchDetail } = useMovie(selectedMovieId || 0);
	const { isFavorite, toggleFavorite } = useFavorites();

	const API_BASE_URL = "http://localhost:8000";

	const searchResults = (movies || []).map((movie) => ({
		id: movie.id,
		title: movie.titulo,
		image: movie.image_url ? `${API_BASE_URL}${movie.image_url}` : heroImage,
		year: movie.año,
		rating: movie.clasificacion,
		isFavorite: isFavorite(movie.id),
	}));

	const handleMovieClick = (id: number) => {
		setSelectedMovieId(id);
	};

	if (isLoading) {
		return (
			<div className="min-h-screen">
				<Header />
				<div className="pt-24 flex items-center justify-center min-h-[60vh]">
					<div className="text-center">
						<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
						<p className="mt-4 text-muted-foreground">Buscando películas...</p>
					</div>
				</div>
				<Footer />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="min-h-screen">
				<Header />
				<div className="pt-24 flex items-center justify-center min-h-[60vh]">
					<div className="text-center max-w-md px-4">
						<h2 className="text-2xl font-semibold mb-3">Error en la búsqueda</h2>
						<p className="text-muted-foreground mb-6">{(error as any)?.message || "No se pudo realizar la búsqueda. Por favor, inténtalo de nuevo."}</p>
						<button onClick={() => refetch()} className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover-elevate active-elevate-2">
							Reintentar
						</button>
					</div>
				</div>
				<Footer />
			</div>
		);
	}

	return (
		<div className="min-h-screen">
			<Header />

			<div className="pt-24 pb-12">
				<div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
					<h1 className="text-3xl md:text-4xl font-bold mb-2">{query ? `Resultados para "${query}"` : "Búsqueda"}</h1>
					{searchResults.length > 0 && <p className="text-muted-foreground mb-8">{searchResults.length} películas encontradas</p>}
				</div>

				{!query ? (
					<div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 text-center py-20">
						<p className="text-muted-foreground text-lg">Usa el cuadro de búsqueda arriba para encontrar películas</p>
					</div>
				) : searchResults.length === 0 ? (
					<div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 text-center py-20">
						<h2 className="text-2xl font-semibold mb-3">No se encontraron resultados</h2>
						<p className="text-muted-foreground">Intenta con otros términos de búsqueda</p>
					</div>
				) : (
					<div className="space-y-12">
						<MovieGrid title="" movies={searchResults} onMovieClick={handleMovieClick} onToggleFavorite={toggleFavorite} />
					</div>
				)}
			</div>

			<Footer />

			{selectedMovieId !== null && (
				<>
					{isDetailError ? (
						<div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center">
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
		</div>
	);
}
