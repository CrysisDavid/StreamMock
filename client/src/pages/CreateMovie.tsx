import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { moviesAPI, CreateMovieRequest, UpdateMovieRequest } from '../lib/api';
import { useToast } from '../hooks/use-toast';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Film, Upload, X, ArrowLeft, Save } from 'lucide-react';

const CLASIFICACIONES = ['G', 'PG', 'PG-13', 'R', 'NC-17', 'NR', 'ATP', '+13', '+16', '+18'];

const GENEROS = [
  'Acción',
  'Aventura',
  'Ciencia Ficción',
  'Comedia',
  'Drama',
  'Terror',
  'Romance',
  'Thriller',
  'Animación',
  'Documental',
  'Fantasía',
  'Musical',
  'Suspenso',
  'Western',
];

export default function CreateMovie() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [loadingMovie, setLoadingMovie] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateMovieRequest>({
    titulo: '',
    director: '',
    genero: '',
    duracion: 0,
    año: new Date().getFullYear(),
    clasificacion: 'PG-13',
    sinopsis: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditMode && id) {
      loadMovie(parseInt(id));
    }
  }, [id, isEditMode]);

  const loadMovie = async (movieId: number) => {
    setLoadingMovie(true);
    try {
      const movie = await moviesAPI.getMovie(movieId);
      setFormData({
        titulo: movie.titulo,
        director: movie.director,
        genero: movie.genero,
        duracion: movie.duracion,
        año: movie.año,
        clasificacion: movie.clasificacion,
        sinopsis: movie.sinopsis || '',
      });
      if (movie.image_url) {
        setExistingImageUrl(movie.image_url);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo cargar la película',
        variant: 'destructive',
      });
      setLocation('/created-list');
    } finally {
      setLoadingMovie(false);
    }
  };

  const handleInputChange = (field: keyof CreateMovieRequest, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
        toast({
          title: 'Error',
          description: 'Solo se permiten imágenes JPEG, PNG, JPG o WebP',
          variant: 'destructive',
        });
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'La imagen no debe superar los 50MB',
          variant: 'destructive',
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.titulo.trim() || formData.titulo.length > 200) {
      newErrors.titulo = 'El título es requerido (máx. 200 caracteres)';
    }

    if (!formData.director.trim() || formData.director.length > 150) {
      newErrors.director = 'El director es requerido (máx. 150 caracteres)';
    }

    if (!formData.genero.trim() || formData.genero.length > 100) {
      newErrors.genero = 'El género es requerido (máx. 100 caracteres)';
    }

    if (formData.duracion < 1 || formData.duracion > 600) {
      newErrors.duracion = 'La duración debe estar entre 1 y 600 minutos';
    }

    const currentYear = new Date().getFullYear();
    if (formData.año < 1888 || formData.año > currentYear) {
      newErrors.año = `El año debe estar entre 1888 y ${currentYear}`;
    }

    if (formData.sinopsis && formData.sinopsis.length > 1000) {
      newErrors.sinopsis = 'La sinopsis no puede superar los 1000 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: 'Error de validación',
        description: 'Por favor, corrige los errores en el formulario',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      let movieId: number;

      if (isEditMode && id) {
        // Actualizar película
        const updatedMovie = await moviesAPI.updateMovie(parseInt(id), formData as UpdateMovieRequest);
        movieId = updatedMovie.id;
        toast({
          title: '¡Película actualizada!',
          description: `"${updatedMovie.titulo}" se actualizó correctamente`,
        });

        // Subir imagen si existe (solo en modo edición)
        if (imageFile) {
          try {
            await moviesAPI.uploadImage(movieId, imageFile);
            toast({
              title: 'Imagen subida',
              description: 'La imagen se subió correctamente',
            });
          } catch (error: any) {
            toast({
              title: 'Error al subir imagen',
              description: error.response?.data?.message || 'No se pudo subir la imagen',
              variant: 'destructive',
            });
          }
        }
      } else {
        // Crear nueva película
        const newMovie = await moviesAPI.createMovie(formData);
        toast({
          title: '¡Película creada!',
          description: `"${newMovie.titulo}" se creó exitosamente`,
        });
      }

      // Redirigir a la lista de películas creadas
      setTimeout(() => setLocation('/created-list'), 1000);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo guardar la película',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingMovie) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <Film className="w-12 h-12 mx-auto animate-pulse text-red-600" />
          <p className="text-white text-lg">Cargando película...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="text-white hover:text-red-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </Button>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                {isEditMode ? 'Editar Película' : 'Crear Nueva Película'}
              </h1>
              <p className="text-zinc-400 text-sm md:text-base mt-1">
                {isEditMode
                  ? 'Actualiza los detalles de tu película'
                  : 'Completa la información para agregar una nueva película'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-xl">Información de la Película</CardTitle>
            <CardDescription className="text-zinc-400">
              Todos los campos marcados con * son obligatorios
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Imagen - Solo en modo edición y si no tiene imagen */}
              {isEditMode && !existingImageUrl && (
                <div className="space-y-4">
                  <Label htmlFor="image" className="text-white text-base">
                    Imagen de la Película
                  </Label>
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Preview */}
                    <div className="w-full md:w-64 h-36 bg-zinc-800 rounded-lg overflow-hidden relative group">
                      {imagePreview ? (
                        <>
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500">
                          <Upload className="w-8 h-8 mb-2" />
                          <span className="text-xs">Sin imagen</span>
                        </div>
                      )}
                    </div>

                    {/* Upload Button */}
                    <div className="flex-1">
                      <input
                        type="file"
                        id="image"
                        accept="image/jpeg,image/png,image/jpg,image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <Label
                        htmlFor="image"
                        className="cursor-pointer inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Subir imagen
                      </Label>
                      <p className="text-xs text-zinc-500 mt-2">
                        JPEG, PNG, JPG o WebP. Máximo 50MB. Recomendado 16:9 (landscape)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Título y Director */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="titulo" className="text-white">
                    Título *
                  </Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => handleInputChange('titulo', e.target.value)}
                    placeholder="Ej: Inception"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    maxLength={200}
                  />
                  {errors.titulo && <p className="text-red-500 text-xs">{errors.titulo}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="director" className="text-white">
                    Director *
                  </Label>
                  <Input
                    id="director"
                    value={formData.director}
                    onChange={(e) => handleInputChange('director', e.target.value)}
                    placeholder="Ej: Christopher Nolan"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    maxLength={150}
                  />
                  {errors.director && <p className="text-red-500 text-xs">{errors.director}</p>}
                </div>
              </div>

              {/* Género */}
              <div className="space-y-2">
                <Label htmlFor="genero" className="text-white">
                  Género *
                </Label>
                <Input
                  id="genero"
                  value={formData.genero}
                  onChange={(e) => handleInputChange('genero', e.target.value)}
                  placeholder="Ej: Ciencia Ficción, Acción"
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  maxLength={100}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {GENEROS.map((genero) => (
                    <button
                      key={genero}
                      type="button"
                      onClick={() => handleInputChange('genero', genero)}
                      className="text-xs bg-zinc-800 hover:bg-red-600 text-zinc-300 hover:text-white px-3 py-1 rounded-full transition-colors"
                    >
                      {genero}
                    </button>
                  ))}
                </div>
                {errors.genero && <p className="text-red-500 text-xs">{errors.genero}</p>}
              </div>

              {/* Duración, Año y Clasificación */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="duracion" className="text-white">
                    Duración (min) *
                  </Label>
                  <Input
                    id="duracion"
                    type="number"
                    value={formData.duracion || ''}
                    onChange={(e) => handleInputChange('duracion', parseInt(e.target.value) || 0)}
                    placeholder="148"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    min={1}
                    max={600}
                  />
                  {errors.duracion && <p className="text-red-500 text-xs">{errors.duracion}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="año" className="text-white">
                    Año *
                  </Label>
                  <Input
                    id="año"
                    type="number"
                    value={formData.año || ''}
                    onChange={(e) => handleInputChange('año', parseInt(e.target.value) || new Date().getFullYear())}
                    placeholder="2024"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    min={1888}
                    max={new Date().getFullYear()}
                  />
                  {errors.año && <p className="text-red-500 text-xs">{errors.año}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clasificacion" className="text-white">
                    Clasificación *
                  </Label>
                  <Select
                    value={formData.clasificacion}
                    onValueChange={(value) => handleInputChange('clasificacion', value)}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {CLASIFICACIONES.map((clasificacion) => (
                        <SelectItem key={clasificacion} value={clasificacion} className="text-white">
                          {clasificacion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Sinopsis */}
              <div className="space-y-2">
                <Label htmlFor="sinopsis" className="text-white">
                  Sinopsis
                </Label>
                <Textarea
                  id="sinopsis"
                  value={formData.sinopsis}
                  onChange={(e) => handleInputChange('sinopsis', e.target.value)}
                  placeholder="Escribe una breve descripción de la película..."
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 min-h-[120px] resize-none"
                  maxLength={1000}
                />
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>{errors.sinopsis || 'Opcional'}</span>
                  <span>{formData.sinopsis?.length || 0}/1000</span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="flex-1 bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {isEditMode ? 'Actualizar Película' : 'Crear Película'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
