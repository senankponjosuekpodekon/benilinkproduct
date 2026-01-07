import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, products } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message requis' });
    }

    // Clé API côté serveur (sécurisée)
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('❌ GEMINI_API_KEY manquante');
      return res.status(500).json({ 
        error: 'Configuration serveur manquante',
        text: 'Désolé, le service de chat est temporairement indisponible. Veuillez contacter le support.'
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Catalogue : ${JSON.stringify(products)}.
                Réponds à : ${message}. 
                Tu es un expert en cosmétique naturelle et en huiles précieuses africaines.
                Réponds en français de façon élégante, professionnelle et concise (max 3 paragraphes).
                Recommande des produits du catalogue si pertinent.`,
    });

    const text = response.text || "Désolé, je rencontre un petit problème technique. Pouvez-vous reformuler votre question ?";
    
    return res.status(200).json({ 
      success: true,
      text: text 
    });

  } catch (error) {
    console.error('❌ Erreur API Chat:', error);
    return res.status(500).json({ 
      error: 'Erreur serveur',
      text: 'Erreur de connexion. Veuillez réessayer dans quelques instants.'
    });
  }
}
