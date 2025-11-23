import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Wind, Moon, Sun } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

const Home: React.FC = () => {
  const { products } = useStore();
  // Display top 3 products
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-tea-800 text-white py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            <img src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" alt="Tea leaves" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Find Your Perfect <br/> <span className="text-tea-300 italic">Moment of Calm</span>
          </h1>
          <p className="text-tea-100 text-lg md:text-xl max-w-2xl mb-10 font-light">
            Artisan herbal blends sourced from nature's finest gardens. curated for your wellness and tranquility.
          </p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-white text-tea-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-tea-100 transition-colors shadow-lg">
            Explore Our Collection <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-stone-50 rounded-xl">
              <Moon className="w-12 h-12 text-tea-600 mb-4" />
              <h3 className="font-serif text-xl font-bold mb-2 text-tea-900">Better Sleep</h3>
              <p className="text-stone-600">Natural blends rich in chamomile and valerian to help you rest.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-stone-50 rounded-xl">
              <Sun className="w-12 h-12 text-amber-500 mb-4" />
              <h3 className="font-serif text-xl font-bold mb-2 text-tea-900">Morning Energy</h3>
              <p className="text-stone-600">Caffeine-free zest to start your day with clarity and vitality.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-stone-50 rounded-xl">
              <Wind className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="font-serif text-xl font-bold mb-2 text-tea-900">Digestion Aid</h3>
              <p className="text-stone-600">Soothing peppermint and ginger to support a healthy gut.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-serif text-3xl font-bold text-tea-900">Weekly Favorites</h2>
              <p className="text-stone-600 mt-2">Our most loved blends this week.</p>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center text-tea-700 font-medium hover:underline">
              View all teas <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
             <Link to="/shop" className="inline-flex items-center text-tea-700 font-medium hover:underline">
              View all teas <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;