import MovieGrid from '../MovieGrid';
import poster1 from '@assets/generated_images/Sci-fi_thriller_poster_88fc24fd.png';
import poster2 from '@assets/generated_images/Action_adventure_poster_f492de19.png';
import poster3 from '@assets/generated_images/Romantic_drama_poster_b639f1fb.png';
import poster4 from '@assets/generated_images/Horror_thriller_poster_9b7f00e0.png';
import poster5 from '@assets/generated_images/Comedy_film_poster_00a4c9b8.png';

const mockMovies = [
  { id: 1, title: "Inception", image: poster1, year: 2010, rating: "PG-13", isFavorite: false },
  { id: 2, title: "The Dark Knight", image: poster2, year: 2008, rating: "PG-13", isFavorite: true },
  { id: 3, title: "Interstellar", image: poster3, year: 2014, rating: "PG-13", isFavorite: false },
  { id: 4, title: "The Prestige", image: poster4, year: 2006, rating: "PG-13", isFavorite: false },
  { id: 5, title: "Dunkirk", image: poster5, year: 2017, rating: "PG-13", isFavorite: false },
];

export default function MovieGridExample() {
  return (
    <MovieGrid
      title="Popular en CineStream"
      movies={mockMovies}
      showNavigation={true}
      onMovieClick={(id) => console.log('Movie clicked:', id)}
      onToggleFavorite={(id) => console.log('Toggle favorite:', id)}
    />
  );
}
