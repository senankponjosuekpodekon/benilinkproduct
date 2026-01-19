
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Search, ShoppingBag, MessageSquare, X, ChevronRight, Copy, Check, Plus, Minus, ShoppingCart, Send, Trash2, Star, Quote, Truck, Package, Globe, ShieldCheck, CheckCircle, Menu, Mail, Phone, Ship, Plane, Clock } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS, WHATSAPP_NUMBER, TESTIMONIALS, VAT_RATE } from '../constants';
import { Product, CategoryFilter, ChatMessage, CartItem } from '../types';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=800&h=600';

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
    className={`px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 text-xs sm:text-sm font-bold transform active:scale-95 whitespace-nowrap ${
      isActive 
        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
        : 'bg-white text-emerald-900 hover:bg-emerald-50 border border-emerald-100'
    }`}
  >
    {label}
  </button>
);

const ProductCard: React.FC<{ product: Product; onAddToCart: (p: Product) => void }> = ({ product, onAddToCart }) => {
  const [imgSrc, setImgSrc] = useState(product.image);

  useEffect(() => {
    console.log(`[ProductCard] ${product.name} → Image: ${product.image}`);
    setImgSrc(product.image);
  }, [product.image, product.name]);

  const handleImageError = useCallback(() => {
    if (imgSrc === FALLBACK_IMAGE) return;
    console.warn(`❌ Image non chargée pour ${product.name}: ${imgSrc}`);
    setImgSrc(FALLBACK_IMAGE);
  }, [imgSrc, product.name]);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 flex flex-col h-full">
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <img 
          src={imgSrc} 
          alt={product.name} 
          loading="lazy"
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-2 left-2">
          <span className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg text-[8px] font-black text-emerald-800 uppercase tracking-wider shadow-sm">
            {product.category}
          </span>
        </div>
      </div>
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-2 leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
          {product.name}
        </h3>
        <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wide">Prix/{product.unit}</span>
            <span className="text-lg sm:text-xl font-black text-emerald-600">
              {product.price.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} <span className="text-[10px] font-medium">EUR TTC</span>
            </span>
          </div>
          <button 
            onClick={() => onAddToCart(product)}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm active:scale-90"
          >
            <Plus size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

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

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('benilink_category');
      return (saved as CategoryFilter) || 'Tous';
    }
    return 'Tous';
  });
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('benilink_search') || '';
    }
    return '';
  });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('benilink_chat');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return [];
        }
      }
    }
    return [];
  });
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paypalStatus, setPaypalStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const paypalContainerRef = useRef<HTMLDivElement | null>(null);

  // Charger le panier depuis localStorage au montage
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('benilink_cart');
      if (savedCart) {
        try {
          return JSON.parse(savedCart);
        } catch (e) {
          console.error('Erreur lors du chargement du panier:', e);
          return [];
        }
      }
    }
    return [];
  });

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('benilink_cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Sauvegarder activeCategory
  useEffect(() => {
    localStorage.setItem('benilink_category', activeCategory);
  }, [activeCategory]);

  // Sauvegarder searchQuery
  useEffect(() => {
    localStorage.setItem('benilink_search', searchQuery);
  }, [searchQuery]);

  // Sauvegarder chatMessages
  useEffect(() => {
    localStorage.setItem('benilink_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Synchroniser le panier entre les onglets
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'benilink_cart' && e.newValue) {
        try {
          const updatedCart = JSON.parse(e.newValue);
          setCart(updatedCart);
        } catch (error) {
          console.error('Erreur de synchronisation du panier:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Formulaire expédition
  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('benilink_form');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return {
            name: '',
            email: '',
            phone: '',
            weight: '',
            type: 'personnel',
            message: ''
          };
        }
      }
    }
    return {
      name: '',
      email: '',
      phone: '',
      weight: '',
      type: 'personnel',
      message: ''
    };
  });

  // Sauvegarder formData
  useEffect(() => {
    localStorage.setItem('benilink_form', JSON.stringify(formData));
  }, [formData]);

  // Données de livraison pour e-commerce
  const [deliveryData, setDeliveryData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('benilink_delivery');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return {
            fullName: '',
            phone: '',
            email: '',
            address: '',
            city: '',
            postalCode: '',
            country: 'France',
          };
        }
      }
    }
    return {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'France',
    };
  });

  // Sauvegarder deliveryData
  useEffect(() => {
    localStorage.setItem('benilink_delivery', JSON.stringify(deliveryData));
  }, [deliveryData]);

  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const [paymentMethod, setPaymentMethod] = useState<'whatsapp' | 'paypal' | 'stripe'>('whatsapp');
  const [isDeliveryFormOpen, setIsDeliveryFormOpen] = useState(true);
  const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const appBaseUrl = (import.meta.env.VITE_APP_BASE_URL || window.location.origin).trim();
  const stripeSuccessPath = import.meta.env.VITE_STRIPE_SUCCESS_PATH || '/checkout/success';
  const stripeCancelPath = import.meta.env.VITE_STRIPE_CANCEL_PATH || '/checkout/cancel';

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

  // Weight-based shipping
  type DeliveryMethod = 'pickup-tence' | 'pickup-stetienne' | 'colissimo' | 'relais';
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup-tence');

  const getUnitWeightKg = (item: CartItem) => {
    const name = item.name.toLowerCase();
    // Parse grams if present (e.g., 600g)
    const gramMatch = name.match(/(\d{2,4})\s*g/);
    if (item.unit === 'g' && gramMatch) {
      const g = parseInt(gramMatch[1], 10);
      return Math.max(0.05, g / 1000);
    }
    // Parse ml if present (e.g., 500ml)
    const mlMatch = name.match(/(\d{2,4})\s*ml/);
    if (item.unit === 'ml' && mlMatch) {
      const ml = parseInt(mlMatch[1], 10);
      return Math.max(0.05, ml / 1000); // approx density 1kg/L
    }
    if (item.unit === 'kilo') return 1;
    if (item.unit === 'litre') return 1;
    // sachet / unité → default estimate
    return 0.5;
  };

  const totalWeightKg = cart.reduce((sum, item) => sum + getUnitWeightKg(item) * item.quantity, 0);

  const getShippingRateEUR = (weightKg: number) => {
    if (weightKg < 5) return 3.00;          // 5-199kg → 3€/kg
    if (weightKg < 200) return 3.00;       // 5-199kg → 3€/kg
    if (weightKg < 500) return 2.75;       // 200-499kg → 2,75€/kg
    if (weightKg < 1000) return 2.50;      // 500-999kg → 2,50€/kg
    if (weightKg < 2000) return 2.25;      // 1-2t → 2,25€/kg
    return 1.75;                            // 3t+ → 1,75€/kg
  };

  const shippingCostEUR = useMemo(() => {
    // TOUJOURS appliquer les frais maritimes (Bénin → France)
    const ratePerKg = getShippingRateEUR(totalWeightKg);
    let shippingEUR = Math.round(totalWeightKg * ratePerKg * 100) / 100;
    
    // Ajouter frais Colissimo/Relais si applicable (TODO: définir tarifs)
    if (deliveryMethod === 'colissimo' || deliveryMethod === 'relais') {
      // shippingEUR += additionalColissimoFee;
    }
    
    return shippingEUR;
  }, [deliveryMethod, totalWeightKg]);

  // Calcul HT/TTC pour affichage et paiements
  const subtotalHT = Math.round((cartTotal / (1 + VAT_RATE)) * 100) / 100;
  const shippingHT = shippingCostEUR; // frais de port hors taxe
  const totalHT = Math.round((subtotalHT + shippingHT) * 100) / 100;
  const totalVAT = Math.round((totalHT * VAT_RATE) * 100) / 100;
  const totalTTC = Math.round((totalHT + totalVAT) * 100) / 100;

  const handleCheckout = async () => {
    // Vérifier le poids minimum
    if (totalWeightKg < 5) {
      alert(`⚠️ Poids minimum requis : 5 kg\nPoids actuel : ${totalWeightKg.toFixed(2)} kg\n\nVeuillez ajouter des produits pour atteindre le minimum.`);
      return;
    }
    
    // Vérifier que les infos de livraison sont remplies
    if (!deliveryData.fullName || !deliveryData.phone || !deliveryData.address || !deliveryData.city || !deliveryData.country) {
      alert('⚠️ Veuillez remplir toutes les informations de livraison avant de commander.');
      return;
    }

    let orderId = null;
    
    // ✅ Valider et sauvegarder la commande via l'API sécurisée
    try {
      const response = await fetch('/api/validate-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(i => ({ 
            name: i.name, 
            quantity: i.quantity 
          })),
          deliveryInfo: deliveryData,
          deliveryMethod: deliveryMethod,
          paymentMethod: 'whatsapp'
        })
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        console.warn('⚠️ API validation échouée, continuation sans ID de commande:', result);
        // On continue quand même - c'est un fallback
      } else {
        orderId = result.orderId;
        console.log(`✅ Commande validée : ${orderId}`);
      }
    } catch (error) {
      console.error('❌ Erreur validation commande:', error);
      // On continue quand même pour ne pas bloquer WhatsApp
    }

    // Message WhatsApp (affichage visuel pour le client)
    const message = `🛍️ NOUVELLE COMMANDE BENILINK${orderId ? `\n📌 Numéro : ${orderId}` : ''}\n\n` +
      `📦 PRODUITS :\n` +
      cart.map(item => `• ${item.name} (${item.quantity} ${item.unit}${item.quantity > 1 ? 's' : ''}) : ${(item.price * item.quantity).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} EUR TTC`).join('\n') +
      `\n\n💰 RÉCAPITULATIF :\n` +
      `• Sous-total produits HT : ${subtotalHT.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} EUR\n` +
      `• Frais de port HT (${deliveryMethod.replace('-', ' ')}) : ${shippingHT.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} EUR\n` +
      `• TVA (20%) : ${totalVAT.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} EUR\n` +
      `• TOTAL TTC : ${totalTTC.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} EUR\n\n` +
      `📍 LIVRAISON :\n` +
      `• Nom : ${deliveryData.fullName}\n` +
      `• Téléphone : ${deliveryData.phone}\n` +
      `• Email : ${deliveryData.email || 'Non fourni'}\n` +
      `• Adresse : ${deliveryData.address}\n` +
      `• Ville : ${deliveryData.city}\n` +
      `• Code postal : ${deliveryData.postalCode || 'N/A'}\n` +
      `• Pays : ${deliveryData.country}\n\n` +
      `Merci de confirmer la disponibilité ! 🙏`;
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    
    // Afficher la confirmation avec le numéro de commande
    if (orderId) {
      alert(`✅ Commande créée !\n\nNuméro : ${orderId}\n\nVous allez être redirigé vers WhatsApp...`);
    }
    
    // Ouvrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Vider le panier après succès
    clearCart();
    setIsCartOpen(false);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('benilink_cart');
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    
    const userMsg: ChatMessage = { role: 'user', content: userInput };
    setChatMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setIsTyping(true);

    try {
      // ✅ Appel sécurisé côté serveur
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userInput,
          products: PRODUCTS.map(p => ({ name: p.name, price: p.price, unit: p.unit }))
        })
      });

      const data = await response.json();
      
      if (data.success && data.text) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
      } else {
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.text || "Désolé, je rencontre un petit problème technique." 
        }]);
      }
    } catch (error) {
      console.error('Erreur chat:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Erreur de connexion. Veuillez réessayer dans quelques instants." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleStripeCheckout = async () => {
    // Vérifier le poids minimum
    if (totalWeightKg < 5) {
      alert(`⚠️ Poids minimum requis : 5 kg\nPoids actuel : ${totalWeightKg.toFixed(2)} kg\n\nVeuillez ajouter des produits pour atteindre le minimum.`);
      return;
    }

    // Vérifier que les infos de livraison sont remplies
    if (!deliveryData.fullName || !deliveryData.phone || !deliveryData.address || !deliveryData.city || !deliveryData.country) {
      alert('⚠️ Veuillez remplir toutes les informations de livraison avant de commander.');
      return;
    }

    if (!stripePublishableKey) {
      alert('Stripe indisponible: VITE_STRIPE_PUBLISHABLE_KEY manquant.');
      return;
    }

    if (cart.length === 0) return;

    try {
      // Appeler /api/validate-order pour avoir les détails sécurisés de la commande
      const validationRes = await fetch('/api/validate-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(i => ({ name: i.name, quantity: i.quantity })),
          deliveryInfo: deliveryData,
          deliveryMethod: deliveryMethod,
          paymentMethod: 'stripe'
        })
      });

      const validationResult = await validationRes.json();
      if (!validationRes.ok || !validationResult.success) {
        alert(`❌ Erreur validation commande: ${validationResult.error}`);
        return;
      }

      const orderId = validationResult.orderId;
      sessionStorage.setItem('stripe_order_id', orderId);

      // Créer la session Stripe checkout avec les montants validés
      const checkoutRes = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(i => ({ 
            name: i.name, 
            priceEUR: i.price,  // Le prix du frontend sera comparé côté serveur
            quantity: i.quantity 
          })),
          shippingCostEUR: Math.round(shippingHT * (1 + VAT_RATE) * 100) / 100,
          baseUrl: appBaseUrl,
          successPath: stripeSuccessPath,
          cancelPath: stripeCancelPath,
          orderId: orderId  // Passer l'ID de commande pour le webhook
        })
      });

      let checkoutData: any = null;
      try { 
        checkoutData = await checkoutRes.json();
      } catch (_) { /* no body */ }

      if (!checkoutRes.ok || !checkoutData?.sessionId) {
        const msg = checkoutData?.error || checkoutData?.details || `Échec API Stripe (${checkoutRes.status})`;
        throw new Error(msg);
      }

      const stripe = await loadStripe(stripePublishableKey);
      await stripe?.redirectToCheckout({ sessionId: checkoutData.sessionId });
    } catch (e: any) {
      console.error('Stripe error:', e);
      alert(`Erreur Stripe: ${e?.message || 'Veuillez réessayer.'}`);
      sessionStorage.removeItem('stripe_order_id');
    }
  };

  // Gestion formulaire expédition
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Bonjour BeniLink,\n\nNom: ${formData.name}\nEmail: ${formData.email}\nTéléphone: ${formData.phone}\nPoids estimé: ${formData.weight} kg\nType: ${formData.type}\n\nMessage:\n${formData.message}`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Services BeniLink
  const services = [
    {
      icon: Package,
      title: 'Colis personnels',
      description: 'Envoyez vivres, vêtements, cadeaux… partout en France.',
      color: 'emerald'
    },
    {
      icon: Globe,
      title: 'Produits locaux',
      description: 'Beurre de karité, huiles (coco, ricin), tapioca, gari, farine de manioc…',
      color: 'amber'
    },
    {
      icon: Truck,
      title: 'Approvisionnement pro',
      description: 'Matières premières pour cosmétique, agroalimentaire, artisanat.',
      color: 'blue'
    },
    {
      icon: ShieldCheck,
      title: 'Commandes spécifiques',
      description: 'Nous recherchons et envoyons ce dont vous avez besoin sur demande.',
      color: 'violet'
    }
  ];

  const processSteps = [
    { number: '1', title: 'Réservation', description: 'En ligne ou par WhatsApp en quelques minutes.' },
    { number: '2', title: 'Validation du devis', description: 'Nous vous envoyons un tarif clair et sans surprise.' },
    { number: '3', title: 'Paiement sécurisé', description: 'Mobile Money, Stripe ou Flutterwave.' },
    { number: '4', title: 'Expédition', description: 'Envoi hebdomadaire maritime ou aérien.' },
    { number: '5', title: 'Livraison', description: 'Chez vous ou retrait à Paris en toute simplicité.' }
  ];

  const pricing = [
    { name: 'Petit envoi', price: '3',range: '5 à 199 kg', badge: false },
    { name: 'Standard', price: '2,75', range: '200 à 499 kg', badge: false },
    { name: 'Moyen volume', price: '2,5', range: '500 à 999 kg', badge: true },
    { name: 'Gros envoi', price: '2,25', range: '1 à 2 tonnes', badge: false },
    { name: 'Gros volume', price: '1,75', range: '3 tonnes et plus', badge: true }
  ];

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
                value: totalTTC.toFixed(2),
                breakdown: {
                  item_total: {
                    currency_code: 'EUR',
                    value: cartTotal.toFixed(2)
                  },
                  shipping: {
                    currency_code: 'EUR',
                    value: (Math.round(shippingHT * (1 + VAT_RATE) * 100) / 100).toFixed(2)
                  }
                },
              },
              description: 'Commande BeniLink',
              items: cart.map(item => ({
                name: item.name.slice(0, 120),
                unit_amount: { currency_code: 'EUR', value: item.price.toFixed(2) },
                quantity: item.quantity,
              })),
            }
          ]
        });
      },
      onApprove: async (_: unknown, actions: any) => {
        // Vérifier le poids minimum
        if (totalWeightKg < 5) {
          alert(`⚠️ Poids minimum requis : 5 kg\nPoids actuel : ${totalWeightKg.toFixed(2)} kg`);
          return;
        }

        // Vérifier que les infos de livraison sont remplies
        if (!deliveryData.fullName || !deliveryData.phone || !deliveryData.address || !deliveryData.city || !deliveryData.country) {
          alert('⚠️ Veuillez remplir toutes les informations de livraison avant de valider le paiement.');
          return;
        }

        try {
          // Capturer le paiement PayPal
          await actions.order.capture();

          // Valider la commande côté serveur (sécurisé)
          const response = await fetch('/api/validate-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: cart.map(i => ({ 
                name: i.name, 
                quantity: i.quantity 
              })),
              deliveryInfo: deliveryData,
              deliveryMethod: deliveryMethod,
              paymentMethod: 'paypal'
            })
          });

          const result = await response.json();
          
          if (response.ok && result.success) {
            const orderId = result.orderId;
            alert(`✅ Paiement confirmé !\n\nNuméro de commande : ${orderId}`);
            clearCart();
            setIsCartOpen(false);
            setChatMessages(prev => [...prev, { role: 'assistant', content: `Paiement PayPal confirmé. Commande ${orderId} créée avec succès ! 🎉` }]);
          } else {
            console.error('Erreur validation commande:', result);
            alert('⚠️ Paiement confirmé mais erreur lors de la sauvegarde. Nous vous contacterons.');
          }
        } catch (error) {
          console.error('Erreur PayPal:', error);
          alert('⚠️ Erreur lors du traitement du paiement. Veuillez réessayer.');
        }
      },
      onError: () => setPaypalStatus('error')
    }).render(paypalContainerRef.current);

    setPaypalStatus('ready');
  }, [cart, subtotalHT, shippingHT, totalTTC, deliveryData]);

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
                            <span class="text-xl font-black text-emerald-600">${p.price.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} € TTC</span>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 pb-24 selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      {/* Header BeniLink */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-emerald-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <button onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3 hover:rotate-0 transition-transform">
                <Package size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">
                  <span className="text-amber-500">BENI</span>
                  <span className="text-emerald-900">LINK</span>
                </h1>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Bénin • France</p>
              </div>
            </button>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#boutique" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">Boutique</a>
              <a href="#expedition" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">Expédition</a>
              <a href="#tarifs" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">Tarifs</a>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-3 text-slate-700 hover:bg-slate-50 rounded-2xl transition-all active:scale-95 group"
              >
                <ShoppingCart size={24} className="group-hover:text-emerald-600 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-600 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-4 ring-white animate-in zoom-in duration-300">
                    {cartCount}
                  </span>
                )}
              </button>
              <a href="#contact" className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl active:scale-95">
                Réserver
              </a>
            </nav>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-emerald-100 shadow-xl">
            <div className="px-4 py-6 space-y-4">
              <a href="#boutique" onClick={() => setIsMenuOpen(false)} className="block py-3 text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">Boutique</a>
              <a href="#expedition" onClick={() => setIsMenuOpen(false)} className="block py-3 text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">Expédition</a>
              <a href="#tarifs" onClick={() => setIsMenuOpen(false)} className="block py-3 text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">Tarifs</a>
              <button 
                onClick={() => { setIsCartOpen(true); setIsMenuOpen(false); }}
                className="block w-full text-left py-3 text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors"
              >
                Panier {cartCount > 0 && `(${cartCount})`}
              </button>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="block py-3 px-6 bg-emerald-600 text-white rounded-2xl font-black text-sm text-center hover:bg-emerald-700 transition-all">
                Réserver
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section - Dual Activity */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-emerald-50/50 to-transparent -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-emerald-200 rounded-full text-emerald-700 text-xs font-black uppercase tracking-widest mb-10 shadow-lg">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-emerald-400"></span>
              Livraison fiable & Produits authentiques
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-tight">
              Du <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Bénin</span> à la <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">France</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              <strong>Expédiez vos colis</strong> ou <strong>commandez nos produits 100% béninois</strong> : beurre de karité, huiles précieuses, vivres traditionnels. Service complet avec suivi.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#boutique" className="group px-8 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-black text-lg shadow-2xl hover:shadow-emerald-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
                <ShoppingBag size={24} />
                Découvrir nos produits
              </a>
              <a href="#expedition" className="px-8 py-5 bg-white text-emerald-600 border-2 border-emerald-600 rounded-2xl font-black text-lg hover:bg-emerald-50 transition-all flex items-center gap-3">
                <Truck size={24} />
                Expédier un colis
              </a>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-black text-emerald-600 mb-2">850+</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Colis livrés</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-amber-600 mb-2">70+</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Produits</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-teal-600 mb-2">100%</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Authentique</div>
              </div>
            </div>
          </div>

          {/* Alerte prochains départs - Design moderne et professionnel */}
          <div className="mt-20 max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
              {/* Header avec badge animé */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-8 py-6 border-b border-emerald-100">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Clock size={28} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Prochains Départs</h3>
                      <p className="text-sm text-slate-600 font-medium">Bénin → France • Réservez dès maintenant</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full text-xs font-bold shadow-lg">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    Places disponibles
                  </div>
                </div>
              </div>

              {/* Grille des départs */}
              <div className="p-8 grid md:grid-cols-2 gap-6">
                {/* Maritime */}
                <div className="group bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-6 border-2 border-sky-200 hover:border-sky-400 transition-all hover:shadow-xl">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-sky-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Ship size={24} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900">Transport Maritime</h4>
                        <p className="text-xs text-slate-600 font-semibold">Économique & Fiable</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-sky-600 text-white rounded-full text-xs font-bold">
                      Min. 5kg
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-600"></div>
                      <span className="text-sm text-slate-700"><strong>Prochain départ :</strong> 25 Janvier 2026</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-600"></div>
                      <span className="text-sm text-slate-700"><strong>Délai :</strong> 30-45 jours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-600"></div>
                      <span className="text-sm text-slate-700"><strong>Tarif :</strong> À partir de 3 EUR / kg</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-sky-200">
                    <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
                      <Clock size={14} />
                      <span className="font-bold">Réservation avant le 20 janvier</span>
                    </div>
                  </div>
                </div>

                {/* Aérien */}
                <div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-xl">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plane size={24} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900">Transport Aérien</h4>
                        <p className="text-xs text-slate-600 font-semibold">Rapide & Sécurisé</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-bold">
                      Min. 10kg
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                      <span className="text-sm text-slate-700"><strong>Prochain vol :</strong> 15 Janvier 2026</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                      <span className="text-sm text-slate-700"><strong>Délai :</strong> 5-7 jours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                      <span className="text-sm text-slate-700"><strong>Tarif :</strong> À partir de 7,75 EUR / kg</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-purple-200">
                    <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 px-3 py-2 rounded-lg">
                      <ShieldCheck size={14} />
                      <span className="font-bold">Places limitées - Réservez vite</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Footer */}
              <div className="bg-slate-50 px-8 py-6 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-slate-600 text-center sm:text-left">
                    <strong className="text-slate-900">Besoin d'aide ?</strong> Notre équipe vous accompagne dans votre réservation
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <a 
                      href="https://wa.me/33768585890?text=Bonjour, je souhaite réserver pour le prochain départ"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95"
                    >
                      <MessageSquare size={18} />
                      Réserver sur WhatsApp
                    </a>
                    <button
                      onClick={() => navigate('/politique-expedition')}
                      className="px-6 py-3 bg-white text-slate-700 border-2 border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all active:scale-95"
                    >
                      En savoir plus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Clarification des 2 services */}
          <div className="mt-16 grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-3xl border-2 border-emerald-200 hover:border-emerald-400 transition-all group">
              <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShoppingBag size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">🛍️ Acheter nos produits</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Commandez parmi <strong>70+ produits béninois authentiques</strong> : huiles, beurres, épices, vivres. Nous expédions depuis le Bénin vers la France avec suivi complet.
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-600" />
                  Livraison en France selon le poids
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-600" />
                  TVA 20% incluse
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-600" />
                  Paiement sécurisé (PayPal, Stripe, WhatsApp)
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-3xl border-2 border-amber-200 hover:border-amber-400 transition-all group">
              <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Package size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">📦 Expédier vos colis</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Vous avez des colis à envoyer du Bénin vers la France ? Utilisez notre <strong>service d'expédition fiable</strong>. Tarif selon poids, suivi complet, livraison rapide.
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-amber-600" />
                  À partir de 3 € / kg
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-amber-600" />
                  Suivi en temps réel
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-amber-600" />
                  Livraison sous 7-15 jours
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Product Feed */}
      <main id="boutique" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            🛍️ Nos <span className="text-emerald-600">produits</span> authentiques
          </h2>
          <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full mb-8"></div>
        </div>
        <div className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {(['Tous', 'Huile', 'Beurre', 'Poudre', 'Farine', 'Céréale', 'Épice', 'Poisson'] as CategoryFilter[]).map(cat => (
              <CategoryTab 
                key={cat} 
                label={cat} 
                isActive={activeCategory === cat} 
                onClick={() => setActiveCategory(cat)} 
              />
            ))}
          </div>

          <div className="relative group max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none shadow-sm text-slate-700 font-medium placeholder:text-slate-300 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      </main>

      {/* Services Section (BeniLink) */}
      <section id="expedition" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              🌿 Nos produits et <span className="text-emerald-600">services</span>
            </h2>
            <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="group bg-gradient-to-br from-white to-slate-50 p-8 rounded-[2.5rem] border-2 border-slate-100 hover:border-emerald-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`w-16 h-16 bg-gradient-to-br from-${service.color}-500 to-${service.color}-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                  <service.icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="#contact" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 shadow-xl hover:shadow-2xl transition-all active:scale-95">
              Je réserve mon envoi maintenant
              <Send size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Process Section (BeniLink) */}
      <section id="process" className="py-24 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              ⚙️ Comment ça <span className="text-emerald-600">marche ?</span>
            </h2>
            <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {processSteps.map((step, index) => (
              <div 
                key={index}
                className="relative bg-white p-8 rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-slate-100"
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl">
                  {step.number}
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-black text-emerald-600 mb-3">{step.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="#contact" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 shadow-xl hover:shadow-2xl transition-all active:scale-95">
              Je réserve mon envoi maintenant
              <Send size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Pricing Section (BeniLink) */}
      <section id="tarifs" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              💰 Nos tarifs <span className="text-emerald-600">indicatifs</span>
            </h2>
            <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full mb-4"></div>
            <p className="text-slate-600 max-w-2xl mx-auto">Prix au kilogramme pour un envoi maritime depuis le Bénin vers la France</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, index) => (
              <div 
                key={index}
                className={`relative bg-gradient-to-br from-white to-slate-50 p-8 rounded-[2.5rem] border-2 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                  plan.badge ? 'border-emerald-400 shadow-lg' : 'border-slate-200'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black uppercase rounded-full shadow-lg">
                    Populaire
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-black text-slate-900 mb-4">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-5xl font-black text-emerald-600">{plan.price}</span>
                    <span className="text-slate-500 font-bold ml-2">EUR / Kg</span>
                  </div>
                  <p className="text-slate-600 font-bold">{plan.range}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 max-w-2xl mx-auto bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <CheckCircle size={24} className="text-white" />
              </div>
              <div>
                <h4 className="text-lg font-black text-amber-900 mb-2">💡 Tarif aérien disponible</h4>
                <p className="text-amber-800">Pour un envoi express (3-5 jours), demandez un devis personnalisé. Tarif à partir de 7,75 EUR / Kg.</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <a href="#contact" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 shadow-xl hover:shadow-2xl transition-all active:scale-95">
              Réserver mon envoi
              <Send size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[70] flex justify-end">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-6 md:p-10 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Votre Panier</h3>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">{cartCount} article{cartCount > 1 ? 's' : ''}</p>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all hover:rotate-90">
                <X size={28} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-4 md:p-10 space-y-6 md:space-y-10">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-slate-100">
                    <ShoppingCart size={48} className="text-slate-200" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-800">Panier vide</h4>
                  <p className="text-slate-400 mt-3 max-w-[200px]">Parcourez nos pépites naturelles pour le remplir !</p>
                </div>
              ) : (
                <>
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-4 md:gap-8 items-center animate-in fade-in slide-in-from-bottom-8">
                      <div className="w-20 h-20 md:w-28 md:h-28 rounded-3xl overflow-hidden shadow-xl flex-shrink-0 group ring-4 ring-emerald-50">
                        <img src={item.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={item.name} />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-lg font-bold text-slate-900 leading-tight mb-2">{item.name}</h4>
                        <p className="text-emerald-600 font-black">{(item.price * item.quantity).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} <span className="text-xs font-medium">EUR</span></p>
                        <div className="flex items-center gap-5 mt-4">
                          <div className="flex items-center bg-slate-100 rounded-2xl p-1.5 ring-1 ring-slate-200/50">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm"><Minus size={16} /></button>
                            <input 
                              type="number" 
                              min="1" 
                              max="999" 
                              value={item.quantity}
                              onChange={(e) => {
                                const newQty = parseInt(e.target.value) || 1;
                                updateQuantity(item.id, newQty - item.quantity);
                              }}
                              className="w-12 text-center text-sm font-black text-slate-800 bg-transparent border-none outline-none"
                            />
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm"><Plus size={16} /></button>
                          </div>
                          <button onClick={() => updateQuantity(item.id, -item.quantity)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Formulaire de livraison - Version compacte */}
                  <div className="bg-emerald-50 rounded-3xl p-4 md:p-6 border-2 border-emerald-200">
                    <button
                      onClick={() => setIsDeliveryFormOpen(!isDeliveryFormOpen)}
                      className="w-full flex items-center justify-between text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <Truck size={24} className="text-emerald-600" />
                        <div>
                          <h3 className="font-black text-slate-900">Informations de livraison</h3>
                          {deliveryData.fullName && (
                            <p className="text-sm text-emerald-600 font-bold mt-1">
                              ✓ {deliveryData.fullName} - {deliveryData.city || 'Ville à renseigner'}
                            </p>
                          )}
                        </div>
                      </div>
                      <ChevronRight 
                        size={24} 
                        className={`text-emerald-600 transition-transform ${isDeliveryFormOpen ? 'rotate-90' : ''}`}
                      />
                    </button>

                    {/* Mode de livraison / retrait */}
                    <div className="mt-4 grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Mode de livraison</label>
                        <select
                          value={deliveryMethod}
                          onChange={(e) => setDeliveryMethod(e.target.value as any)}
                          className="w-full px-4 py-3 rounded-xl border-2 border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition bg-white text-sm"
                        >
                          <option value="pickup-tence">Retrait à Tence (gratuit)</option>
                          <option value="pickup-stetienne">Retrait à Saint-Étienne (gratuit)</option>
                          <option value="colissimo">Colissimo (à domicile)</option>
                          <option value="relais">Point relais (de votre choix)</option>
                        </select>
                      </div>
                    </div>

                    {isDeliveryFormOpen && (
                      <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Nom complet *"
                            value={deliveryData.fullName}
                            onChange={(e) => setDeliveryData({ ...deliveryData, fullName: e.target.value })}
                            className="px-4 py-3 rounded-xl border-2 border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition bg-white text-sm"
                            required
                          />
                          <input
                            type="tel"
                            placeholder="Téléphone *"
                            value={deliveryData.phone}
                            onChange={(e) => setDeliveryData({ ...deliveryData, phone: e.target.value })}
                            className="px-4 py-3 rounded-xl border-2 border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition bg-white text-sm"
                            required
                          />
                        </div>
                        <input
                          type="email"
                          placeholder="Email"
                          value={deliveryData.email}
                          onChange={(e) => setDeliveryData({ ...deliveryData, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition bg-white text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Adresse complète *"
                          value={deliveryData.address}
                          onChange={(e) => setDeliveryData({ ...deliveryData, address: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition bg-white text-sm"
                          required
                        />
                        <div className="grid grid-cols-3 gap-3">
                          <input
                            type="text"
                            placeholder="Ville *"
                            value={deliveryData.city}
                            onChange={(e) => setDeliveryData({ ...deliveryData, city: e.target.value })}
                            className="px-4 py-3 rounded-xl border-2 border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition bg-white text-sm"
                            required
                          />
                          <input
                            type="text"
                            placeholder="Code postal"
                            value={deliveryData.postalCode}
                            onChange={(e) => setDeliveryData({ ...deliveryData, postalCode: e.target.value })}
                            className="px-4 py-3 rounded-xl border-2 border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition bg-white text-sm"
                          />
                          <select
                            value={deliveryData.country}
                            onChange={(e) => setDeliveryData({ ...deliveryData, country: e.target.value })}
                            className="px-4 py-3 rounded-xl border-2 border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition bg-white text-sm"
                          >
                            <option value="France">🇫🇷 France</option>
                            <option value="Bénin">🇧🇯 Bénin</option>
                            <option value="International">🌍 International</option>
                          </select>
                        </div>
                        <p className="text-xs text-emerald-700 font-bold">* Champs obligatoires</p>
                        <button
                          onClick={() => {
                            setIsDeliveryFormOpen(false);
                            // Scroll vers le bas du panier
                            setTimeout(() => {
                              const cartElement = document.querySelector('.flex-grow.overflow-y-auto');
                              if (cartElement) {
                                cartElement.scrollTo({ top: cartElement.scrollHeight, behavior: 'smooth' });
                              }
                            }, 100);
                          }}
                          className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={20} />
                          Valider les informations
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-10 border-t border-slate-50 bg-slate-50/50 space-y-6">
                {/* Récapitulatif */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 font-bold">Sous-total produits HT</span>
                    <span className="font-black text-slate-900">{subtotalHT.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} EUR</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 font-bold">Poids total</span>
                    <span className="font-black text-slate-900">{totalWeightKg.toFixed(2)} kg</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 font-bold">Frais de port HT ({deliveryMethod.replace('-', ' ')})</span>
                    <span className="font-black text-slate-900">{shippingHT.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} EUR</span>
                  </div>
                  <div className="flex items-center justify-between text-sm border-t border-slate-200 pt-3">
                    <span className="text-slate-600 font-bold">TVA (20%)</span>
                    <span className="font-black text-emerald-600">{totalVAT.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} EUR</span>
                  </div>
                  <div className="pt-3 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Total TTC</span>
                      <span className="text-4xl font-black text-emerald-950">{totalTTC.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} <span className="text-sm">EUR</span></span>
                    </div>
                  </div>
                </div>

                {/* Méthodes de paiement */}
                <div className="flex gap-2">
                  <button onClick={() => setPaymentMethod('whatsapp')} className={`px-4 py-2 rounded-xl text-sm font-black border ${paymentMethod === 'whatsapp' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'}`}>WhatsApp</button>
                  <button onClick={() => setPaymentMethod('paypal')} className={`px-4 py-2 rounded-xl text-sm font-black border ${paymentMethod === 'paypal' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'}`}>PayPal</button>
                  {/* Stripe désactivé - button masqué */}
                </div>
                {paymentMethod === 'whatsapp' ? (
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-emerald-600 text-white py-3 md:py-4 rounded-[2rem] font-black text-lg md:text-xl flex items-center justify-center gap-3 md:gap-4 hover:bg-emerald-700 shadow-2xl shadow-emerald-200 transition-all active:scale-[0.98] group"
                  >
                    <Send size={20} md:size={25} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Commander via WhatsApp
                  </button>
                ) : paymentMethod === 'paypal' ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-slate-500 font-bold">
                      <span>Payer avec PayPal</span>
                      <span className="text-emerald-700 font-black">{totalTTC.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} EUR</span>
                    </div>
                    <div ref={paypalContainerRef} className="min-h-[60px]" />
                    {paypalStatus === 'loading' && <p className="text-sm text-slate-500">Chargement des boutons PayPal...</p>}
                    {paypalStatus === 'error' && <p className="text-sm text-red-500">PayPal indisponible. Vérifiez PAYPAL_CLIENT_ID ou réessayez.</p>}
                  </div>
                ) : null
                /* Stripe désactivé
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-slate-500 font-bold">
                      <span>Payer avec Stripe</span>
                      <span className="text-emerald-700 font-black">{totalTTC.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} EUR</span>
                    </div>
                    <button onClick={handleStripeCheckout} className="w-full bg-slate-900 text-white py-3 md:py-4 rounded-2xl font-black text-base md:text-lg hover:bg-slate-800 transition">
                      Continuer vers Stripe Checkout
                    </button>
                    {!stripePublishableKey && <p className="text-sm text-red-500">Stripe indisponible. Ajoutez STRIPE_PUBLISHABLE_KEY.</p>}
                  </div>
                */}
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

      {/* Contact & Réservation (Formulaire unifié) */}
      <section id="contact" className="py-24 bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              📦 Réservez votre <span className="text-amber-400">envoi</span>
            </h2>
            <p className="text-emerald-100 text-lg">Remplissez le formulaire et nous vous contacterons rapidement sur WhatsApp</p>
          </div>

          <form onSubmit={handleShippingSubmit} className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Nom complet *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Téléphone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium"
                  placeholder="+33 ou +229"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Poids estimé (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium"
                  placeholder="50"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Type d'envoi</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium"
              >
                <option value="personnel">Colis personnel</option>
                <option value="produits">Produits locaux</option>
                <option value="pro">Approvisionnement professionnel</option>
                <option value="specifique">Commande spécifique</option>
              </select>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Détails de votre demande</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium resize-none"
                placeholder="Décrivez votre besoin (contenu, destination, délai souhaité...)"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-5 rounded-2xl font-black text-lg hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <Send size={24} />
              Envoyer sur WhatsApp
            </button>

            <p className="text-center text-sm text-slate-500 mt-6">
              En soumettant ce formulaire, vous acceptez d'être contacté par WhatsApp pour finaliser votre réservation.
            </p>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Colonne 1 - Marque */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <Package size={28} />
                </div>
                <div>
                  <h1 className="text-2xl font-black">
                    <span className="text-amber-500">BENI</span>
                    <span className="text-white">LINK</span>
                  </h1>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Votre partenaire de confiance pour l'expédition de colis et produits authentiques entre le Bénin et la France.
              </p>
              {/* Réseaux sociaux */}
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-emerald-600 rounded-xl flex items-center justify-center transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-emerald-600 rounded-xl flex items-center justify-center transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 hover:bg-emerald-600 rounded-xl flex items-center justify-center transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
              </div>
            </div>

            {/* Colonne 2 - Navigation */}
            <div className="space-y-6">
              <h5 className="font-black text-xs uppercase tracking-wider text-white">Navigation</h5>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><a href="#boutique" className="hover:text-emerald-400 transition-colors flex items-center gap-2"><ChevronRight size={16} />Boutique</a></li>
                <li><a href="#expedition" className="hover:text-emerald-400 transition-colors flex items-center gap-2"><ChevronRight size={16} />Expédition</a></li>
                <li><a href="#tarifs" className="hover:text-emerald-400 transition-colors flex items-center gap-2"><ChevronRight size={16} />Tarifs</a></li>
                <li><a href="/politique-expedition" className="hover:text-emerald-400 transition-colors flex items-center gap-2"><ChevronRight size={16} />Politique d'envoi</a></li>
                <li><a href="#contact" className="hover:text-emerald-400 transition-colors flex items-center gap-2"><ChevronRight size={16} />Contact</a></li>
              </ul>
            </div>

            {/* Colonne 3 - Contact */}
            <div className="space-y-6">
              <h5 className="font-black text-xs uppercase tracking-wider text-white">Contact</h5>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li className="flex items-start gap-3">
                  <Mail size={18} className="flex-shrink-0 mt-0.5 text-emerald-500" />
                  <a href="mailto:germaine.elitenetworker@gmail.com" className="hover:text-emerald-400 transition-colors break-all">
                    germaine.elitenetworker@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="flex-shrink-0 text-emerald-500" />
                  <a href={`tel:+${WHATSAPP_NUMBER}`} className="hover:text-emerald-400 transition-colors">
                    +33 7 68 58 58 90
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Globe size={18} className="flex-shrink-0 mt-0.5 text-emerald-500" />
                  <span>Bénin 🇧🇯 → France 🇫🇷</span>
                </li>
              </ul>
            </div>

            {/* Colonne 4 - Horaires */}
            <div className="space-y-6">
              <h5 className="font-black text-xs uppercase tracking-wider text-white">Horaires</h5>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex justify-between">
                  <span>Lundi - Vendredi</span>
                  <span className="text-emerald-400 font-bold">9h - 18h</span>
                </li>
                <li className="flex justify-between">
                  <span>Samedi</span>
                  <span className="text-emerald-400 font-bold">10h - 16h</span>
                </li>
                <li className="flex justify-between">
                  <span>Dimanche</span>
                  <span className="text-slate-500">Fermé</span>
                </li>
              </ul>
              <div className="pt-4">
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all">
                  <MessageSquare size={16} />
                  Chat WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Séparateur et copyright */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">© 2026 BeniLink. Tous droits réservés.</p>
            <div className="flex gap-6 text-sm">
              <a href="/confidentialite" className="text-slate-500 hover:text-emerald-400 transition-colors">Confidentialité</a>
              <a href="/mentions-legales" className="text-slate-500 hover:text-emerald-400 transition-colors">Mentions légales</a>
              <a href="/cgv" className="text-slate-500 hover:text-emerald-400 transition-colors">CGV</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
