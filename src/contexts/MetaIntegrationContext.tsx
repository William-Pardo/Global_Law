import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import type { MetaUserProfile, MetaPage, MetaForm } from '../types';
import { metaApiService } from '../services/metaApiService';

interface MetaIntegrationContextType {
  isConnected: boolean;
  userProfile: MetaUserProfile | null;
  token: string | null;
  pages: MetaPage[];
  forms: MetaForm[];
  selectedPageId: string | null;
  selectedFormId: string | null;
  loading: boolean;
  connect: (accessToken: string) => Promise<void>;
  disconnect: () => void;
  selectPage: (pageId: string) => void;
  saveFormSelection: (formId: string) => void;
  getLeads: () => Promise<any[]>;
}

const MetaIntegrationContext = createContext<MetaIntegrationContextType | undefined>(undefined);

export const MetaIntegrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('meta_access_token'));
  const [userProfile, setUserProfile] = useState<MetaUserProfile | null>(null);
  const [pages, setPages] = useState<MetaPage[]>([]);
  const [forms, setForms] = useState<MetaForm[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(() => localStorage.getItem('meta_selected_page_id'));
  const [selectedFormId, setSelectedFormId] = useState<string | null>(() => localStorage.getItem('meta_selected_form_id'));
  const [loading, setLoading] = useState(false);

  const connect = async (accessToken: string) => {
    setLoading(true);
    try {
      const profile = await metaApiService.validateToken(accessToken);
      setUserProfile(profile);
      setToken(accessToken);
      localStorage.setItem('meta_access_token', accessToken);
      
      const userPages = await metaApiService.getPages(accessToken);
      setPages(userPages);

    } catch (error) {
      console.error('Meta connection failed:', error);
      disconnect(); // Clear state on failure
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    setToken(null);
    setUserProfile(null);
    setPages([]);
    setForms([]);
    setSelectedPageId(null);
    setSelectedFormId(null);
    localStorage.removeItem('meta_access_token');
    localStorage.removeItem('meta_user_profile');
    localStorage.removeItem('meta_selected_page_id');
    localStorage.removeItem('meta_selected_form_id');
  };

  const selectPage = async (pageId: string) => {
    setLoading(true);
    setSelectedPageId(pageId);
    setForms([]); // Clear old forms
    setSelectedFormId(null); // Clear selected form
    localStorage.setItem('meta_selected_page_id', pageId);
    localStorage.removeItem('meta_selected_form_id');

    const page = pages.find(p => p.id === pageId);
    if(page && page.access_token) {
        try {
            const pageForms = await metaApiService.getForms(pageId, page.access_token);
            setForms(pageForms);
        } catch (error) {
            console.error(`Failed to fetch forms for page ${pageId}:`, error);
        } finally {
            setLoading(false);
        }
    } else {
        console.error('Selected page not found or page access token missing.');
        setLoading(false);
    }
  };
  
  const saveFormSelection = (formId: string) => {
      setSelectedFormId(formId);
      localStorage.setItem('meta_selected_form_id', formId);
  }

  const getLeads = async (): Promise<any[]> => {
    if (!selectedFormId || !selectedPageId || !token) {
      throw new Error("Connection not configured properly to fetch leads.");
    }
    const page = pages.find(p => p.id === selectedPageId);
    if (!page || !page.access_token) {
      throw new Error("Page access token is missing.");
    }
    return metaApiService.getLeads(selectedFormId, page.access_token);
  };
  
  // Effect to initialize state from token
  useEffect(() => {
    const initialize = async () => {
      if (token) {
        setLoading(true);
        try {
          const profile = await metaApiService.validateToken(token);
          setUserProfile(profile);
          const userPages = await metaApiService.getPages(token);
          setPages(userPages);
          
          if(selectedPageId){
              const page = userPages.find(p => p.id === selectedPageId);
              if(page && page.access_token){
                  const pageForms = await metaApiService.getForms(selectedPageId, page.access_token);
                  setForms(pageForms);
              }
          }

        } catch (error) {
          console.error('Invalid token on init, disconnecting.');
          disconnect();
        } finally {
          setLoading(false);
        }
      }
    };
    initialize();
  }, [token]); // Run only when token changes on initial load

  return (
    <MetaIntegrationContext.Provider value={{
      isConnected: !!token,
      userProfile,
      token,
      pages,
      forms,
      selectedPageId,
      selectedFormId,
      loading,
      connect,
      disconnect,
      selectPage,
      saveFormSelection,
      getLeads,
    }}>
      {children}
    </MetaIntegrationContext.Provider>
  );
};

export const useMetaIntegration = (): MetaIntegrationContextType => {
  const context = useContext(MetaIntegrationContext);
  if (context === undefined) {
    throw new Error('useMetaIntegration must be used within a MetaIntegrationProvider');
  }
  return context;
};
