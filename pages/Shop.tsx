import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import { Search, Filter } from 'lucide-react';

const Shop: React.FC = () => {
  const { products } = useStore();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const categories = Array.from(new Set(products.map(p => p.category)));

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) 
        ? prev.filter(c => c !== cat) 
        : [...prev, cat]
    );
  };

  const filteredProducts = products.filter(product => {
    // Filter by multiple categories (if any are selected)
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    
    // Search in Name, Description, and Ingredients
    const searchLower = search.toLowerCase();
    const matchesSearch = 
        product.name.toLowerCase().includes(searchLower) || 
        product.description.toLowerCase().includes(searchLower) ||
        product.ingredients.some(ing => ing.toLowerCase().includes(searchLower));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen py-12 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl font-bold text-tea-900 mb-8 text-center">Our Collection</h1>
        
        {/* Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          
          {/* Category Filter */}
          <div className="flex flex-col gap-2 w-full lg:w-auto">
             <div className="flex items-center gap-2 text-sm font-bold text-stone-600 mb-1">
                <Filter className="w-4 h-4" /> Filter by Category
             </div>
             <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategories.includes(cat) 
                        ? 'bg-tea-700 text-white shadow-md ring-2 ring-offset-1 ring-tea-700' 
                        : 'bg-white text-stone-600 hover:bg-tea-50 border border-stone-200'
                    }`}
                >
                    {cat}
                </button>
                ))}
                 <button
                    onClick={() => setSelectedCategories([])}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategories.length === 0
                        ? 'bg-stone-800 text-white shadow-md' 
                        : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                    }`}
                >
                    All
                </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-stone-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, effect, or ingredient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-stone-200 rounded-xl leading-5 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-tea-500 focus:border-tea-500 transition-shadow shadow-sm"
            />
          </div>
        </div>

        {/* Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-stone-100 shadow-sm">
            <Search className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-stone-800">No teas found</h3>
            <p className="text-stone-500 mt-2">Try adjusting your filters or search for different ingredients.</p>
            <button 
                onClick={() => { setSearch(''); setSelectedCategories([]); }}
                className="mt-4 text-tea-600 font-bold hover:underline"
            >
                Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;