import React, { useState, useMemo, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiZap,
  FiTrendingUp,
  FiDollarSign,
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
//import { AIEngine } from "../utils/AIEngine";
import { langData, LangKey } from "../utils/lang";

type Props = {
  dark: boolean;
  lang: LangKey;
};

// type Product = {
//   id: number;
//   name: { en: string; hi: string; mr: string };
//   sku: string;
//   category: string;
//   quantity: number;
//   price: number;
//   reorderLevel: number;
//   type: "weight" | "unit";
// };

export default function Inventory({ dark, lang }: Props) {
 const language = lang;
  const t = langData[lang];

  const [editingProduct, setEditingProduct] = useState<any>(null);;
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAI, setShowAI] = useState(false);
  const itemsPerPage = 5;

  const [products, setProducts] = useState([
  { id: 1, name: { en: 'Rice', hi: 'चावल', mr: 'तांदूळ' }, sku: 'RIC001', category: 'Grains', quantity: 100, price: 60, reorderLevel: 20, type: 'weight' },
  { id: 2, name: { en: 'Wheat Flour', hi: 'आटा', mr: 'गहू पीठ' }, sku: 'WHE001', category: 'Grains', quantity: 80, price: 45, reorderLevel: 20, type: 'weight' },
  { id: 3, name: { en: 'Sugar', hi: 'चीनी', mr: 'साखर' }, sku: 'SUG001', category: 'Essentials', quantity: 90, price: 50, reorderLevel: 25, type: 'weight' },
  { id: 4, name: { en: 'Milk', hi: 'दूध', mr: 'दूध' }, sku: 'MIL001', category: 'Dairy', quantity: 120, price: 55, reorderLevel: 30, type: 'unit' },
  { id: 5, name: { en: 'Cooking Oil', hi: 'तेल', mr: 'तेल' }, sku: 'OIL001', category: 'Essentials', quantity: 70, price: 140, reorderLevel: 20, type: 'unit' },
  { id: 6, name: { en: 'Toor Dal', hi: 'तूर दाल', mr: 'तूर डाळ' }, sku: 'DAL001', category: 'Pulses', quantity: 60, price: 120, reorderLevel: 15, type: 'weight' },
  { id: 7, name: { en: 'Salt', hi: 'नमक', mr: 'मीठ' }, sku: 'SAL001', category: 'Essentials', quantity: 200, price: 25, reorderLevel: 50, type: 'unit' },
  { id: 8, name: { en: 'Biscuits', hi: 'बिस्कुट', mr: 'बिस्किट' }, sku: 'BIS001', category: 'Snacks', quantity: 150, price: 20, reorderLevel: 40, type: 'unit' },
  { id: 9, name: { en: 'Tea Powder', hi: 'चाय पत्ती', mr: 'चहा पावडर' }, sku: 'TEA001', category: 'Beverages', quantity: 50, price: 180, reorderLevel: 15, type: 'weight' },
  { id: 10, name: { en: 'Coffee', hi: 'कॉफी', mr: 'कॉफी' }, sku: 'COF001', category: 'Beverages', quantity: 40, price: 250, reorderLevel: 10, type: 'weight' },
  { id: 11, name: { en: 'Turmeric Powder', hi: 'हल्दी', mr: 'हळद' }, sku: 'TUR001', category: 'Spices', quantity: 30, price: 200, reorderLevel: 10, type: 'weight' },
  { id: 12, name: { en: 'Chilli Powder', hi: 'मिर्च पाउडर', mr: 'तिखट' }, sku: 'CHI001', category: 'Spices', quantity: 35, price: 220, reorderLevel: 10, type: 'weight' },
  { id: 13, name: { en: 'Coriander Powder', hi: 'धनिया पाउडर', mr: 'धणे पावडर' }, sku: 'COR001', category: 'Spices', quantity: 40, price: 180, reorderLevel: 10, type: 'weight' },
  { id: 14, name: { en: 'Onion', hi: 'प्याज', mr: 'कांदा' }, sku: 'ONI001', category: 'Vegetables', quantity: 100, price: 30, reorderLevel: 25, type: 'weight' },
  { id: 15, name: { en: 'Potato', hi: 'आलू', mr: 'बटाटा' }, sku: 'POT001', category: 'Vegetables', quantity: 120, price: 25, reorderLevel: 30, type: 'weight' },
  { id: 16, name: { en: 'Tomato', hi: 'टमाटर', mr: 'टोमॅटो' }, sku: 'TOM001', category: 'Vegetables', quantity: 90, price: 40, reorderLevel: 20, type: 'weight' },
  { id: 17, name: { en: 'Paneer', hi: 'पनीर', mr: 'पनीर' }, sku: 'PAN001', category: 'Dairy', quantity: 25, price: 300, reorderLevel: 10, type: 'unit' },
  { id: 18, name: { en: 'Butter', hi: 'मक्खन', mr: 'लोणी' }, sku: 'BUT001', category: 'Dairy', quantity: 20, price: 250, reorderLevel: 10, type: 'unit' },
  { id: 19, name: { en: 'Curd', hi: 'दही', mr: 'दही' }, sku: 'CUR001', category: 'Dairy', quantity: 60, price: 60, reorderLevel: 20, type: 'unit' },
  { id: 20, name: { en: 'Bread', hi: 'ब्रेड', mr: 'ब्रेड' }, sku: 'BRE001', category: 'Bakery', quantity: 70, price: 40, reorderLevel: 20, type: 'unit' },
  { id: 21, name: { en: 'Eggs', hi: 'अंडे', mr: 'अंडी' }, sku: 'EGG001', category: 'Dairy', quantity: 200, price: 6, reorderLevel: 50, type: 'unit' },
  { id: 22, name: { en: 'Soap', hi: 'साबुन', mr: 'साबण' }, sku: 'SOP001', category: 'Household', quantity: 150, price: 30, reorderLevel: 40, type: 'unit' },
  { id: 23, name: { en: 'Shampoo', hi: 'शैम्पू', mr: 'शॅम्पू' }, sku: 'SHA001', category: 'Household', quantity: 80, price: 120, reorderLevel: 20, type: 'unit' },
  { id: 24, name: { en: 'Toothpaste', hi: 'टूथपेस्ट', mr: 'टूथपेस्ट' }, sku: 'TOO001', category: 'Household', quantity: 90, price: 90, reorderLevel: 25, type: 'unit' },
  { id: 25, name: { en: 'Maggi Noodles', hi: 'मैगी', mr: 'मॅगी' }, sku: 'MAG001', category: 'Snacks', quantity: 180, price: 15, reorderLevel: 50, type: 'unit' },
]);

const [newProduct, setNewProduct] = useState({
    name: { en: '', hi: '', mr: '' },
    sku: '',
    category: 'Grains',
    quantity: 0,
    price: 0,
    reorderLevel: 0,
    type: 'unit',
  });

   const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search Filter
      const search = searchTerm.toLowerCase();

      const searchMatch =
        (p.name?.en || '').toLowerCase().includes(search) ||
        (p.name?.hi || '').toLowerCase().includes(search) ||
        (p.name?.mr || '').toLowerCase().includes(search) ||
        (p.sku || '').toLowerCase().includes(search);

      // Category Filter
      const categoryMatch = categoryFilter === 'All' || p.category === categoryFilter;

      // Stock Filter
      let stockMatch = true;
      if (stockFilter === 'low') {
        stockMatch = p.quantity <= p.reorderLevel;
      } else if (stockFilter === 'high') {
        stockMatch = p.quantity > p.reorderLevel;
      }

      return searchMatch && categoryMatch && stockMatch;
    });
  }, [products, searchTerm, categoryFilter, stockFilter]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

 
  // const handleAddProduct = () => {
  //   if (!newProduct.name || !newProduct.sku) {
  //     toast.error('Please fill all required fields');
  //     return;
  //   }
  //   setProducts([...products,{...newProduct,id: Date.now(),},
  // ]);
  //   setNewProduct({
  //     name: { en: '', hi: '', mr: '' },
  //     sku: '',
  //     category: 'Grains',
  //     quantity: 0,
  //     price: 0,
  //     reorderLevel: 0,
  //     type: 'unit',
  //   });
  //   setShowModal(false);
  //   toast.success('productAdded');
  // };
  const handleAddProduct = async () => {
      if (!newProduct.name.en || !newProduct.sku) {
        toast.error("Fill required fields");
        return;
      }

      if (editingProduct) {
        // UPDATE
        await window.api.updateProduct({
          ...newProduct,
          id: editingProduct.id,
        });

        toast.success("Product Updated");
      } else {
        // ADD
        await window.api.addProduct(newProduct);
        toast.success("Product Added");
      }

      setEditingProduct(null);
      setShowModal(false);

      await loadProducts(); // 🔥 refresh DB
    };

    useEffect(() => {
        loadProducts();
      }, []);

      const loadProducts = async () => {
        const data = await window.api.getProducts();

        const formatted = data.map((p: any) => {
          let parsedName;

          try {
            parsedName =
              typeof p.name === "string" && p.name
                ? JSON.parse(p.name)
                : p.name || { en: "", hi: "", mr: "" };
          } catch (e) {
            parsedName = { en: "", hi: "", mr: "" };
          }

          return {
            ...p,
            name: parsedName,
          };
        });

        setProducts(formatted);
    };
  const handleDeleteProduct = async (id: number) => {
      // setProducts(products.filter((p) => p.id !== id));
      // toast.success('productDeleted');
      await window.api.deleteProduct(id);
      toast.success("Product Deleted");
      loadProducts();
    };
  
    const getLowStockWarning = (quantity: number, reorderLevel: number) => {
      if (quantity <= reorderLevel) {
        return 'text-red-600 font-semibold';
      }
      return 'text-green-600';
    };
  
    // AI Features
    const getAIAlerts = () => {
      //return AIEngine.getInventoryAlerts(products);
    };
  const getPricingSuggestions = () => {
      // return products
      //   .map((p) => ({
      //     ...p,
      //     suggestion: AIEngine.pricingSuggestion(p, 5, p.quantity),
      //   }))
      //   .filter((p) => p.suggestion.adjustment !== 0);
    };
  
    const aiAlerts = getAIAlerts();
    const pricingSuggestions = getPricingSuggestions();

  return (
    <div className={`p-8 ${dark ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} min-h-screen`}>
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t.inventoryManagement}</h1>
          <p className="text-gray-600">{t.manageStore}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAI(!showAI)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              showAI
                ? 'bg-purple-600 text-white'
                : dark
                ? 'bg-gray-700 text-white'
                : 'bg-purple-100 text-purple-600'
            }`}
            title="AI Recommendations"
          >
            <FiZap /> {t.aiInsights}
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <FiPlus /> {t.addProduct}
          </button>
        </div>
      </div>

      {showAI && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Inventory Alerts */}
          <div className={`bg-gray-800 border border-gray-700 rounded-lg p-4`}>
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <FiTrendingUp /> Stock Alerts
            </h3>
            {/* {aiAlerts.length === 0 ? (
              <p className="text-sm text-gray-500">All inventory levels optimal ✓</p>
            ) : (
              <div className="space-y-2">
                {aiAlerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded text-sm ${
                      alert.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {alert.message}
                  </div>
                ))}
              </div>
            )} */}
          </div>

           {/* Pricing Suggestions */}
          <div className={`bg-gray-800 border border-gray-700 rounded-lg p-4`}>
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <FiDollarSign /> Price Optimization
            </h3>
            {/* {pricingSuggestions.length === 0 ? (
              <p className="text-sm text-gray-500">Current pricing is optimal ✓</p>
            ) : (
              <div className="space-y-2">
                {pricingSuggestions.slice(0, 3).map((item) => (
                  <div key={item.id} className="p-2 rounded bg-blue-50 text-sm">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-gray-600">{item.suggestion.reason}</p>
                    <p className="text-xs">
                      ₹{item.suggestion.currentPrice.toFixed(0)} → ₹{item.suggestion.suggestedPrice.toFixed(0)}{' '}
                      ({item.suggestion.adjustment > 0 ? '+' : ''}{item.suggestion.adjustment}%)
                    </p>
                  </div>
                ))}
              </div>
            )} */}
          </div>
        </div>
      )}

        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${dark ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-300"} border-gray-600`}
            />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setCurrentPage(1);
          }}
          className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${dark ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-300"} border-gray-600`}
        >
          <option value="All">{t.all}</option>
          <option value="Beverages">{t.beverages}</option>
          <option value="Pulses">{t.pulses}</option>
          <option value="Essentials">{t.essentials}</option>
          <option value="Snacks">{t.snacks}</option>
          <option value="Grains">{t.grains}</option>
          <option value="Dairy">{t.dairy}</option>
          <option value="Spices">{t.spices}</option>
          <option value="Vegetables">{t.vegetables}</option>
          <option value="Bakery">{t.bakery}</option>     
          <option value="Household">{t.household}</option>
        </select>

        <select
          value={stockFilter}
          onChange={(e) => {
            setStockFilter(e.target.value);
            setCurrentPage(1);
          }}
          className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${dark ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-300"} border-gray-600`}
        >
          <option value="all">{t.allS}</option>
          <option value="low">{t.lowS}</option>
          <option value="high">{t.highS}</option>
        </select>
      </div>

      {/* Products Table */}
      <div className={`rounded-lg shadow-md overflow-hidden border ${dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <table className="w-full">
          <thead className={dark ? 'bg-gray-700' : 'bg-red-500 border-b border-gray-200'}>
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">{t.productName}</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">{t.sku}</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">{t.category}</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">{t.quantity}</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">{t.price}</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr key={product.id} className={dark ? 'border-gray-700 border-b hover:bg-gray-700' : 'border-gray-200 border-b hover:bg-gray-50'}>
                <td className="px-6 py-4">
                  <p className="font-semibold">{product.name?.[language] || product.name?.en}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    {product.category}
                  </span>
                </td>
                <td className={`px-6 py-4 ${getLowStockWarning(product.quantity, product.reorderLevel)}`}>
                  {product.quantity}
                  {product.quantity <= product.reorderLevel && <p className="text-xs mt-1">⚠️ Low</p>}
                </td>
                <td className="px-6 py-4 font-semibold">₹{product.price}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setNewProduct(product);
                        setShowModal(true);
                      }}
                      className="p-2 hover:bg-blue-100 rounded-lg transition text-blue-600"
                    >
                      <FiEdit2 className="text-lg" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
                    >
                      <FiTrash2 className="text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Page {currentPage} of {totalPages || 1} ({filteredProducts.length} products)
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg transition ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 hover:bg-blue-100'
            }`}
          >
            <FiChevronLeft className="text-lg" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-lg transition ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : dark
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg transition ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 hover:bg-blue-100'
            }`}
          >
            <FiChevronRight className="text-lg" />
          </button>
        </div>
      </div>


      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-lg shadow-2xl max-w-md w-full p-6 ${dark ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FiPlus className="animate-spin text-blue-500" />
              {editingProduct ? t.editProduct : t.addProduct}
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Product Name *</label>
                <input
                  type="text"
                   value={newProduct.name.en}
                   onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        name: { ...newProduct.name, en: e.target.value },
                      })
                    }
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${dark ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-300"} border-gray-600`}
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">SKU *</label>
                <input
                  type="text"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${dark ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-300"} border-gray-600`}
                  placeholder="Enter SKU"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${dark ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-300"} border-gray-600`}
                >
                  <option>Beverages</option>
                  <option>Food</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Quantity</label>
                <input
                  type="number"
                  value={newProduct.quantity}
                  onChange={(e) =>
                  setNewProduct({ ...newProduct, quantity: Number(e.target.value) })}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${dark ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-300"} border-gray-600`}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Price (₹)</label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                  setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${dark ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-300"} border-gray-600`}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Reorder Level</label>
                <input
                  type="number"
                  value={newProduct.reorderLevel}
                  onChange={(e) =>
                  setNewProduct({ ...newProduct, reorderLevel: Number(e.target.value) })}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${dark ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-300"} border-gray-600`}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 rounded-lg transition border border-gray-700 flex items-center justify-center gap-2"
                >
                ❌ {t.cancel}
              </button>
              <button
                onClick={handleAddProduct}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
