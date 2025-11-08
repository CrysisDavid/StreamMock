import { Play, Plus, Info, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieHeroProps {
  title: string;
  synopsis: string;
  backdrop: string;
  year?: number;
  rating?: string;
  duration?: number;
  isFavorite?: boolean;
  onPlay?: () => void;
  onToggleFavorite?: () => void;
  onMoreInfo?: () => void;
}

export default function MovieHero({
  title,
  synopsis,
  backdrop,
  year,
  rating,
  duration,
  isFavorite = false,
  onPlay,
  onToggleFavorite,
  onMoreInfo,
}: MovieHeroProps) {
  return (
    <div className="relative min-h-[70vh] md:min-h-[85vh] flex items-end">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backdrop})` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pb-16 md:pb-24 w-full">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight" data-testid="text-hero-title">
            {title}
          </h1>

          {(year || rating || duration) && (
            <div className="flex items-center gap-4 text-sm md:text-base">
              {year && <span className="font-medium" data-testid="text-hero-year">{year}</span>}
              {rating && (
                <span className="px-2 py-1 border border-border rounded text-xs font-medium" data-testid="text-hero-rating">
                  {rating}
                </span>
              )}
              {duration && <span data-testid="text-hero-duration">{duration} min</span>}
            </div>
          )}

          <p className="text-base md:text-lg text-foreground/90 line-clamp-3 md:line-clamp-4" data-testid="text-hero-synopsis">
            {synopsis}
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              variant="secondary"
              onClick={onPlay}
              className="bg-white text-black hover:bg-white/90"
              data-testid="button-hero-play"
            >
              <Play className="w-5 h-5 mr-2 fill-current" />
              Reproducir
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={onToggleFavorite}
              data-testid="button-hero-favorite"
            >
              {isFavorite ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  En Mi Lista
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Mi Lista
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={onMoreInfo}
              data-testid="button-hero-info"
            >
              <Info className="w-5 h-5 mr-2" />
              Más información
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
