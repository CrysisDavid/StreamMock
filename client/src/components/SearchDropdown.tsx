import { useState, useEffect, useRef } from "react";
import { Search, Film } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchMovies } from "@/hooks/useMovies";
import heroImage from "@assets/generated_images/Cityscape_hero_banner_7ee16f15.png";

interface SearchDropdownProps {
	onMovieSelect: (movieId: number) => void;
	className?: string;
	placeholder?: string;
}

export default function SearchDropdown({ onMovieSelect, className = "", placeholder = "Buscar películas..." }: SearchDropdownProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [debouncedQuery, setDebouncedQuery] = useState("");
	const dropdownRef = useRef<HTMLDivElement>(null);

	const API_BASE_URL = "http://localhost:8000";

	// Debounce para evitar demasiadas peticiones
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(searchQuery);
		}, 300);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	const searchParams = debouncedQuery.trim() ? { titulo: debouncedQuery.trim() } : {};
	const { data: movies, isLoading } = useSearchMovies(searchParams);

	// Cerrar dropdown al hacer clic fuera
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchQuery(value);
		setIsOpen(value.trim().length > 0);
	};

	const handleMovieClick = (movieId: number) => {
		setIsOpen(false);
		setSearchQuery("");
		onMovieSelect(movieId);
	};

	const displayMovies = movies || [];
	const showResults = isOpen && debouncedQuery.trim().length > 0;

	return (
		<div ref={dropdownRef} className={`relative ${className}`}>
			<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
			<Input
				type="search"
				placeholder={placeholder}
				value={searchQuery}
				onChange={handleInputChange}
				onFocus={() => searchQuery.trim().length > 0 && setIsOpen(true)}
				className="pl-10 w-full bg-secondary border-0"
				data-testid="input-search"
			/>

			{showResults && (
				<div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50 max-h-[400px] overflow-y-auto">
					{isLoading ? (
						<div className="p-4 text-center text-muted-foreground">
							<div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
							<p className="mt-2 text-sm">Buscando...</p>
						</div>
					) : displayMovies.length === 0 ? (
						<div className="p-4 text-center text-muted-foreground">
							<Film className="w-8 h-8 mx-auto mb-2 opacity-50" />
							<p className="text-sm">No se encontraron películas</p>
						</div>
					) : (
						<div className="py-2">
							{displayMovies.map((movie) => (
								<button
									key={movie.id}
									onClick={() => handleMovieClick(movie.id)}
									className="w-full px-4 py-3 flex items-center gap-3 hover:bg-secondary transition-colors text-left"
								>
									<img
										src={movie.image_url ? `${API_BASE_URL}${movie.image_url}` : heroImage}
										alt={movie.titulo}
										className="w-12 h-16 object-cover rounded"
										onError={(e) => {
											e.currentTarget.src = heroImage;
										}}
									/>
									<div className="flex-1 min-w-0">
										<p className="font-medium text-sm truncate">{movie.titulo}</p>
										<div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
											<span>{movie.año}</span>
											<span>•</span>
											<span>{movie.clasificacion}</span>
											<span>•</span>
											<span className="truncate">{movie.genero}</span>
										</div>
									</div>
								</button>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
