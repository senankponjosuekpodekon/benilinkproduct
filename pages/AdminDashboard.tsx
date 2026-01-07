import React, { useEffect, useMemo, useState } from 'react';
import { ShieldCheck, RefreshCw, Eye, Package, LogIn, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
  name: string;
  quantity: number;
  priceFCFA?: number;
  totalFCFA?: number;
}

interface Order {
  orderId?: string;
  order_id?: string;
  totalAmount?: number;
  total_fcfa?: number;
  amountEUR?: number;
  created_at?: string;
  timestamp?: string;
  paymentMethod?: string;
  payment_method?: string;
  deliveryInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
    city?: string;
    country?: string;
  };
  items?: OrderItem[];
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchOrders = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/orders-admin', {
        headers: {
          'x-admin-token': token,
        },
      });

      if (res.status === 401) {
        setIsAuthenticated(false);
        setError('Token invalide.');
        return;
      }

      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Erreur de récupération des commandes.');
        return;
      }

      setOrders(data.orders || []);
      setIsAuthenticated(true);
      localStorage.setItem('benilink_admin_token', token);
    } catch (err: any) {
      setError(err.message || 'Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('benilink_admin_token');
    if (saved) {
      fetchOrders(saved);
    }
  }, []);

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => sum + (order.totalAmount || order.total_fcfa || 0), 0);
  }, [orders]);

  const totalOrders = orders.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Veuillez saisir le token admin.');
      return;
    }
    fetchOrders(password.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold"
          >
            ← Retour à la boutique
          </button>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-6 sm:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700">
              <ShieldCheck />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Dashboard Admin</h1>
              <p className="text-slate-500">Accès protégé par token admin (variable serveur ADMIN_DASH_TOKEN)</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Saisir le token admin (non exposé côté client)"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:bg-emerald-700 active:scale-95"
              disabled={loading}
            >
              {loading ? 'Chargement...' : <><LogIn size={18} /> Se connecter</>}
            </button>
            <button
              type="button"
              onClick={() => fetchOrders(password || localStorage.getItem('benilink_admin_token') || '')}
              className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 px-4 py-3 rounded-2xl font-semibold border border-emerald-100 hover:bg-emerald-50 active:scale-95"
              disabled={loading}
            >
              <RefreshCw size={18} /> Rafraîchir
            </button>
          </form>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700">
              {error}
            </div>
          )}

          {isAuthenticated && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <p className="text-sm text-emerald-700 font-semibold">Commandes</p>
                  <p className="text-3xl font-black text-emerald-900">{totalOrders}</p>
                </div>
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100">
                  <p className="text-sm text-amber-700 font-semibold">Chiffre d'affaires (FCFA)</p>
                  <p className="text-3xl font-black text-amber-900">{totalRevenue.toLocaleString()} F</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-sm text-slate-600 font-semibold">Moyenne panier</p>
                  <p className="text-3xl font-black text-slate-900">
                    {totalOrders > 0 ? Math.round(totalRevenue / totalOrders).toLocaleString() : '0'} F
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border border-slate-100 rounded-2xl overflow-hidden">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-3 text-left">Commande</th>
                      <th className="px-4 py-3 text-left">Client</th>
                      <th className="px-4 py-3 text-left">Pays</th>
                      <th className="px-4 py-3 text-left">Montant</th>
                      <th className="px-4 py-3 text-left">Paiement</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Articles</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((order) => {
                      const id = order.orderId || order.order_id || 'N/A';
                      const total = order.totalAmount || order.total_fcfa || 0;
                      const created = order.timestamp || order.created_at;
                      const payment = order.paymentMethod || order.payment_method || '—';
                      return (
                        <tr key={id} className="hover:bg-emerald-50/40">
                          <td className="px-4 py-3 font-semibold text-slate-900">{id}</td>
                          <td className="px-4 py-3 text-slate-700">
                            {order.deliveryInfo?.fullName || '—'}
                            <div className="text-xs text-slate-500">{order.deliveryInfo?.phone}</div>
                          </td>
                          <td className="px-4 py-3 text-slate-700">{order.deliveryInfo?.country || '—'}</td>
                          <td className="px-4 py-3 font-bold text-emerald-700">{total.toLocaleString()} F</td>
                          <td className="px-4 py-3 text-slate-700 capitalize">{payment}</td>
                          <td className="px-4 py-3 text-slate-700">{created ? new Date(created).toLocaleString('fr-FR') : '—'}</td>
                          <td className="px-4 py-3 text-slate-700">
                            <div className="flex flex-wrap gap-2">
                              {order.items?.map((item) => (
                                <span key={item.name} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-xl text-xs text-slate-700">
                                  <Package size={12} /> {item.name} × {item.quantity}
                                </span>
                              )) || '—'}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                          Aucune commande enregistrée pour le moment.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {!isAuthenticated && (
            <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600 flex items-center gap-2">
              <Eye size={16} /> Saisissez le token admin pour afficher les commandes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
