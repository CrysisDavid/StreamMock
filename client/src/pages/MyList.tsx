import { useState } from "react";
import Header from "@/components/Header";
import MovieGrid from "@/components/MovieGrid";
import MovieDetail from "@/components/MovieDetail";
import Footer from "@/components/Footer";
import { useFavorites } from "@/hooks/useFavorites";
import { useMovie } from "@/hooks/useMovies";

import heroImage from '@assets/generated_images/Hero_banner_landscape_f64e120d.png';

export default function MyList() {
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const { favorites, isLoading, isError, error, refetch, toggleFavorite, isFavorite } = useFavorites();
  const { data: selectedMovieData, isError: isDetailError, error: detailError, refetch: refetchDetail } = useMovie(selectedMovieId || 0);

  const API_BASE_URL = 'http://localhost:8000';

  const favoriteMovies = favorites.map(movie => ({
    id: movie.id,
    title: movie.titulo,
    image: movie.image_url ? `${API_BASE_URL}${movie.image_url}` : heroImage,
    year: movie.año,
    rating: movie.clasificacion,
    isFavorite: true,
  }));

  const handleMovieClick = (id: number) => {
    setSelectedMovieId(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-24 pb-12 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Cargando tu lista...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold" data-testid="text-mylist-title">
              Mi Lista
            </h1>
          </div>
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="text-center max-w-md px-4">
              <h2 className="text-2xl font-semibold mb-3">Error al cargar favoritos</h2>
              <p className="text-muted-foreground mb-6">
                {(error as any)?.message || 'No se pudieron cargar tus películas favoritas.'}
              </p>
              <button
                onClick={() => refetch()}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover-elevate active-elevate-2"
                data-testid="button-retry-favorites"
              >
                Reintentar
              </button>
            </div>
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
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold" data-testid="text-mylist-title">
            Mi Lista
          </h1>
          <p className="text-muted-foreground mt-2" data-testid="text-mylist-subtitle">
            Películas que has guardado para ver más tarde
          </p>
        </div>

        {favoriteMovies.length > 0 ? (
          <MovieGrid
            title=""
            movies={favoriteMovies}
            onMovieClick={handleMovieClick}
            onToggleFavorite={toggleFavorite}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 md:px-8 text-center py-24">
            <div className="max-w-md mx-auto space-y-4">
              <h2 className="text-2xl font-semibold" data-testid="text-empty-title">
                Tu lista está vacía
              </h2>
              <p className="text-muted-foreground" data-testid="text-empty-description">
                Agrega películas a tu lista para verlas más tarde
              </p>
            </div>
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
                <p className="text-muted-foreground mb-6">
                  {(detailError as any)?.message || 'No se pudieron cargar los detalles de la película.'}
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => refetchDetail()}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover-elevate active-elevate-2"
                    data-testid="button-retry-detail"
                  >
                    Reintentar
                  </button>
                  <button
                    onClick={() => setSelectedMovieId(null)}
                    className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md hover-elevate active-elevate-2"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          ) : selectedMovieData && (
            <MovieDetail
              title={selectedMovieData.titulo}
              synopsis={selectedMovieData.sinopsis || 'Sin sinopsis disponible'}
              backdrop={selectedMovieData.image_url ? `${API_BASE_URL}${selectedMovieData.image_url}` : heroImage}
              director={selectedMovieData.director}
              genre={selectedMovieData.genero}
              year={selectedMovieData.año}
              duration={selectedMovieData.duracion}
              rating={selectedMovieData.clasificacion}
              isFavorite={isFavorite(selectedMovieId)}
              onClose={() => setSelectedMovieId(null)}
              onPlay={() => console.log('Play from detail')}
              onToggleFavorite={() => toggleFavorite(selectedMovieId)}
            />
          )}
        </>
      )}
    </div>
  );
}
