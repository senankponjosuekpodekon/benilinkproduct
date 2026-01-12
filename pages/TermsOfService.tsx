import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

const TermsOfService: React.FC = () => {
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
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
              <ShoppingCart size={32} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900">Conditions Générales de Vente</h1>
              <p className="text-slate-500 text-sm mt-1">Dernière mise à jour : 7 janvier 2026</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Objet et champ d'application</h2>
              <p className="text-slate-600 leading-relaxed">
                Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre BeniLink, 
                ci-après dénommée "le Vendeur", et toute personne physique ou morale, ci-après dénommée "le Client", 
                souhaitant effectuer un achat de produits ou un service d'expédition via le site web.
              </p>
              <p className="text-slate-600 leading-relaxed mt-4">
                BeniLink propose deux activités principales :
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-2">
                <li><strong>Vente de produits :</strong> matières premières naturelles, huiles, beurres, farines, épices en provenance du Bénin</li>
                <li><strong>Service d'expédition :</strong> transport de colis personnels et professionnels entre le Bénin et la France</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Acceptation des CGV</h2>
              <p className="text-slate-600 leading-relaxed">
                Toute commande implique l'acceptation sans réserve des présentes CGV. Le Client reconnaît avoir pris connaissance 
                de ces conditions et les avoir acceptées avant de passer commande. Ces conditions prévalent sur tout autre document.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Produits et services</h2>
              
              <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">3.1 Vente de produits</h3>
              <p className="text-slate-600 leading-relaxed">
                Les produits proposés sont ceux figurant sur le site au jour de la consultation par le Client. Les photographies 
                et descriptions sont aussi fidèles que possible mais ne peuvent garantir une similitude parfaite avec le produit livré, 
                notamment en raison de variations naturelles des matières premières.
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-4">
                <li>Les prix sont indiqués en Euros (€) TTC</li>
                <li>Produits 100% naturels en provenance du Bénin</li>
                <li>Qualité contrôlée et certifiée d'origine</li>
                <li>Pressés à froid pour les huiles, bruts et sans additifs</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">3.2 Service d'expédition</h3>
              <p className="text-slate-600 leading-relaxed">
                BeniLink propose un service d'expédition de colis entre le Bénin et la France :
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-4">
                <li><strong>Retrait en point relais :</strong> Tence ou Saint-Étienne (gratuit)</li>
                <li><strong>Livraison Colissimo :</strong> frais calculés selon le poids (voir grille tarifaire)</li>
                <li><strong>Livraison en Point Relais :</strong> frais calculés selon le poids (voir grille tarifaire)</li>
                <li><strong>Grille tarifaire (EUR) :</strong>
                  <ul className="list-circle pl-6 mt-2 space-y-1">
                    <li>Jusqu'à 0,5 kg : 5€</li>
                    <li>Jusqu'à 1 kg : 7€</li>
                    <li>Jusqu'à 2 kg : 9€</li>
                    <li>Jusqu'à 5 kg : 14€</li>
                    <li>Jusqu'à 10 kg : 20€</li>
                    <li>Plus de 10 kg : 30€</li>
                  </ul>
                </li>
                <li>Colis interdits : produits illégaux, dangereux, périssables non autorisés</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Commandes</h2>
              
              <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">4.1 Processus de commande</h3>
              <p className="text-slate-600 leading-relaxed">
                Le Client passe commande de trois manières :
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-4">
                <li><strong>Via le site web :</strong> ajout au panier et paiement en ligne (Stripe, PayPal)</li>
                <li><strong>Via WhatsApp :</strong> envoi de la liste des produits souhaités au +33 7 68 58 58 90</li>
                <li><strong>Via formulaire :</strong> pour les demandes d'expédition personnalisées</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">4.2 Validation de commande</h3>
              <p className="text-slate-600 leading-relaxed">
                Une fois la commande validée et le paiement confirmé, le Client reçoit :
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-4">
                <li>Un email de confirmation avec le récapitulatif</li>
                <li>Un numéro de commande unique</li>
                <li>Les informations de suivi (pour les expéditions)</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">4.3 Modification et annulation</h3>
              <p className="text-slate-600 leading-relaxed">
                Toute demande de modification ou d'annulation doit être effectuée dans les 24 heures suivant la validation 
                de la commande, avant expédition. Passé ce délai, aucune modification ne sera possible.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Prix et paiement</h2>
              
              <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">5.1 Prix</h3>
              <p className="text-slate-600 leading-relaxed">
                Les prix sont indiqués en Euros (€) TTC (Toutes Taxes Comprises) et comprennent :
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-4">
                <li>Le prix du produit ou du service</li>
                <li>La TVA à 20% (pour les clients en France)</li>
                <li>Les frais d'expédition sont calculés selon le poids et le mode de livraison choisi</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mt-4">
                Les prix affichés au moment de la commande sont fermes et définitifs. BeniLink se réserve le droit de modifier 
                ses tarifs à tout moment, mais les commandes validées restent soumises aux prix en vigueur lors de leur validation.
              </p>

              <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">5.2 Moyens de paiement</h3>
              <p className="text-slate-600 leading-relaxed">
                Les paiements sont acceptés via :
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-4">
                <li><strong>Stripe :</strong> cartes bancaires (Visa, Mastercard, American Express)</li>
                <li><strong>PayPal :</strong> compte PayPal ou cartes bancaires</li>
                <li><strong>Mobile Money :</strong> pour les clients au Bénin (MTN, Moov)</li>
                <li><strong>Virement bancaire :</strong> sur demande pour les montants importants</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">5.3 Sécurité des paiements</h3>
              <p className="text-slate-600 leading-relaxed">
                Tous les paiements en ligne sont sécurisés par nos partenaires certifiés PCI-DSS. BeniLink ne conserve aucune 
                information bancaire complète. Les données de paiement transitent de manière chiffrée (SSL/TLS).
              </p>

              <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">5.4 Facturation</h3>
              <p className="text-slate-600 leading-relaxed">
                Une facture est émise et envoyée par email pour chaque commande validée. Elle est également disponible dans 
                l'espace client (si applicable).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Livraison et expédition</h2>
              
              <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">6.1 Zones de livraison</h3>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li><strong>Retrait gratuit :</strong> Tence (Haute-Loire) ou Saint-Étienne (Loire)</li>
                <li><strong>France métropolitaine :</strong> livraison Colissimo ou Point Relais</li>
                <li><strong>Autres destinations :</strong> sur demande et devis</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">6.2 Délais de livraison</h3>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li><strong>Retrait en point relais :</strong> sous 24-48h après préparation</li>
                <li><strong>Colissimo :</strong> 2 à 3 jours ouvrés après expédition</li>
                <li><strong>Point Relais :</strong> 3 à 5 jours ouvrés après expédition</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mt-4">
                Ces délais sont indicatifs et peuvent varier en fonction des aléas de transport, conditions météorologiques, 
                contrôles douaniers, etc.
              </p>

              <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">6.3 Suivi de commande</h3>
              <p className="text-slate-600 leading-relaxed">
                Le Client reçoit un numéro de suivi dès l'expédition de sa commande. Il peut suivre l'avancement via :
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-4">
                <li>Mises à jour WhatsApp en temps réel</li>
                <li>Email de notification à chaque étape</li>
                <li>Plateforme du transporteur (lien fourni)</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">6.4 Réception de la commande</h3>
              <p className="text-slate-600 leading-relaxed">
                À la livraison, le Client doit vérifier l'état du colis en présence du livreur. En cas de dommage apparent, 
                le Client doit :
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-4">
                <li>Refuser le colis et noter les réserves sur le bon de livraison</li>
                <li>Prendre des photos du colis endommagé</li>
                <li>Contacter BeniLink dans les 48 heures</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Droit de rétractation</h2>
              <p className="text-slate-600 leading-relaxed">
                Conformément aux articles L.221-18 et suivants du Code de la consommation, le Client dispose d'un délai de 
                14 jours à compter de la réception des produits pour exercer son droit de rétractation sans avoir à justifier 
                de motifs ni à payer de pénalités.
              </p>
              
              <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">7.1 Exclusions</h3>
              <p className="text-slate-600 leading-relaxed">
                Le droit de rétractation ne s'applique pas aux :
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-4">
                <li>Produits périssables ou à date de péremption courte</li>
                <li>Produits descellés ou ouverts</li>
                <li>Produits confectionnés sur mesure ou personnalisés</li>
                <li>Services d'expédition déjà exécutés</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">7.2 Modalités de retour</h3>
              <p className="text-slate-600 leading-relaxed">
                Pour exercer son droit de rétractation, le Client doit :
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-4">
                <li>Notifier BeniLink par email ou WhatsApp</li>
                <li>Retourner le produit dans son emballage d'origine, intact et complet</li>
                <li>Les frais de retour sont à la charge du Client, sauf produit défectueux</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">7.3 Remboursement</h3>
              <p className="text-slate-600 leading-relaxed">
                Le remboursement sera effectué dans un délai de 14 jours suivant la réception du produit retourné, 
                par le même moyen de paiement utilisé lors de l'achat.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Garanties</h2>
              
              <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">8.1 Garantie de conformité</h3>
              <p className="text-slate-600 leading-relaxed">
                Tous nos produits bénéficient de la garantie légale de conformité (articles L.217-4 à L.217-14 du Code de la consommation) 
                et de la garantie des vices cachés (articles 1641 à 1648 du Code civil).
              </p>

              <h3 className="text-xl font-bold text-slate-800 mb-3 mt-6">8.2 Qualité des produits</h3>
              <p className="text-slate-600 leading-relaxed">
                BeniLink garantit :
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-4">
                <li>L'origine 100% béninoise de ses produits</li>
                <li>Le caractère naturel et l'absence d'additifs chimiques</li>
                <li>Le respect des normes de qualité et d'hygiène</li>
                <li>La conformité aux descriptions du site</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Réclamations et SAV</h2>
              <p className="text-slate-600 leading-relaxed">
                Pour toute réclamation ou demande de service après-vente :
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-4">
                <li><strong>Email :</strong> <a href="mailto:germaine.elitenetworker@gmail.com" className="text-emerald-600 font-bold hover:underline">germaine.elitenetworker@gmail.com</a></li>
                <li><strong>WhatsApp :</strong> +33 7 68 58 58 90</li>
                <li><strong>Délai de réponse :</strong> 48 heures maximum</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mt-4">
                Joindre : numéro de commande, photos si applicable, description précise du problème.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Responsabilité</h2>
              <p className="text-slate-600 leading-relaxed">
                BeniLink ne saurait être tenu responsable :
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-4">
                <li>Des retards de livraison dus aux transporteurs ou événements de force majeure</li>
                <li>De l'utilisation inadéquate des produits par le Client</li>
                <li>Des allergies ou réactions individuelles aux produits naturels</li>
                <li>Du contenu des colis lors du service d'expédition (responsabilité de l'expéditeur)</li>
                <li>Des contrôles douaniers ou blocages administratifs</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Protection des données</h2>
              <p className="text-slate-600 leading-relaxed">
                Les données personnelles collectées sont nécessaires au traitement de la commande et sont traitées conformément 
                à notre <a href="/confidentialite" className="text-emerald-600 font-bold hover:underline">Politique de Confidentialité</a> 
                et au RGPD.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Force majeure</h2>
              <p className="text-slate-600 leading-relaxed">
                BeniLink ne pourra être tenu responsable de l'inexécution de ses obligations en cas de force majeure, notamment : 
                catastrophes naturelles, guerres, grèves, pandémies, défaillances des réseaux de télécommunication, etc.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Médiation</h2>
              <p className="text-slate-600 leading-relaxed">
                Conformément à l'article L.612-1 du Code de la consommation, le Client a le droit de recourir gratuitement 
                à un service de médiation en cas de litige : 
                <a href="https://www.economie.gouv.fr/mediation-conso" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-bold hover:underline ml-1">economie.gouv.fr/mediation-conso</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">14. Droit applicable et juridiction</h2>
              <p className="text-slate-600 leading-relaxed">
                Les présentes CGV sont régies par le droit français. En cas de litige, et après échec d'une tentative de règlement 
                amiable, les tribunaux français seront seuls compétents.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">15. Modification des CGV</h2>
              <p className="text-slate-600 leading-relaxed">
                BeniLink se réserve le droit de modifier les présentes CGV à tout moment. Les CGV applicables sont celles en vigueur 
                au moment de la passation de la commande.
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

export default TermsOfService;
