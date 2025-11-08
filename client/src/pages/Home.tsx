import { useState } from "react";
import Header from "@/components/Header";
import MovieHero from "@/components/MovieHero";
import MovieGrid from "@/components/MovieGrid";
import MovieDetail from "@/components/MovieDetail";
import Footer from "@/components/Footer";

import heroImage from '@assets/generated_images/Cityscape_hero_banner_7ee16f15.png';
import poster1 from '@assets/generated_images/Sci-fi_thriller_poster_88fc24fd.png';
import poster2 from '@assets/generated_images/Action_adventure_poster_f492de19.png';
import poster3 from '@assets/generated_images/Romantic_drama_poster_b639f1fb.png';
import poster4 from '@assets/generated_images/Horror_thriller_poster_9b7f00e0.png';
import poster5 from '@assets/generated_images/Comedy_film_poster_00a4c9b8.png';
import poster6 from '@assets/generated_images/Fantasy_epic_poster_f94e6dc9.png';

export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set([2, 5]));

  const trendingMovies = [
    { id: 1, title: "Inception", image: poster1, year: 2010, rating: "PG-13", isFavorite: favorites.has(1) },
    { id: 2, title: "The Dark Knight", image: poster2, year: 2008, rating: "PG-13", isFavorite: favorites.has(2) },
    { id: 3, title: "Interstellar", image: poster3, year: 2014, rating: "PG-13", isFavorite: favorites.has(3) },
    { id: 4, title: "The Prestige", image: poster4, year: 2006, rating: "PG-13", isFavorite: favorites.has(4) },
    { id: 5, title: "Dunkirk", image: poster5, year: 2017, rating: "PG-13", isFavorite: favorites.has(5) },
  ];

  const popularMovies = [
    { id: 6, title: "Tenet", image: poster6, year: 2020, rating: "PG-13", isFavorite: favorites.has(6) },
    { id: 7, title: "Memento", image: poster1, year: 2000, rating: "R", isFavorite: favorites.has(7) },
    { id: 8, title: "The Batman", image: poster2, year: 2022, rating: "PG-13", isFavorite: favorites.has(8) },
    { id: 9, title: "Oppenheimer", image: poster3, year: 2023, rating: "R", isFavorite: favorites.has(9) },
    { id: 10, title: "The Departed", image: poster4, year: 2006, rating: "R", isFavorite: favorites.has(10) },
  ];

  const actionMovies = [
    { id: 11, title: "Mad Max", image: poster5, year: 2015, rating: "R", isFavorite: favorites.has(11) },
    { id: 12, title: "John Wick", image: poster6, year: 2014, rating: "R", isFavorite: favorites.has(12) },
    { id: 13, title: "Extraction", image: poster1, year: 2020, rating: "R", isFavorite: favorites.has(13) },
    { id: 14, title: "Mission Impossible", image: poster2, year: 2018, rating: "PG-13", isFavorite: favorites.has(14) },
    { id: 15, title: "The Raid", image: poster3, year: 2011, rating: "R", isFavorite: favorites.has(15) },
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
      
      <MovieHero
        title="The Matrix Resurrections"
        synopsis="Return to a world of two realities: one, everyday life; the other, what lies behind it. To find out if his reality is a physical or mental construct, to truly know himself, Mr. Anderson will have to choose to follow the white rabbit once more."
        backdrop={heroImage}
        year={2021}
        rating="R"
        duration={148}
        isFavorite={favorites.has(999)}
        onPlay={() => console.log('Play hero movie')}
        onToggleFavorite={() => toggleFavorite(999)}
        onMoreInfo={() => handleMovieClick(999)}
      />

      <div className="space-y-12 py-12">
        <MovieGrid
          title="Tendencias ahora"
          movies={trendingMovies}
          showNavigation={true}
          onMovieClick={handleMovieClick}
          onToggleFavorite={toggleFavorite}
        />

        <MovieGrid
          title="Popular en CineStream"
          movies={popularMovies}
          showNavigation={true}
          onMovieClick={handleMovieClick}
          onToggleFavorite={toggleFavorite}
        />

        <MovieGrid
          title="Películas de Acción"
          movies={actionMovies}
          showNavigation={true}
          onMovieClick={handleMovieClick}
          onToggleFavorite={toggleFavorite}
        />
      </div>

      <Footer />

      {selectedMovie !== null && (
        <MovieDetail
          title="Inception"
          synopsis="Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state, when the mind is at its most vulnerable. Cobb's rare ability has made him a coveted player in this treacherous new world of corporate espionage, but it has also made him an international fugitive and cost him everything he has ever loved."
          backdrop={heroImage}
          director="Christopher Nolan"
          genre="Ciencia Ficción, Acción, Thriller"
          year={2010}
          duration={148}
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
