import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const LegalNotice: React.FC = () => {
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
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center">
              <FileText size={32} className="text-amber-600" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900">Mentions Légales</h1>
              <p className="text-slate-500 text-sm mt-1">Informations légales</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Éditeur du site</h2>
              <p className="text-slate-600 leading-relaxed">
                <strong>Raison sociale :</strong> BeniLink<br />
                <strong>Forme juridique :</strong> [À compléter - Ex: Auto-entrepreneur / SARL / SAS]<br />
                <strong>Siège social :</strong> [Adresse complète à compléter]<br />
                <strong>Capital social :</strong> [À compléter si applicable]<br />
                <strong>SIRET :</strong> [Numéro SIRET à compléter]<br />
                <strong>TVA intracommunautaire :</strong> [Numéro TVA à compléter]<br />
                <strong>Email :</strong> <a href="mailto:germaine.elitenetworker@gmail.com" className="text-emerald-600 font-bold hover:underline">germaine.elitenetworker@gmail.com</a><br />
                <strong>Téléphone :</strong> +33 7 68 58 58 90
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Directeur de publication</h2>
              <p className="text-slate-600 leading-relaxed">
                <strong>Nom :</strong> [Nom du dirigeant/responsable légal]<br />
                <strong>Qualité :</strong> [Gérant / Président / Directeur]<br />
                <strong>Contact :</strong> <a href="mailto:germaine.elitenetworker@gmail.com" className="text-emerald-600 font-bold hover:underline">germaine.elitenetworker@gmail.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Hébergement</h2>
              <p className="text-slate-600 leading-relaxed">
                <strong>Hébergeur :</strong> Vercel Inc.<br />
                <strong>Adresse :</strong> 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis<br />
                <strong>Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-bold hover:underline">vercel.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Conception et développement</h2>
              <p className="text-slate-600 leading-relaxed">
                <strong>Développement web :</strong> BeniLink<br />
                <strong>Technologies utilisées :</strong> React, TypeScript, Vite, TailwindCSS<br />
                <strong>API & Intégrations :</strong> Stripe, PayPal, Google Gemini AI
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Propriété intellectuelle</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                L'ensemble du contenu de ce site (textes, images, vidéos, logos, marques, structure, design, etc.) est la propriété 
                exclusive de BeniLink ou de ses partenaires, et est protégé par les lois françaises et internationales relatives à la 
                propriété intellectuelle.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                Toute reproduction, représentation, modification, publication, transmission, dénaturation, totale ou partielle du site 
                ou de son contenu, par quelque procédé que ce soit, et sur quelque support que ce soit est interdite sans l'autorisation 
                écrite préalable de BeniLink.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Les marques et logos affichés sur le site sont des marques déposées de BeniLink ou de tiers. Toute utilisation non 
                autorisée de ces marques est strictement interdite.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Protection des données personnelles</h2>
              <p className="text-slate-600 leading-relaxed">
                Conformément à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée et au Règlement Général sur la Protection 
                des Données (RGPD) du 27 avril 2016, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition 
                aux données personnelles vous concernant.
              </p>
              <p className="text-slate-600 leading-relaxed mt-4">
                Pour plus d'informations, consultez notre <a href="/confidentialite" className="text-emerald-600 font-bold hover:underline">Politique de Confidentialité</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Cookies</h2>
              <p className="text-slate-600 leading-relaxed">
                Le site utilise des cookies pour améliorer l'expérience utilisateur et réaliser des statistiques de visites. 
                Vous pouvez paramétrer votre navigateur pour refuser les cookies, mais certaines fonctionnalités du site pourraient 
                alors être indisponibles.
              </p>
              <p className="text-slate-600 leading-relaxed mt-4">
                Types de cookies utilisés :
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-2">
                <li><strong>Cookies essentiels :</strong> nécessaires au fonctionnement du site (panier, session)</li>
                <li><strong>Cookies analytiques :</strong> pour comprendre l'utilisation du site (avec consentement)</li>
                <li><strong>Cookies de paiement :</strong> gérés par nos partenaires sécurisés (Stripe, PayPal)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Limitation de responsabilité</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                BeniLink s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur le site, mais ne peut garantir 
                l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                BeniLink ne saurait être tenu responsable :
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Des dommages directs ou indirects résultant de l'utilisation du site</li>
                <li>Des interruptions temporaires du site pour maintenance ou mise à jour</li>
                <li>Des dysfonctionnements techniques indépendants de notre volonté</li>
                <li>Du contenu des sites tiers vers lesquels pointent nos liens</li>
                <li>Des retards de livraison liés aux transporteurs</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Liens hypertextes</h2>
              <p className="text-slate-600 leading-relaxed">
                Le site peut contenir des liens vers d'autres sites internet. BeniLink n'exerce aucun contrôle sur ces sites et décline 
                toute responsabilité quant à leur contenu, leur disponibilité ou leur politique de confidentialité.
              </p>
              <p className="text-slate-600 leading-relaxed mt-4">
                Tout lien hypertexte pointant vers notre site doit faire l'objet d'une autorisation préalable écrite de BeniLink.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Droit applicable</h2>
              <p className="text-slate-600 leading-relaxed">
                Les présentes mentions légales sont régies par le droit français. En cas de litige, et après tentative de recherche d'une 
                solution amiable, les tribunaux français seront seuls compétents.
              </p>
              <p className="text-slate-600 leading-relaxed mt-4">
                Conformément à l'article L.612-1 du Code de la consommation, vous pouvez recourir gratuitement à un service de médiation 
                en cas de litige : Médiateur de la consommation - <a href="https://www.economie.gouv.fr/mediation-conso" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-bold hover:underline">economie.gouv.fr/mediation-conso</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Contact</h2>
              <p className="text-slate-600 leading-relaxed">
                Pour toute question concernant les mentions légales, vous pouvez nous contacter :
              </p>
              <ul className="list-none text-slate-600 space-y-2 mt-4">
                <li><strong>Email :</strong> <a href="mailto:germaine.elitenetworker@gmail.com" className="text-emerald-600 font-bold hover:underline">germaine.elitenetworker@gmail.com</a></li>
                <li><strong>Téléphone :</strong> <a href="tel:+33768585890" className="text-emerald-600 font-bold hover:underline">+33 7 68 58 58 90</a></li>
                <li><strong>WhatsApp :</strong> <a href="https://wa.me/33768585890" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-bold hover:underline">+33 7 68 58 58 90</a></li>
              </ul>
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

export default LegalNotice;
