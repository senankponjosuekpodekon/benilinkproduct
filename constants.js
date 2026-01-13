// Configuration pour les API serverless (CommonJS/ESM compatible)
export const FCFA_PER_EUR = 655;
export const MARKUP_FACTOR = 3.0;
export const VAT_RATE = 0.20;

const RAW_DATA = `MATIERES PREMIERES,PRIX LITRE/KILOS
Huile de neem pressée à froid,6750 FCFA
Huile d'avocat extra vierge,12000 FCFA
Beurre de Karité brut,3600 FCFA
Huile de ricin pressée à froid,15750 FCFA
Huile de palmiste brute,1800 FCFA
Huile de coco pressée à froid,5700 FCFA
Huile de tournesol extra vierge,6000 FCFA
Huile de baobab pressée à froid,9750 FCFA
Huile de soja extra vierge,3300 FCFA
Poudre de baobab tamisée en vrac,5250 FCFA
Huile de nigelle pressée à froid,18000 FCFA
Huile d'hibiscus pure,18750 FCFA
Huile de carotte pure,13200 FCFA
Huile de fenugrec pressée à froid,17700 FCFA
Huile d'Akpi pressée à froid,20250 FCFA
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

function parseCSVData(csv) {
  const lines = csv.split('\n').slice(1);
  return lines.map((line, index) => {
    const [name, priceStr] = line.split(',');
    const basePriceFCFA = parseInt(priceStr.replace(/[^0-9]/g, ''));
    
    let category = 'Huile';
    let unit = 'kilo';

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
      unit
    };
  });
}

export const PRODUCTS = parseCSVData(RAW_DATA);
export const WHATSAPP_NUMBER = "33768585890";
