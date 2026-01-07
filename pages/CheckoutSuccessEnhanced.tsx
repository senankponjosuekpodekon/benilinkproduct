import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Home } from 'lucide-react';

export default function CheckoutSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
        
        {/* Icône de succès animée */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-25"></div>
            <div className="relative bg-gradient-to-br from-emerald-500 to-green-600 p-6 rounded-full shadow-xl">
              <CheckCircle size={64} className="text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Message principal */}
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
          Commande confirmée !
        </h1>
        
        <p className="text-xl text-slate-600 mb-8 leading-relaxed">
          🎉 Merci pour votre confiance ! Votre commande a été enregistrée avec succès.
        </p>

        {/* Informations */}
        <div className="bg-emerald-50 rounded-2xl p-6 mb-8 border border-emerald-100">
          <div className="flex items-start gap-4 text-left">
            <Package className="text-emerald-600 mt-1 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-slate-900 mb-2 text-lg">Prochaines étapes</h3>
              <ul className="text-slate-700 space-y-2 text-sm leading-relaxed">
                <li>✅ Un email de confirmation vous a été envoyé</li>
                <li>📱 Nous vous contacterons bientôt sur WhatsApp pour confirmer les détails</li>
                <li>📦 Votre colis sera préparé avec soin</li>
                <li>🚚 Vous recevrez un numéro de suivi dès l'expédition</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="bg-slate-50 rounded-2xl p-6 mb-8">
          <p className="text-sm text-slate-600 mb-3">
            <strong>Questions ?</strong> Notre équipe est à votre écoute
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="mailto:germaine.elitenetworker@gmail.com"
              className="inline-flex items-center gap-2 bg-white px-5 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all shadow-sm"
            >
              📧 germaine.elitenetworker@gmail.com
            </a>
            <a 
              href="https://wa.me/33768585890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 px-5 py-3 rounded-xl text-sm font-semibold text-white hover:bg-green-700 transition-all shadow-sm"
            >
              💬 WhatsApp: +33 7 68 58 58 90
            </a>
          </div>
        </div>

        {/* Bouton retour */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl active:scale-95"
        >
          <Home size={24} />
          Retour à la boutique
        </button>

        {/* Message de gratitude */}
        <p className="mt-8 text-slate-500 text-sm italic">
          Du Bénin à la France avec amour 💚
        </p>
      </div>
    </div>
  );
}
