
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Search, ShoppingBag, MessageSquare, X, ChevronRight, Copy, Check, Plus, Minus, ShoppingCart, Send, Trash2, Star, Quote } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { PRODUCTS, WHATSAPP_NUMBER, TESTIMONIALS, PAYPAL_RATE_FCFA_PER_EUR } from './constants';
import { Product, CategoryFilter, ChatMessage, CartItem } from './types';
import { GoogleGenAI } from '@google/genai';

declare global {
  interface Window {
    paypal?: any;
  }
}

// Micro-components
const CategoryTab: React.FC<{
  label: CategoryFilter;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2.5 rounded-2xl transition-all duration-300 text-sm font-semibold transform active:scale-95 whitespace-nowrap ${
      isActive 
        ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200 ring-2 ring-emerald-500 ring-offset-2' 
        : 'bg-white text-emerald-900 hover:bg-emerald-50 border border-emerald-100'
    }`}
  >
    {label}
  </button>
);

const ProductCard: React.FC<{ product: Product; onAddToCart: (p: Product) => void }> = ({ product, onAddToCart }) => (
  <div className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border border-slate-100 flex flex-col h-full">
    <div className="relative h-64 overflow-hidden">
      <img 
        src={product.image} 
        alt={product.name} 
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
      />
      <div className="absolute top-5 left-5">
        <span className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-xl text-[10px] font-black text-emerald-800 uppercase tracking-widest shadow-sm">
          {product.category}
        </span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
    <div className="p-8 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-slate-800 mb-4 leading-tight min-h-[3.5rem] group-hover:text-emerald-700 transition-colors">
        {product.name}
      </h3>
      <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em]">Prix au {product.unit}</span>
          <span className="text-2xl font-black text-emerald-600">
            {product.price.toLocaleString()} <span className="text-xs font-medium">FCFA</span>
          </span>
        </div>
        <button 
          onClick={() => onAddToCart(product)}
          className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-[1.25rem] flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm active:scale-90"
        >
          <Plus size={28} />
        </button>
      </div>
    </div>
  </div>
);

const TestimonialCard: React.FC<{ testimonial: typeof TESTIMONIALS[0] }> = ({ testimonial }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
    <div className="flex items-center gap-4 mb-6">
      <img src={testimonial.avatar} alt={testimonial.name} className="w-14 h-14 rounded-2xl object-cover ring-4 ring-emerald-50" />
      <div>
        <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{testimonial.role}</p>
      </div>
    </div>
    <div className="relative">
      <Quote className="absolute -top-2 -left-2 text-emerald-50 w-12 h-12 -z-10" />
      <p className="text-slate-600 leading-relaxed italic relative z-10">"{testimonial.content}"</p>
    </div>
    <div className="mt-6 flex gap-1">
      {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-emerald-400 text-emerald-400" />)}
    </div>
  </div>
);

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paypalStatus, setPaypalStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const paypalContainerRef = useRef<HTMLDivElement | null>(null);
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const [paymentMethod, setPaymentMethod] = useState<'whatsapp' | 'paypal' | 'stripe'>('whatsapp');
  const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const appBaseUrl = (import.meta.env.VITE_APP_BASE_URL || window.location.origin).trim();
  const stripeSuccessPath = import.meta.env.VITE_STRIPE_SUCCESS_PATH || '/?checkout=success';
  const stripeCancelPath = import.meta.env.VITE_STRIPE_CANCEL_PATH || '/?checkout=cancel';

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesCategory = activeCategory === 'Tous' || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const paypalAmountEUR = useMemo(() => {
    if (!cartTotal) return 0;
    return Math.max(1, Math.round((cartTotal / PAYPAL_RATE_FCFA_PER_EUR) * 100) / 100);
  }, [cartTotal]);

  const handleCheckout = () => {
    const message = `Bonjour ! Je souhaite passer une commande :\n\n` +
      cart.map(item => `- ${item.name} (${item.quantity} ${item.unit}${item.quantity > 1 ? 's' : ''}) : ${(item.price * item.quantity).toLocaleString()} FCFA`).join('\n') +
      `\n\nTotal : ${cartTotal.toLocaleString()} FCFA\n\nMerci de me confirmer la disponibilité !`;
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const userMsg: ChatMessage = { role: 'user', content: userInput };
    setChatMessages(prev => [...prev, userMsg]);
    setUserInput('');

    if (!apiKey) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Clé API manquante. Configurez VITE_GEMINI_API_KEY dans les variables d\'environnement.' }]);
      return;
    }

    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Catalogue : ${JSON.stringify(PRODUCTS.map(p => ({ n: p.name, p: p.price, u: p.unit })))}.
                  Réponds à : ${userInput}. Tu es un expert en cosmétique naturelle et en huiles précieuses. Réponds en français de façon élégante, professionnelle et concise.`,
      });
      setChatMessages(prev => [...prev, { role: 'assistant', content: response.text || "Désolé, je rencontre un petit problème technique." }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: "Erreur de connexion. Veuillez réessayer." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleStripeCheckout = async () => {
    if (!stripePublishableKey) {
      alert('Stripe indisponible: VITE_STRIPE_PUBLISHABLE_KEY manquant.');
      return;
    }
    if (cart.length === 0) return;
    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(i => ({ name: i.name, priceFCFA: i.price, quantity: i.quantity })),
          currency: 'EUR',
          baseUrl: appBaseUrl,
          successPath: stripeSuccessPath,
          cancelPath: stripeCancelPath
        })
      });
      const data = await res.json();
      if (!data.sessionId) throw new Error('sessionId missing');
      const stripe = await loadStripe(stripePublishableKey);
      await stripe?.redirectToCheckout({ sessionId: data.sessionId });
    } catch (e) {
      console.error('Stripe error:', e);
      alert('Erreur Stripe. Veuillez réessayer.');
    }
  };

  const loadPayPalScript = useCallback((clientId: string) => {
    if (document.querySelector('script[data-paypal-sdk]')) return Promise.resolve();
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR`;
      script.async = true;
      script.dataset.paypalSdk = 'true';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('paypal-sdk-load-error'));
      document.body.appendChild(script);
    });
  }, []);

  const renderPayPalButtons = useCallback(() => {
    if (!window.paypal || !paypalContainerRef.current || cartTotal <= 0) return;
    paypalContainerRef.current.innerHTML = '';

    window.paypal.Buttons({
      style: { layout: 'horizontal', height: 45, shape: 'rect', color: 'gold' },
      createOrder: (_: unknown, actions: any) => {
        return actions.order.create({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'EUR',
                value: paypalAmountEUR.toFixed(2),
              },
              description: 'Commande NaturaPro',
              items: cart.map(item => ({
                name: item.name.slice(0, 120),
                unit_amount: { currency_code: 'EUR', value: Math.max(0.01, (item.price / PAYPAL_RATE_FCFA_PER_EUR)).toFixed(2) },
                quantity: item.quantity,
              })),
            }
          ]
        });
      },
      onApprove: async (_: unknown, actions: any) => {
        await actions.order.capture();
        setChatMessages(prev => [...prev, { role: 'assistant', content: 'Paiement PayPal confirmé. Merci pour votre commande !' }]);
        setIsCartOpen(false);
      },
      onError: () => setPaypalStatus('error')
    }).render(paypalContainerRef.current);

    setPaypalStatus('ready');
  }, [cart, cartTotal, paypalAmountEUR]);

  useEffect(() => {
    if (!isCartOpen || cart.length === 0 || paymentMethod !== 'paypal') return;
    if (!paypalClientId) {
      setPaypalStatus('error');
      return;
    }
    if (window.paypal) {
      renderPayPalButtons();
      return;
    }
    setPaypalStatus('loading');
    loadPayPalScript(paypalClientId)
      .then(renderPayPalButtons)
      .catch(() => setPaypalStatus('error'));
  }, [isCartOpen, cart.length, paymentMethod, paypalClientId, renderPayPalButtons, loadPayPalScript]);

  const copyForSystemeIO = useCallback(() => {
    // Generate full standalone HTML for SIO
    const staticHTML = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
    <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-[#f8faf7]">
    <section class="max-w-7xl mx-auto px-4 py-20">
        <h2 class="text-5xl font-serif text-emerald-950 text-center mb-16">Nos Produits</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            ${PRODUCTS.map(p => `
                <div class="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 h-full flex flex-col">
                    <img src="${p.image}" class="h-48 w-full object-cover">
                    <div class="p-6 flex flex-col flex-grow">
                        <span class="text-[10px] font-bold text-emerald-600 uppercase mb-2">${p.category}</span>
                        <h3 class="text-lg font-bold text-slate-800 mb-4">${p.name}</h3>
                        <div class="mt-auto flex justify-between items-center">
                            <span class="text-xl font-black text-emerald-600">${p.price.toLocaleString()} FCFA</span>
                            <a href="https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour, je souhaite commander : ${p.name}" class="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all">Commander</a>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    </section>
</body>
</html>
    `.trim();
    navigator.clipboard.writeText(staticHTML);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8faf7] pb-24 selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white/80 border-b border-emerald-50 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 rotate-3 transition-transform hover:rotate-0">
              <ShoppingBag size={28} />
            </div>
            <div>
              <span className="text-2xl font-black text-emerald-900 tracking-tighter">NATURA<span className="text-emerald-500">PRO</span></span>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest leading-none">Excellence Bio</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 text-slate-700 hover:bg-slate-50 rounded-2xl transition-all active:scale-95 group"
            >
              <ShoppingCart size={26} className="group-hover:text-emerald-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-600 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-4 ring-white animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={copyForSystemeIO}
              className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl text-sm font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95 group"
            >
              {copied ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} className="group-hover:rotate-12" />}
              {copied ? 'Copié !' : 'Export SIO'}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-10 animate-bounce">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-sm shadow-emerald-400"></span>
            Pur à 100% • Pressé à Froid • Bio
          </div>
          <h1 className="text-6xl md:text-9xl font-serif text-emerald-950 mb-10 leading-[0.85] tracking-tight">
            L'âme de la <br/> <span className="text-emerald-600 italic">Nature</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
            Sublimez vos formulations avec nos huiles précieuses, beurres onctueux et poudres végétales d'origine certifiée.
          </p>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-emerald-50/70 to-transparent -z-10 pointer-events-none"></div>
      </section>

      {/* Product Feed */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="flex items-center gap-4 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
            {(['Tous', 'Huile', 'Beurre', 'Poudre'] as CategoryFilter[]).map(cat => (
              <CategoryTab 
                key={cat} 
                label={cat} 
                isActive={activeCategory === cat} 
                onClick={() => setActiveCategory(cat)} 
              />
            ))}
          </div>

          <div className="relative group max-w-md w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={22} />
            <input 
              type="text" 
              placeholder="Rechercher un élixir..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-50 rounded-[2rem] focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all outline-none shadow-sm text-slate-700 font-medium placeholder:text-slate-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      </main>

      {/* Testimonials Section */}
      <section className="mt-40 bg-emerald-900 py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-800/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-800/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Ils nous font confiance</h2>
            <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {TESTIMONIALS.map(t => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </div>
      </section>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[70] flex justify-end">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Votre Panier</h3>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">{cartCount} article{cartCount > 1 ? 's' : ''}</p>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all hover:rotate-90">
                <X size={28} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-10 space-y-10">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-slate-100">
                    <ShoppingCart size={48} className="text-slate-200" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-800">Panier vide</h4>
                  <p className="text-slate-400 mt-3 max-w-[200px]">Parcourez nos pépites naturelles pour le remplir !</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-8 items-center animate-in fade-in slide-in-from-bottom-8">
                    <div className="w-28 h-28 rounded-3xl overflow-hidden shadow-xl flex-shrink-0 group ring-4 ring-emerald-50">
                      <img src={item.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={item.name} />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-lg font-bold text-slate-900 leading-tight mb-2">{item.name}</h4>
                      <p className="text-emerald-600 font-black">{(item.price * item.quantity).toLocaleString()} <span className="text-xs font-medium">FCFA</span></p>
                      <div className="flex items-center gap-5 mt-4">
                        <div className="flex items-center bg-slate-100 rounded-2xl p-1.5 ring-1 ring-slate-200/50">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm"><Minus size={16} /></button>
                          <span className="w-12 text-center text-sm font-black text-slate-800">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm"><Plus size={16} /></button>
                        </div>
                        <button onClick={() => updateQuantity(item.id, -item.quantity)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-10 border-t border-slate-50 bg-slate-50/50 space-y-8">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Total de la commande</span>
                  <span className="text-4xl font-black text-emerald-950">{cartTotal.toLocaleString()} <span className="text-sm">FCFA</span></span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setPaymentMethod('whatsapp')} className={`px-4 py-2 rounded-xl text-sm font-black border ${paymentMethod === 'whatsapp' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'}`}>WhatsApp</button>
                  <button onClick={() => setPaymentMethod('paypal')} className={`px-4 py-2 rounded-xl text-sm font-black border ${paymentMethod === 'paypal' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'}`}>PayPal</button>
                  <button onClick={() => setPaymentMethod('stripe')} className={`px-4 py-2 rounded-xl text-sm font-black border ${paymentMethod === 'stripe' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'}`}>Stripe</button>
                </div>
                {paymentMethod === 'whatsapp' ? (
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-emerald-600 text-white py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 hover:bg-emerald-700 shadow-2xl shadow-emerald-200 transition-all active:scale-[0.98] group"
                  >
                    <Send size={28} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Commander via WhatsApp
                  </button>
                ) : paymentMethod === 'paypal' ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-slate-500 font-bold">
                      <span>Payer avec PayPal</span>
                      <span className="text-emerald-700 font-black">≈ {paypalAmountEUR.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} EUR</span>
                    </div>
                    <div ref={paypalContainerRef} className="min-h-[60px]" />
                    {paypalStatus === 'loading' && <p className="text-sm text-slate-500">Chargement des boutons PayPal...</p>}
                    {paypalStatus === 'error' && <p className="text-sm text-red-500">PayPal indisponible. Vérifiez PAYPAL_CLIENT_ID ou réessayez.</p>}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-slate-500 font-bold">
                      <span>Payer avec Stripe</span>
                      <span className="text-emerald-700 font-black">≈ {paypalAmountEUR.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} EUR</span>
                    </div>
                    <button onClick={handleStripeCheckout} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition">
                      Continuer vers Stripe Checkout
                    </button>
                    {!stripePublishableKey && <p className="text-sm text-red-500">Stripe indisponible. Ajoutez STRIPE_PUBLISHABLE_KEY.</p>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Chat */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-12 right-12 w-24 h-24 bg-emerald-950 text-white rounded-[2.5rem] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[60] group border-4 border-white"
      >
        <MessageSquare size={36} className="group-hover:rotate-12 transition-transform" />
      </button>

      {/* Chat UI */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[80] flex justify-end">
          <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-xl" onClick={() => setIsChatOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-10 bg-emerald-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                  <MessageSquare size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">Conseiller Expert</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-sm shadow-emerald-400"></span>
                    <span className="text-[10px] font-black text-emerald-300 uppercase tracking-[0.2em]">En direct</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-4 hover:bg-white/10 rounded-[1.25rem] transition-all">
                <X size={28} />
              </button>
            </div>
            
            <div className="flex-grow p-10 overflow-y-auto space-y-8 scrollbar-hide">
              {chatMessages.length === 0 && (
                <div className="text-center py-20 space-y-6">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                    <Quote className="text-emerald-200" size={32} />
                  </div>
                  <p className="text-slate-400 font-bold max-w-[220px] mx-auto text-sm leading-relaxed">
                    Besoin de conseils pour votre routine ? Je suis là pour vous guider.
                  </p>
                </div>
              )}
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[88%] px-6 py-5 rounded-[2rem] text-sm font-bold leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-emerald-600 text-white rounded-tr-none' 
                      : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/50'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 px-6 py-5 rounded-[2rem] rounded-tl-none">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-10 border-t border-slate-50">
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Posez votre question..."
                  className="flex-grow bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-5 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-all text-slate-800"
                />
                <button onClick={handleSendMessage} className="bg-emerald-950 text-white p-5 rounded-3xl hover:bg-emerald-900 transition-all active:scale-90 shadow-xl shadow-emerald-100">
                  <ChevronRight size={28} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-40 border-t border-slate-100 bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            <div className="space-y-6">
              <span className="text-2xl font-black text-emerald-900">NATURAPRO</span>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Le meilleur de la nature, sélectionné avec soin et passion pour votre bien-être quotidien.
              </p>
            </div>
            {['Produits', 'Expertise', 'Compte', 'Support'].map(title => (
              <div key={title} className="space-y-6">
                <h5 className="font-black text-xs uppercase tracking-[0.25em] text-slate-900">{title}</h5>
                <ul className="space-y-4 text-slate-400 text-sm font-bold">
                  <li><a href="#" className="hover:text-emerald-600 transition-colors">Lien Utile</a></li>
                  <li><a href="#" className="hover:text-emerald-600 transition-colors">Information</a></li>
                  <li><a href="#" className="hover:text-emerald-600 transition-colors">Contactez-nous</a></li>
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-20 pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest">© 2024 NaturaPro. Tous droits réservés.</p>
            <div className="flex gap-8">
               <a href="#" className="text-slate-300 hover:text-emerald-600 transition-all font-black text-[10px] uppercase tracking-widest">Confidentialité</a>
               <a href="#" className="text-slate-300 hover:text-emerald-600 transition-all font-black text-[10px] uppercase tracking-widest">Mentions</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
