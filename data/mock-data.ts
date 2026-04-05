export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  rating?: number
  isPopular?: boolean
}



export interface Restaurant {
  id: string
  name: string
  image: string
  rating: number
  deliveryTime: number
  deliveryFee: number
  distance: number
  minOrder: number
  cuisineType: string
  badge?: string
  badgeColor?: string
  menu: MenuItem[]
  isOpen: boolean
}

export interface Category {
  id: string
  name: string
  icon: string
  slug: string
}

export interface Offer {
  id: string
  title: string
  description: string
  code: string
  minOrderAmount?: number
  maxDiscount?: number
  discountType: 'percentage' | 'fixed'
  discountValue: number
  restaurantId?: string
  restaurantName?: string
  image: string
  expiryDate: string
  tag: string
}

export const offers: Offer[] = [
  {
    id: 'off-1',
    title: 'Welcome Gift',
    description: 'Get 50% OFF on your very first order at FoodExpress!',
    code: 'WELCOME50',
    discountType: 'percentage',
    minOrderAmount: 10,
    maxDiscount: 25,
    discountValue: 50,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    expiryDate: 'Dec 31, 2026',
    tag: 'NEW USER'
  },
  {
    id: 'off-2',
    title: 'Pizza Studio Special',
    description: 'Flat $5 OFF on all Artisan Pizzas!',
    code: 'PIZZA5',
    discountType: 'fixed',
    discountValue: 5,
    restaurantId: '2',
    restaurantName: 'Artisan Pizza Studio',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
    expiryDate: 'Apr 20, 2026',
    tag: 'RESTAURANT DEAL'
  },
  {
    id: 'off-3',
    title: 'Burger King Fest',
    description: 'Get 20% OFF on all signature burgers this weekend!',
    code: 'BURGER20',
    discountType: 'percentage',
    minOrderAmount: 15,
    maxDiscount: 10,
    discountValue: 20,
    restaurantId: '5',
    restaurantName: 'Burger King',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80',
    expiryDate: 'May 15, 2026',
    tag: 'LIMITED TIME'
  },
  {
    id: 'off-4',
    title: 'Healthy Bites',
    description: 'Flat $8 OFF on fresh salads and smoothie bowls.',
    code: 'HEALTHY8',
    discountType: 'fixed',
    minOrderAmount: 30,
    discountValue: 8,
    restaurantId: '10',
    restaurantName: 'Green Garden',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    expiryDate: 'Jun 10, 2026',
    tag: 'HEALTHY'
  },
  {
    id: 'off-5',
    title: 'Midnight Cravings',
    description: 'Enjoy 30% OFF on all late-night orders after 11 PM.',
    code: 'NIGHT30',
    discountType: 'percentage',
    minOrderAmount: 20,
    maxDiscount: 15,
    discountValue: 30,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db76?w=800&q=80',
    expiryDate: 'Jul 05, 2026',
    tag: 'MIDNIGHT'
  },
  {
    id: 'off-6',
    title: 'Sushi Sunday',
    description: 'Special 15% discount on all premium Sushi Platters.',
    code: 'SUSHIFEST',
    discountType: 'percentage',
    minOrderAmount: 40,
    maxDiscount: 20,
    discountValue: 15,
    restaurantId: '15',
    restaurantName: 'Tokyo Dine',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80',
    expiryDate: 'Apr 30, 2026',
    tag: 'WEEKEND ONLY'
  },
  {
    id: 'off-7',
    title: 'Family Feast',
    description: 'Flat $12 OFF on orders above $60. Feed the family!',
    code: 'FAMILY12',
    discountType: 'fixed',
    minOrderAmount: 60,
    discountValue: 12,
    image: 'https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=800&q=80',
    expiryDate: 'Aug 25, 2026',
    tag: 'GLOBAL DEAL'
  },
  {
    id: 'off-8',
    title: 'Dessert Heaven',
    description: 'Get 25% OFF on cakes and pastries at Sweet Delights.',
    code: 'SWEET25',
    discountType: 'percentage',
    minOrderAmount: 12,
    maxDiscount: 8,
    discountValue: 25,
    restaurantId: '25',
    restaurantName: 'Sweet Delights',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80',
    expiryDate: 'Sep 12, 2026',
    tag: 'DESSERTS'
  }
]


