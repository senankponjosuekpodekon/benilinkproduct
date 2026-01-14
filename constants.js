// Configuration pour les API serverless (CommonJS/ESM compatible)
export const FCFA_PER_EUR = 655;
export const MARKUP_FACTOR = 1.0;
export const VAT_RATE = 0.20;

// Serve images from /public/products (absolute path for dev/preview)
const PRODUCTS_BASE = '/products';

// Local product visuals
const LOCAL_IMAGES = {
  'huile-de-neem-1l': 'huile-de-neem.jpg',
  'huile-d-avocat-1l': 'huile-d-avocat.jpg',
  'beurre-de-karite-1kg': 'beurre-de-karite.jpg',
  'huile-de-ricin-1l': 'huile-de-ricin.jpg',
  'huile-de-palmiste-1l': 'huile-de-palmiste.jpg',
  'huile-de-coco-1l': 'huile-de-coco.jpg',
  'huile-de-tournesol-1l': 'huile-de-tournesol.jpg',
  'huile-de-baobab-1l': 'huile-de-baobab.jpg',
  'huile-de-soja-1l': 'huile-de-soja.jpg',
  'huile-de-nigelle-1l': 'huile-de-nigelle.jpg',
  'huile-d-hibiscus-1l': 'huile-d-hibiscuit.jpg',
  'huile-de-carotte-1l': 'huile-de-carotte.jpg',
  'huile-de-fenugrec-1l': 'huile-de-fenugrec.jpg',
  'huile-d-akpi-1l': 'huile-d-akpi.jpg',
  'poudre-de-moringa-1kg': 'poudre-de-moringa.jpg',
  'poudre-de-neem-1kg': 'poudre-de-neem.jpg',
  'huile-de-moringa-1l': 'huile-de-moringa.jpg',
  'huile-de-sesame-1l': 'huile-de-sesame.jpg',
  'poudre-de-baobab-1kg': 'poudre-de-baobab.jpg',
  'huile-rouge-1l': 'huile-rouge.jpg',
  'igname-frais-1kg': 'igname-frais.jpg',
  'noix-d-acajou-1kg': 'noix-d-acajou.jpg',
  'patate-douce-1kg': 'pomme-de-terre.jpg',
  'aklui-de-sorgho-1kg': 'aklui-de-sorgho.jpg',
  'farine-de-mais-1kg': 'farine-de-mais.jpg',
  'farine-de-telibor-cosette-d-igname-1kg': 'farine-de-telibo.jpg',
  'aklui-de-mais-1kg': 'aklui-de-mais.jpg',
  'aklui-de-mil-1kg': 'aklui-de-mil.jpg',
  'farine-de-agbeli-1kg': 'farine-de-agbeli.jpg',
  'farine-de-riz-ablo-1kg': 'farine-de-riz.jpg',
  'farine-de-mawe-mais-1kg': 'farine-de-mawe.jpg',
  'farine-de-akassa-1kg': 'farine-de-akassa.jpg',
  'farine-de-ata-gbaza-1kg': 'farine-de-ata-gbaza.jpg',
  'farine-de-adowe-1kg': 'farine-de-adowe.jpg',
  'farine-de-mawe-sorgho-1kg': 'farine-de-mawe-sorgho.jpg',
  'piment-rouge-de-table-1kg': 'piment-rouge-de-table.jpg'
};

// Fallback Unsplash images (same as constants.ts)
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
  ],
  Poisson: [
    'photo-1534604973900-c43ab4c2e0ab',
    'photo-1504973960431-1c467e159aa4',
    'photo-1559737558-2f5a35ab38c1'
  ]
};

const slugify = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const RAW_DATA = `MATIERES PREMIERES,PRIX
Huile de ricin - 1L,13100 FCFA
Huile d'avocat - 1L,16375 FCFA
Huile de neem - 1L,9825 FCFA
Huile de palmiste - 1L,5823 FCFA
Huile de coco - 1L,7860 FCFA
Huile de tournesol - 1L,8450 FCFA
Huile de baobab - 1L,16375 FCFA
Huile de soja - 1L,6550 FCFA
Huile de nigelle - 1L,24235 FCFA
Huile d'hibiscus - 1L,27510 FCFA
Huile de carotte - 1L,19650 FCFA
Huile de fenugrec - 1L,26128 FCFA
Huile d'Akpi - 1L,30130 FCFA
Huile de moringa - 1L,65500 FCFA
Huile de sésame - 1L,15065 FCFA
Beurre de Karité - 1kg,6550 FCFA
Poudre de baobab - 1kg,9825 FCFA
Poudre de moringa - 1kg,16375 FCFA
Poudre de neem - 1kg,13100 FCFA
Huile rouge - 1L,3275 FCFA
Igname frais - 1kg,4991 FCFA
Patate douce - 1kg,3275 FCFA
Noix d'acajou - 1kg,10480 FCFA
Aklui de Sorgho - 1kg,3275 FCFA
Farine de maïs - 1kg,1310 FCFA
Farine de telibor (Cosette d'igname) - 1kg,2358 FCFA
Aklui de Maïs - 1kg,2731 FCFA
Aklui de Mil - 1kg,3275 FCFA
Farine de Agbeli - 1kg,3275 FCFA
Farine de riz (ABLO) - 1kg,3917 FCFA
Farine de Féchouada - 1kg,9976 FCFA
Farine de Côme - 1kg,2456 FCFA
Farine de Mawê Maïs - 1kg,3275 FCFA
Farine de AKASSA - 1kg,3275 FCFA
Farine de ATA GBAZA - 1kg,6550 FCFA
Farine de Adowê - 1kg,6550 FCFA
Farine de Mawê Sorgho - 1kg,5024 FCFA
Piment rouge de table - 1kg,1795 FCFA
Poisson séché - 1kg,9825 FCFA
Crevette séchée - 1kg,16375 FCFA`;

function parseCSVData(csv) {
  const lines = csv.split('\n').slice(1);
  return lines.map((line, index) => {
    const [name, priceStr] = line.split(',');
    const basePriceFCFA = parseInt(priceStr.replace(/[^0-9]/g, ''));
    
    let category = 'Huile';
    let unit = 'kilo';

    const nameLower = name.toLowerCase();
    
    // Catégorisation intelligente
    if (nameLower.includes('farine') || nameLower.includes('aklui')) {
      category = 'Farine';
      unit = 'kilo';
    } else if (nameLower.includes('poisson') || nameLower.includes('crevette')) {
      category = 'Poisson';
      unit = 'kilo';
    } else if (nameLower.includes('patate') || nameLower.includes('igname') || nameLower.includes('noix')) {
      category = 'Céréale';
      unit = 'kilo';
    } else if (nameLower.includes('piment')) {
      category = 'Épice';
      unit = 'kilo';
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

    // Compute EUR price with markup and VAT included
    const priceFCFAWithMarkup = Math.round(basePriceFCFA * MARKUP_FACTOR);
    const priceEURHT = priceFCFAWithMarkup / FCFA_PER_EUR;
    const priceEURTTC = Math.round(priceEURHT * (1 + VAT_RATE) * 100) / 100; // 2 decimals

    const pool = IMAGE_POOLS[category];
    const imageId = pool[index % pool.length];
    const slug = slugify(name);
    const localImage = LOCAL_IMAGES[slug];

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
}

export const PRODUCTS = parseCSVData(RAW_DATA);
export const WHATSAPP_NUMBER = "33768585890";
