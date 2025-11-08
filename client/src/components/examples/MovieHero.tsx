import MovieHero from '../MovieHero';
import heroImage from '@assets/generated_images/Cityscape_hero_banner_7ee16f15.png';
import { useState } from 'react';

export default function MovieHeroExample() {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <MovieHero
      title="The Matrix Resurrections"
      synopsis="Return to a world of two realities: one, everyday life; the other, what lies behind it. To find out if his reality is a physical or mental construct, to truly know himself, Mr. Anderson will have to choose to follow the white rabbit once more."
      backdrop={heroImage}
      year={2021}
      rating="R"
      duration={148}
      isFavorite={isFavorite}
      onPlay={() => console.log('Play clicked')}
      onToggleFavorite={() => {
        setIsFavorite(!isFavorite);
        console.log('Toggle favorite');
      }}
      onMoreInfo={() => console.log('More info clicked')}
    />
  );
}
