import { useQuery, useMutation } from '@tanstack/react-query';
import { favoritesAPI } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { useAuth } from '@/lib/auth';
import { useToast } from './use-toast';

export function useFavorites() {
  const { user } = useAuth();
  const { toast } = useToast();

  const favoritesQuery = useQuery({
    queryKey: ['/api/favoritos', user?.id],
    queryFn: () => favoritesAPI.getFavorites(user!.id),
    enabled: !!user,
    retry: 2,
  });

  const addMutation = useMutation({
    mutationFn: ({ movieId }: { movieId: number }) =>
      favoritesAPI.addFavorite(user!.id, movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favoritos', user?.id] });
      toast({
        title: "Agregado a Mi Lista",
        description: "La película se agregó correctamente",
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'No se pudo agregar a favoritos';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: ({ movieId }: { movieId: number }) =>
      favoritesAPI.removeFavorite(user!.id, movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favoritos', user?.id] });
      toast({
        title: "Eliminado de Mi Lista",
        description: "La película se eliminó correctamente",
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'No se pudo eliminar de favoritos';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  });

  const isFavorite = (movieId: number) => {
    return favoritesQuery.data?.some(movie => movie.id === movieId) || false;
  };

  const toggleFavorite = (movieId: number) => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para agregar favoritos",
        variant: "destructive",
      });
      return;
    }

    if (isFavorite(movieId)) {
      removeMutation.mutate({ movieId });
    } else {
      addMutation.mutate({ movieId });
    }
  };

  return {
    favorites: favoritesQuery.data || [],
    isLoading: favoritesQuery.isLoading,
    isError: favoritesQuery.isError,
    error: favoritesQuery.error,
    refetch: favoritesQuery.refetch,
    isFavorite,
    toggleFavorite,
    addToFavorites: (movieId: number) => addMutation.mutate({ movieId }),
    removeFromFavorites: (movieId: number) => removeMutation.mutate({ movieId }),
  };
}
