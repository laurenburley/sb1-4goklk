import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, AlertCircle } from 'lucide-react';
import { squareService, SquareProduct } from '../../services/square';

interface ProductCatalogProps {
  onProductClick: (product: SquareProduct) => void;
  onNewProduct: () => void;
}

function ProductCatalog({ onProductClick, onNewProduct }: ProductCatalogProps) {
  const [products, setProducts] = useState<SquareProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const products = await squareService.getProducts();
      setProducts(products);
    } catch (err) {
      setError('Failed to load products from Square');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Product Catalog</h2>
        <button
          onClick={onNewProduct}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 rounded-lg flex items-center text-red-600">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Categories</option>
          <option value="spirits">Spirits</option>
          <option value="merchandise">Merchandise</option>
          <option value="experiences">Experiences</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => onProductClick(product)}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                  {product.description && (
                    <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                  )}
                </div>
                {product.ageRestricted && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    21+
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {product.variations.map((variation) => (
                  <div
                    key={variation.id}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm text-gray-600">{variation.name}</span>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900">
                        ${variation.price.toFixed(2)}
                      </span>
                      {variation.inventory !== undefined && (
                        <div className="text-xs text-gray-500">
                          {variation.inventory} in stock
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductCatalog;