import { Product } from '../types';

// Synonym map mapping user search variations to product search terms
const SYNONYM_MAP: Record<string, string[]> = {
  mug: ['mug', 'coffee mug', 'magic mug', 'heat-sensitive mug'],
  mugs: ['mug', 'coffee mug', 'magic mug', 'heat-sensitive mug'],
  'heat mug': ['heat-sensitive', 'magic mug', 'color changing'],
  'magic mug': ['magic mug', 'heat-sensitive', 'thermochromic'],
  'coffee mug': ['coffee mug', 'ceramic mug'],
  'wood keychain': ['wooden keychain', 'wood keychain', 'engraved keychain'],
  'wooden keychain': ['wooden keychain', 'wood keychain', 'engraved keychain'],
  'acrylic key chain': ['acrylic keychain', 'acrylic key chain'],
  'acrylic keychain': ['acrylic keychain', 'acrylic key chain'],
  keychain: ['keychain', 'key chain', 'keyring', 'key ring'],
  'key chain': ['keychain', 'key chain'],
  'phone cover': ['mobile cover', 'phone cover', 'phone case', 'mobile case', 'plastic-frame', 'rubber-case', 'glass mobile'],
  'mobile cover': ['mobile cover', 'phone cover', 'phone case', 'mobile case', 'plastic-frame', 'rubber-case', 'glass mobile'],
  'mobile case': ['mobile cover', 'phone cover', 'phone case', 'mobile case'],
  'phone case': ['mobile cover', 'phone cover', 'phone case', 'mobile case'],
  ganpati: ['ganpati', 'ganesha', 'ganesh', 'vinayak', 'bappa'],
  ganesha: ['ganpati', 'ganesha', 'ganesh', 'vinayak', 'bappa'],
  ganesh: ['ganpati', 'ganesha', 'ganesh'],
  bappa: ['ganpati', 'ganesha', 'ganesh'],
  'artificial flower': ['forever blooms', 'artificial flower', 'handmade flower', 'crochet flower', 'satin ribbon', 'paper flower'],
  'artificial flowers': ['forever blooms', 'artificial flower', 'handmade flower', 'crochet flower', 'satin ribbon', 'paper flower'],
  'fake flower': ['forever blooms', 'artificial flower', 'handmade flower', 'crochet', 'paper flower'],
  'fake flowers': ['forever blooms', 'artificial flower', 'handmade flower', 'crochet', 'paper flower'],
  flower: ['forever blooms', 'flower', 'bouquet', 'tulip', 'sunflower', 'rose'],
  flowers: ['forever blooms', 'flower', 'bouquet', 'tulip', 'sunflower', 'rose'],
  blooms: ['forever blooms', 'flower', 'bouquet'],
  'birthday present': ['birthday', 'birthday gift', 'birthday hamper', 'birthday special'],
  'birthday gift': ['birthday', 'birthday gift', 'birthday hamper'],
  birthday: ['birthday', 'birthday gift'],
  'anniversary present': ['anniversary', 'anniversary gift', 'anniversary hamper', 'couple'],
  'anniversary gift': ['anniversary', 'anniversary gift', 'couple'],
  anniversary: ['anniversary', 'couple'],
  '3d printed': ['3d arts', '3d-printed', '3d print', 'lithophane', 'moon lamp', 'miniature'],
  '3d print': ['3d arts', '3d-printed', '3d print'],
  '3d art': ['3d arts', '3d-printed', '3d print'],
  '3d arts': ['3d arts', '3d-printed', '3d print'],
  necklace: ['necklace', 'pendant', 'jewellery', 'jewelry'],
  pendant: ['pendant', 'necklace', 'jewellery'],
  bracelet: ['bracelet', 'wristband', 'jewellery'],
  bracelets: ['bracelet', 'jewellery'],
  earring: ['earring', 'earrings', 'jewellery'],
  earrings: ['earring', 'earrings', 'jewellery'],
  ring: ['ring', 'rings', 'jewellery'],
  jewellery: ['jewellery', 'jewelry', 'pendant', 'necklace', 'earrings', 'bracelet'],
  jewelry: ['jewellery', 'jewelry', 'pendant', 'necklace', 'earrings', 'bracelet'],
  hamper: ['hamper', 'gift hamper', 'gift box', 'basket'],
  hampers: ['hamper', 'gift hamper', 'gift box', 'basket'],
  lamp: ['lamp', 'led lamp', 'photo lamp', 'moon lamp', 'night lamp'],
  frame: ['frame', 'photo frame', 'wooden frame'],
  photo: ['photo frame', 'photo lamp', 'acrylic plaque', 'standee'],
  standee: ['standee', 'acrylic standee', 'cutout'],
  bottle: ['bottle', 'flask', 'temperature flask'],
};

function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/gi, ' ') // remove punctuation
    .replace(/\s+/g, ' ')
    .trim();
}

export function searchProducts(products: Product[], query: string): Product[] {
  const normalizedQuery = normalizeString(query);
  if (!normalizedQuery) return [];

  // Expand query with synonyms
  const queryTokens = normalizedQuery.split(' ').filter(Boolean);
  const searchTerms = new Set<string>();
  searchTerms.add(normalizedQuery);

  // Add individual tokens
  for (const token of queryTokens) {
    searchTerms.add(token);
    if (SYNONYM_MAP[token]) {
      for (const syn of SYNONYM_MAP[token]) {
        searchTerms.add(syn);
      }
    }
  }

  // Check multi-word phrase in SYNONYM_MAP
  if (SYNONYM_MAP[normalizedQuery]) {
    for (const syn of SYNONYM_MAP[normalizedQuery]) {
      searchTerms.add(syn);
    }
  }

  const termsArray = Array.from(searchTerms);

  return products.filter((product) => {
    const nameNorm = normalizeString(product.name);
    const catNorm = normalizeString(product.category);
    const subCatNorm = product.subCategory ? normalizeString(product.subCategory) : '';
    const descNorm = normalizeString(product.description);
    const tagsNorm = product.tags ? product.tags.map(normalizeString).join(' ') : '';
    const combined = `${nameNorm} ${catNorm} ${subCatNorm} ${descNorm} ${tagsNorm}`;

    // Direct match with normalized query
    if (combined.includes(normalizedQuery)) return true;

    // Check if any expanded synonym term appears
    for (const term of termsArray) {
      if (combined.includes(term)) return true;
    }

    // Check if all original query tokens appear in the product text
    const allTokensMatch = queryTokens.every((token) => combined.includes(token));
    if (allTokensMatch) return true;

    return false;
  });
}
