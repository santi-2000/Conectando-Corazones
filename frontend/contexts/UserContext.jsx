import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simular carga de usuario (aquí iría la lógica real de autenticación)
  useEffect(() => {
    // Simular carga de usuario
    const loadUser = async () => {
      try {
        // Aquí iría la llamada al backend para obtener el usuario actual
        // Por ahora simulamos un usuario administrador
        const mockUser = {
          id: 1,
          nombre: 'Administrador',
          correo: 'admin@fafore.com',
          rol: 'Administrador',
          isAdmin: true
        };
        
        setUser(mockUser);
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    // Aquí iría la lógica de logout
  };

  const value = {
    user,
    isLoading,
    updateUser,
    logout,
    isAdmin: user?.isAdmin || false,
    isUser: user?.rol === 'Usuario',
    isModerator: user?.rol === 'Moderador',
    isEditor: user?.rol === 'Editor'
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
