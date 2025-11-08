import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
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
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token, refresh_token: newRefreshToken } = response.data;
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
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
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post('/api/usuarios/', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  validateToken: async (): Promise<boolean> => {
    try {
      const response = await api.get('/api/auth/validate');
      return response.data.valid;
    } catch {
      return false;
    }
  },
};

export const moviesAPI = {
  getMovies: async (page = 1, limit = 20): Promise<PaginatedResponse<Movie>> => {
    const response = await api.get('/api/peliculas/', {
      params: { page, limit },
    });
    return response.data;
  },

  getMovie: async (id: number): Promise<Movie> => {
    const response = await api.get(`/api/peliculas/${id}`);
    return response.data;
  },

  searchMovies: async (query: string, page = 1, limit = 20): Promise<PaginatedResponse<Movie>> => {
    const response = await api.get('/api/peliculas/buscar', {
      params: { q: query, page, limit },
    });
    return response.data;
  },
};

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
};
