import { useState } from "react";
import Header from "@/components/Header";
import MovieGrid from "@/components/MovieGrid";
import MovieDetail from "@/components/MovieDetail";
import Footer from "@/components/Footer";

import heroImage from '@assets/generated_images/Hero_banner_landscape_f64e120d.png';
import poster1 from '@assets/generated_images/Sci-fi_thriller_poster_88fc24fd.png';
import poster2 from '@assets/generated_images/Action_adventure_poster_f492de19.png';
import poster5 from '@assets/generated_images/Comedy_film_poster_00a4c9b8.png';

export default function MyList() {
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set([2, 5, 12]));

  const favoriteMovies = [
    { id: 2, title: "The Dark Knight", image: poster2, year: 2008, rating: "PG-13", isFavorite: true },
    { id: 5, title: "Dunkirk", image: poster5, year: 2017, rating: "PG-13", isFavorite: true },
    { id: 12, title: "John Wick", image: poster1, year: 2014, rating: "R", isFavorite: true },
  ];

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
    console.log('Toggled favorite for movie:', id);
  };

  const handleMovieClick = (id: number) => {
    setSelectedMovie(id);
    console.log('Selected movie:', id);
  };

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

      {selectedMovie !== null && (
        <MovieDetail
          title="The Dark Knight"
          synopsis="Batman raises the stakes in his war on crime in Gotham City. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker."
          backdrop={heroImage}
          director="Christopher Nolan"
          genre="Acción, Drama, Thriller"
          year={2008}
          duration={152}
          rating="PG-13"
          isFavorite={favorites.has(selectedMovie)}
          onClose={() => setSelectedMovie(null)}
          onPlay={() => console.log('Play from detail')}
          onToggleFavorite={() => {
            toggleFavorite(selectedMovie);
          }}
        />
      )}
    </div>
  );
}
