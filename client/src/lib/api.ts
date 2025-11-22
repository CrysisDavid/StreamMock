import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

const API_BASE_URL = "http://localhost:8000";

export const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const token = localStorage.getItem("access_token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error: AxiosError) => {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response: AxiosResponse) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const refreshToken = localStorage.getItem("refresh_token");
				if (refreshToken) {
					const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
						refresh_token: refreshToken,
					});

					const { access_token, refresh_token: newRefreshToken } = response.data;
					localStorage.setItem("access_token", access_token);
					localStorage.setItem("refresh_token", newRefreshToken);

					originalRequest.headers.Authorization = `Bearer ${access_token}`;
					return api(originalRequest);
				}
			} catch (refreshError) {
				// Limpiar tokens pero NO redirigir ni limpiar usuario aquí
				// Dejar que el AuthProvider maneje la limpieza
				localStorage.removeItem("access_token");
				localStorage.removeItem("refresh_token");
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

export interface LoginRequest {
	correo: string;
	contraseña: string;
}

export interface RegisterRequest {
	nombre: string;
	correo: string;
	contraseña: string;
	confirmarContraseña: string;
}

export interface UpdateUserRequest {
	nombre?: string;
	correo?: string;
	contraseña?: string;
}

export interface User {
	id: number;
	nombre: string;
	correo: string;
	fecha_registro: string;
}

export interface AuthResponse {
	access_token: string;
	refresh_token: string;
	token_type: string;
	expires_in: number;
	expires_at: string;
	user: User;
}

export interface Movie {
	id: number;
	titulo: string;
	director: string;
	genero: string;
	duracion: number;
	año: number;
	clasificacion: string;
	sinopsis: string;
	fecha_creacion: string;
	image_url: string | null;
}

export interface PaginatedResponse<T> {
	items: T[];
	total_records: number;
	current_pg: number;
	limit: number;
	pages: number;
	has_next: boolean;
	has_prev: boolean;
	next_page: number | null;
	prev_page: number | null;
}

export const authAPI = {
	login: async (credentials: LoginRequest): Promise<AuthResponse> => {
		const response = await api.post("/api/auth/login", credentials);
		return response.data;
	},

	register: async (data: RegisterRequest): Promise<User> => {
		const response = await api.post("/api/usuarios/", data);
		return response.data;
	},

	logout: async (): Promise<void> => {
		await api.post("/api/auth/logout");
	},

	getCurrentUser: async (): Promise<User> => {
		const response = await api.get("/api/auth/me");
		return response.data;
	},

	validateToken: async (): Promise<boolean> => {
		try {
			// Intentar obtener el usuario actual como validación
			await api.get("/api/auth/me");
			return true;
		} catch (error: any) {
			console.log("Token validation failed:", error.response?.status);
			return false;
		}
	},
};

export interface CreateMovieRequest {
	titulo: string;
	director: string;
	genero: string;
	duracion: number;
	año: number;
	clasificacion: string;
	sinopsis?: string;
}

export interface UpdateMovieRequest {
	titulo?: string;
	director?: string;
	genero?: string;
	duracion?: number;
	año?: number;
	clasificacion?: string;
	sinopsis?: string;
}

export interface SearchMovieParams {
	titulo?: string;
	director?: string;
	genero?: string;
	año?: number;
	año_min?: number;
	año_max?: number;
}

export const moviesAPI = {
	getMovies: async (page = 1, limit = 20): Promise<PaginatedResponse<Movie>> => {
		const response = await api.get("/api/peliculas/", {
			params: { page, limit },
		});
		return response.data;
	},

	getMovie: async (id: number): Promise<Movie> => {
		const response = await api.get(`/api/peliculas/${id}`);
		return response.data;
	},

	createMovie: async (data: CreateMovieRequest): Promise<Movie> => {
		const response = await api.post("/api/peliculas/", data);
		return response.data;
	},

	updateMovie: async (id: number, data: UpdateMovieRequest): Promise<Movie> => {
		const response = await api.put(`/api/peliculas/${id}`, data);
		return response.data;
	},

	deleteMovie: async (id: number): Promise<void> => {
		await api.delete(`/api/peliculas/${id}`);
	},

	searchMovies: async (params: SearchMovieParams): Promise<Movie[]> => {
		const response = await api.get("/api/peliculas/buscar/", {
			params: params,
		});
		return response.data;
	},

	getPopularMovies: async (limit = 10): Promise<Movie[]> => {
		const response = await api.get("/api/peliculas/populares/top", {
			params: { limit },
		});
		return response.data;
	},

	getRecentMovies: async (limit = 10): Promise<Movie[]> => {
		const response = await api.get("/api/peliculas/recientes/nuevas", {
			params: { limit },
		});
		return response.data;
	},

	getMoviesByClassification: async (clasificacion: string, limit = 10): Promise<Movie[]> => {
		const response = await api.get(`/api/peliculas/clasificacion/${clasificacion}`, {
			params: { limit },
		});
		return response.data;
	},

	getMoviesByUser: async (userId: number): Promise<Movie[]> => {
		const response = await api.get(`/api/peliculas/usuario/${userId}`);
		return response.data;
	},

	// Gestión de imágenes
	getImageUrl: (movieId: number): string => {
		return `${API_BASE_URL}/api/peliculas/imagen/${movieId}`;
	},

	uploadImage: async (movieId: number, file: File): Promise<{ message: string; image_url: string; pelicula_id: number }> => {
		const formData = new FormData();
		formData.append("image", file);

		const response = await api.post(`/api/peliculas/${movieId}/imagen`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	},

	deleteImage: async (movieId: number): Promise<void> => {
		await api.delete(`/api/peliculas/${movieId}/imagen`);
	},
};

export interface Favorite {
	id: number;
	id_usuario: number;
	id_pelicula: number;
	fecha_marcado: string;
	usuario?: User;
	pelicula?: Movie;
}

export interface FavoriteCheckResponse {
	es_favorito: boolean;
	favorito_id: number | null;
	fecha_marcado: string | null;
	usuario_id: number;
	pelicula_id: number;
}

export const favoritesAPI = {
	getFavorites: async (userId: number): Promise<Movie[]> => {
		const response = await api.get(`/api/usuarios/${userId}/favoritos`);
		return response.data;
	},

	addFavorite: async (userId: number, movieId: number): Promise<void> => {
		await api.post(`/api/usuarios/${userId}/favoritos/${movieId}`);
	},

	removeFavorite: async (userId: number, movieId: number): Promise<void> => {
		await api.delete(`/api/usuarios/${userId}/favoritos/${movieId}`);
	},

	checkFavorite: async (userId: number, movieId: number): Promise<FavoriteCheckResponse> => {
		const response = await api.get(`/api/favoritos/verificar/${userId}/${movieId}`);
		return response.data;
	},

	getAllFavorites: async (page = 1, limit = 10): Promise<PaginatedResponse<Favorite>> => {
		const response = await api.get("/api/favoritos/", {
			params: { page, limit },
		});
		return response.data;
	},

	getFavoriteById: async (favoriteId: number): Promise<Favorite> => {
		const response = await api.get(`/api/favoritos/${favoriteId}`);
		return response.data;
	},

	getFavoritesByUser: async (userId: number, limit = 100): Promise<Favorite[]> => {
		const response = await api.get(`/api/favoritos/usuario/${userId}`, {
			params: { limit },
		});
		return response.data;
	},

	getFavoritesByMovie: async (movieId: number, limit = 100): Promise<Favorite[]> => {
		const response = await api.get(`/api/favoritos/pelicula/${movieId}`, {
			params: { limit },
		});
		return response.data;
	},

	createFavorite: async (userId: number, movieId: number): Promise<{ message: string; detail: string }> => {
		const response = await api.post("/api/favoritos/", {
			id_usuario: userId,
			id_pelicula: movieId,
		});
		return response.data;
	},

	deleteFavorite: async (favoriteId: number): Promise<void> => {
		await api.delete(`/api/favoritos/${favoriteId}`);
	},
};
