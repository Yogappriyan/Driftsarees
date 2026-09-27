export interface Product {
  id: string;
  name: string;
  category: 'Kanjivaram' | 'Banarasi' | 'Paithani' | 'Organza' | 'Net' | 'Chiffon';
  mood: 'Wedding Edit' | 'Kanchipuram Icons' | 'Banarasi Heirlooms' | 'Festive Radiance' | 'Zari Signatures' | 'Bridal Glam';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  primaryImage: string;
  secondaryImage: string;
  altLooks: {
    label: string;
    image: string;
    color: string;
  }[];
  description: string;
  fabricSpecs: string[];
  colors: {
    name: string;
    hex: string;
  }[];
  sizes: string[];
  stock: number;
  sku?: string;
  isNew?: boolean;
  isBestseller?: boolean;
  isExclusive?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
}

export type OrderStatus =
  | 'Atelier Allocated'
  | 'On Handloom'
  | 'Zari Hallmarked'
  | 'Fall & Pico Done'
  | 'Velvet Dispatched'
  | 'Delivered';

export interface AtelierOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  city: string;
  address: string;
  date: string;
  items: {
    productName: string;
    category: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
    image: string;
  }[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  notes?: string;
}

export interface AnalyticsMetric {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtitle: string;
}
