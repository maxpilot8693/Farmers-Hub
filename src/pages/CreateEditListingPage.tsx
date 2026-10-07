import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/authContext';
import { Category, Listing } from '../types';
import { api } from '../lib/api';
import { ListingForm } from '../components/farmer/ListingForm';

interface CreateEditListingPageProps {
  id?: string;
  navigate: (route: string) => void;
}

export const CreateEditListingPage: React.FC<CreateEditListingPageProps> = ({ id, navigate }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [initialData, setInitialData] = useState<Partial<Listing> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        const cats = await api.getCategories();
        setCategories(cats);

        if (id) {
          const item = await api.getListingById(id);
          if (item) setInitialData(item);
        }
      } catch (err) {
        console.error('Error initializing form data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [id]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Authentication Required</h2>
        <p className="text-xs text-slate-500">Please sign in as a farmer to create or edit listings.</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-[#0D3B2E] text-white px-5 py-2.5 rounded-xl text-xs font-bold"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-[#0D3B2E] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  const handleSubmit = async (formData: Omit<Listing, 'id' | 'created_at' | 'updated_at'>) => {
    if (id) {
      await api.updateListing(id, formData);
    } else {
      await api.createListing(formData);
    }
    navigate('/farmer/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8F9F8] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ListingForm
          initialData={initialData}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/farmer/dashboard')}
          farmerCounty={user.county || 'Kericho'}
          farmerPhone={user.phone || ''}
          farmerId={user.id}
        />
      </div>
    </div>
  );
};
