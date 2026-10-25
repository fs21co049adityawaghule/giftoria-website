import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // ==========================================
  // FLOWERS & BOUQUETS
  // ==========================================
  {
    id: 'flw-01',
    name: 'Eternal 12 Red Roses Luxe Bouquet',
    slug: 'eternal-12-red-roses-luxe-bouquet',
    category: 'Flowers',
    subCategory: 'Roses',
    description: 'A classic and romantic arrangement of 12 handpicked farm-fresh red roses, artfully enveloped in premium sky-blue kraft paper with a matching silk ribbon bow.',
    price: 649,
    compareAtPrice: 899,
    currency: '₹',
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
    stock: 50,
    featured: true,
    bestSeller: true,
    trending: true,
    deliveryLabel: 'Earliest Delivery: Today',
    isSameDay: true,
    isExpress: true,
    rating: 4.9,
    reviewsCount: 342,
    tags: ['roses', 'flowers', 'anniversary', 'romance', 'bestseller', 'today-delivery'],
    occasion: 'Anniversary'
  },
  {
    id: 'flw-02',
    name: 'Serene Purple Orchids Glass Vase Arrangement',
    slug: 'serene-purple-orchids-glass-vase',
    category: 'Flowers',
    subCategory: 'Orchids',
    description: 'Graceful arrangement of 6 exotic purple Mokara orchids seated in a sleek cylindrical clear glass vase. Exudes tranquility and modern elegance.',
    price: 1099,
    compareAtPrice: 1399,
    currency: '₹',
    images: [
      'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&q=80&w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&q=80&w=800',
    stock: 35,
    featured: true,
    bestSeller: false,
    trending: true,
    deliveryLabel: 'Earliest Delivery: Today',
    isSameDay: true,
    rating: 4.8,
    reviewsCount: 184,
    tags: ['orchids', 'vase arrangement', 'flowers', 'premium', 'birthday'],
    occasion: 'Birthday'
  },
  {
    id: 'flw-03',
    name: 'Sun-Kissed Yellow Lilies & Carnations Basket',
    slug: 'sun-kissed-yellow-lilies-carnations-basket',
    category: 'Flowers',
    subCategory: 'Lilies',
    description: 'Radiant Asiatic yellow lilies paired with pastel carnations arranged in a handcrafted wicker basket. Guaranteed to brighten up any celebration.',
    price: 949,
    compareAtPrice: 1199,
    currency: '₹',
    images: [
      'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&q=80&w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&q=80&w=800',
    stock: 25,
    featured: false,
    bestSeller: true,
    deliveryLabel: 'Earliest Delivery: Today',
    isSameDay: true,
    rating: 4.7,
    reviewsCount: 129,
    tags: ['lilies', 'carnations', 'basket', 'get-well-soon', 'cheer'],
    occasion: 'Celebration'
  },
  {
    id: 'flw-04',
    name: 'Blissful Pink Carnations & Baby Breath Bouquet',
    slug: 'blissful-pink-carnations-bouquet',
    category: 'Flowers',
    subCategory: 'Carnations',
    description: '15 lush pink carnations accented with delicate gypsophila (baby breath), wrapped in dual-tone sky-blue and pearl paper.',
    price: 599,
    compareAtPrice: 799,
    currency: '₹',
    images: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800',
    stock: 40,
    featured: false,
    bestSeller: false,
    deliveryLabel: 'Earliest Delivery: Today',
    isSameDay: true,
    rating: 4.8,
    reviewsCount: 96,
    tags: ['carnations', 'pink flowers', 'subtle', 'mother'],
    occasion: 'Birthday'
  },

  // ==========================================
  // CAKES & CONFECTIONERY
  // ==========================================
  {
    id: 'ck-01',
    name: 'Belgian Dark Truffle Chocolate Cake',
    slug: 'belgian-dark-truffle-chocolate-cake',
    category: 'Cakes',
    subCategory: 'Chocolate Cakes',
    description: 'Decadent moist chocolate sponge layered with rich Belgian chocolate ganache, decorated with chocolate shards and cocoa dusting.',
    price: 699,
    compareAtPrice: 949,
    currency: '₹',
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80&w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
    stock: 60,
    featured: true,
    bestSeller: true,
    trending: true,
    availableWeights: ['500g', '1kg', '1.5kg', '2kg'],
    deliveryLabel: 'Earliest Delivery: 2 Hours',
    isSameDay: true,
    isExpress: true,
    rating: 4.9,
    reviewsCount: 512,
    tags: ['cake', 'chocolate', 'birthday cake', 'express-delivery', 'bestseller'],
    occasion: 'Birthday'
  },
  {
    id: 'ck-02',
    name: 'Heart-Crafted Red Velvet Cream Cheese Cake',
    slug: 'heart-crafted-red-velvet-cake',
    category: 'Cakes',
    subCategory: 'Red Velvet',
    description: 'Velvety crimson sponge topped and filled with silky Philadelphia-style cream cheese frosting, presented in an exquisite heart silhouette.',
    price: 799,
    compareAtPrice: 1049,
    currency: '₹',
    images: [
      'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&q=80&w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&q=80&w=800',
    stock: 30,
    featured: true,
    bestSeller: true,
    availableWeights: ['500g', '1kg', '2kg'],
    deliveryLabel: 'Earliest Delivery: Today',
    isSameDay: true,
    rating: 4.9,
    reviewsCount: 288,
    tags: ['red velvet', 'anniversary cake', 'heart cake', 'romance'],
    occasion: 'Anniversary'
  },
  {
    id: 'ck-03',
    name: 'Exotic Seasonal Fresh Fruit Gateau',
    slug: 'exotic-fresh-fruit-gateau',
    category: 'Cakes',
    subCategory: 'Fruit Cakes',
    description: 'Light vanilla sponge frosted with fresh whipped cream and crowned with a bounty of fresh kiwi, strawberries, dragon fruit, and peaches.',
    price: 749,
    compareAtPrice: 999,
    currency: '₹',
    images: [
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=800',
    stock: 25,
    featured: false,
    bestSeller: false,
    availableWeights: ['500g', '1kg'],
    deliveryLabel: 'Earliest Delivery: Today',
    isSameDay: true,
    rating: 4.7,
    reviewsCount: 145,
    tags: ['fruit cake', 'fresh cream', 'healthy', 'vanilla'],
    occasion: 'Birthday'
  },
  {
    id: 'ck-04',
    name: 'Classic Black Forest Cherry Delight',
    slug: 'classic-black-forest-cherry-delight',
    category: 'Cakes',
    subCategory: 'Black Forest',
    description: 'Traditional German-style cocoa layers infused with sweet cherry compote, enveloped in airy whipped cream and finished with shaved chocolate curls.',
    price: 549,
    compareAtPrice: 749,
    currency: '₹',
    images: [
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800',
    stock: 45,
    featured: false,
    bestSeller: true,
    availableWeights: ['500g', '1kg'],
    deliveryLabel: 'Earliest Delivery: Today',
    isSameDay: true,
    rating: 4.8,
    reviewsCount: 390,
    tags: ['black forest', 'popular', 'budget-friendly', 'classic'],
    occasion: 'Celebration'
  },

  // ==========================================
  // PLANTS & GREEN GIFTS
  // ==========================================
  {
    id: 'plt-01',
    name: 'Good Luck Money Plant in Ceramic Pastel Pot',
    slug: 'good-luck-money-plant-ceramic-pot',
    category: 'Plants',
    subCategory: 'Indoor Plants',
    description: 'Vibrant indoor Epipremnum aureum (Golden Pothos) nestled in a high-gloss pastel blue ceramic pot. Believed to attract prosperity and purify indoor air.',
    price: 499,
    compareAtPrice: 699,
    currency: '₹',
    images: [
      'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=800',
    stock: 80,
    featured: true,
    bestSeller: true,
    trending: true,
    deliveryLabel: 'Earliest Delivery: Tomorrow',
    rating: 4.8,
    reviewsCount: 210,
    tags: ['plants', 'money plant', 'air purifying', 'indoor', 'eco friendly'],
    occasion: 'Housewarming'
  },
  {
    id: 'plt-02',
    name: 'Peace Lily Air Purifier in Sleek White Planter',
    slug: 'peace-lily-air-purifier-white-planter',
    category: 'Plants',
    subCategory: 'Flowering Plants',
    description: 'Lush dark green leaves complemented by elegant white blooms. NASA-recommended indoor air cleaner that brings positive calmness to any living room or desk.',
    price: 649,
    compareAtPrice: 899,
    currency: '₹',
    images: [
      'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&q=80&w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&q=80&w=800',
    stock: 40,
    featured: false,
    bestSeller: true,
    deliveryLabel: 'Earliest Delivery: Tomorrow',
    rating: 4.9,
    reviewsCount: 167,
    tags: ['peace lily', 'flowering plant', 'desk plant', 'living room'],
    occasion: 'Birthday'
  },
  {
    id: 'plt-03',
    name: 'Lucky 2-Layer Bamboo in Glass Bowl with Pebbles',
    slug: 'lucky-two-layer-bamboo-glass-bowl',
    category: 'Plants',
    subCategory: 'Lucky Bamboo',
    description: 'Two tiers of Dracaena sanderiana representing love and double luck, settled in a clear glass bowl adorned with decorative blue polished stones.',
    price: 399,
    compareAtPrice: 549,
    currency: '₹',
    images: [
      'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=800',
    stock: 90,
    featured: false,
    bestSeller: true,
    deliveryLabel: 'Earliest Delivery: Today',
    isSameDay: true,
    rating: 4.7,
    reviewsCount: 312,
    tags: ['lucky bamboo', 'feng shui', 'desk plant', 'budget'],
    occasion: 'Housewarming'
  },
  {
    id: 'plt-04',
    name: 'Sansevieria Snake Plant in Textured Planter',
    slug: 'sansevieria-snake-plant-textured-planter',
    category: 'Plants',
    subCategory: 'Succulents',
    description: 'Resilient and virtually indestructible snake plant featuring upright architectural sword leaves with golden-yellow margins.',
    price: 599,
    compareAtPrice: 799,
    currency: '₹',
    images: [
      'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&q=80&w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&q=80&w=800',
    stock: 55,
    featured: false,
    bestSeller: false,
    deliveryLabel: 'Earliest Delivery: Tomorrow',
    rating: 4.8,
    reviewsCount: 94,
    tags: ['snake plant', 'low maintenance', 'air purifier'],
    occasion: 'Corporate'
  },

  // ==========================================
  // PERSONALIZED GIFTS
  // ==========================================
  {
    id: 'pers-01',
    name: 'Personalized Temperature LED Flask 500ml',
    slug: 'personalized-temperature-led-flask',
    category: 'Personalized Gifts',
    subCategory: 'Engraved Drinkware',
    description: 'Sleek matte finish double-wall insulated flask with smart touch LED temperature sensor on cap. Custom laser-engraved with recipient name and icon.',
    price: 699,
    compareAtPrice: 999,
    currency: '₹',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=800',
    customizable: true,
    stock: 75,
    featured: true,
    bestSeller: true,
    trending: true,
    deliveryLabel: 'Earliest Delivery: 2 Days',
    rating: 4.9,
    reviewsCount: 420,
    tags: ['personalized', 'flask', 'engraving', 'custom name', 'corporate'],
    occasion: 'Birthday'
  },
  {
    id: 'pers-02',
    name: 'Custom Acrylic Song Plaque with Wooden LED Base',
    slug: 'custom-acrylic-song-plaque-wooden-led',
    category: 'Personalized Gifts',
    subCategory: 'Photo Keepsakes',
    description: 'High-definition UV printed clear acrylic glass displaying your favorite couple photo, song title, artist, and scannable code, supported by warm LED wooden stand.',
    price: 899,
    compareAtPrice: 1299,
    currency: '₹',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
    customizable: true,
    stock: 45,
    featured: true,
    bestSeller: true,
    deliveryLabel: 'Earliest Delivery: 2 Days',
    rating: 4.9,
    reviewsCount: 310,
    tags: ['spotify plaque', 'acrylic', 'anniversary gift', 'photo frame', 'led'],
    occasion: 'Anniversary'
  },
  {
    id: 'pers-03',
    name: 'Personalized Color Changing Magic Mug',
    slug: 'personalized-color-changing-magic-mug',
    category: 'Personalized Gifts',
    subCategory: 'Custom Mugs',
    description: 'Surprise your loved ones with this thermochromic black mug that reveals high-resolution custom photo & heartfelt quote when filled with hot beverages.',
    price: 399,
    compareAtPrice: 599,
    currency: '₹',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
    customizable: true,
    stock: 120,
    featured: false,
    bestSeller: true,
    deliveryLabel: 'Earliest Delivery: Tomorrow',
    rating: 4.8,
    reviewsCount: 580,
    tags: ['magic mug', 'custom mug', 'photo gift', 'birthday'],
    occasion: 'Birthday'
  },
  {
    id: 'pers-04',
    name: 'Handcrafted Wooden Engraved Photo Frame',
    slug: 'handcrafted-wooden-engraved-photo-frame',
    category: 'Personalized Gifts',
    subCategory: 'Frames',
    description: 'Pure imported beech wood plaque custom laser-engraved with your portrait and anniversary date. Includes metallic tabletop easel stand.',
    price: 649,
    compareAtPrice: 899,
    currency: '₹',
    images: [
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800',
    customizable: true,
    stock: 50,
    featured: false,
    bestSeller: false,
    deliveryLabel: 'Earliest Delivery: 2 Days',
    rating: 4.8,
    reviewsCount: 172,
    tags: ['wooden engraving', 'photo frame', 'anniversary keepsake'],
    occasion: 'Anniversary'
  },

  // ==========================================
  // GIFT HAMPERS
  // ==========================================
  {
    id: 'hmp-01',
    name: 'Imperial Royal Dry Fruit & Saffron Hamper',
    slug: 'imperial-royal-dry-fruit-saffron-hamper',
    category: 'Gift Hampers',
    subCategory: 'Gourmet Hampers',
    description: 'Handcrafted sky-blue velvet trunk packed with roasted almonds, jumbo cashews, Afghan raisins, Kashmiri walnuts, pure saffron, and festive brass diya.',
    price: 1899,
    compareAtPrice: 2499,
    currency: '₹',
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800',
    stock: 35,
    featured: true,
    bestSeller: true,
    trending: true,
    deliveryLabel: 'Earliest Delivery: Today',
    isSameDay: true,
    rating: 4.9,
    reviewsCount: 215,
    tags: ['hamper', 'dry fruits', 'luxury hamper', 'festive', 'gift basket'],
    occasion: 'Festivals'
  },
  {
    id: 'hmp-02',
    name: 'Artisan Chocolate & Aromatherapy Pamper Hamper',
    slug: 'artisan-chocolate-aromatherapy-pamper-hamper',
    category: 'Gift Hampers',
    subCategory: 'Wellness Hampers',
    description: 'An indulgence basket filled with hand-poured lavender soy candle, artisan dark cocoa bars, bath salts, organic body wash, and a keepsake plush towel.',
    price: 1499,
    compareAtPrice: 1999,
    currency: '₹',
    images: [
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&q=80&w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&q=80&w=800',
    stock: 28,
    featured: true,
    bestSeller: false,
    deliveryLabel: 'Earliest Delivery: Tomorrow',
    rating: 4.8,
    reviewsCount: 138,
    tags: ['pamper', 'spa hamper', 'chocolates', 'wellness', 'relaxation'],
    occasion: 'Birthday'
  },
  {
    id: 'hmp-03',
    name: 'Sweet Harmony Flowers & Mithai Celebration Box',
    slug: 'sweet-harmony-flowers-mithai-box',
    category: 'Gift Hampers',
    subCategory: 'Combo Hampers',
    description: 'Classic festive wooden box containing 6 fresh red roses, premium Kaju Katli (250g), and Assorted Pralines. The quintessential Indian family celebratory gift.',
    price: 1199,
    compareAtPrice: 1599,
    currency: '₹',
    images: [
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800',
    stock: 45,
    featured: false,
    bestSeller: true,
    deliveryLabel: 'Earliest Delivery: Today',
    isSameDay: true,
    rating: 4.9,
    reviewsCount: 310,
    tags: ['mithai', 'flowers combo', 'kaju katli', 'family gift'],
    occasion: 'Festivals'
  },

  // ==========================================
  // CHOCOLATES & SWEETS
  // ==========================================
  {
    id: 'choc-01',
    name: '16 Pcs Ferrero Rocher Golden Bouquet',
    slug: '16-pcs-ferrero-rocher-golden-bouquet',
    category: 'Chocolates',
    subCategory: 'Chocolate Bouquet',
    description: '16 crunchy hazelnut Ferrero Rocher golden truffles elegantly assembled as floral blooms in delicate sky-blue and white craft wraps.',
    price: 1199,
    compareAtPrice: 1499,
    currency: '₹',
    images: [
      'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=800',
    stock: 65,
    featured: true,
    bestSeller: true,
    trending: true,
    deliveryLabel: 'Earliest Delivery: Today',
    isSameDay: true,
    rating: 4.9,
    reviewsCount: 470,
    tags: ['chocolates', 'ferrero', 'bouquet', 'chocolate bouquet', 'bestseller'],
    occasion: 'Valentine'
  },
  {
    id: 'choc-02',
    name: 'Cadbury Celebrations Silk Grand Tower',
    slug: 'cadbury-celebrations-silk-grand-tower',
    category: 'Chocolates',
    subCategory: 'Chocolate Boxes',
    description: 'Tiered gift arrangement featuring Cadbury Silk Bubbly, Fruit & Nut, Oreo, and Roast Almond bars crowned with silky blue ribbon.',
    price: 849,
    compareAtPrice: 1099,
    currency: '₹',
    images: [
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&q=80&w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&q=80&w=800',
    stock: 80,
    featured: false,
    bestSeller: true,
    deliveryLabel: 'Earliest Delivery: Today',
    isSameDay: true,
    rating: 4.8,
    reviewsCount: 382,
    tags: ['cadbury', 'silk', 'chocolates', 'sweet gift'],
    occasion: 'Birthday'
  },

  // ==========================================
  // JEWELLERY & FASHION ACCESSORIES
  // ==========================================
  {
    id: 'jwl-01',
    name: 'Interlocking Infinity Sterling Silver Pendant',
    slug: 'interlocking-infinity-silver-pendant',
    category: 'Jewellery',
    subCategory: 'Necklaces',
    description: '925 hallmarked sterling silver pendant with Austrian zircon stones. Symbolizes timeless affection. Packed in a sky-blue velvet jewellery box.',
    price: 1299,
    compareAtPrice: 1899,
    currency: '₹',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
    stock: 40,
    featured: false,
    bestSeller: true,
    deliveryLabel: 'Earliest Delivery: 2 Days',
    rating: 4.8,
    reviewsCount: 165,
    tags: ['jewellery', 'silver pendant', 'infinity', 'anniversary gift'],
    occasion: 'Anniversary'
  },

  // ==========================================
  // HOME & LIVING
  // ==========================================
  {
    id: 'home-01',
    name: 'Nordic Ceramic Aroma Diffuser & Essential Oils Set',
    slug: 'nordic-ceramic-aroma-diffuser-set',
    category: 'Home & Living',
    subCategory: 'Fragrance',
    description: 'Minimalist sky-tinted ceramic ultrasonic mist diffuser paired with pure Lemongrass, Lavender, and Eucalyptus steam-distilled essential oils.',
    price: 1149,
    compareAtPrice: 1599,
    currency: '₹',
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800',
    stock: 35,
    featured: false,
    bestSeller: false,
    deliveryLabel: 'Earliest Delivery: 2 Days',
    rating: 4.7,
    reviewsCount: 92,
    tags: ['home decor', 'aroma diffuser', 'essential oils', 'zen'],
    occasion: 'Housewarming'
  },

  // ==========================================
  // OCCASIONS & BIRTHDAY SPECIALS
  // ==========================================
  {
    id: 'combo-01',
    name: 'Happy Birthday Grand Trio: Roses, Cake & Teddy',
    slug: 'happy-birthday-grand-trio-roses-cake-teddy',
    category: 'Birthday Gifts',
    subCategory: 'Grand Combos',
    description: 'The ultimate birthday celebration package: 10 vibrant red roses bunch, 500g Dutch Chocolate Cake, and an adorable 6-inch plush cream teddy bear.',
    price: 1399,
    compareAtPrice: 1899,
    currency: '₹',
    images: [
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800',
    stock: 50,
    featured: true,
    bestSeller: true,
    trending: true,
    deliveryLabel: 'Earliest Delivery: Today',
    isSameDay: true,
    isExpress: true,
    rating: 4.9,
    reviewsCount: 684,
    tags: ['birthday special', 'combo', 'roses and cake', 'teddy combo', 'bestseller'],
    occasion: 'Birthday'
  },
  {
    id: 'combo-02',
    name: 'Everlasting Love Red Heart Roses & Photo Box',
    slug: 'everlasting-love-heart-roses-photo-box',
    category: 'Anniversary Gifts',
    subCategory: 'Romantic Combos',
    description: 'A heart-shaped designer gift box filled with 20 scarlet roses on one side and a pull-out customized photo film strip on the other.',
    price: 1599,
    compareAtPrice: 2199,
    currency: '₹',
    images: [
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=800'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=800',
    customizable: true,
    stock: 30,
    featured: true,
    bestSeller: true,
    deliveryLabel: 'Earliest Delivery: Today',
    isSameDay: true,
    rating: 4.9,
    reviewsCount: 395,
    tags: ['anniversary gift', 'heart box', 'luxury roses', 'photo surprise'],
    occasion: 'Anniversary'
  }
];

export const CATEGORIES_LIST = [
  {
    id: 'Flowers',
    name: 'Flowers',
    slug: 'flowers',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=400',
    description: 'Fresh bouquets, roses, lilies & orchids',
    count: '150+ Varieties'
  },
  {
    id: 'Cakes',
    name: 'Cakes',
    slug: 'cakes',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400',
    description: 'Truffle, Black Forest, Red Velvet & more',
    count: 'Freshly Baked'
  },
  {
    id: 'Plants',
    name: 'Plants',
    slug: 'plants',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=400',
    description: 'Money plants, jade, snake & lucky bamboo',
    count: 'Air Purifiers'
  },
  {
    id: 'Personalized Gifts',
    name: 'Personalized Gifts',
    slug: 'personalized-gifts',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400',
    description: 'Mugs, engraved flasks, acrylic & wooden plaques',
    count: 'Custom Engraved'
  },
  {
    id: 'Gift Hampers',
    name: 'Gift Hampers',
    slug: 'gift-hampers',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=400',
    description: 'Dry fruits, gourmet chocolates & wellness baskets',
    count: 'Curated Sets'
  },
  {
    id: 'Chocolates',
    name: 'Chocolates',
    slug: 'chocolates',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=400',
    description: 'Ferrero bouquets, Cadbury silk towers & pralines',
    count: 'Sweet Delights'
  },
  {
    id: 'Jewellery',
    name: 'Jewellery',
    slug: 'jewellery',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400',
    description: 'Silver pendants, bracelets & earrings',
    count: 'Fine Keepsakes'
  },
  {
    id: 'Home & Living',
    name: 'Home & Living',
    slug: 'home-living',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=400',
    description: 'Aroma diffusers, lamps & decorative planters',
    count: 'Cozy Living'
  },
  {
    id: 'Birthday Gifts',
    name: 'Birthday Gifts',
    slug: 'birthday-gifts',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=400',
    description: 'Cakes, flower combos & special birthday hampers',
    count: 'Same-day Ready'
  },
  {
    id: 'Anniversary Gifts',
    name: 'Anniversary Gifts',
    slug: 'anniversary-gifts',
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=400',
    description: 'Heart cakes, rose boxes & couple plaques',
    count: 'Romantic Picks'
  }
];

export const OCCASIONS_LIST = [
  'Birthday',
  'Anniversary',
  'Congratulations',
  'Get Well Soon',
  'Housewarming',
  'Thank You',
  'New Born Baby',
  'Love & Romance'
];
