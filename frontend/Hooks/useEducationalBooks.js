import { useState, useEffect, useCallback } from 'react';
import { educationalBooksService } from '../proxy/services';

/**
 * Hook para manejar libros educativos
 */
export const useEducationalBooks = (initialFilters = {}) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Cargar libros cuando cambien los filtros
  useEffect(() => {
    loadBooks();
  }, [filters]);

  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await educationalBooksService.getBooks(filters);
      
      setBooks(result.books || []);
      setPagination({
        page: result.page || 1,
        limit: result.limit || 10,
        total: result.total || 0,
        totalPages: result.totalPages || 0
      });
    } catch (err) {
      setError(err.message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const searchBooks = useCallback(async (searchTerm, searchFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await educationalBooksService.searchBooks(searchTerm, {
        ...filters,
        ...searchFilters
      });
      
      setBooks(result.books || []);
      setPagination({
        page: result.page || 1,
        limit: result.limit || 10,
        total: result.total || 0,
        totalPages: result.totalPages || 0
      });
    } catch (err) {
      setError(err.message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const getBookById = useCallback(async (bookId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await educationalBooksService.getBookById(bookId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBooksByCategory = useCallback(async (category, categoryFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await educationalBooksService.getBooksByCategory(category, {
        ...filters,
        ...categoryFilters
      });
      
      setBooks(result.books || []);
      setPagination({
        page: result.page || 1,
        limit: result.limit || 10,
        total: result.total || 0,
        totalPages: result.totalPages || 0
      });
    } catch (err) {
      setError(err.message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const getBooksBySubject = useCallback(async (subject, subjectFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await educationalBooksService.getBooksBySubject(subject, {
        ...filters,
        ...subjectFilters
      });
      
      setBooks(result.books || []);
      setPagination({
        page: result.page || 1,
        limit: result.limit || 10,
        total: result.total || 0,
        totalPages: result.totalPages || 0
      });
    } catch (err) {
      setError(err.message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const getCategories = useCallback(async () => {
    try {
      const result = await educationalBooksService.getCategories();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  return {
    books,
    loading,
    error,
    filters,
    pagination,
    loadBooks,
    searchBooks,
    getBookById,
    getBooksByCategory,
    getBooksBySubject,
    getCategories,
    updateFilters,
    resetFilters
  };
};
