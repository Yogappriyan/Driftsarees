import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { Product, AtelierOrder, OrderStatus } from '../types';
import {
  BarChart3,
  Package,
  ShoppingBag,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  TrendingUp,
  DollarSign,
  Award,
  Layers,
  CheckCircle2,
  Clock,
  Truck,
  Sparkles,
  ArrowUpRight,
  Filter,
  Eye,
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Rose Net', url: '/src/assets/images/editorial_model_rose_net_1790444842708.jpg' },
  { label: 'Emerald Kanjivaram', url: '/src/assets/images/editorial_model_kanjivaram_1790444829857.jpg' },
  { label: 'Ivory Organza', url: '/src/assets/images/editorial_model_ivory_organza_1790444853542.jpg' },
  { label: 'Crimson Banarasi', url: '/src/assets/images/editorial_model_royal_crimson_1790444865420.jpg' },
  { label: 'Mustard Paithani', url: '/src/assets/images/editorial_model_mustard_paithani_1790444917179.jpg' },
  { label: 'Sapphire Handloom', url: '/src/assets/images/editorial_model_sapphire_1790444892272.jpg' },
];

export const AdminPanel: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    adminTab,
    setAdminTab,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleBestseller,
    toggleNewDrop,
    orders,
    updateOrderStatus,
    setSelectedProduct,
  } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'today' | 'week' | 'month' | 'all'>('month');

  // Product Add / Edit modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form fields
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'Kanjivaram',
    mood: 'Wedding Edit',
    price: 25000,
    originalPrice: 32000,
    stock: 8,
    description: '',
    fabricSpecs: ['100% Pure Mulberry Silk', 'Tested Pure Zari', 'Handloom Hallmarked'],
    primaryImage: PRESET_IMAGES[0].url,
    secondaryImage: PRESET_IMAGES[1].url,
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: true,
    isBestseller: false,
    isExclusive: false,
  });

  if (!isAdminOpen) return null;

  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `DF-SAREE-${Math.floor(100 + Math.random() * 900)}`,
      category: 'Kanjivaram',
      mood: 'Wedding Edit',
      price: 28000,
      originalPrice: 35000,
      stock: 6,
      rating: 4.9,
      reviewCount: 1,
      description: 'Handwoven with tested pure silver-gold zari on traditional pit looms.',
      fabricSpecs: ['100% Pure Silk', 'Tested Pure 2G Zari', 'Custom Tailored Blouse'],
      primaryImage: PRESET_IMAGES[0].url,
      secondaryImage: PRESET_IMAGES[1].url,
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      colors: [
        { name: 'Royal Crimson', hex: '#77142A' },
        { name: 'Temple Gold', hex: '#C5A880' },
      ],
      altLooks: [
        { label: 'Look 1', image: PRESET_IMAGES[0].url, color: '#77142A' },
        { label: 'Look 2', image: PRESET_IMAGES[1].url, color: '#134D35' },
      ],
      isNew: true,
      isBestseller: false,
      isExclusive: false,
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({ ...prod });
    setIsFormOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        ...formData,
      } as Product);
    } else {
      const newProd: Product = {
        id: `custom-${Date.now()}`,
        name: formData.name || 'Artisanal Saree',
        sku: formData.sku || `DF-CUST-${Math.floor(100 + Math.random() * 900)}`,
        category: formData.category as any,
        mood: formData.mood as any,
        price: Number(formData.price) || 24000,
        originalPrice: Number(formData.originalPrice) || 30000,
        stock: Number(formData.stock) || 5,
        rating: 4.9,
        reviewCount: 1,
        description: formData.description || 'Exclusive handwoven heirloom creation.',
        fabricSpecs: formData.fabricSpecs || ['Pure Mulberry Silk', 'Tested Zari'],
        primaryImage: formData.primaryImage || PRESET_IMAGES[0].url,
        secondaryImage: formData.secondaryImage || PRESET_IMAGES[1].url,
        sizes: formData.sizes || ['S', 'M', 'L', 'XL'],
        colors: formData.colors || [{ name: 'Gold', hex: '#C5A880' }],
        altLooks: formData.altLooks || [
          { label: 'Main', image: formData.primaryImage || PRESET_IMAGES[0].url, color: '#C5A880' },
        ],
        isNew: formData.isNew,
        isBestseller: formData.isBestseller,
        isExclusive: formData.isExclusive,
      };
      addProduct(newProd);
    }
    setIsFormOpen(false);
  };

  // Filter products for the inventory tab
  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchQuery;
  });

  // Analytics calculation
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0) + 1845000;
  const avgOrderValue = Math.round(totalRevenue / (orders.length + 58));

  return (
    <div 
      className="fixed inset-0 z-[120] overflow-y-auto bg-[#0C0A0A] text-[#ECE5DC]"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-30 bg-[#120F0F] border-b border-[#FAF7F2]/10 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C5A880] animate-pulse" />
            <h1 className="font-serif text-2xl tracking-[0.2em] text-[#FAF7F2] uppercase">
              DRIFT ATELIER
            </h1>
          </div>
          <span className="text-xs px-2.5 py-1 bg-[#541123] border border-[#8C1D3B]/40 text-[#F5EBE1] rounded-full font-mono uppercase tracking-widest hidden sm:inline">
            MAISON ADMIN PORTAL
          </span>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-2 bg-[#1A1616] p-1 rounded-xl border border-[#FAF7F2]/10">
          <button
            onClick={() => setAdminTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
              adminTab === 'analytics'
                ? 'bg-[#541123] text-[#FAF7F2] shadow-md font-semibold'
                : 'text-[#ECE5DC]/70 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Atelier Analytics</span>
          </button>

          <button
            onClick={() => setAdminTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
              adminTab === 'products'
                ? 'bg-[#541123] text-[#FAF7F2] shadow-md font-semibold'
                : 'text-[#ECE5DC]/70 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Saree Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
              adminTab === 'orders'
                ? 'bg-[#541123] text-[#FAF7F2] shadow-md font-semibold'
                : 'text-[#ECE5DC]/70 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Bridal Orders ({orders.length})</span>
          </button>
        </div>

        {/* Right Action: Close Admin */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAdminOpen(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C1818] hover:bg-[#282222] border border-[#FAF7F2]/15 text-xs text-[#ECE5DC] hover:text-[#C5A880] transition-colors"
          >
            <span>Exit to Maison</span>
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Admin Panel Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* =========================================================================
            TAB 1: ATELIER ANALYTICS & LOOM CAPACITY
           ========================================================================= */}
        {adminTab === 'analytics' && (
          <div className="space-y-8">
            {/* Analytics Header & Time Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#FAF7F2]/10">
              <div>
                <h2 className="font-serif text-3xl text-[#FAF7F2] font-normal">
                  Haute Couture Performance &amp; Provenance
                </h2>
                <p className="text-xs text-[#ECE5DC]/60 font-mono tracking-wider mt-1">
                  REAL-TIME SALON REVENUE · TESTED ZARI ALLOTMENTS · ATELIER LOOMS
                </p>
              </div>

              {/* Time filter selector */}
              <div className="flex items-center gap-1 bg-[#161212] p-1 rounded-xl border border-[#FAF7F2]/10 text-xs font-mono">
                {[
                  { id: 'today', label: 'Today' },
                  { id: 'week', label: 'This Week' },
                  { id: 'month', label: 'Festive Month' },
                  { id: 'all', label: 'All Time' },
                ].map((tf) => (
                  <button
                    key={tf.id}
                    onClick={() => setAnalyticsTimeframe(tf.id as any)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      analyticsTimeframe === tf.id
                        ? 'bg-[#541123] text-[#FAF7F2] font-semibold'
                        : 'text-[#ECE5DC]/60 hover:text-white'
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Key Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-2xl bg-[#141111] border border-[#FAF7F2]/10 shadow-lg">
                <div className="flex items-center justify-between text-[#C5A880] mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider">Gross Salon Revenue</span>
                  <DollarSign className="w-5 h-5 text-[#C5A880]" />
                </div>
                <div className="font-serif text-3xl font-semibold text-[#FAF7F2] tabular-nums">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+24.6% vs previous festive season</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#141111] border border-[#FAF7F2]/10 shadow-lg">
                <div className="flex items-center justify-between text-[#C5A880] mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider">Active Bridal Trousseaus</span>
                  <ShoppingBag className="w-5 h-5 text-[#C5A880]" />
                </div>
                <div className="font-serif text-3xl font-semibold text-[#FAF7F2] tabular-nums">
                  {orders.length + 58}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-[#C5A880] font-mono">
                  <span>4 orders dispatched today</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#141111] border border-[#FAF7F2]/10 shadow-lg">
                <div className="flex items-center justify-between text-[#C5A880] mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider">Average Order Value (AOV)</span>
                  <Award className="w-5 h-5 text-[#C5A880]" />
                </div>
                <div className="font-serif text-3xl font-semibold text-[#FAF7F2] tabular-nums">
                  ₹{avgOrderValue.toLocaleString('en-IN')}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                  <span>+12.8% on Pure Zari Kanchipurams</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#141111] border border-[#FAF7F2]/10 shadow-lg">
                <div className="flex items-center justify-between text-[#C5A880] mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider">Hallmarked 2G Zari Used</span>
                  <Sparkles className="w-5 h-5 text-[#C5A880]" />
                </div>
                <div className="font-serif text-3xl font-semibold text-[#FAF7F2] tabular-nums">
                  14.8 kg
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-[#C5A880] font-mono">
                  <span>100% certified electroplated pure silver</span>
                </div>
              </div>
            </div>

            {/* Middle Section: Weaving Cluster Breakdown & Loom Capacity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Category Sales Breakdown */}
              <div className="lg:col-span-6 p-6 rounded-2xl bg-[#141111] border border-[#FAF7F2]/10">
                <h3 className="font-serif text-xl text-[#FAF7F2] mb-1">
                  Demand by Artisanal Weave Cluster
                </h3>
                <p className="text-xs text-[#ECE5DC]/60 font-mono mb-6">
                  PROPORTION OF HAUTE REVENUE GENERATED
                </p>

                <div className="space-y-4">
                  {[
                    { label: 'Kanchipuram Temple Silks (Korvai)', pct: 42, amount: '₹10,43,000', color: 'from-[#8C1D3B] to-[#C5A880]' },
                    { label: 'Banarasi Kadhwa Weave (Ghats)', pct: 28, amount: '₹6,95,000', color: 'from-[#541123] to-[#8C1D3B]' },
                    { label: 'Yeola Paithani Heirlooms', pct: 16, amount: '₹3,97,000', color: 'from-[#C5A880] to-[#E7D5B8]' },
                    { label: 'Sheer Organza & French Net', pct: 14, amount: '₹3,47,000', color: 'from-[#3B1832] to-[#781830]' },
                  ].map((cat) => (
                    <div key={cat.label} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#ECE5DC] font-medium">{cat.label}</span>
                        <span className="font-mono text-[#C5A880]">{cat.amount} ({cat.pct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-[#221D1D] rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${cat.color}`}
                          style={{ width: `${cat.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Artisan Loom Capacity Tracker */}
              <div className="lg:col-span-6 p-6 rounded-2xl bg-[#141111] border border-[#FAF7F2]/10">
                <h3 className="font-serif text-xl text-[#FAF7F2] mb-1">
                  Ancestral Looms &amp; Weaver Guild Capacity
                </h3>
                <p className="text-xs text-[#ECE5DC]/60 font-mono mb-6">
                  LIVE STATUS ACROSS REGISTERED WEAVING ATELIERS
                </p>

                <div className="space-y-4">
                  {[
                    {
                      name: 'Kanchipuram Master Loom Atelier',
                      capacity: '12 / 12 Looms Active (100%)',
                      weavers: '24 Master Weavers (Dual Shuttle)',
                      status: 'Full Capacity · 28-Day Waitlist',
                      badgeColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40',
                    },
                    {
                      name: 'Varanasi Ghats Pit Loom Workshop',
                      capacity: '8 / 10 Looms Active (80%)',
                      weavers: '16 Artisans on Kadhwa Jaal',
                      status: 'Operating Normally',
                      badgeColor: 'text-[#C5A880] bg-[#541123]/40 border-[#8C1D3B]/40',
                    },
                    {
                      name: 'Yeola Paithani Guild (Maharashtra)',
                      capacity: '6 / 6 Looms Active (100%)',
                      weavers: '12 Weavers on Peacock Pallu',
                      status: 'Ceremonial Allotment Closed',
                      badgeColor: 'text-amber-400 bg-amber-950/40 border-amber-800/40',
                    },
                  ].map((loom) => (
                    <div
                      key={loom.name}
                      className="p-4 rounded-xl bg-[#191515] border border-[#FAF7F2]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <h4 className="font-serif text-base text-[#FAF7F2] font-medium">{loom.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-[#ECE5DC]/60 font-mono mt-1">
                          <span>{loom.capacity}</span>
                          <span>·</span>
                          <span>{loom.weavers}</span>
                        </div>
                      </div>
                      <span className={`text-[11px] font-mono px-3 py-1 rounded-full border self-start sm:self-center ${loom.badgeColor}`}>
                        {loom.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Action Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#541123]/60 via-[#1C1818] to-[#120F0F] border border-[#8C1D3B]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-serif text-lg text-[#FAF7F2]">Ready to expand the Autumn/Winter Bridal Edit?</h4>
                <p className="text-xs text-[#ECE5DC]/70">Add newly hand-draped masterworks directly to the live showcase.</p>
              </div>
              <button
                onClick={handleOpenAddForm}
                className="px-5 py-2.5 bg-[#8C1D3B] hover:bg-[#A32244] text-[#FAF7F2] text-xs uppercase font-mono tracking-wider font-semibold rounded-xl flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Saree</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: PRODUCT MANAGEMENT & INVENTORY
           ========================================================================= */}
        {adminTab === 'products' && (
          <div className="space-y-6">
            {/* Sub-header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#FAF7F2]/10">
              <div>
                <h2 className="font-serif text-3xl text-[#FAF7F2] font-normal">
                  Saree Catalog &amp; Loom Inventory
                </h2>
                <p className="text-xs text-[#ECE5DC]/60 font-mono tracking-wider mt-1">
                  MANAGE HIGH-FASHION PIECES, PRICES, DESCRIPTIONS &amp; BADGES
                </p>
              </div>

              <button
                onClick={handleOpenAddForm}
                className="self-start md:self-auto px-5 py-2.5 bg-[#541123] hover:bg-[#781830] text-[#FAF7F2] text-xs uppercase font-mono tracking-wider font-semibold rounded-full border border-[#8C1D3B]/60 flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4 text-[#C5A880]" />
                <span>Add New Saree</span>
              </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="p-4 rounded-2xl bg-[#141111] border border-[#FAF7F2]/10 flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-[#C5A880] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, SKU, weave..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1C1818] border border-[#FAF7F2]/10 rounded-xl pl-9 pr-4 py-2 text-xs text-[#FAF7F2] placeholder-[#ECE5DC]/40 outline-none focus:border-[#C5A880]"
                />
              </div>

              {/* Category filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
                {['All', 'Kanjivaram', 'Banarasi', 'Paithani', 'Organza', 'Net', 'Chiffon'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#541123] text-[#FAF7F2] font-semibold border border-[#8C1D3B]/50'
                        : 'text-[#ECE5DC]/60 hover:text-white hover:bg-[#1E1B1B]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Table */}
            <div className="rounded-2xl bg-[#141111] border border-[#FAF7F2]/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181414] text-[#C5A880] font-mono uppercase tracking-wider border-b border-[#FAF7F2]/10">
                    <tr>
                      <th className="py-3.5 px-4">Creation</th>
                      <th className="py-3.5 px-4">Category &amp; SKU</th>
                      <th className="py-3.5 px-4">Price (₹)</th>
                      <th className="py-3.5 px-4">Stock</th>
                      <th className="py-3.5 px-4">Badges</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FAF7F2]/5">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-[#191515] transition-colors group">
                        {/* Thumbnail & Name */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.primaryImage}
                              alt={prod.name}
                              className="w-12 h-16 object-cover rounded-lg border border-[#FAF7F2]/10"
                            />
                            <div>
                              <h4 className="font-serif text-sm text-[#FAF7F2] font-medium leading-snug">
                                {prod.name}
                              </h4>
                              <span className="text-[10px] text-[#C5A880] font-mono">
                                {prod.mood}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category & SKU */}
                        <td className="py-3.5 px-4 font-mono">
                          <div className="text-[#ECE5DC] font-medium">{prod.category}</div>
                          <div className="text-[10px] text-[#ECE5DC]/50">{prod.sku || 'DF-STD-001'}</div>
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-4 font-mono tabular-nums">
                          <div className="text-[#FAF7F2] font-semibold">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </div>
                          {prod.originalPrice && (
                            <div className="text-[10px] text-[#ECE5DC]/40 line-through">
                              ₹{prod.originalPrice.toLocaleString('en-IN')}
                            </div>
                          )}
                        </td>

                        {/* Stock */}
                        <td className="py-3.5 px-4 font-mono">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] ${
                              prod.stock > 5
                                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                                : prod.stock > 0
                                ? 'bg-amber-950/40 text-amber-400 border border-amber-800/40'
                                : 'bg-red-950/40 text-red-400 border border-red-800/40'
                            }`}
                          >
                            {prod.stock > 0 ? `${prod.stock} in atelier` : 'Sold out'}
                          </span>
                        </td>

                        {/* Badges / Toggles */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleBestseller(prod.id)}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider transition-colors ${
                                prod.isBestseller
                                  ? 'bg-[#C5A880] text-[#0F0D0D] font-bold'
                                  : 'bg-[#1C1818] text-[#ECE5DC]/40 hover:text-white'
                              }`}
                            >
                              BESTSELLER
                            </button>
                            <button
                              onClick={() => toggleNewDrop(prod.id)}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider transition-colors ${
                                prod.isNew
                                  ? 'bg-[#541123] text-[#FAF7F2] font-semibold border border-[#8C1D3B]/40'
                                  : 'bg-[#1C1818] text-[#ECE5DC]/40 hover:text-white'
                              }`}
                            >
                              NEW
                            </button>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedProduct(prod)}
                              className="p-1.5 rounded-lg bg-[#1C1818] hover:bg-[#252020] text-[#ECE5DC]/70 hover:text-[#C5A880]"
                              title="View in Customer Modal"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditForm(prod)}
                              className="p-1.5 rounded-lg bg-[#1C1818] hover:bg-[#252020] text-[#ECE5DC]/70 hover:text-white"
                              title="Edit Saree Details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteProduct(prod.id)}
                              className="p-1.5 rounded-lg bg-[#1C1818] hover:bg-[#3D141E] text-[#ECE5DC]/70 hover:text-red-400"
                              title="Delete from Catalog"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: BRIDAL ORDERS & ATELIER DISPATCH
           ========================================================================= */}
        {adminTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#FAF7F2]/10">
              <div>
                <h2 className="font-serif text-3xl text-[#FAF7F2] font-normal">
                  Bridal Orders &amp; Velvet Box Dispatch
                </h2>
                <p className="text-xs text-[#ECE5DC]/60 font-mono tracking-wider mt-1">
                  UPDATE WEAVING STATUS, FALL &amp; PICO FINISH, AND COURIER TRACKING
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[#C5A880]">
                <Clock className="w-4 h-4" />
                <span>{orders.length} active orders pending fulfillment</span>
              </div>
            </div>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-6 rounded-2xl bg-[#141111] border border-[#FAF7F2]/10 shadow-lg space-y-4"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#FAF7F2]/5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-[#C5A880] bg-[#1F1919] px-3 py-1 rounded-md border border-[#FAF7F2]/10">
                        {ord.orderNumber}
                      </span>
                      <span className="text-xs text-[#ECE5DC]/50 font-mono">{ord.date}</span>
                    </div>

                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#ECE5DC]/50 font-mono uppercase">Status:</span>
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className={`text-xs font-mono px-3 py-1.5 rounded-lg border outline-none font-semibold ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : ord.status === 'Velvet Dispatched'
                            ? 'bg-[#541123] text-[#FAF7F2] border-[#8C1D3B]'
                            : 'bg-[#1C1818] text-[#C5A880] border-[#C5A880]/30'
                        }`}
                      >
                        <option value="Atelier Allocated">Atelier Allocated</option>
                        <option value="On Handloom">On Handloom</option>
                        <option value="Zari Hallmarked">Zari Hallmarked</option>
                        <option value="Fall & Pico Done">Fall &amp; Pico Done</option>
                        <option value="Velvet Dispatched">Velvet Dispatched</option>
                        <option value="Delivered">Delivered &amp; Draped</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer and Items Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Customer Information */}
                    <div className="md:col-span-4 space-y-1.5 text-xs">
                      <div className="text-[10px] text-[#C5A880] font-mono uppercase tracking-wider">
                        Client Details
                      </div>
                      <div className="font-serif text-base text-[#FAF7F2] font-medium">
                        {ord.customerName}
                      </div>
                      <div className="text-[#ECE5DC]/70">{ord.customerPhone}</div>
                      <div className="text-[#ECE5DC]/60">{ord.address}, {ord.city}</div>
                      <div className="text-[10px] font-mono text-[#C5A880] pt-1">
                        Paid via: {ord.paymentMethod}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="md:col-span-5 space-y-2">
                      <div className="text-[10px] text-[#C5A880] font-mono uppercase tracking-wider">
                        Ordered Creations
                      </div>
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-10 h-14 object-cover rounded-md border border-[#FAF7F2]/10"
                          />
                          <div>
                            <h5 className="font-serif text-sm text-[#FAF7F2] font-medium leading-tight">
                              {item.productName}
                            </h5>
                            <span className="text-[11px] text-[#ECE5DC]/60 font-mono">
                              Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Amount & Notes */}
                    <div className="md:col-span-3 flex flex-col justify-between text-right">
                      <div>
                        <div className="text-[10px] text-[#ECE5DC]/50 font-mono uppercase">
                          Total Amount
                        </div>
                        <div className="font-serif text-2xl text-[#C5A880] font-bold font-mono">
                          ₹{ord.totalAmount.toLocaleString('en-IN')}
                        </div>
                      </div>

                      {ord.notes && (
                        <div className="mt-3 p-2 rounded-lg bg-[#181414] text-[11px] text-[#ECE5DC]/70 text-left font-light border border-[#FAF7F2]/5">
                          <strong className="text-[#C5A880]">Atelier Note:</strong> {ord.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          ADD / EDIT SAREE MODAL
         ========================================================================= */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[150] overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="fixed inset-0" onClick={() => setIsFormOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-2xl bg-[#141212] border border-[#FAF7F2]/15 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto overscroll-contain"
              style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#FAF7F2]/10 mb-6">
                <div>
                  <h3 className="font-serif text-2xl text-[#FAF7F2]">
                    {editingProduct ? 'Edit Saree Masterpiece' : 'Add New Saree to Atelier'}
                  </h3>
                  <span className="text-xs text-[#C5A880] font-mono tracking-wider uppercase">
                    HAUTE COUTURE SPECIFICATIONS
                  </span>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 text-[#ECE5DC]/60 hover:text-white rounded-full hover:bg-[#1E1B1B]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                {/* Name */}
                <div>
                  <label className="block uppercase tracking-wider text-[#ECE5DC]/70 mb-1 font-mono">
                    Saree Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maharani Paithani Royal Peacock"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#1A1616] border border-[#FAF7F2]/10 rounded-xl px-4 py-2.5 text-sm text-[#FAF7F2] outline-none focus:border-[#C5A880]"
                  />
                </div>

                {/* Category & Mood */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider text-[#ECE5DC]/70 mb-1 font-mono">
                      Weave Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full bg-[#1A1616] border border-[#FAF7F2]/10 rounded-xl px-3 py-2.5 text-xs text-[#FAF7F2] outline-none focus:border-[#C5A880]"
                    >
                      <option value="Kanjivaram">Kanjivaram</option>
                      <option value="Banarasi">Banarasi</option>
                      <option value="Paithani">Paithani</option>
                      <option value="Organza">Organza</option>
                      <option value="Net">Net</option>
                      <option value="Chiffon">Chiffon</option>
                    </select>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[#ECE5DC]/70 mb-1 font-mono">
                      Curated Mood *
                    </label>
                    <select
                      value={formData.mood}
                      onChange={(e) => setFormData({ ...formData, mood: e.target.value as any })}
                      className="w-full bg-[#1A1616] border border-[#FAF7F2]/10 rounded-xl px-3 py-2.5 text-xs text-[#FAF7F2] outline-none focus:border-[#C5A880]"
                    >
                      <option value="Wedding Edit">Wedding Edit</option>
                      <option value="Kanchipuram Icons">Kanchipuram Icons</option>
                      <option value="Banarasi Heirlooms">Banarasi Heirlooms</option>
                      <option value="Festive Radiance">Festive Radiance</option>
                      <option value="Zari Signatures">Zari Signatures</option>
                      <option value="Bridal Glam">Bridal Glam</option>
                    </select>
                  </div>
                </div>

                {/* Price, Original Price, Stock */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider text-[#ECE5DC]/70 mb-1 font-mono">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price || 0}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full bg-[#1A1616] border border-[#FAF7F2]/10 rounded-xl px-3.5 py-2.5 text-xs text-[#FAF7F2] font-mono outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[#ECE5DC]/70 mb-1 font-mono">
                      Original Price (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.originalPrice || 0}
                      onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                      className="w-full bg-[#1A1616] border border-[#FAF7F2]/10 rounded-xl px-3.5 py-2.5 text-xs text-[#FAF7F2] font-mono outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[#ECE5DC]/70 mb-1 font-mono">
                      Atelier Stock
                    </label>
                    <input
                      type="number"
                      value={formData.stock || 0}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full bg-[#1A1616] border border-[#FAF7F2]/10 rounded-xl px-3.5 py-2.5 text-xs text-[#FAF7F2] font-mono outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                {/* Image Selection presets */}
                <div>
                  <label className="block uppercase tracking-wider text-[#ECE5DC]/70 mb-1.5 font-mono">
                    Select High-Fashion Editorial Imagery
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {PRESET_IMAGES.map((img) => (
                      <button
                        type="button"
                        key={img.label}
                        onClick={() => setFormData({ ...formData, primaryImage: img.url })}
                        className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${
                          formData.primaryImage === img.url
                            ? 'border-[#C5A880] ring-2 ring-[#C5A880]/40 scale-105'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[8px] text-white p-0.5 text-center font-mono">
                          {img.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block uppercase tracking-wider text-[#ECE5DC]/70 mb-1 font-mono">
                    Editorial Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#1A1616] border border-[#FAF7F2]/10 rounded-xl p-3 text-xs text-[#FAF7F2] outline-none focus:border-[#C5A880]"
                  />
                </div>

                {/* Badges Checkboxes */}
                <div className="flex items-center gap-6 pt-2 font-mono">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNew || false}
                      onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                      className="accent-[#8C1D3B]"
                    />
                    <span>New Drop</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isBestseller || false}
                      onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                      className="accent-[#C5A880]"
                    />
                    <span>Bestseller</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isExclusive || false}
                      onChange={(e) => setFormData({ ...formData, isExclusive: e.target.checked })}
                      className="accent-[#8C1D3B]"
                    />
                    <span>Atelier Exclusive</span>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-6 border-t border-[#FAF7F2]/10">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-6 py-2.5 rounded-full bg-[#1C1818] hover:bg-[#252020] text-xs font-mono uppercase tracking-wider text-[#ECE5DC]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-[#541123] to-[#781830] hover:from-[#69152C] hover:to-[#8C1D3B] text-xs font-mono uppercase tracking-[0.2em] font-semibold text-[#FAF7F2] rounded-full shadow-lg"
                  >
                    {editingProduct ? 'Save Saree Changes' : 'Publish to Live Showcase'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
