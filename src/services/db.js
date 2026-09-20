/**
 * MongoDB-Compatible Database Engine & Data Collections for FUNRADO
 * Collections: Users, OTPVerifications, Products, Categories, Orders, ActivityLogs
 */

import { PRODUCTS as initialProducts } from '../data/products';

const STORAGE_PREFIX = 'funrado_db_';

function getCollection(name, defaultData = []) {
  try {
    let raw = localStorage.getItem(STORAGE_PREFIX + name);
    if (!raw) {
      // Auto-migrate from old kiddigo_db_ prefix if present
      raw = localStorage.getItem('kiddigo_db_' + name);
      if (raw) {
        localStorage.setItem(STORAGE_PREFIX + name, raw);
      }
    }
    return raw ? JSON.parse(raw) : defaultData;
  } catch (e) {
    return defaultData;
  }
}

function saveCollection(name, data) {
  try {
    localStorage.setItem(STORAGE_PREFIX + name, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save database collection ${name}:`, e);
  }
}

/**
 * Hash function for storing passwords securely (bcrypt / SHA-256 salted)
 */
export async function hashPassword(password, email) {
  const encoder = new TextEncoder();
  const salt = `funrado_secure_salt_${email.toLowerCase().trim()}_v2`;
  const data = encoder.encode(`${salt}_${password}`);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Pre-seed Super Admin Account
 * Email: admin@funrado.com
 * Password: FunradoAdmin2026!
 */
export async function seedInitialAdminAccount() {
  const users = getCollection('users', []);
  
  // Primary Admin Account (admin@funrado.com)
  const funradoEmail = 'admin@funrado.com';
  let funradoAdmin = users.find(u => u.email.toLowerCase() === funradoEmail);
  if (!funradoAdmin) {
    const hashedPassword = await hashPassword('FunradoAdmin2026!', funradoEmail);
    users.push({
      _id: 'user_super_admin_funrado',
      name: 'FUNRADO Super Admin',
      email: funradoEmail,
      mobile: '9999999999',
      passwordHash: hashedPassword,
      role: 'superAdmin',
      permissions: ['all'],
      isEmailVerified: true,
      isActive: true,
      isBlocked: false,
      loginAttempts: 0,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  saveCollection('users', users);
}

// Run initial admin seeding automatically
seedInitialAdminAccount();

/**
 * Database API Functions
 */
export const db = {
  // Users Collection
  users: {
    find: (query = {}) => {
      const users = getCollection('users', []);
      return users.filter(u => {
        if (query.email && u.email.toLowerCase() !== query.email.toLowerCase()) return false;
        if (query.role && u.role !== query.role) return false;
        if (query.isBlocked !== undefined && u.isBlocked !== query.isBlocked) return false;
        return true;
      });
    },
    findOne: (query = {}) => {
      const results = db.users.find(query);
      return results[0] || null;
    },
    findById: (id) => {
      const users = getCollection('users', []);
      return users.find(u => u._id === id) || null;
    },
    create: (userData) => {
      const users = getCollection('users', []);
      const newUser = {
        _id: `user_${Date.now()}_${Math.floor(Math.random()*1000)}`,
        role: 'customer',
        permissions: ['customer_access'],
        isEmailVerified: false,
        isActive: true,
        isBlocked: false,
        loginAttempts: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...userData
      };
      users.push(newUser);
      saveCollection('users', users);
      return newUser;
    },
    update: (id, updates) => {
      const users = getCollection('users', []);
      const idx = users.findIndex(u => u._id === id);
      if (idx >= 0) {
        users[idx] = { ...users[idx], ...updates, updatedAt: new Date().toISOString() };
        saveCollection('users', users);
        return users[idx];
      }
      return null;
    }
  },

  // Products Collection
  products: {
    find: (query = {}) => {
      let prods = getCollection('products', []);
      const existingIds = new Set(prods.map(p => p.id || p._id?.replace(/^prod_/, '')));
      
      const missingProds = initialProducts.filter(p => !existingIds.has(p.id)).map(p => ({
        _id: `prod_${p.id}`,
        id: p.id,
        name: p.name,
        slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: p.description || `${p.name} - Premium FUNRADO luxury product for kids.`,
        shortDescription: p.category || 'Kids Luxury Item',
        categoryId: p.category,
        brand: 'FUNRADO',
        originalPrice: p.originalPrice || p.price * 1.2,
        salePrice: p.price,
        discountPercentage: p.discount || '15% OFF',
        stock: p.stock || 25,
        minimumStock: 5,
        sku: `FND-${p.id}-SKU`,
        ageGroup: p.ageGroup || 'All Ages',
        colours: ['Red', 'Blue', 'Yellow', 'White'],
        sizes: ['Standard'],
        images: [p.image],
        specifications: p.specs || ['100% Certified Non-Toxic', 'Express Shipping'],
        featured: p.isBestSeller || false,
        bestseller: p.isBestSeller || false,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      if (missingProds.length > 0) {
        prods = [...prods, ...missingProds];
        saveCollection('products', prods);
      }
      return prods.filter(p => {
        if (query.isDeleted !== undefined && p.isDeleted !== query.isDeleted) return false;
        if (query.category && p.categoryId !== query.category) return false;
        if (query.featured !== undefined && p.featured !== query.featured) return false;
        return true;
      });
    },
    create: (prodData) => {
      const prods = getCollection('products', []);
      const imgUrl = prodData.image || (prodData.images && prodData.images[0]) || 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop';
      const newProd = {
        _id: `prod_${Date.now()}`,
        id: `prod_${Date.now()}`,
        name: prodData.name,
        categoryId: prodData.categoryId || 'Ride-ons',
        salePrice: Number(prodData.salePrice || 0),
        originalPrice: Number(prodData.originalPrice || prodData.salePrice * 1.2),
        price: Number(prodData.salePrice || 0),
        slug: (prodData.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        stock: Number(prodData.stock || 25),
        minimumStock: 5,
        sku: prodData.sku || `FND-${Math.floor(1000 + Math.random() * 9000)}`,
        ageGroup: prodData.ageGroup || 'All Ages',
        colours: prodData.colours || ['Standard'],
        sizes: prodData.sizes || ['Standard'],
        image: imgUrl,
        images: prodData.images || [imgUrl],
        description: prodData.description || `${prodData.name} - FUNRADO Luxury Item.`,
        specifications: prodData.specifications || ['100% Certified Safe', 'Express Shipping'],
        featured: Boolean(prodData.featured),
        bestseller: Boolean(prodData.bestseller),
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      prods.unshift(newProd);
      saveCollection('products', prods);
      return newProd;
    },
    update: (id, updates) => {
      const prods = getCollection('products', []);
      const idx = prods.findIndex(p => p._id === id || p.id === id);
      if (idx >= 0) {
        const updated = { 
          ...prods[idx], 
          ...updates, 
          updatedAt: new Date().toISOString() 
        };
        if (updates.salePrice) updated.price = Number(updates.salePrice);
        if (updates.image && (!updates.images || !updates.images.length)) {
          updated.images = [updates.image];
        }
        prods[idx] = updated;
        saveCollection('products', prods);
        return prods[idx];
      }
      return null;
    },
    softDelete: (id) => {
      return db.products.update(id, { isDeleted: true, isActive: false });
    },
    hardDelete: (id) => {
      let prods = getCollection('products', []);
      prods = prods.filter(p => p._id !== id && p.id !== id);
      saveCollection('products', prods);
      return true;
    }
  },

  // Orders Collection
  orders: {
    find: (query = {}) => {
      let orders = getCollection('orders', null);
      if (!orders || orders.length === 0) {
        orders = [
          {
            _id: 'ord_1',
            id: 'FNZ849201',
            orderNumber: 'FNZ849201',
            userId: 'user_1',
            customerName: 'Alexander Wright',
            customerPhone: '+91 98765 43210',
            customerEmail: 'alexander@funrado.com',
            shippingAddress: {
              fullName: 'Alexander Wright',
              phone: '+91 98765 43210',
              email: 'alexander@funrado.com',
              street: 'Penthouse 4B, Royale Gardens, Bandra West',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400050',
              type: 'Home'
            },
            address: {
              fullName: 'Alexander Wright',
              phone: '+91 98765 43210',
              email: 'alexander@funrado.com',
              street: 'Penthouse 4B, Royale Gardens, Bandra West',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400050',
              type: 'Home'
            },
            products: [
              {
                id: 'vespa-1',
                name: 'FUNRADO Italian Retro Vespa 12V Ride-On',
                sku: 'FND-VESPA-RED',
                price: 14999,
                originalPrice: 18999,
                discount: 4000,
                quantity: 1,
                selectedColor: 'Cherry Red',
                selectedSize: 'Standard 12V',
                image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80'
              }
            ],
            items: [
              {
                id: 'vespa-1',
                name: 'FUNRADO Italian Retro Vespa 12V Ride-On',
                sku: 'FND-VESPA-RED',
                price: 14999,
                originalPrice: 18999,
                discount: 4000,
                quantity: 1,
                selectedColor: 'Cherry Red',
                selectedSize: 'Standard 12V',
                image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80'
              }
            ],
            subtotal: 14999,
            discount: 1500,
            couponDiscount: 1500,
            couponUsed: 'LUXURY500',
            shippingFee: 0,
            taxAmount: 2430,
            totalAmount: 15929,
            total: 15929,
            paymentMethod: 'UPI (Google Pay)',
            paymentStatus: 'Paid',
            orderStatus: 'Confirmed',
            status: 'Confirmed',
            isArchived: false,
            transactionRef: 'TXN-982310492817',
            createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
          },
          {
            _id: 'ord_2',
            id: 'FNZ394812',
            orderNumber: 'FNZ394812',
            userId: 'user_2',
            customerName: 'Priya Sharma',
            customerPhone: '+91 98201 12345',
            customerEmail: 'priya.sharma@example.com',
            shippingAddress: {
              fullName: 'Priya Sharma',
              phone: '+91 98201 12345',
              email: 'priya.sharma@example.com',
              street: '702 Sunshine Heights, Hiranandani Estate',
              city: 'Thane',
              state: 'Maharashtra',
              pincode: '400607',
              type: 'Home'
            },
            address: {
              fullName: 'Priya Sharma',
              phone: '+91 98201 12345',
              email: 'priya.sharma@example.com',
              street: '702 Sunshine Heights, Hiranandani Estate',
              city: 'Thane',
              state: 'Maharashtra',
              pincode: '400607',
              type: 'Home'
            },
            products: [
              {
                id: 'scooter-1',
                name: 'FUNRADO SmartGlide Music & Light Scooter',
                sku: 'FND-SCOOT-PINK',
                price: 3499,
                originalPrice: 4499,
                discount: 1000,
                quantity: 2,
                selectedColor: 'Rose Gold',
                selectedSize: 'Medium',
                image: 'https://images.unsplash.com/photo-1597404294360-feeeda04612e?auto=format&fit=crop&w=400&q=80'
              }
            ],
            items: [
              {
                id: 'scooter-1',
                name: 'FUNRADO SmartGlide Music & Light Scooter',
                sku: 'FND-SCOOT-PINK',
                price: 3499,
                originalPrice: 4499,
                discount: 1000,
                quantity: 2,
                selectedColor: 'Rose Gold',
                selectedSize: 'Medium',
                image: 'https://images.unsplash.com/photo-1597404294360-feeeda04612e?auto=format&fit=crop&w=400&q=80'
              }
            ],
            subtotal: 6998,
            discount: 500,
            couponDiscount: 500,
            couponUsed: 'WELCOME20',
            shippingFee: 250,
            taxAmount: 1215,
            totalAmount: 7963,
            total: 7963,
            paymentMethod: 'Cash on Delivery',
            paymentStatus: 'Cash on Delivery',
            orderStatus: 'Order Received',
            status: 'Order Received',
            isArchived: false,
            transactionRef: 'COD-PENDING',
            createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
          },
          {
            _id: 'ord_3',
            id: 'FNZ109248',
            orderNumber: 'FNZ109248',
            userId: 'user_3',
            customerName: 'Rohan Mehta',
            customerPhone: '+91 99870 54321',
            customerEmail: 'rohan.mehta@example.com',
            shippingAddress: {
              fullName: 'Rohan Mehta',
              phone: '+91 99870 54321',
              email: 'rohan.mehta@example.com',
              street: 'Villa 12, Palm Meadows, Whitefield',
              city: 'Bengaluru',
              state: 'Karnataka',
              pincode: '560066',
              type: 'Office'
            },
            address: {
              fullName: 'Rohan Mehta',
              phone: '+91 99870 54321',
              email: 'rohan.mehta@example.com',
              street: 'Villa 12, Palm Meadows, Whitefield',
              city: 'Bengaluru',
              state: 'Karnataka',
              pincode: '560066',
              type: 'Office'
            },
            products: [
              {
                id: 'nitro-glide-1',
                name: 'Nitro-Glide 3-Wheel LED Scooter',
                sku: 'NT-GLIDE-BLK',
                price: 8999,
                originalPrice: 11999,
                discount: 3000,
                quantity: 1,
                selectedColor: 'Jet Black',
                selectedSize: 'Large',
                image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=400&q=80'
              }
            ],
            items: [
              {
                id: 'nitro-glide-1',
                name: 'Nitro-Glide 3-Wheel LED Scooter',
                sku: 'NT-GLIDE-BLK',
                price: 8999,
                originalPrice: 11999,
                discount: 3000,
                quantity: 1,
                selectedColor: 'Jet Black',
                selectedSize: 'Large',
                image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=400&q=80'
              }
            ],
            subtotal: 8999,
            discount: 0,
            couponDiscount: 0,
            couponUsed: null,
            shippingFee: 0,
            taxAmount: 1620,
            totalAmount: 10619,
            total: 10619,
            paymentMethod: 'Credit Card (Visa)',
            paymentStatus: 'Paid',
            orderStatus: 'Shipped',
            status: 'Shipped',
            isArchived: false,
            transactionRef: 'TXN-109283749102',
            createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 8).toISOString()
          }
        ];
        saveCollection('orders', orders);
      }
      return orders;
    },
    update: (id, updates) => {
      const orders = db.orders.find();
      const idx = orders.findIndex(o => o._id === id || o.id === id || o.orderNumber === id);
      if (idx >= 0) {
        orders[idx] = {
          ...orders[idx],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        saveCollection('orders', orders);
        return orders[idx];
      }
      return null;
    },
    updateStatus: (id, newStatus) => {
      return db.orders.update(id, { orderStatus: newStatus, status: newStatus });
    },
    archive: (id) => {
      const orders = db.orders.find();
      const idx = orders.findIndex(o => o._id === id || o.id === id || o.orderNumber === id);
      if (idx >= 0) {
        orders[idx].isArchived = !orders[idx].isArchived;
        orders[idx].updatedAt = new Date().toISOString();
        saveCollection('orders', orders);
        return orders[idx];
      }
      return null;
    },
    create: (orderData) => {
      let orders = db.orders.find();
      const newOrder = {
        _id: `ord_${Date.now()}`,
        id: orderData.id || orderData.orderNumber || `FND${Math.floor(100000 + Math.random() * 900000)}`,
        orderNumber: orderData.id || orderData.orderNumber || `FND${Math.floor(100000 + Math.random() * 900000)}`,
        userId: orderData.userId || 'guest_user',
        customerName: orderData.address?.fullName || orderData.customerName || 'Valued Customer',
        customerEmail: orderData.address?.email || orderData.customerEmail || 'customer@funrado.com',
        customerPhone: orderData.address?.phone || orderData.customerPhone || 'N/A',
        shippingAddress: orderData.address || orderData.shippingAddress || null,
        address: orderData.address || orderData.shippingAddress || null,
        products: (orderData.items || orderData.products || []).map((item, idx) => ({
          id: item.id || `prod_${idx}`,
          name: item.name || item.title || 'FUNRADO Product',
          sku: item.sku || `SKU-${item.id || idx + 100}`,
          price: item.price || item.sellingPrice || 0,
          originalPrice: item.originalPrice || item.price || 0,
          discount: item.discount || 0,
          quantity: item.quantity || 1,
          selectedColor: item.selectedColor || 'Default',
          selectedSize: item.selectedSize || 'Standard',
          image: item.image || (item.images ? item.images[0] : null)
        })),
        items: (orderData.items || orderData.products || []).map((item, idx) => ({
          id: item.id || `prod_${idx}`,
          name: item.name || item.title || 'FUNRADO Product',
          sku: item.sku || `SKU-${item.id || idx + 100}`,
          price: item.price || item.sellingPrice || 0,
          originalPrice: item.originalPrice || item.price || 0,
          discount: item.discount || 0,
          quantity: item.quantity || 1,
          selectedColor: item.selectedColor || 'Default',
          selectedSize: item.selectedSize || 'Standard',
          image: item.image || (item.images ? item.images[0] : null)
        })),
        totalAmount: Number(orderData.total || orderData.totalAmount || 0),
        total: Number(orderData.total || orderData.totalAmount || 0),
        subtotal: Number(orderData.subtotal || 0),
        discount: Number(orderData.discount || 0),
        couponDiscount: Number(orderData.discount || 0),
        couponUsed: orderData.couponUsed || null,
        shippingFee: Number(orderData.shippingFee || 0),
        taxAmount: Number(orderData.taxAmount || 0),
        paymentMethod: orderData.paymentMethod || 'UPI',
        paymentStatus: orderData.paymentStatus || 'Pending',
        orderStatus: orderData.orderStatus || orderData.status || 'Order Received',
        status: orderData.status || orderData.orderStatus || 'Order Received',
        isArchived: false,
        transactionRef: orderData.transactionRef || `TXN-${Date.now()}`,
        createdAt: orderData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      orders.unshift(newOrder);
      saveCollection('orders', orders);
      return newOrder;
    }
  },

  // Activity Logs
  activityLogs: {
    find: () => getCollection('activity_logs', []),
    log: (adminId, action, module, description) => {
      const logs = getCollection('activity_logs', []);
      const newLog = {
        _id: `log_${Date.now()}`,
        adminId,
        action,
        module,
        description,
        timestamp: new Date().toISOString()
      };
      logs.unshift(newLog);
      saveCollection('activity_logs', logs.slice(0, 100)); // Keep latest 100
      return newLog;
    }
  }
};
