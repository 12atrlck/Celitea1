import React from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const { addToCart } = useStore();
  const isLowStock = product.stock > 0 && product.stock < 10;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-stone-100 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
        {isLowStock && (
          <div className="absolute top-2 left-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Low Stock
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-stone-800 text-white px-4 py-2 rounded-md font-bold text-sm uppercase tracking-widest">
              Sold Out
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-tea-800 uppercase tracking-wide shadow-sm">
          {product.category}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-serif text-xl font-bold text-stone-800 mb-2">{product.name}</h3>
        <p className="text-stone-600 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
          <span className="text-lg font-bold text-tea-800">${product.price.toFixed(2)}</span>
          <button
            onClick={() => addToCart(product)}
            disabled={isOutOfStock}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isOutOfStock 
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                : 'bg-tea-600 text-white hover:bg-tea-700 active:bg-tea-800'
            }`}
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        <div className="text-xs text-stone-400 mt-2 text-right">
          {product.stock} in stock
        </div>
      </div>
    </div>
  );
};

export default ProductCard;