export const categories: Category[] = [
  {
    id: '1',
    name: 'Burgers',
    icon: '🍔',
    slug: 'burgers',
  },
  {
    id: '2',
    name: 'Pizza',
    icon: '🍕',
    slug: 'pizza',
  },
  {
    id: '3',
    name: 'Sushi',
    icon: '🍣',
    slug: 'sushi',
  },
  {
    id: '4',
    name: 'Indian',
    icon: '🥘',
    slug: 'indian',
  },
  {
    id: '5',
    name: 'Italian',
    icon: '🍝',
    slug: 'italian',
  },
  {
    id: '6',
    name: 'Asian',
    icon: '🥢',
    slug: 'asian',
  },
  {
    id: '7',
    name: 'Mexican',
    icon: '🌮',
    slug: 'mexican',
  },
  {
    id: '8',
    name: 'Desserts',
    icon: '🍰',
    slug: 'desserts',
  },
  {
    id: '9',
    name: 'Vegan',
    icon: '🥗',
    slug: 'vegan',
  },
  {
    id: '10',
    name: 'Drinks',
    icon: '🍹' ,
    slug: 'drinks'
  }


]

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Prime Burger Co.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop',
    rating: 4.8,
    deliveryTime: 25,
    deliveryFee: 2.99,
    distance: 0.8,
    minOrder: 10,
    cuisineType: 'Burgers',
    badge: 'Flash Sale',
    badgeColor: 'bg-red-500',
    isOpen: true,
    menu: [
      {
        id: 'm1',
        name: 'Premium Wagyu Burger',
        description: 'Juicy wagyu beef with truffle mayo and aged cheddar',
        price: 14.99,
        category: 'burgers',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop',
        isPopular: true,
      },
      {
        id: 'm2',
        name: 'Double Stack Deluxe',
        description: 'Two patties, bacon, cheese, lettuce, and special sauce',
        price: 12.99,
        category: 'burgers',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&h=300&fit=crop',
        rating: 4.7,
      },
      {
        id: 'm3',
        name: 'Spicy Fried Chicken Burger',
        description: 'Crispy fried chicken with hot sauce and pickles',
        price: 11.99,
        category: 'burgers',
        image: 'https://images.unsplash.com/photo-1562547256-f0f6876fe568?w=300&h=300&fit=crop',
      },
      {
        id: 'm4',
        name: 'Crispy Fries',
        description: 'Perfectly seasoned golden fries',
        price: 4.99,
        category: 'sides',
        image: 'https://images.unsplash.com/photo-1585238341710-4dd0e06ff466?w=300&h=300&fit=crop',
        isPopular: true,
      },
    ],
  },
  {
    id: '2',
    name: 'Artisan Pizza Studio',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=300&h=300&fit=crop',
    rating: 4.7,
    deliveryTime: 30,
    deliveryFee: 3.49,
    distance: 1.2,
    minOrder: 12,
    cuisineType: 'Pizza',
    badge: 'Free Delivery',
    badgeColor: 'bg-green-500',
    isOpen: true,
    menu: [
      {
        id: 'm5',
        name: 'Margherita Classico',
        description: 'Fresh mozzarella, basil, tomato, olive oil',
        price: 13.99,
        category: 'pizza',
        image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=300&h=300&fit=crop',
        isPopular: true,
      },
      {
        id: 'm6',
        name: 'Truffle & Mushroom',
        description: 'Assorted mushrooms with truffle oil and fresh herbs',
        price: 16.99,
        category: 'pizza',
        image: 'https://images.unsplash.com/photo-1571407970349-bc79e6993753?w=300&h=300&fit=crop',
        rating: 4.9,
      },
      {
        id: 'm7',
        name: 'Pepperoni Perfetto',
        description: 'Premium pepperoni with extra cheese',
        price: 14.99,
        category: 'pizza',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07f128?w=300&h=300&fit=crop',
      },
      {
        id: 'm8',
        name: 'Garlic Bread',
        description: 'Crispy bread with garlic butter and herbs',
        price: 5.99,
        category: 'sides',
        image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd1529c?w=300&h=300&fit=crop',
      },
    ],
  },
  {
    id: '3',
    name: 'Tokyo Sushi & Roll',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=300&fit=crop',
    rating: 4.9,
    deliveryTime: 28,
    deliveryFee: 4.99,
    distance: 2.1,
    minOrder: 15,
    cuisineType: 'Sushi',
    isOpen: true,
    menu: [
      {
        id: 'm9',
        name: 'Dragon Roll',
        description: 'Shrimp tempura, avocado, cucumber, spicy mayo',
        price: 16.99,
        category: 'sushi',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=300&fit=crop',
        isPopular: true,
      },
      {
        id: 'm10',
        name: 'Tuna Sashimi Set',
        description: 'Premium sashimi with 8 pieces of fresh tuna',
        price: 19.99,
        category: 'sushi',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=300&fit=crop',
        rating: 4.9,
      },
      {
        id: 'm11',
        name: 'California Roll',
        description: 'Crab, avocado, cucumber inside-out roll',
        price: 14.99,
        category: 'sushi',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=300&fit=crop',
      },
      {
        id: 'm12',
        name: 'Miso Soup',
        description: 'Traditional miso soup with tofu and seaweed',
        price: 3.99,
        category: 'sides',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=300&fit=crop',
      },
    ],
  },
  {
    id: '4',
    name: 'Maharaja Indian Kitchen',
    image: 'https://i.ibb.co.com/1JR3wng8/snappr-g-Ng-Qzet-Qsmw-unsplash.jpg',
    rating: 4.6,
    deliveryTime: 35,
    deliveryFee: 2.49,
    distance: 1.5,
    minOrder: 14,
    cuisineType: 'Indian',
    isOpen: true,
    menu: [
      {
        id: 'm13',
        name: 'Butter Chicken Curry',
        description: 'Tender chicken in creamy tomato butter sauce',
        price: 13.99,
        category: 'curries',
        image: 'https://i.ibb.co.com/1JR3wng8/snappr-g-Ng-Qzet-Qsmw-unsplash.jpg',
        isPopular: true,
      },
      {
        id: 'm14',
        name: 'Tandoori Chicken',
        description: 'Charred chicken marinated in yogurt and spices',
        price: 14.99,
        category: 'tandoori',
        image: 'https://i.ibb.co.com/1JR3wng8/snappr-g-Ng-Qzet-Qsmw-unsplash.jpg',
      },
      {
        id: 'm15',
        name: 'Lamb Biryani',
        description: 'Fragrant basmati rice with tender lamb',
        price: 15.99,
        category: 'biryani',
        image: 'https://i.ibb.co.com/1JR3wng8/snappr-g-Ng-Qzet-Qsmw-unsplash.jpg',
        rating: 4.8,
      },
      {
        id: 'm16',
        name: 'Naan Bread',
        description: 'Soft tandoori naan bread',
        price: 3.49,
        category: 'bread',
        image: 'https://images.unsplash.com/photo-1596726278493-b9aa9a96d78d?w=300&h=300&fit=crop',
      },
    ],
  },
  {
    id: '5',
    name: 'La Dolce Vita Italian',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=300&fit=crop',
    rating: 4.8,
    deliveryTime: 32,
    deliveryFee: 3.99,
    distance: 1.8,
    minOrder: 16,
    cuisineType: 'Italian',
    isOpen: true,
    menu: [
      {
        id: 'm17',
        name: 'Spaghetti Carbonara',
        description: 'Creamy pasta with guanciale, pecorino, black pepper',
        price: 14.99,
        category: 'pasta',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&h=300&fit=crop',
        isPopular: true,
      },
      {
        id: 'm18',
        name: 'Risotto al Tartufo',
        description: 'Creamy risotto with black truffle shavings',
        price: 17.99,
        category: 'risotto',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&h=300&fit=crop',
        rating: 4.9,
      },
      {
        id: 'm19',
        name: 'Osso Buco',
        description: 'Slow-braised veal shank in white wine and vegetables',
        price: 18.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&h=300&fit=crop',
      },
      {
        id: 'm20',
        name: 'Tiramisu',
        description: 'Classic Italian dessert with mascarpone and espresso',
        price: 6.99,
        category: 'dessert',
        image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=300&h=300&fit=crop',
      },
    ],
  },
  {
    id: '6',
    name: 'Bangkok Street Kitchen',
    image: 'https://i.ibb.co.com/HpM9S1tF/thavatchai-samui-Ec3-1-H0k3q-Y-unsplash.jpg',
    rating: 4.5,
    deliveryTime: 26,
    deliveryFee: 2.99,
    distance: 1.3,
    minOrder: 12,
    cuisineType: 'Asian',
    badge: '20% Off',
    badgeColor: 'bg-amber-500',
    isOpen: true,
    menu: [
      {
        id: 'm21',
        name: 'Pad Thai',
        description: 'Stir-fried rice noodles with shrimp and peanuts',
        price: 11.99,
        category: 'noodles',
        image: 'https://i.ibb.co.com/HpM9S1tF/thavatchai-samui-Ec3-1-H0k3q-Y-unsplash.jpg',
        isPopular: true,
      },
      {
        id: 'm22',
        name: 'Green Curry Chicken',
        description: 'Spicy green curry with chicken and basil',
        price: 12.99,
        category: 'curry',
        image: 'https://i.ibb.co.com/HpM9S1tF/thavatchai-samui-Ec3-1-H0k3q-Y-unsplash.jpg',
      },
      {
        id: 'm23',
        name: 'Tom Yum Goong',
        description: 'Hot and sour soup with shrimp and lemongrass',
        price: 10.99,
        category: 'soup',
        image: 'https://i.ibb.co.com/HpM9S1tF/thavatchai-samui-Ec3-1-H0k3q-Y-unsplash.jpg',
        rating: 4.7,
      },
      {
        id: 'm24',
        name: 'Mango Sticky Rice',
        description: 'Sweet mango with sticky rice and coconut milk',
        price: 5.99,
        category: 'dessert',
        image: 'https://i.ibb.co.com/HpM9S1tF/thavatchai-samui-Ec3-1-H0k3q-Y-unsplash.jpg',
      },
    ],
  },
  {
    id: '7',
    name: 'Taco Fiesta',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&h=300&fit=crop',
    rating: 4.4,
    deliveryTime: 24,
    deliveryFee: 2.49,
    distance: 0.9,
    minOrder: 10,
    cuisineType: 'Mexican',
    isOpen: true,
    menu: [
      {
        id: 'm25',
        name: 'Carnitas Tacos',
        description: 'Slow-cooked pork with onions, cilantro, and lime',
        price: 10.99,
        category: 'tacos',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&h=300&fit=crop',
        isPopular: true,
      },
      {
        id: 'm26',
        name: 'Carne Asada Burrito',
        description: 'Grilled beef with rice, beans, cheese, and salsa',
        price: 11.99,
        category: 'burritos',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&h=300&fit=crop',
      },
      {
        id: 'm27',
        name: 'Chile Relleno',
        description: 'Roasted poblano filled with cheese and sauce',
        price: 12.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&h=300&fit=crop',
      },
      {
        id: 'm28',
        name: 'Churros with Chocolate',
        description: 'Crispy churros with dark chocolate dipping sauce',
        price: 5.49,
        category: 'dessert',
        image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd1529c?w=300&h=300&fit=crop',
      },
    ],
  },
  {
    id: '8',
    name: 'Sweet Haven Bakery',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=300&fit=crop',
    rating: 4.9,
    deliveryTime: 20,
    deliveryFee: 1.99,
    distance: 0.6,
    minOrder: 8,
    cuisineType: 'Desserts',
    isOpen: true,
    menu: [
      {
        id: 'm29',
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten center',
        price: 7.99,
        category: 'cakes',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop',
        isPopular: true,
      },
      {
        id: 'm30',
        name: 'Strawberry Cheesecake',
        description: 'Creamy cheesecake with fresh strawberries',
        price: 7.49,
        category: 'cheesecake',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop',
        rating: 4.9,
      },
      {
        id: 'm31',
        name: 'Macarons Box (6)',
        description: 'Assorted French macarons in various flavors',
        price: 8.99,
        category: 'macarons',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop',
      },
      {
        id: 'm32',
        name: 'Croissant',
        description: 'Buttery French croissant',
        price: 3.99,
        category: 'pastry',
        image: 'https://images.unsplash.com/photo-1585073033235-92b0e4f1d8b5?w=300&h=300&fit=crop',
      },
    ],
  },
{
    id: '9',
    name: 'The Steakhouse Elite',
    image: 'https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=500&h=300&fit=crop',
    rating: 4.7,
    deliveryTime: 40,
    deliveryFee: 5.99,
    distance: 2.5,
    minOrder: 25,
    cuisineType: 'Steak',
    badge: 'Premium',
    badgeColor: 'bg-purple-600',
    isOpen: true,
    menu: [
      {
        id: 'm33',
        name: 'Ribeye Steak',
        description: 'Prime cut ribeye with garlic butter and asparagus',
        price: 29.99,
        category: 'mains',
        image: 'https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=300&h=300&fit=crop',
        isPopular: true,
      }
    ],
  },
  {
    id: '10',
    name: 'Healthy Bowls & Co.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop',
    rating: 4.6,
    deliveryTime: 20,
    deliveryFee: 0, // Free Delivery test
    distance: 0.5,
    minOrder: 12,
    cuisineType: 'Healthy',
    badge: 'Free Delivery',
    badgeColor: 'bg-green-500',
    isOpen: true,
    menu: [
      {
        id: 'm34',
        name: 'Quinoa Buddha Bowl',
        description: 'Quinoa, kale, roasted chickpeas, and tahini dressing',
        price: 13.49,
        category: 'bowls',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop',
        isPopular: true,
      }
    ],
  },
  {
    id: '11',
    name: 'Wok & Roll Chinese',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&h=300&fit=crop',
    rating: 4.3,
    deliveryTime: 30,
    deliveryFee: 2.49,
    distance: 1.4,
    minOrder: 15,
    cuisineType: 'Asian',
    isOpen: true,
    menu: [
      {
        id: 'm35',
        name: 'Kung Pao Chicken',
        description: 'Classic spicy stir-fry with peanuts and vegetables',
        price: 14.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=300&h=300&fit=crop',
      }
    ],
  },
  {
    id: '12',
    name: 'The Caffeine Hub',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=300&fit=crop',
    rating: 4.9,
    deliveryTime: 15,
    deliveryFee: 1.49,
    distance: 0.4,
    minOrder: 5,
    cuisineType: 'Beverages',
    badge: 'Super Fast',
    badgeColor: 'bg-blue-500',
    isOpen: true,
    menu: [
      {
        id: 'm36',
        name: 'Caramel Macchiato',
        description: 'Rich espresso with steamed milk and caramel drizzle',
        price: 5.49,
        category: 'coffee',
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=300&fit=crop',
        isPopular: true,
      }
    ],
  },
  {
    id: '13',
    name: 'Istanbul Kebab House',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&h=300&fit=crop',
    rating: 4.5,
    deliveryTime: 35,
    deliveryFee: 3.99,
    distance: 2.0,
    minOrder: 18,
    cuisineType: 'Middle Eastern',
    isOpen: true,
    menu: [
      {
        id: 'm37',
        name: 'Mixed Grill Platter',
        description: 'Lamb chops, chicken shish, and adana kebab with rice',
        price: 22.99,
        category: 'grill',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=300&fit=crop',
      }
    ],
  },
  {
    id: '14',
    name: 'Pasta e Basta',
    image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=500&h=300&fit=crop',
    rating: 4.7,
    deliveryTime: 28,
    deliveryFee: 2.99,
    distance: 1.1,
    minOrder: 15,
    cuisineType: 'Italian',
    badge: 'Top Choice',
    badgeColor: 'bg-[#E21B70]',
    isOpen: true,
    menu: [
      {
        id: 'm38',
        name: 'Lasagna Bolognese',
        description: 'Traditional layered pasta with rich meat sauce',
        price: 16.50,
        category: 'pasta',
        image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=300&h=300&fit=crop',
        isPopular: true,
      }
    ],
  },
  {
    id: '15',
    name: 'Veggie Delight',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=300&fit=crop',
    rating: 4.4,
    deliveryTime: 25,
    deliveryFee: 1.99,
    distance: 0.9,
    minOrder: 10,
    cuisineType: 'Vegetarian',
    isOpen: true,
    menu: [
      {
        id: 'm39',
        name: 'Garden Fresh Salad',
        description: 'Organic greens, cherry tomatoes, and balsamic glaze',
        price: 11.99,
        category: 'salad',
        image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=300&fit=crop',
      }
    ],
  },
  {
    id: '16',
    name: 'Brooklyn Bagel Shop',
    image: 'https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=500&h=300&fit=crop',
    rating: 4.8,
    deliveryTime: 18,
    deliveryFee: 0.99,
    distance: 0.3,
    minOrder: 8,
    cuisineType: 'Breakfast',
    isOpen: true,
    menu: [
      {
        id: 'm40',
        name: 'Lox & Cream Cheese Bagel',
        description: 'Smoked salmon, cream cheese, capers, and onions',
        price: 9.99,
        category: 'bagels',
        image: 'https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=300&h=300&fit=crop',
        isPopular: true,
      }
    ],
  },
  {
    id: '17',
    name: 'Ocean Fresh Seafood',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=300&fit=crop',
    rating: 4.6,
    deliveryTime: 45,
    deliveryFee: 4.99,
    distance: 3.2,
    minOrder: 30,
    cuisineType: 'Seafood',
    isOpen: true,
    menu: [
      {
        id: 'm41',
        name: 'Grilled Salmon',
        description: 'Wild-caught salmon with lemon butter sauce',
        price: 24.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=300&fit=crop',
      }
    ],
  },
  {
    id: '18',
    name: 'Sweet Tooth Confectionery',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=300&fit=crop',
    rating: 4.9,
    deliveryTime: 22,
    deliveryFee: 2.49,
    distance: 1.2,
    minOrder: 15,
    cuisineType: 'Desserts',
    badge: 'Best Rated',
    badgeColor: 'bg-yellow-500',
    isOpen: true,
    menu: [
      {
        id: 'm42',
        name: 'Glazed Donuts (Box of 4)',
        description: 'Assorted artisan donuts made fresh daily',
        price: 12.00,
        category: 'donuts',
        image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&h=300&fit=crop',
        isPopular: true,
      }
    ],
  }



]




export const getRestaurantById = (id: string) => {
  return restaurants.find((r) => r.id === id)
}

export const getCategoryBySlug = (slug: string) => {
  return categories.find((c) => c.slug === slug)
}

export const getRestaurantsByCategory = (cuisineType: string) => {
  return restaurants.filter((r) => r.cuisineType === cuisineType)
}

export const searchRestaurants = (query: string) => {
  const q = query.toLowerCase()
  return restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.cuisineType.toLowerCase().includes(q)
  )
}
