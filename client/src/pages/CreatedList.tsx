import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { moviesAPI, Movie } from '../lib/api';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../lib/auth';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { Film, Plus, Edit, Trash2, Clock, Calendar, Star, ArrowLeft } from 'lucide-react';

export default function CreatedList() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Esperar a que termine la autenticación
    if (isAuthLoading) return;
    
    if (!user) {
      toast({
        title: 'Error',
        description: 'Debes iniciar sesión para ver tus películas',
        variant: 'destructive',
      });
      setLocation('/login');
      return;
    }
    
    loadMovies();
  }, [user, isAuthLoading]);  const loadMovies = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('Cargando películas del usuario:', user.id);
      const response = await moviesAPI.getMoviesByUser(user.id);
      console.log('Películas cargadas:', response.length);
      setMovies(response);
    } catch (error: any) {
      console.error('Error cargando películas:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudieron cargar las películas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (movieId: number) => {
    setLocation(`/edit-movie/${movieId}`);
  };

  const handleDeleteClick = (movie: Movie) => {
    setMovieToDelete(movie);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!movieToDelete) return;

    setDeleting(true);
    try {
      await moviesAPI.deleteMovie(movieToDelete.id);
      toast({
        title: 'Película eliminada',
        description: `"${movieToDelete.titulo}" se eliminó correctamente`,
      });
      
      // Recargar las películas
      await loadMovies();
      
      setDeleteDialogOpen(false);
      setMovieToDelete(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo eliminar la película',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleCreateNew = () => {
    setLocation('/create-movie');
  };

  if (isAuthLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <Film className="w-12 h-12 mx-auto animate-pulse text-red-600" />
          <p className="text-white text-lg">
            {isAuthLoading ? 'Verificando autenticación...' : 'Cargando películas...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black">
      {/* Header */}
      <div className="pt-24 pb-12 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => setLocation('/')}
          className="text-white hover:text-red-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver al inicio
        </Button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">
              Mis Películas Creadas
            </h1>
            <p className="text-zinc-400 text-lg">
              Administra tu catálogo de películas
            </p>
          </div>
          <Button
            onClick={handleCreateNew}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-6 text-base"
          >
            <Plus className="w-5 h-5 mr-2" />
            Crear Nueva Película
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-8 lg:px-12 max-w-7xl mx-auto pb-16">
        {movies.length === 0 ? (
          // Empty State
          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                <Film className="w-10 h-10 text-zinc-600" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                No hay películas creadas
              </h3>
              <p className="text-zinc-400 text-center mb-8 max-w-md">
                Comienza a construir tu catálogo agregando tu primera película.
              </p>
              <Button
                onClick={handleCreateNew}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-base"
              >
                <Plus className="w-5 h-5 mr-2" />
                Crear Mi Primera Película
              </Button>
            </CardContent>
          </Card>
        ) : (
          // Movies Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <Card
                key={movie.id}
                className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm overflow-hidden group hover:border-red-600/50 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-video bg-zinc-800 overflow-hidden">
                  {movie.image_url ? (
                    <img
                      src={ 'http://localhost:8000'+movie.image_url}
                      alt={movie.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="w-12 h-12 text-zinc-600" />
                    </div>
                  )}
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(movie.id)}
                          size="sm"
                          className="flex-1 bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border-0"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(movie)}
                          size="sm"
                          variant="destructive"
                          className="flex-1 bg-red-600/80 hover:bg-red-600 backdrop-blur-md"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white line-clamp-1 mb-1">
                      {movie.titulo}
                    </h3>
                    <p className="text-sm text-zinc-400 line-clamp-1">
                      {movie.director}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{movie.año}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{movie.duracion} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      <span>{movie.clasificacion}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800">
                    <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded-full">
                      {movie.genero}
                    </span>
                  </div>

                  {movie.sinopsis && (
                    <p className="text-xs text-zinc-500 line-clamp-2">
                      {movie.sinopsis}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-xl">
              ¿Eliminar película?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              ¿Estás seguro de que deseas eliminar "{movieToDelete?.titulo}"? Esta acción no se puede deshacer
              y se eliminarán todos los datos asociados, incluyendo la imagen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
              disabled={deleting}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
