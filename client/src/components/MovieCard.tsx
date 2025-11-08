import { Play, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MovieCardProps {
  id: number;
  title: string;
  image: string;
  year?: number;
  rating?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onClick?: () => void;
}

export default function MovieCard({
  id,
  title,
  image,
  year,
  rating,
  isFavorite = false,
  onToggleFavorite,
  onClick,
}: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative cursor-pointer rounded-md overflow-hidden transition-all duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      data-testid={`card-movie-${id}`}
    >
      <div className="aspect-[2/3] relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        
        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            <h3 className="font-semibold text-sm line-clamp-2" data-testid={`text-title-${id}`}>
              {title}
            </h3>
            {(year || rating) && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {year && <span data-testid={`text-year-${id}`}>{year}</span>}
                {rating && <span className="px-1.5 py-0.5 border border-border rounded text-xs" data-testid={`text-rating-${id}`}>{rating}</span>}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" className="flex-1" data-testid={`button-play-${id}`}>
                <Play className="w-3 h-3 mr-1" />
                Reproducir
              </Button>
              <Button
                size="icon"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite?.();
                }}
                data-testid={`button-favorite-${id}`}
              >
                {isFavorite ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {!isHovered && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.();
            }}
            data-testid={`button-favorite-quick-${id}`}
          >
            {isFavorite ? (
              <Check className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
