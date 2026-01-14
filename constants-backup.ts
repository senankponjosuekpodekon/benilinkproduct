
import { Product, Testimonial } from './types';

// Pricing configuration
export const FCFA_PER_EUR = 655;
export const MARKUP_FACTOR = 3.0; // Markup to achieve 2€ from 1.5€ current price
export const VAT_RATE = 0.20; // 20%

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
Huile de sésame pressée à froid,11250 FCFA
Aklui de Sorgho - 600g,2751 FCFA
Farine de maÏs - 1kg,1493 FCFA
Farine de telibor (Cosette d'igname) - 1kg,3537 FCFA
Aklui de Maïs - 600g,2456 FCFA
Aklui de Mil - 600g,3000 FCFA
Farine de Agbeli - 600g,2941 FCFA
Farine de riz (ABLO) - 500g,2941 FCFA
Farine de Féchouada - 300g,4493 FCFA
Farine de Côme - 800g,2941 FCFA
Farine de Mawê Maïs - 600g,2941 FCFA
Farine de AKASSA - 600g,2941 FCFA
Farine de ATA GBAZA - 300g,2941 FCFA
Farine de Adowê - 300g,2941 FCFA
Farine de Mawê Sorgho - 600g,4493 FCFA
Tagliatelle au manioc,1801 FCFA
Piment rouge de table - 500g,2063 FCFA
Kluiklui – Galette d'arachide croustillante - 300g,1035 FCFA
Huile rouge - 500ml,1231 FCFA
Pomme de terre - 1kg,1769 FCFA
Igname frais - 1kg,3373 FCFA
Carte-cadeau,9825 FCFA
Noix d'acajou - 1kg,7074 FCFA
Ognon - 1kg,2037 FCFA
Ail - 1 sachet,740 FCFA
Graine de chia,1801 FCFA
Piment vert de table - 500g,1349 FCFA
Infusion verveine menthe - 25 sachets,2692 FCFA
Lanhouiwin - 100g,2063 FCFA
Purée de tomate Yon-na - 1Kg,2456 FCFA
Infusion digestion légère - 20 sachets,2692 FCFA
Sel de mer fin iodé - La baleine - 125g,1801 FCFA
Persil séché,1474 FCFA
Persillade Assaisonnement,1474 FCFA
Piment noir de Kom - 600g,9039 FCFA
Piment noir de Kom - 300g,4127 FCFA
Poudre de cannelle,1801 FCFA
Poivre blanc bio moulu,1801 FCFA
Poivre noir bio moulu,1801 FCFA
Graine d'anis vert,1801 FCFA
Gingembre en poudre bio,3000 FCFA
Monodara myristica - Épices,3000 FCFA
Purée de tomate Yon-na - 500g,2253 FCFA
Thym séché,1179 FCFA
Poudre de piment vert CUISTOS - 100g,3747 FCFA
Poudre de piment CUISTOS - 100g,3000 FCFA
Tomate en poudre - 125g,4493 FCFA
Poudre de piment vert - 125g,5247 FCFA
Poudre de piment rouge - 125g,4493 FCFA`;

// Serve images from /public/products (absolute path for dev/preview)
const PRODUCTS_BASE = '/products';

// Robust images from Unsplash IDs (fallbacks)
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
  ],
  Farine: [
    'photo-1509440159596-0249088772ff',
    'photo-1628840042765-356cda07504e',
    'photo-1574323347407-f5e1ad6d020b',
    'photo-1601526714465-bdd38c2b83ff'
  ],
  Conserve: [
    'photo-1599598938194-c9d8c20b1a89',
    'photo-1619566636858-adf3ef46400b',
    'photo-1573855619003-97b4799dcd8b'
  ],
  Céréale: [
    'photo-1586201375761-83865001e31c',
    'photo-1518977676601-b53f82aba655',
    'photo-1604908176997-125f25cc6f3d',
    'photo-1612528443702-f6741f70a049'
  ],
  Épice: [
    'photo-1596040008851-e229b5a73c57',
    'photo-1599909533301-8a6b7c6c3e88',
    'photo-1506368249639-73a05d6f6488',
    'photo-1587411768390-609139b54d5e',
    'photo-1596040008853-f1b5b4b0b1b7'
  ]
};

// Local product visuals (prefer local over Unsplash for key items)
const LOCAL_IMAGES: Record<string, string> = {
  'huile-de-neem-pressee-a-froid': 'huile-de-neem.jpg',
  'huile-d-avocat-extra-vierge': 'huile-d-avocat.jpg',
  'beurre-de-karite-brut': 'beurre-de-karite.jpg',
  'huile-de-ricin-pressee-a-froid': 'huile-de-ricin.jpg',
  'huile-de-palmiste-brute': 'huile-de-palmiste.jpg',
  'huile-de-coco-pressee-a-froid': 'huile-de-coco.jpg',
  'huile-de-tournesol-extra-vierge': 'huile-de-tournesol.jpg',
  'huile-de-baobab-pressee-a-froid': 'huile-de-baobab.jpg',
  'huile-de-soja-extra-vierge': 'huile-de-soja.jpg',
  'huile-de-nigelle-pressee-a-froid': 'huile-de-nigelle.jpg',
  'huile-d-hibiscus-pure': 'huile-d-hibiscuit.jpg',
  'huile-de-carotte-pure': 'huile-de-carotte.jpg',
  'huile-de-fenugrec-pressee-a-froid': 'huile-de-fenugrec.jpg',
  'huile-d-akpi-pressee-a-froid': 'huile-d-akpi.jpg',
  'poudre-de-moringa-naturelle': 'poudre-de-moringa.jpg',
  'poudre-de-neem-naturelle': 'poudre-de-neem.jpg',
  'huile-de-moringa-pressee-a-froid': 'huile-de-moringa.jpg',
  'huile-de-sesame-pressee-a-froid': 'huile-de-sesame.jpg',
  'poudre-de-baobab-tamisee-en-vrac': 'poudre-de-baobab.jpg',
  'huile-rouge-500ml': 'huile-rouge.jpg',
  'igname-frais-1kg': 'igname-frais.jpg',
  'kluiklui-galette-d-arachide-croustillante-300g': 'klui-klui.jpg',
  'noix-d-acajou-1kg': 'noix-d-acajou.jpg',
  'pomme-de-terre-1kg': 'pomme-de-terre.jpg',
  'aklui-de-sorgho-600g': 'aklui-de-sorgho.jpg',
  'farine-de-mais-1kg': 'farine-de-mais.jpg',
  'farine-de-telibor-cosette-d-igname-1kg': 'farine-de-telibo.jpg',
  'aklui-de-mais-600g': 'aklui-de-mais.jpg',
  'aklui-de-mil-600g': 'aklui-de-mil.jpg',
  'farine-de-agbeli-600g': 'farine-de-agbeli.jpg',
  'farine-de-riz-ablo-500g': 'farine-de-riz.jpg',
  'farine-de-mawe-mais-600g': 'farine-de-mawe.jpg',
  'farine-de-akassa-600g': 'farine-de-akassa.jpg',
  'farine-de-ata-gbaza-300g': 'farine-de-ata-gbaza.jpg',
  'farine-de-adowe-300g': 'farine-de-adowe.jpg',
  'farine-de-mawe-sorgho-600g': 'farine-de-mawe-sorgho.jpg',
  'tagliatelle-au-manioc': 'tigatelle-au-manioc.jpg',
  'piment-rouge-de-table-500g': 'piment-rouge-de-table.jpg',
  'ognon-1kg': 'oignon.jpg',
  'ail-1-sachet': 'ail.jpg',
  'graine-de-chia': 'graine-de-chia.jpg',
  'piment-vert-de-table-500g': 'piment-vert-de-table.jpg',
  'lanhouiwin-100g': 'lanhouihouin.jpg',
  'puree-de-tomate-yon-na-1kg': 'puree-de-tomate.jpg',
  'sel-de-mer-fin-iode-la-baleine-125g': 'sel-de-mer-fin-iodee.jpg',
  'persil-seche': 'persil-seche.jpg',
  'piment-noir-de-kom-600g': 'piment-noir-come.jpg',
  'poudre-de-cannelle': 'poudre-de-carnelle.jpg',
  'poivre-blanc-bio-moulu': 'poivre-blanc-moulu.jpg',
  'poivre-noir-bio-moulu': 'poivre-noir-moulu.jpg',
  'graine-d-anis-vert': 'graine-d-anis-vert.jpg',
  'gingembre-en-poudre-bio': 'gimgembre-en-poudre.jpg',
  'monodara-myristica-epices': 'monodora-myristica-epices.jpg',
  'puree-de-tomate-yon-na-500g': 'puree-de-tomate (2).jpg',
  'thym-seche': 'teem-seche.jpg',
  'poudre-de-piment-rouge-125g': 'poudre-de-piment-rouge.jpg',
  'poudre-de-piment-vert-125g': 'poudre-de-piment-vert.jpg',
  'tomate-en-poudre-125g': 'poudre-de-tomate.jpg'
};

const slugify = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const parseCSVData = (csv: string): Product[] => {
  const lines = csv.split('\n').slice(1);
  return lines.map((line, index) => {
    const [name, priceStr] = line.split(',');
    const basePriceFCFA = parseInt(priceStr.replace(/[^0-9]/g, ''));
    
    let category: 'Huile' | 'Beurre' | 'Poudre' | 'Farine' | 'Conserve' | 'Céréale' | 'Épice' = 'Huile';
    let unit: 'litre' | 'kilo' | 'g' | 'ml' | 'sachet' | 'unité' = 'kilo';

    const nameLower = name.toLowerCase();
    
    // Catégorisation intelligente
    if (nameLower.includes('farine') || nameLower.includes('aklui') || nameLower.includes('tagliatelle')) {
      category = 'Farine';
      unit = 'kilo';
    } else if (nameLower.includes('kluiklui') || nameLower.includes('conserve') || (nameLower.includes('huile rouge') && nameLower.includes('500ml'))) {
      category = 'Conserve';
      unit = 'unité';
    } else if (nameLower.includes('pomme de terre') || nameLower.includes('igname') || nameLower.includes('carte-cadeau') || nameLower.includes('noix')) {
      category = 'Céréale';
      unit = nameLower.includes('kg') ? 'kilo' : 'unité';
    } else if (nameLower.includes('piment') || nameLower.includes('ognon') || nameLower.includes('ail') || nameLower.includes('graine') || nameLower.includes('infusion') || nameLower.includes('lanhouiwin') || nameLower.includes('purée') || nameLower.includes('sel') || nameLower.includes('persil') || nameLower.includes('poivre') || nameLower.includes('cannelle') || nameLower.includes('gingembre') || nameLower.includes('monodara') || nameLower.includes('thym') || nameLower.includes('tomate en poudre')) {
      category = 'Épice';
      if (nameLower.includes('sachet')) unit = 'sachet';
      else if (nameLower.includes('kg')) unit = 'kilo';
      else if (nameLower.includes('ml')) unit = 'ml';
      else if (nameLower.includes('g')) unit = 'g';
      else unit = 'unité';
    } else if (nameLower.includes('poudre')) {
      category = 'Poudre';
      unit = 'kilo';
    } else if (nameLower.includes('beurre')) {
      category = 'Beurre';
      unit = 'kilo';
    } else {
      // Huile par défaut
      category = 'Huile';
      unit = 'litre';
    }

    const pool = IMAGE_POOLS[category];
    const imageId = pool[index % pool.length];
    const slug = slugify(name);
    const localImage = LOCAL_IMAGES[slug];

    // Compute EUR price with double 50% markup and VAT included
    const priceFCFAWithMarkup = Math.round(basePriceFCFA * MARKUP_FACTOR);
    const priceEURHT = priceFCFAWithMarkup / FCFA_PER_EUR;
    const priceEURTTC = Math.round(priceEURHT * (1 + VAT_RATE) * 100) / 100; // 2 decimals

    return {
      id: `prod-${index}`,
      name,
      price: priceEURTTC,
      currency: 'EUR',
      category,
      unit,
      image: localImage ? `${PRODUCTS_BASE}/${localImage}` : `https://images.unsplash.com/${imageId}?auto=format&fit=crop&q=80&w=800&h=600`,
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
export const PAYPAL_RATE_FCFA_PER_EUR = FCFA_PER_EUR;
