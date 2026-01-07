import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-bold mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Retour à l'accueil
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <Shield size={32} className="text-emerald-600" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900">Politique de Confidentialité</h1>
              <p className="text-slate-500 text-sm mt-1">Dernière mise à jour : 7 janvier 2026</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
              <p className="text-slate-600 leading-relaxed">
                BeniLink s'engage à protéger la confidentialité et la sécurité des données personnelles de ses utilisateurs. 
                Cette politique de confidentialité décrit comment nous collectons, utilisons, stockons et protégeons vos informations 
                personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et aux lois applicables.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Données collectées</h2>
              <p className="text-slate-600 leading-relaxed mb-4">Nous collectons les informations suivantes :</p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li><strong>Données d'identification :</strong> nom, prénom, adresse email, numéro de téléphone</li>
                <li><strong>Données de commande :</strong> produits commandés, montants, historique d'achats</li>
                <li><strong>Données d'expédition :</strong> adresses de livraison, informations de colis</li>
                <li><strong>Données de paiement :</strong> via nos partenaires sécurisés (Stripe, PayPal) - nous ne stockons jamais vos informations bancaires complètes</li>
                <li><strong>Données de navigation :</strong> adresse IP, type de navigateur, pages visitées (cookies)</li>
                <li><strong>Communications :</strong> échanges WhatsApp, emails, messages via le chatbot</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Utilisation des données</h2>
              <p className="text-slate-600 leading-relaxed mb-4">Vos données sont utilisées pour :</p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Traiter et livrer vos commandes et expéditions</li>
                <li>Communiquer sur l'état de vos colis et commandes</li>
                <li>Gérer les paiements et la facturation</li>
                <li>Améliorer nos services et votre expérience utilisateur</li>
                <li>Vous envoyer des informations commerciales (avec votre consentement)</li>
                <li>Respecter nos obligations légales et comptables</li>
                <li>Prévenir la fraude et assurer la sécurité de nos services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Base légale du traitement</h2>
              <p className="text-slate-600 leading-relaxed">
                Nous traitons vos données sur les bases légales suivantes :
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-4">
                <li><strong>Exécution du contrat :</strong> pour traiter vos commandes et expéditions</li>
                <li><strong>Consentement :</strong> pour les communications marketing et l'utilisation de cookies non essentiels</li>
                <li><strong>Intérêt légitime :</strong> pour améliorer nos services et assurer la sécurité</li>
                <li><strong>Obligation légale :</strong> pour la comptabilité et les obligations fiscales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Partage des données</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Vos données peuvent être partagées avec :
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li><strong>Partenaires de paiement :</strong> Stripe, PayPal (données sécurisées)</li>
                <li><strong>Services de livraison :</strong> transporteurs et partenaires logistiques</li>
                <li><strong>Services techniques :</strong> hébergement (Vercel), analytics, chatbot IA (Google Gemini)</li>
                <li><strong>Autorités compétentes :</strong> sur demande légale ou judiciaire</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mt-4">
                Nous ne vendons jamais vos données personnelles à des tiers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Durée de conservation</h2>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li><strong>Données de commande :</strong> 10 ans (obligations comptables)</li>
                <li><strong>Données de prospection :</strong> 3 ans après le dernier contact</li>
                <li><strong>Données de navigation :</strong> 13 mois maximum (cookies)</li>
                <li><strong>Données de compte inactif :</strong> suppression après 3 ans d'inactivité</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Vos droits</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
                <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
                <li><strong>Droit à l'effacement :</strong> supprimer vos données (droit à l'oubli)</li>
                <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
                <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
                <li><strong>Droit d'opposition :</strong> vous opposer au traitement pour des motifs légitimes</li>
                <li><strong>Droit de retrait du consentement :</strong> à tout moment</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mt-4">
                Pour exercer ces droits, contactez-nous : <a href="mailto:germaine.elitenetworker@gmail.com" className="text-emerald-600 font-bold hover:underline">germaine.elitenetworker@gmail.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Sécurité</h2>
              <p className="text-slate-600 leading-relaxed">
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :
                chiffrement SSL/TLS, serveurs sécurisés, accès restreints, audits réguliers. En cas de violation de données,
                nous vous informerons dans les délais légaux (72h).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Cookies</h2>
              <p className="text-slate-600 leading-relaxed">
                Nous utilisons des cookies essentiels (panier, session) et des cookies analytiques (avec votre consentement).
                Vous pouvez gérer vos préférences cookies dans les paramètres de votre navigateur.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Transferts internationaux</h2>
              <p className="text-slate-600 leading-relaxed">
                Vos données peuvent être transférées vers des pays hors UE (notamment via nos prestataires techniques).
                Ces transferts sont encadrés par des garanties appropriées (clauses contractuelles types, Privacy Shield).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Modifications</h2>
              <p className="text-slate-600 leading-relaxed">
                Cette politique peut être modifiée. Toute modification sera publiée sur cette page avec une nouvelle date de mise à jour.
                Nous vous encourageons à consulter régulièrement cette page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Contact & Réclamation</h2>
              <p className="text-slate-600 leading-relaxed">
                <strong>Responsable du traitement :</strong> BeniLink<br />
                <strong>Email :</strong> <a href="mailto:germaine.elitenetworker@gmail.com" className="text-emerald-600 font-bold hover:underline">germaine.elitenetworker@gmail.com</a><br />
                <strong>Téléphone :</strong> +33 7 68 58 58 90
              </p>
              <p className="text-slate-600 leading-relaxed mt-4">
                Vous avez le droit d'introduire une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) : 
                <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-bold hover:underline ml-1">www.cnil.fr</a>
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200">
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
