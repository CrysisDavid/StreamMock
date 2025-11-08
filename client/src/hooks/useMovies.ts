import { useQuery } from '@tanstack/react-query';
import { moviesAPI } from '@/lib/api';

export function useMovies(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['/api/peliculas', page, limit],
    queryFn: () => moviesAPI.getMovies(page, limit),
    retry: 2,
  });
}

export function useMovie(id: number) {
  return useQuery({
    queryKey: ['/api/peliculas', id],
    queryFn: () => moviesAPI.getMovie(id),
    enabled: id > 0,
    retry: 2,
  });
}

export function useSearchMovies(query: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: ['/api/peliculas/buscar', query, page, limit],
    queryFn: () => moviesAPI.searchMovies(query, page, limit),
    enabled: query.length > 0,
  });
}
