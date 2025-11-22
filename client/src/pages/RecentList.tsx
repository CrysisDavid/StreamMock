import MovieDetail from "@/components/MovieDetail";
import React from "react";
import { useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { useMovie, useRecentMovies } from "@/hooks/useMovies";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MovieHero from "@/components/MovieHero";
import MovieGrid from "@/components/MovieGrid";

import heroImage from "@assets/generated_images/Cityscape_hero_banner_7ee16f15.png";

const RecentList = () => {
	const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

	const { data: movies, isLoading, isError, error, refetch } = useRecentMovies(50);
	const { data: selectedMovieData, isError: isDetailError, error: detailError, refetch: refetchDetail } = useMovie(selectedMovieId || 0);
	const { isFavorite, toggleFavorite } = useFavorites();

	const API_BASE_URL = "http://localhost:8000";

	const recentMovies = (movies || []).map((movie) => ({
		id: movie.id,
		title: movie.titulo,
		image: movie.image_url ? `${API_BASE_URL}${movie.image_url}` : heroImage,
		year: movie.año,
		rating: movie.clasificacion,
		isFavorite: isFavorite(movie.id),
	}));

	const heroMovie = movies && movies.length > 0 ? movies[0] : null;

	const handleMovieClick = (id: number) => {
		setSelectedMovieId(id);
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
					<p className="mt-4 text-muted-foreground">Cargando películas...</p>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="min-h-screen">
				<Header />
				<div className="flex items-center justify-center min-h-[60vh]">
					<div className="text-center max-w-md px-4">
						<h2 className="text-2xl font-semibold mb-3">Error al cargar películas</h2>
						<p className="text-muted-foreground mb-6">{(error as any)?.message || "No se pudieron cargar las películas. Por favor, verifica tu conexión."}</p>
						<button onClick={() => refetch()} className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover-elevate active-elevate-2" data-testid="button-retry">
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

			{heroMovie && (
				<MovieHero
					title={heroMovie.titulo}
					synopsis={heroMovie.sinopsis || "Sin sinopsis disponible"}
					backdrop={heroMovie.image_url ? `${API_BASE_URL}${heroMovie.image_url}` : heroImage}
					year={heroMovie.año}
					rating={heroMovie.clasificacion}
					duration={heroMovie.duracion}
					isFavorite={isFavorite(heroMovie.id)}
					onPlay={() => console.log("Play hero movie")}
					onToggleFavorite={() => toggleFavorite(heroMovie.id)}
					onMoreInfo={() => handleMovieClick(heroMovie.id)}
				/>
			)}

			<div className="space-y-12 py-12">
				<MovieGrid title="Películas Recientes" movies={recentMovies} onMovieClick={handleMovieClick} onToggleFavorite={toggleFavorite} />
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
									<button
										onClick={() => refetchDetail()}
										className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover-elevate active-elevate-2"
										data-testid="button-retry-detail"
									>
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
};

export default RecentList;
