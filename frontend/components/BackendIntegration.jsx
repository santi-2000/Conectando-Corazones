import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useEducationalBooks } from '../Hooks/useEducationalBooks';
import { useSupportDirectories } from '../Hooks/useSupportDirectories';
import { useFafore } from '../Hooks/useFafore';

const BackendIntegration = () => {
  const [activeTab, setActiveTab] = useState('books');
  
  // Hooks para las funcionalidades básicas
  const { 
    books, 
    loading: booksLoading, 
    error: booksError, 
    fetchBooks 
  } = useEducationalBooks();
  
  const { 
    directories, 
    loading: directoriesLoading, 
    error: directoriesError, 
    fetchDirectories 
  } = useSupportDirectories();
  
  const { 
    faforeInfo, 
    loading: faforeLoading, 
    error: faforeError, 
    fetchFaforeInfo 
  } = useFafore();

  useEffect(() => {
    // Cargar datos al montar el componente
    fetchBooks();
    fetchDirectories();
    fetchFaforeInfo();
  }, []);

  const renderBooks = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.title}>📚 Libros Educativos</Text>
      {booksLoading && <Text style={styles.loading}>Cargando libros...</Text>}
      {booksError && <Text style={styles.error}>Error: {booksError}</Text>}
      {books && books.length > 0 ? (
        books.slice(0, 5).map((book, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemTitle}>{book.title}</Text>
            <Text style={styles.itemSubtitle}>{book.author}</Text>
            <Text style={styles.itemDescription}>{book.description}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noData}>No hay libros disponibles</Text>
      )}
    </ScrollView>
  );

  const renderDirectories = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.title}>🏥 Directorio de Apoyo</Text>
      {directoriesLoading && <Text style={styles.loading}>Cargando directorio...</Text>}
      {directoriesError && <Text style={styles.error}>Error: {directoriesError}</Text>}
      {directories && directories.length > 0 ? (
        directories.slice(0, 5).map((directory, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemTitle}>{directory.name}</Text>
            <Text style={styles.itemSubtitle}>{directory.category}</Text>
            <Text style={styles.itemDescription}>{directory.description}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noData}>No hay directorios disponibles</Text>
      )}
    </ScrollView>
  );

  const renderFafore = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.title}>🏛️ FAFORE</Text>
      {faforeLoading && <Text style={styles.loading}>Cargando información...</Text>}
      {faforeError && <Text style={styles.error}>Error: {faforeError}</Text>}
      {faforeInfo ? (
        <View style={styles.item}>
          <Text style={styles.itemTitle}>{faforeInfo.nombre}</Text>
          <Text style={styles.itemSubtitle}>{faforeInfo.mision}</Text>
          <Text style={styles.itemDescription}>{faforeInfo.descripcion}</Text>
          <Text style={styles.itemContact}>📞 {faforeInfo.telefono}</Text>
          <Text style={styles.itemContact}>📧 {faforeInfo.email}</Text>
        </View>
      ) : (
        <Text style={styles.noData}>No hay información disponible</Text>
      )}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔗 Integración Backend</Text>
        <Text style={styles.headerSubtitle}>Fase 1: Funcionalidades Básicas</Text>
      </View>
      
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'books' && styles.activeTab]}
          onPress={() => setActiveTab('books')}
        >
          <Text style={[styles.tabText, activeTab === 'books' && styles.activeTabText]}>
            📚 Libros
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'directories' && styles.activeTab]}
          onPress={() => setActiveTab('directories')}
        >
          <Text style={[styles.tabText, activeTab === 'directories' && styles.activeTabText]}>
            🏥 Directorio
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'fafore' && styles.activeTab]}
          onPress={() => setActiveTab('fafore')}
        >
          <Text style={[styles.tabText, activeTab === 'fafore' && styles.activeTabText]}>
            🏛️ FAFORE
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'books' && renderBooks()}
      {activeTab === 'directories' && renderDirectories()}
      {activeTab === 'fafore' && renderFafore()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2c3e50',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#bdc3c7',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3498db',
  },
  tabText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  activeTabText: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
  },
  loading: {
    fontSize: 16,
    color: '#3498db',
    textAlign: 'center',
    marginTop: 20,
  },
  error: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 20,
  },
  noData: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 20,
  },
  item: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
  },
  itemContact: {
    fontSize: 14,
    color: '#3498db',
    marginTop: 5,
  },
});

export default BackendIntegration;
