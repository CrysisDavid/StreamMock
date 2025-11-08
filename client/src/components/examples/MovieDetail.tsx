import MovieDetail from '../MovieDetail';
import backdrop from '@assets/generated_images/Hero_banner_landscape_f64e120d.png';
import { useState } from 'react';

export default function MovieDetailExample() {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <div className="p-8 text-center">
        <button
          onClick={() => setIsOpen(true)}
          className="text-primary underline"
        >
          Abrir modal de detalle
        </button>
      </div>
    );
  }

  return (
    <MovieDetail
      title="Inception"
      synopsis="Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state, when the mind is at its most vulnerable. Cobb's rare ability has made him a coveted player in this treacherous new world of corporate espionage, but it has also made him an international fugitive and cost him everything he has ever loved."
      backdrop={backdrop}
      director="Christopher Nolan"
      genre="Ciencia Ficción, Acción, Thriller"
      year={2010}
      duration={148}
      rating="PG-13"
      isFavorite={isFavorite}
      onClose={() => setIsOpen(false)}
      onPlay={() => console.log('Play clicked')}
      onToggleFavorite={() => {
        setIsFavorite(!isFavorite);
        console.log('Toggle favorite');
      }}
    />
  );
}
