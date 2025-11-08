import MovieCard from '../MovieCard';
import poster1 from '@assets/generated_images/Sci-fi_thriller_poster_88fc24fd.png';
import { useState } from 'react';

export default function MovieCardExample() {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="w-64 p-4">
      <MovieCard
        id={1}
        title="Inception"
        image={poster1}
        year={2010}
        rating="PG-13"
        isFavorite={isFavorite}
        onToggleFavorite={() => {
          setIsFavorite(!isFavorite);
          console.log('Toggle favorite');
        }}
        onClick={() => console.log('Movie clicked')}
      />
    </div>
  );
}
