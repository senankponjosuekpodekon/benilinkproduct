
import { Product, Testimonial } from './types';

export const RAW_DATA = `MATIERES PREMIERES,PRIX LITRE/KILOS
Huile de neem pressée à froid,6750 FCFA
Huile d’avocat extra vierge,12000 FCFA
Beurre de Karité brut,3600 FCFA
Huile de ricin pressée à froid,15750 FCFA
Huile de palmiste brute,1800 FCFA
Huile de coco pressée à froid,5700 FCFA
Huile de tournesol extra vierge,6000 FCFA
Huile de baobab pressée à froid,9750 FCFA
Huile de soja extra vierge,3300 FCFA
Poudre de baobab tamisée en vrac,5250 FCFA
Huile de nigelle pressée à froid,18000 FCFA
Huile d’hibiscus pure,18750 FCFA
Huile de carotte pure,13200 FCFA
Huile de fenugrec pressée à froid,17700 FCFA
Huile d’Akpi pressée à froid,20250 FCFA
Poudre de moringa naturelle,10500 FCFA
Poudre de neem naturelle,6750 FCFA
Huile de moringa pressée à froid,49500 FCFA
Huile de sésame pressée à froid,11250 FCFA`;

// Robust images from Unsplash IDs
const IMAGE_POOLS = {
  Huile: [
    'photo-1611080626919-7cf5a9dbab5b',
    'photo-1608571423902-eed4a5ad8108',
    'photo-1620916566398-39f1143ab7be',
    'photo-1544161515-4af6b1d4738c',
    'photo-1612531388305-643037233868',
    'photo-1544161513-0179fe746fd5'
  ],
  Beurre: [
    'photo-1590159357421-44754a10874e',
    'photo-1596755094514-f87e34085b2c',
    'photo-1556228720-195a672e8a03'
  ],
  Poudre: [
    'photo-1515255384510-333066917637',
    'photo-1542618953-274e6459146c',
    'photo-1542618953-b295c2f8149f'
  ]
};

export const parseCSVData = (csv: string): Product[] => {
  const lines = csv.split('\n').slice(1);
  return lines.map((line, index) => {
    const [name, priceStr] = line.split(',');
    const price = parseInt(priceStr.replace(/[^0-9]/g, ''));
    
    let category: 'Huile' | 'Beurre' | 'Poudre' = 'Huile';
    let unit: 'litre' | 'kilo' = 'litre';

    if (name.toLowerCase().includes('poudre')) {
      category = 'Poudre';
      unit = 'kilo';
    } else if (name.toLowerCase().includes('beurre')) {
      category = 'Beurre';
      unit = 'kilo';
    }

    const pool = IMAGE_POOLS[category];
    const imageId = pool[index % pool.length];

    return {
      id: `prod-${index}`,
      name,
      price,
      currency: 'FCFA',
      category,
      unit,
      image: `https://images.unsplash.com/${imageId}?auto=format&fit=crop&q=80&w=800&h=600`,
    };
  });
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Amina Diop',
    role: 'Esthéticienne',
    content: 'Les huiles sont d\'une pureté exceptionnelle. Ma clientèle voit la différence sur leur grain de peau dès la première séance.',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 't2',
    name: 'Jean-Pierre Koffi',
    role: 'Producteur Local',
    content: 'Un partenaire de confiance qui respecte le travail des artisans. Les poudres sont tamisées avec un soin rare.',
    avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: 't3',
    name: 'Fatou Traoré',
    role: 'Particulier',
    content: 'L\'huile de coco et le beurre de karité sont devenus mes indispensables. Livraison rapide et produits toujours impeccables.',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=150&h=150'
  }
];

export const PRODUCTS = parseCSVData(RAW_DATA);
export const WHATSAPP_NUMBER = "33768585890";
