import { useState, useEffect, useCallback } from 'react';
import { authService } from '../proxy/services';

/**
 * Hook para manejar autenticación
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(() => {
    try {
      const isAuth = authService.isAuthenticated();
      const userData = authService.getCurrentUser();
      
      setIsAuthenticated(isAuth);
      setUser(userData);
      setError(null);
    } catch (err) {
      setError(err.message);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (identifier, password) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await authService.login(identifier, password);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        return result;
      }
      
      throw new Error(result.message || 'Error al iniciar sesión');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await authService.register(userData);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        return result;
      }
      
      throw new Error(result.message || 'Error al registrar usuario');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    try {
      authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const isAdmin = useCallback(() => {
    return authService.isAdmin();
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    isAdmin,
    checkAuth
  };
};
