
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Product } from '../types';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.getProducts();
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* Title Section */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-12 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Download Now</h1>
      </div>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-[2rem] aspect-square" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link 
                key={product.id} 
                to={`/download/${product.id}`}
                className="group block bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 p-3"
              >
                <div className="relative aspect-[1.1/1] rounded-[1.5rem] overflow-hidden">
                  <img 
                    src={product.images[0]} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                </div>
                
                <div className="p-5 text-center">
                  <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-brand transition-colors h-10 flex items-center justify-center">
                    {product.title}
                  </h3>
                </div>
              </Link>
            ))}
            {products.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-400 font-bold">
                No templates found in the Lab.
              </div>
            )}
          </div>
        )}
      </section>

    </div>
  );
};
