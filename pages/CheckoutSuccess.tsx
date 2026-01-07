import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Home } from 'lucide-react';

const CheckoutSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8faf7] flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-16 max-w-md w-full text-center border border-slate-100">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce">
          <Check size={48} className="text-emerald-600" />
        </div>
        
        <h1 className="text-4xl font-black text-emerald-950 mb-4">Paiement confirmé !</h1>
        
        <p className="text-slate-600 font-bold mb-10 text-lg">
          Merci pour votre commande. Nous vous enverrons un email de confirmation très bientôt.
        </p>

        <div className="bg-emerald-50 rounded-2xl p-8 mb-10 border border-emerald-100">
          <p className="text-slate-600 mb-3">
            Numero de commande
          </p>
          <p className="text-2xl font-black text-emerald-600 font-mono">
            #000{Math.floor(Math.random() * 10000)}
          </p>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 active:scale-95"
        >
          <Home size={24} />
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
