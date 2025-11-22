import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { moviesAPI, CreateMovieRequest, UpdateMovieRequest, SearchMovieParams } from "@/lib/api";

export function useMovies(page = 1, limit = 20) {
	return useQuery({
		queryKey: ["/api/peliculas", page, limit],
		queryFn: () => moviesAPI.getMovies(page, limit),
		retry: 2,
	});
}

export function useMovie(id: number) {
	return useQuery({
		queryKey: ["/api/peliculas", id],
		queryFn: () => moviesAPI.getMovie(id),
		enabled: id > 0,
		retry: 2,
	});
}

export function useSearchMovies(params: SearchMovieParams) {
	return useQuery({
		queryKey: ["/api/peliculas/buscar", params],
		queryFn: () => moviesAPI.searchMovies(params),
		enabled: Object.keys(params).length > 0,
	});
}

export function usePopularMovies(limit = 10) {
	return useQuery({
		queryKey: ["/api/peliculas/populares/top", limit],
		queryFn: () => moviesAPI.getPopularMovies(limit),
		retry: 2,
	});
}

export function useRecentMovies(limit = 10) {
	return useQuery({
		queryKey: ["/api/peliculas/recientes/nuevas", limit],
		queryFn: () => moviesAPI.getRecentMovies(limit),
		retry: 2,
	});
}

export function useMoviesByClassification(clasificacion: string, limit = 10) {
	return useQuery({
		queryKey: ["/api/peliculas/clasificacion", clasificacion, limit],
		queryFn: () => moviesAPI.getMoviesByClassification(clasificacion, limit),
		enabled: clasificacion.length > 0,
		retry: 2,
	});
}

export function useCreateMovie() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateMovieRequest) => moviesAPI.createMovie(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["/api/peliculas"] });
		},
	});
}

export function useUpdateMovie(id: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateMovieRequest) => moviesAPI.updateMovie(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["/api/peliculas"] });
			queryClient.invalidateQueries({ queryKey: ["/api/peliculas", id] });
		},
	});
}

export function useDeleteMovie() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => moviesAPI.deleteMovie(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["/api/peliculas"] });
		},
	});
}

export function useUploadMovieImage(id: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (file: File) => moviesAPI.uploadImage(id, file),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["/api/peliculas", id] });
		},
	});
}

export function useDeleteMovieImage(id: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => moviesAPI.deleteImage(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["/api/peliculas", id] });
		},
	});
}
