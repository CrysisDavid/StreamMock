import MovieCard from "./MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Movie {
	id: number;
	title: string;
	image: string;
	year?: number;
	rating?: string;
	isFavorite?: boolean;
}

interface MovieGridProps {
	title: string;
	movies: Movie[];
	onMovieClick?: (id: number) => void;
	onToggleFavorite?: (id: number) => void;
}

export default function MovieGrid({ title, movies, onMovieClick, onToggleFavorite }: MovieGridProps) {
	return (
		<div className="space-y-4" data-testid="section-movie-grid">
			<div className="flex items-center justify-between px-4 md:px-8">
				<h2 className="text-xl md:text-2xl font-semibold" data-testid="text-grid-title">
					{title}
				</h2>
			</div>

			<div className="px-4 md:px-8">
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
					{movies.map((movie) => (
						<MovieCard key={movie.id} {...movie} onClick={() => onMovieClick?.(movie.id)} onToggleFavorite={() => onToggleFavorite?.(movie.id)} />
					))}
				</div>
			</div>
		</div>
	);
}
