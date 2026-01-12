import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, Plane, Ship, Package, MapPin, Clock } from 'lucide-react';

const ShippingPolicy: React.FC = () => {
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
              <Truck size={32} className="text-emerald-600" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900">Politique d'Expédition</h1>
              <p className="text-slate-500 text-sm mt-1">Dernière mise à jour : 12 janvier 2026</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Vue d'ensemble</h2>
              <p className="text-slate-600 leading-relaxed">
                BeniLink propose plusieurs options d'expédition pour répondre à vos besoins, que vous commandiez nos 
                produits naturels béninois ou que vous souhaitiez envoyer des colis personnels entre le Bénin et la France.
              </p>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mt-4">
                <p className="text-sm font-bold text-amber-900">
                  ⚠️ <strong>Commande minimum :</strong> 5 kg pour toutes les expéditions depuis le Bénin vers la France.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Options de livraison pour produits</h2>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="text-emerald-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold text-emerald-900 mb-2">Retrait sur place</h3>
                    <p className="text-slate-700 mb-3">
                      Retirez votre commande dans nos points relais (frais de transport Bénin → France inclus) :
                    </p>
                    <ul className="space-y-2 text-slate-700">
                      <li><strong>Tence (Haute-Loire) :</strong> Sur rendez-vous</li>
                      <li><strong>Saint-Étienne (Loire) :</strong> Sur rendez-vous</li>
                    </ul>
                    <p className="text-sm text-amber-700 font-semibold mt-3">
                      ⚠️ Les frais maritimes Bénin → France (tarif au kg dégressif) sont toujours appliqués. Le retrait évite uniquement les frais Colissimo/Point Relais.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <Package className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold text-blue-900 mb-2">Livraison Colissimo</h3>
                    <p className="text-slate-700 mb-3">
                      Livraison à domicile en France métropolitaine.
                    </p>
                    <ul className="space-y-2 text-slate-700">
                      <li><strong>Délai :</strong> 2 à 3 jours ouvrés après expédition</li>
                      <li><strong>Suivi :</strong> Numéro de tracking fourni</li>
                      <li><strong>Tarifs :</strong> Frais maritimes Bénin → France + frais Colissimo locaux (en cours de définition)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <MapPin className="text-amber-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold text-amber-900 mb-2">Livraison en Point Relais</h3>
                    <p className="text-slate-700 mb-3">
                      Retrait dans un point relais de votre choix partout en France.
                    </p>
                    <ul className="space-y-2 text-slate-700">
                      <li><strong>Délai :</strong> 3 à 5 jours ouvrés après expédition</li>
                      <li><strong>Disponibilité :</strong> 7j/7 dans le point relais choisi</li>
                      <li><strong>Tarifs :</strong> Frais maritimes Bénin → France + frais Point Relais locaux (en cours de définition)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Grille tarifaire maritime (Bénin → France)</h2>
              <p className="text-slate-600 mb-4">
                Frais de transport maritime au kilogramme (dégressifs selon volume total) :
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-slate-700 font-bold">Poids total</th>
                      <th className="px-4 py-3 text-left text-slate-700 font-bold">Tarif au kg</th>
                      <th className="px-4 py-3 text-left text-slate-700 font-bold">Exemple (10kg)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-4 py-3 text-slate-600">5 à 199 kg</td>
                      <td className="px-4 py-3 text-emerald-700 font-bold">3,00 €/kg</td>
                      <td className="px-4 py-3 text-slate-600">30,00 €</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-slate-600">200 à 499 kg</td>
                      <td className="px-4 py-3 text-emerald-700 font-bold">2,75 €/kg</td>
                      <td className="px-4 py-3 text-slate-600">27,50 €</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-slate-600">500 à 999 kg</td>
                      <td className="px-4 py-3 text-emerald-700 font-bold">2,50 €/kg</td>
                      <td className="px-4 py-3 text-slate-600">25,00 €</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-slate-600">1 à 2 tonnes</td>
                      <td className="px-4 py-3 text-emerald-700 font-bold">2,25 €/kg</td>
                      <td className="px-4 py-3 text-slate-600">22,50 €</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-slate-600">3 tonnes et plus</td>
                      <td className="px-4 py-3 text-emerald-700 font-bold">1,75 €/kg</td>
                      <td className="px-4 py-3 text-slate-600">17,50 €</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-slate-500 mt-3">
                💡 <strong>Formule :</strong> Frais = Poids total × Tarif au kg. Les frais Colissimo/Point Relais (si choisis) s'ajoutent à ces frais maritimes.
              </p>
              <p className="text-sm text-amber-700 font-semibold mt-2">
                ⚠️ <strong>Minimum requis :</strong> 5 kg pour toute commande.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Expédition de colis personnels (Bénin ↔ France)</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-sky-50 border border-sky-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Ship className="text-sky-600" size={32} />
                    <h3 className="text-xl font-bold text-sky-900">Transport Maritime</h3>
                  </div>
                  <ul className="space-y-2 text-slate-700">
                    <li><strong>Délai :</strong> 30 à 45 jours</li>
                    <li><strong>Tarif :</strong> À partir de 3,00 €/kg</li>
                    <li><strong>Poids minimum :</strong> 5 kg</li>
                    <li><strong>Idéal pour :</strong> Volumes moyens, marchandises non urgentes</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Plane className="text-purple-600" size={32} />
                    <h3 className="text-xl font-bold text-purple-900">Transport Aérien</h3>
                  </div>
                  <ul className="space-y-2 text-slate-700">
                    <li><strong>Délai :</strong> 5 à 7 jours</li>
                    <li><strong>Tarif :</strong> À partir de 7,75 €/kg</li>
                    <li><strong>Poids minimum :</strong> 10 kg</li>
                    <li><strong>Idéal pour :</strong> Envois urgents, produits de valeur</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
                <div className="flex items-start gap-3">
                  <Clock className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-sm font-bold text-yellow-900 mb-1">Calendrier d'expédition</p>
                    <p className="text-sm text-yellow-800">
                      Consultez notre section "Prochains départs" sur la page d'accueil pour connaître les dates 
                      des prochains conteneurs maritimes et vols cargo disponibles.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Marchandises interdites</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Pour des raisons de sécurité et de conformité douanière, les articles suivants sont strictement interdits :
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Produits illégaux ou réglementés (drogues, armes, contrefaçons)</li>
                <li>Matières dangereuses (explosifs, produits chimiques, batteries au lithium non emballées)</li>
                <li>Denrées périssables non autorisées (viandes, produits laitiers sans certificat)</li>
                <li>Animaux vivants</li>
                <li>Espèces protégées (ivoire, coraux, certaines plantes)</li>
                <li>Devises en grande quantité (déclaration obligatoire au-delà de 10 000 €)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Suivi de colis</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Tous nos envois sont suivis :
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li><strong>Numéro de tracking :</strong> Fourni par email et WhatsApp dès l'expédition</li>
                <li><strong>Notifications en temps réel :</strong> Mises à jour WhatsApp à chaque étape</li>
                <li><strong>Support client :</strong> +33 7 68 58 58 90 (disponible 7j/7)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Retards et problèmes</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                En cas de retard ou de problème :
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li><strong>Retards douaniers :</strong> Peuvent survenir lors de contrôles aléatoires (délais variables)</li>
                <li><strong>Conditions météorologiques :</strong> Peuvent affecter les transports maritimes et aériens</li>
                <li><strong>Grèves :</strong> Des perturbations peuvent survenir chez les transporteurs</li>
                <li><strong>Communication :</strong> Nous vous informons immédiatement en cas de retard significatif</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Assurance</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Pour les colis de valeur, nous recommandons fortement de souscrire à notre assurance optionnelle :
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li><strong>Tarif :</strong> 2% de la valeur déclarée</li>
                <li><strong>Couverture :</strong> Perte, vol, dommages pendant le transport</li>
                <li><strong>Franchise :</strong> 50 € par sinistre</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Contact</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Pour toute question sur nos services d'expédition :
              </p>
              <ul className="space-y-2 text-slate-600">
                <li><strong>WhatsApp :</strong> <a href="https://wa.me/33768585890" className="text-emerald-600 font-bold hover:underline">+33 7 68 58 58 90</a></li>
                <li><strong>Email :</strong> <a href="mailto:germaine.elitenetworker@gmail.com" className="text-emerald-600 font-bold hover:underline">germaine.elitenetworker@gmail.com</a></li>
                <li><strong>Délai de réponse :</strong> Sous 24 heures maximum</li>
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

export default ShippingPolicy;
