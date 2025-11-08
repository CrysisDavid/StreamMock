import { Play, Plus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieDetailProps {
  title: string;
  synopsis: string;
  backdrop: string;
  director: string;
  genre: string;
  year: number;
  duration: number;
  rating: string;
  isFavorite?: boolean;
  onClose?: () => void;
  onPlay?: () => void;
  onToggleFavorite?: () => void;
}

export default function MovieDetail({
  title,
  synopsis,
  backdrop,
  director,
  genre,
  year,
  duration,
  rating,
  isFavorite = false,
  onClose,
  onPlay,
  onToggleFavorite,
}: MovieDetailProps) {
  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen">
        <div className="relative min-h-[60vh] flex items-end">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backdrop})` }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />

          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm"
            data-testid="button-close-detail"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pb-12 w-full">
            <div className="max-w-3xl space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold" data-testid="text-detail-title">
                {title}
              </h1>

              <div className="flex flex-wrap items-center gap-3">
                <Button size="lg" variant="secondary" onClick={onPlay} className="bg-white text-black hover:bg-white/90" data-testid="button-detail-play">
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Reproducir
                </Button>
                <Button size="lg" variant="secondary" onClick={onToggleFavorite} data-testid="button-detail-favorite">
                  {isFavorite ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      En Mi Lista
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Agregar a Mi Lista
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Sinopsis</h2>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-detail-synopsis">
                  {synopsis}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm text-muted-foreground mb-2">Director</h3>
                <p className="font-medium" data-testid="text-detail-director">{director}</p>
              </div>

              <div>
                <h3 className="text-sm text-muted-foreground mb-2">Género</h3>
                <p className="font-medium" data-testid="text-detail-genre">{genre}</p>
              </div>

              <div>
                <h3 className="text-sm text-muted-foreground mb-2">Año</h3>
                <p className="font-medium" data-testid="text-detail-year">{year}</p>
              </div>

              <div>
                <h3 className="text-sm text-muted-foreground mb-2">Duración</h3>
                <p className="font-medium" data-testid="text-detail-duration">{duration} minutos</p>
              </div>

              <div>
                <h3 className="text-sm text-muted-foreground mb-2">Clasificación</h3>
                <p className="font-medium" data-testid="text-detail-rating">{rating}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
