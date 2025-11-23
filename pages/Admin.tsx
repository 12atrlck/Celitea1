import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { 
  Package, TrendingUp, Users, DollarSign, Shield, 
  Plus, Trash2, AlertTriangle, Search, LogOut, ShoppingBag 
} from 'lucide-react';
import { Product } from '../types';

const Admin: React.FC = () => {
  const { products, orders, users, admins, currentUser, logout, addProduct, removeProduct, authorizeAdmin } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'users' | 'finance'>('overview');
  
  // Inventory State
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '', description: '', price: 0, stock: 0, category: 'Relaxation', ingredients: [], image: 'https://picsum.photos/id/100/800/800'
  });
  const [showAddModal, setShowAddModal] = useState(false);

  // Admin Auth State
  const [newAdminData, setNewAdminData] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/admin/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== 'admin') return null;

  // Derived Stats
  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const totalItemsSold = orders.reduce((acc, order) => acc + order.items.reduce((sum, i) => sum + i.quantity, 0), 0);
  const lowStockCount = products.filter(p => p.stock < 10).length;

  // Identify Guest Users (Emails in orders that are not in users list)
  const registeredEmails = new Set(users.map(u => u.email));
  // Get orders from non-registered emails
  const guestOrders = orders.filter(o => !registeredEmails.has(o.customerEmail));
  // distinct guests by email, taking the most recent order for details
  const guestMap = new Map();
  guestOrders.forEach(order => {
      if (!guestMap.has(order.customerEmail)) {
          guestMap.set(order.customerEmail, {
              name: order.customerName,
              email: order.customerEmail,
              lastActive: order.date
          });
      }
  });
  const guestUsers = Array.from(guestMap.values());


  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price) {
        const productToAdd: Product = {
            id: 'prod-' + Math.random().toString(36).substr(2, 9),
            name: newProduct.name!,
            description: newProduct.description || 'New herbal blend.',
            price: Number(newProduct.price),
            stock: Number(newProduct.stock),
            category: newProduct.category as any,
            image: newProduct.image || 'https://picsum.photos/id/100/800/800',
            ingredients: typeof newProduct.ingredients === 'string' ? (newProduct.ingredients as string).split(',') : []
        };
        addProduct(productToAdd);
        setShowAddModal(false);
        setNewProduct({ name: '', description: '', price: 0, stock: 0, category: 'Relaxation', ingredients: [], image: 'https://picsum.photos/id/100/800/800' });
    }
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    authorizeAdmin(newAdminData.name, newAdminData.email, newAdminData.password);
    setNewAdminData({ name: '', email: '', password: '' });
    alert('New admin authorized successfully.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="font-serif text-2xl font-bold text-tea-400">Admin Portal</h1>
          <p className="text-xs text-slate-500 mt-1">Welcome, {currentUser.name}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-tea-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <TrendingUp className="w-5 h-5" /> Overview
          </button>
          <button onClick={() => setActiveTab('inventory')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'inventory' ? 'bg-tea-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Package className="w-5 h-5" /> Inventory
          </button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-tea-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Users className="w-5 h-5" /> Users & Access
          </button>
          <button onClick={() => setActiveTab('finance')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'finance' ? 'bg-tea-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <DollarSign className="w-5 h-5" /> Money Movement
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
            <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-2 text-slate-400 hover:text-red-400 px-4 py-2">
                <LogOut className="w-5 h-5" /> Logout
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">Total Revenue</p>
                                <h3 className="text-3xl font-bold text-slate-800 mt-2">${totalRevenue.toFixed(2)}</h3>
                            </div>
                            <div className="p-3 bg-green-100 text-green-600 rounded-full"><DollarSign className="w-6 h-6" /></div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                         <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">Total Orders</p>
                                <h3 className="text-3xl font-bold text-slate-800 mt-2">{orders.length}</h3>
                            </div>
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Package className="w-6 h-6" /></div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                         <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">Items Sold</p>
                                <h3 className="text-3xl font-bold text-slate-800 mt-2">{totalItemsSold}</h3>
                            </div>
                            <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><TrendingUp className="w-6 h-6" /></div>
                        </div>
                    </div>
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                         <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">Low Stock Alert</p>
                                <h3 className="text-3xl font-bold text-slate-800 mt-2">{lowStockCount}</h3>
                            </div>
                            <div className="p-3 bg-amber-100 text-amber-600 rounded-full"><AlertTriangle className="w-6 h-6" /></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-4">Recent Orders</h3>
                        <div className="overflow-y-auto max-h-64">
                             <table className="w-full text-sm text-left text-slate-600">
                                <thead className="text-xs text-slate-400 uppercase bg-slate-50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2">ID</th>
                                        <th className="px-4 py-2">Customer</th>
                                        <th className="px-4 py-2">Total</th>
                                        <th className="px-4 py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {orders.slice(0, 5).map(order => (
                                        <tr key={order.id}>
                                            <td className="px-4 py-3 font-mono text-xs">#{order.id}</td>
                                            <td className="px-4 py-3">{order.customerName}</td>
                                            <td className="px-4 py-3 font-bold">${order.total.toFixed(2)}</td>
                                            <td className="px-4 py-3"><span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold">{order.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                             </table>
                        </div>
                     </div>
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-4">Active Users</h3>
                        <div className="space-y-3">
                             {users.filter(u => u.isOnline).length === 0 && <p className="text-slate-400 text-sm">No users currently online.</p>}
                             {users.filter(u => u.isOnline).map(user => (
                                 <div key={user.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                     <div>
                                         <p className="font-bold text-slate-700 text-sm">{user.name}</p>
                                         <p className="text-xs text-slate-500">{user.email}</p>
                                     </div>
                                 </div>
                             ))}
                        </div>
                     </div>
                </div>
            </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                     <h2 className="text-2xl font-bold text-slate-800">Inventory Management</h2>
                     <button onClick={() => setShowAddModal(!showAddModal)} className="bg-tea-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-tea-700 flex items-center gap-2">
                         <Plus className="w-4 h-4" /> Add Product
                     </button>
                </div>

                {showAddModal && (
                    <div className="bg-white p-6 rounded-xl shadow-md border border-tea-200 mb-6 animate-in slide-in-from-top-2">
                        <h3 className="font-bold text-lg mb-4">Add New Product</h3>
                        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input required placeholder="Product Name" className="p-2 border rounded" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                            <select className="p-2 border rounded" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value as any})}>
                                <option value="Sleep">Sleep</option>
                                <option value="Energy">Energy</option>
                                <option value="Digestion">Digestion</option>
                                <option value="Immunity">Immunity</option>
                                <option value="Relaxation">Relaxation</option>
                            </select>
                            <input required type="number" placeholder="Price" className="p-2 border rounded" value={newProduct.price || ''} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
                            <input required type="number" placeholder="Stock" className="p-2 border rounded" value={newProduct.stock || ''} onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})} />
                            <textarea placeholder="Description" className="p-2 border rounded md:col-span-2" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                            <button type="submit" className="md:col-span-2 bg-stone-800 text-white py-2 rounded hover:bg-stone-900">Save Product</button>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500">
                            <tr>
                                <th className="px-6 py-3">Product</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Price</th>
                                <th className="px-6 py-3">Stock</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products.map(product => (
                                <tr key={product.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-800 flex items-center gap-3">
                                        <img src={product.image} alt="" className="w-8 h-8 rounded-full object-cover" />
                                        {product.name}
                                    </td>
                                    <td className="px-6 py-4">{product.category}</td>
                                    <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                         <span className={`px-2 py-1 rounded text-xs font-bold ${product.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {product.stock} units
                                         </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => removeProduct(product.id)} className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
            <div className="space-y-8">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Admin List */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Shield className="w-4 h-4 text-tea-600" /> Administrators</h3>
                        </div>
                        <div className="space-y-4">
                            {admins.map(admin => (
                                <div key={admin.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-slate-800">{admin.name} {currentUser.id === admin.id && '(You)'}</p>
                                        <p className="text-xs text-slate-500">{admin.email}</p>
                                    </div>
                                    <span className="text-xs bg-tea-100 text-tea-800 px-2 py-1 rounded-full font-bold">Admin</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 border-t border-slate-100 pt-4">
                             <h4 className="text-sm font-bold text-slate-700 mb-3">Authorize New Admin</h4>
                             <form onSubmit={handleAddAdmin} className="space-y-3">
                                <input required placeholder="Name" className="w-full p-2 border rounded text-sm" value={newAdminData.name} onChange={e => setNewAdminData({...newAdminData, name: e.target.value})} />
                                <input required type="email" placeholder="Email" className="w-full p-2 border rounded text-sm" value={newAdminData.email} onChange={e => setNewAdminData({...newAdminData, email: e.target.value})} />
                                <input required type="password" placeholder="Temporary Password" className="w-full p-2 border rounded text-sm" value={newAdminData.password} onChange={e => setNewAdminData({...newAdminData, password: e.target.value})} />
                                <button type="submit" className="w-full bg-tea-600 text-white py-2 rounded text-sm hover:bg-tea-700">Authorize Admin</button>
                             </form>
                        </div>
                    </div>

                    {/* User List */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-blue-600" /> Registered Users</h3>
                            <div className="overflow-y-auto max-h-[300px] space-y-2">
                                {users.map(user => (
                                    <div key={user.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <div>
                                            <p className="font-medium text-slate-800">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                        <div className="text-right">
                                            {user.isOnline ? (
                                                <span className="text-xs text-green-600 font-bold flex items-center gap-1 justify-end"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Online</span>
                                            ) : (
                                                <span className="text-xs text-slate-400">Offline</span>
                                            )}
                                            <p className="text-[10px] text-slate-400 mt-1">Last Active: {new Date(user.lastActive || '').toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                         {/* Guest Customers */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-amber-600" /> Guest Customers</h3>
                            {guestUsers.length === 0 ? (
                                <p className="text-sm text-slate-500 italic">No guest orders yet.</p>
                            ) : (
                                <div className="overflow-y-auto max-h-[200px] space-y-2">
                                    {guestUsers.map((guest, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                                            <div>
                                                <p className="font-medium text-slate-800">{guest.name}</p>
                                                <p className="text-xs text-slate-500">{guest.email}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs bg-stone-200 text-stone-600 px-2 py-1 rounded-full">Guest</span>
                                                <p className="text-[10px] text-slate-400 mt-1">Order: {new Date(guest.lastActive).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                 </div>
            </div>
        )}

        {/* Finance Tab */}
        {activeTab === 'finance' && (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800">Money Movement</h2>
                
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center mb-8">
                    <p className="text-slate-500 mb-2">Total Accumulated Revenue</p>
                    <p className="text-5xl font-bold text-tea-800 font-serif">${totalRevenue.toFixed(2)}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                     <div className="px-6 py-4 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800">Transaction History</h3>
                     </div>
                     <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Order Ref</th>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.map(order => (
                                <tr key={order.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">{new Date(order.date).toLocaleString()}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">#{order.id}</td>
                                    <td className="px-6 py-4">
                                        <div>{order.customerName}</div>
                                        <div className="text-xs text-slate-400">{order.customerEmail}</div>
                                    </td>
                                    <td className="px-6 py-4"><span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold">Sale</span></td>
                                    <td className="px-6 py-4 text-right font-bold text-green-600">+${order.total.toFixed(2)}</td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">No financial records yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

      </main>
    </div>
  );
};

export default Admin;