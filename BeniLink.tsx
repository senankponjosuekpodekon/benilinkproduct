import React, { useState } from 'react';
import { Package, Truck, ShieldCheck, Globe, Mail, Phone, Send, CheckCircle, ArrowRight, Menu, X } from 'lucide-react';

const BeniLink: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    weight: '',
    type: 'personnel',
    message: ''
  });

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
    { name: 'Petit envoi', price: '1800', range: '50 à 199 kg', badge: false },
    { name: 'Standard', price: '1500', range: '200 à 499 kg', badge: false },
    { name: 'Moyen volume', price: '1300', range: '500 à 999 kg', badge: true },
    { name: 'Gros envoi', price: '1000', range: '1 à 2 tonnes', badge: false },
    { name: 'Gros volume', price: '850', range: '3 tonnes et plus', badge: true }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappNumber = '33768585890';
    const message = `Bonjour BeniLink,\n\nNom: ${formData.name}\nEmail: ${formData.email}\nTéléphone: ${formData.phone}\nPoids estimé: ${formData.weight} kg\nType: ${formData.type}\n\nMessage:\n${formData.message}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-emerald-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
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
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">Services</a>
              <a href="#process" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">Comment ça marche</a>
              <a href="#tarifs" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">Tarifs</a>
              <a href="#form" className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl active:scale-95">
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
              <a href="#services" className="block py-3 text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">Services</a>
              <a href="#process" className="block py-3 text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">Comment ça marche</a>
              <a href="#tarifs" className="block py-3 text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">Tarifs</a>
              <a href="#form" className="block py-3 px-6 bg-emerald-600 text-white rounded-2xl font-black text-sm text-center hover:bg-emerald-700 transition-all">
                Réserver
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-emerald-50/50 to-transparent -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-emerald-200 rounded-full text-emerald-700 text-xs font-black uppercase tracking-widest mb-10 shadow-lg">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-emerald-400"></span>
              Livraison fiable & rapide
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-tight">
              Expédiez du <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Bénin</span> vers la <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">France</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              Envoyez vos colis ou recevez nos <strong>produits 100% béninois</strong> : beurre de karité, huiles, vivres. Service fiable avec suivi WhatsApp.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#form" className="group px-8 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-black text-lg shadow-2xl hover:shadow-emerald-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
                Réserver mon envoi
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="mailto:germaine.elitenetworker@gmail.com" className="px-8 py-5 bg-white text-emerald-600 border-2 border-emerald-600 rounded-2xl font-black text-lg hover:bg-emerald-50 transition-all flex items-center gap-3">
                <Mail size={20} />
                Contactez-nous
              </a>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-black text-emerald-600 mb-2">850+</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Colis livrés</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-amber-600 mb-2">7-14j</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Délai moyen</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-teal-600 mb-2">100%</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Sécurisé</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
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
            <a href="#form" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 shadow-xl hover:shadow-2xl transition-all active:scale-95">
              Je réserve mon envoi maintenant
              <Send size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Process Section */}
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
            <a href="#form" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 shadow-xl hover:shadow-2xl transition-all active:scale-95">
              Je réserve mon envoi maintenant
              <Send size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
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
                    <span className="text-slate-500 font-bold ml-2">F CFA / Kg</span>
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
                <p className="text-amber-800">Pour un envoi express (3-5 jours), demandez un devis personnalisé. Tarif à partir de 3000 F CFA/Kg.</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <a href="#form" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 shadow-xl hover:shadow-2xl transition-all active:scale-95">
              Réserver mon envoi
              <Send size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="form" className="py-24 bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              📦 Réservez votre <span className="text-amber-400">envoi</span>
            </h2>
            <p className="text-emerald-100 text-lg">Remplissez le formulaire et nous vous contacterons rapidement sur WhatsApp</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl">
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
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
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
              <p className="text-slate-400 leading-relaxed">
                Votre partenaire de confiance pour l'expédition de colis et produits authentiques entre le Bénin et la France.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-black mb-6 uppercase tracking-widest">Contact</h3>
              <div className="space-y-4">
                <a href="mailto:germaine.elitenetworker@gmail.com" className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors">
                  <Mail size={20} />
                  germaine.elitenetworker@gmail.com
                </a>
                <a href="tel:+33768585890" className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors">
                  <Phone size={20} />
                  +33 7 68 58 58 90
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black mb-6 uppercase tracking-widest">Horaires</h3>
              <div className="space-y-2 text-slate-400">
                <p>Lundi - Vendredi : 9h - 18h</p>
                <p>Samedi : 10h - 16h</p>
                <p>Dimanche : Fermé</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">© 2026 BeniLink. Tous droits réservés.</p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-500 hover:text-emerald-400 text-sm font-bold transition-colors">Confidentialité</a>
              <a href="#" className="text-slate-500 hover:text-emerald-400 text-sm font-bold transition-colors">Mentions légales</a>
              <a href="#" className="text-slate-500 hover:text-emerald-400 text-sm font-bold transition-colors">CGV</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BeniLink;
