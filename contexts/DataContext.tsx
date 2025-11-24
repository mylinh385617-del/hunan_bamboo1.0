
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Era, Article, GlobalTag, CollectionCategory } from '../types';
import { COLLECTIONS, INITIAL_TAGS } from '../constants';

interface DataContextType {
  data: Era[];
  tags: GlobalTag[]; // This now includes both custom and system tags
  addArticle: (eraId: string, categoryId: string, article: Article) => void;
  updateArticle: (eraId: string, categoryId: string, article: Article) => void;
  deleteArticle: (articleId: string) => void;
  addTag: (tagName: string) => void;
  deleteTag: (tagId: string) => void;
  resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [data, setData] = useState<Era[]>(() => {
    const saved = localStorage.getItem('library_data');
    return saved ? JSON.parse(saved) : COLLECTIONS;
  });

  // Only store "Custom" tags in local storage
  const [customTags, setCustomTags] = useState<GlobalTag[]>(() => {
    const saved = localStorage.getItem('library_tags');
    return saved ? JSON.parse(saved) : INITIAL_TAGS;
  });

  // Dynamically derive "System" tags from the current data structure (Categories)
  // This ensures that if a category exists, its tag exists.
  const systemTags = useMemo<GlobalTag[]>(() => {
    const tags: GlobalTag[] = [];
    data.forEach(era => {
      era.categories.forEach(cat => {
        // Prevent duplicates if multiple categories share a name (unlikely but safe)
        if (!tags.some(t => t.name === cat.name)) {
          tags.push({
            id: `sys-${cat.id}`,
            name: cat.name,
            isSystem: true
          });
        }
      });
    });
    return tags;
  }, [data]);

  // Merge system tags and custom tags for the app to consume
  const allTags = useMemo(() => {
    // Filter out custom tags that might conflict with system tags to avoid duplicates
    const nonConflictingCustom = customTags.filter(ct => 
      !systemTags.some(st => st.name === ct.name)
    );
    return [...systemTags, ...nonConflictingCustom];
  }, [systemTags, customTags]);

  // Persist
  useEffect(() => {
    localStorage.setItem('library_data', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('library_tags', JSON.stringify(customTags));
  }, [customTags]);

  const addArticle = (eraId: string, categoryId: string, article: Article) => {
    setData(prevData => {
      return prevData.map(era => {
        if (era.id !== eraId) return era;
        return {
          ...era,
          categories: era.categories.map(cat => {
            if (cat.id !== categoryId) return cat;
            return {
              ...cat,
              articles: [article, ...cat.articles] // Add to top
            };
          })
        };
      });
    });
  };

  const updateArticle = (eraId: string, categoryId: string, updatedArticle: Article) => {
    setData(prevData => {
      return prevData.map(era => {
        if (era.id !== eraId) return era;
        return {
          ...era,
          categories: era.categories.map(cat => {
            if (cat.id !== categoryId) return cat;
            return {
              ...cat,
              articles: cat.articles.map(art => 
                art.id === updatedArticle.id ? updatedArticle : art
              )
            };
          })
        };
      });
    });
  };

  const deleteArticle = (articleId: string) => {
    setData(prevData => {
      return prevData.map(era => ({
        ...era,
        categories: era.categories.map(cat => ({
          ...cat,
          articles: cat.articles.filter(art => art.id !== articleId)
        }))
      }));
    });
  };

  const addTag = (tagName: string) => {
    // Don't add if it exists in either system or custom
    if (allTags.some(t => t.name === tagName)) return;
    
    const newTag: GlobalTag = {
      id: Date.now().toString(),
      name: tagName,
      isSystem: false
    };
    setCustomTags([...customTags, newTag]);
  };

  const deleteTag = (tagId: string) => {
    // Can only delete custom tags
    setCustomTags(customTags.filter(t => t.id !== tagId));
  };

  const resetData = () => {
    setData(COLLECTIONS);
    setCustomTags(INITIAL_TAGS);
    localStorage.removeItem('library_data');
    localStorage.removeItem('library_tags');
    window.location.reload();
  };

  return (
    <DataContext.Provider value={{ 
      data, 
      tags: allTags, 
      addArticle, 
      updateArticle, 
      deleteArticle, 
      addTag, 
      deleteTag,
      resetData
    }}>
      {children}
    </DataContext.Provider>
  );
};
