-- ============================================================
--  Sakthi Bakers - MySQL Seed Script
--  Run this in phpMyAdmin or via: mysql -u root < seed.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS sakthi_bakers CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sakthi_bakers;

-- -------------------- PRODUCTS ----------------------------
CREATE TABLE IF NOT EXISTS products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  category    VARCHAR(100) NOT NULL,
  price       INT          NOT NULL,
  image       TEXT         NOT NULL,
  description TEXT         NOT NULL,
  featured    TINYINT(1)   NOT NULL DEFAULT 0,
  badge       VARCHAR(100)          DEFAULT ''
);

-- -------------------- CATEGORIES --------------------------
CREATE TABLE IF NOT EXISTS categories (
  id   VARCHAR(50)  PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50)  NOT NULL
);

-- -------------------- TESTIMONIALS ------------------------
CREATE TABLE IF NOT EXISTS testimonials (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  author  VARCHAR(255) NOT NULL,
  role    VARCHAR(255) NOT NULL,
  content TEXT         NOT NULL,
  rating  INT          NOT NULL DEFAULT 5,
  image   TEXT         NOT NULL
);

-- -------------------- TEAM --------------------------------
CREATE TABLE IF NOT EXISTS team (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  name  VARCHAR(255) NOT NULL,
  role  VARCHAR(255) NOT NULL,
  bio   TEXT         NOT NULL,
  image TEXT         NOT NULL
);

-- -------------------- SPECIAL OFFERS ----------------------
CREATE TABLE IF NOT EXISTS special_offers (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description TEXT         NOT NULL,
  discount    VARCHAR(50)  NOT NULL,
  valid_till  VARCHAR(100) NOT NULL,
  image       TEXT         NOT NULL
);

-- -------------------- GIFT CARDS --------------------------
CREATE TABLE IF NOT EXISTS gift_cards (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  amount      INT          NOT NULL,
  description TEXT         NOT NULL
);

-- -------------------- ORDERS ------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id                 INT AUTO_INCREMENT PRIMARY KEY,
  order_id           VARCHAR(50)  NOT NULL UNIQUE,
  status             VARCHAR(50)  NOT NULL DEFAULT 'confirmed',
  total_amount       INT          NOT NULL,
  order_date         VARCHAR(100) NOT NULL,
  estimated_delivery VARCHAR(100) NOT NULL,
  customer_name      VARCHAR(255) NOT NULL,
  phone              VARCHAR(50)           DEFAULT '',
  address            TEXT                  DEFAULT '',
  note               TEXT                  DEFAULT ''
);

-- -------------------- ORDER ITEMS -------------------------
CREATE TABLE IF NOT EXISTS order_items (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  order_id  VARCHAR(50)  NOT NULL,
  item_text VARCHAR(255) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- -------------------- NEWSLETTER --------------------------
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  subscribed_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -------------------- CONTACT REQUESTS -------------------
CREATE TABLE IF NOT EXISTS contact_requests (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id   VARCHAR(50)  NOT NULL UNIQUE,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  subject     VARCHAR(255) NOT NULL,
  message     TEXT         NOT NULL,
  received_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
--  SEED DATA
-- ============================================================

-- Products
INSERT IGNORE INTO products (id, name, category, price, image, description, featured, badge) VALUES
(1,  'Artisan Sourdough',         'breads',   580,  'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop', 'Handcrafted sourdough with a crispy crust and tangy flavor, made with our 15-year-old starter.', 1, 'Bestseller'),
(2,  'Chocolate Croissant',       'pastries', 375,  'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=600&h=600&fit=crop', 'Buttery croissant filled with dark chocolate, perfect for your morning.', 1, ''),
(3,  'Blueberry Muffin',          'muffins',  330,  'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600&h=600&fit=crop', 'Fresh blueberries baked into a fluffy muffin with a crispy top.', 0, ''),
(4,  'Butter Croissant',          'pastries', 290,  'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=600&fit=crop', 'Classic French croissant with 100 layers of buttery perfection.', 1, ''),
(5,  'Whole Wheat Bread',         'breads',   499,  'https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=600&h=600&fit=crop', 'Nutritious whole wheat bread with seeds, baked fresh daily.', 0, 'Healthy'),
(6,  'Lemon Poppy Cake',          'cakes',    2099, 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&h=600&fit=crop', 'Zesty lemon cake with poppy seeds, perfect for celebrations.', 1, ''),
(7,  'Almond Biscotti',           'cookies',  665,  'https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=600&h=600&fit=crop', 'Twice-baked Italian biscotti with roasted almonds, perfect with coffee.', 0, ''),
(8,  'Strawberry Tart',           'pastries', 1079, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=600&fit=crop', 'Fresh strawberries on a delicate pastry cream and shortbread base.', 1, 'Popular'),
(9,  'Cinnamon Roll',             'pastries', 415,  'https://images.unsplash.com/photo-1509365390695-33aee754301f?w=600&h=600&fit=crop', 'Warm cinnamon roll with cream cheese frosting, a morning favorite.', 1, ''),
(10, 'Rye Bread',                 'breads',   540,  'https://images.unsplash.com/photo-1586444248879-bc604cbd555a?w=600&h=600&fit=crop', 'Dense and flavorful rye bread, great for sandwiches.', 0, ''),
(11, 'Macaron Box',               'cookies',  1249, 'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=600&h=600&fit=crop', 'Assorted French macarons in seasonal flavors - box of 12.', 0, 'Gift Pick'),
(12, 'Chocolate Cake',            'cakes',    2749, 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&h=600&fit=crop', 'Rich chocolate layer cake with dark chocolate ganache.', 1, 'Bestseller'),
(13, 'Veg Puff',                  'puffs',    45,   'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=600&h=600&fit=crop', 'Flaky golden puff pastry stuffed with spiced potato and peas - a classic Indian snack.', 1, 'Bestseller'),
(14, 'Egg Puff',                  'puffs',    55,   'https://images.unsplash.com/photo-1632203171982-cc0df6e9ceb4?w=600&h=600&fit=crop', 'Crispy puff pastry enclosing a boiled egg in a masala potato filling.', 1, 'Popular'),
(15, 'Chicken Puff',              'puffs',    70,   'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&h=600&fit=crop', 'Tender shredded chicken in a mildly spiced gravy wrapped in puff pastry.', 0, ''),
(16, 'Paneer Puff',               'puffs',    60,   'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&h=600&fit=crop', 'Soft paneer cubes in a lightly spiced filling inside buttery puff layers.', 0, 'New'),
(17, 'Chocolate Glazed Donut',    'donuts',   120,  'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=600&fit=crop', 'Soft ring donut dipped in rich dark chocolate glaze with sprinkles.', 1, 'Popular'),
(18, 'Strawberry Frosted Donut',  'donuts',   130,  'https://images.unsplash.com/photo-1533910534207-90f31029a78e?w=600&h=600&fit=crop', 'Fluffy donut with strawberry cream frosting and rainbow sprinkles.', 0, ''),
(19, 'Classic Glazed Donut',      'donuts',   90,   'https://images.unsplash.com/photo-1514517220017-8ce97a34a7e1?w=600&h=600&fit=crop', 'Light, airy yeast donut with a sweet sugar glaze - timeless comfort.', 0, ''),
(20, 'Gulab Jamun',               'sweets',   250,  'https://images.unsplash.com/photo-1666190020536-e2a5fddcab7d?w=600&h=600&fit=crop', 'Soft, melt-in-your-mouth dumplings soaked in rose-flavored sugar syrup - box of 12.', 1, 'Favourite'),
(21, 'Mysore Pak',                'sweets',   350,  'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=600&h=600&fit=crop', 'Rich, ghee-laden gram flour sweet with a melt-in-mouth texture - 250g box.', 0, 'Traditional'),
(22, 'Jalebi',                    'sweets',   180,  'https://images.unsplash.com/photo-1601303516403-36bb662e1e4e?w=600&h=600&fit=crop', 'Crispy golden spirals soaked in saffron sugar syrup, best served warm.', 1, ''),
(23, 'Red Velvet Cake',           'cakes',    2999, 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=600&h=600&fit=crop', 'Velvety red layers with cream cheese frosting - a celebration showstopper.', 1, 'Premium'),
(24, 'Black Forest Cake',         'cakes',    2599, 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&h=600&fit=crop', 'Layers of chocolate sponge, whipped cream, and cherries - a timeless classic.', 0, '');

-- Categories
INSERT IGNORE INTO categories (id, name, icon) VALUES
('all',      'All Products', 'cart'),
('puffs',    'Puffs',        'puffs'),
('breads',   'Breads',       'bread'),
('pastries', 'Pastries',     'pastry'),
('cakes',    'Cakes',        'cake'),
('donuts',   'Donuts',       'donut'),
('sweets',   'Sweets',       'sweet'),
('muffins',  'Muffins',      'muffin'),
('cookies',  'Cookies',      'cookie');

-- Testimonials
INSERT IGNORE INTO testimonials (id, author, role, content, rating, image) VALUES
(1, 'Priya Kumar',   'Regular Customer',  'Sakthi Bakers makes the best bread in town! Fresh every morning, always perfect.',                       5, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face'),
(2, 'Rajesh Patel',  'Weekly Customer',   'Their cakes are amazing for every occasion. Quality and taste are unmatched!',                            5, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'),
(3, 'Anjali Singh',  'Event Organizer',   'Sakthi Bakers catered our wedding with beautiful custom pastries. Highly professional!',                  5, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face'),
(4, 'Vikram Reddy',  'Community Member',  'Supporting local excellence. Sakthi Bakers is a gem in our neighborhood!',                               5, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face');

-- Team
INSERT IGNORE INTO team (id, name, role, bio, image) VALUES
(1, 'Sakthi Kumar', 'Founder & Head Baker',      '25+ years of baking excellence, passion for traditional recipes', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop'),
(2, 'Meera Sakthi', 'Pastry Chef',               'Specializes in traditional sweets and modern pastries',           'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop'),
(3, 'Arjun Singh',  'Cake & Dessert Designer',   'Creates stunning custom cakes for all your special moments',      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop');

-- Special Offers
INSERT IGNORE INTO special_offers (id, title, description, discount, valid_till, image) VALUES
(1, 'Sunday Special',  'Buy 2, Get 1 Free on selected pastries',              '50% OFF',  'Every Sunday',       'https://images.unsplash.com/photo-1558636508-e0db3814a69e?w=400&h=220&fit=crop'),
(2, 'Birthday Month',  '10% off on all cakes ordered in your birthday month', '10% OFF',  'Year Round',         'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=220&fit=crop'),
(3, 'Bulk Orders',     'Special pricing for orders above 5kg',                'CUSTOM',   'Always Available',   'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=220&fit=crop');

-- Gift Cards
INSERT IGNORE INTO gift_cards (id, name, amount, description) VALUES
(1, 'Sweet Starter',  2000, 'Perfect for trying our signature items'),
(2, 'Baker''s Choice', 4000, 'Great for gifting fresh bread and pastries weekly'),
(3, 'Premium Gift',   8000, 'Ideal for special occasions and celebrations');

-- Demo Orders
INSERT IGNORE INTO orders (order_id, status, total_amount, order_date, estimated_delivery, customer_name, phone, address, note) VALUES
('SB-2026-0001', 'baking',            3289, 'March 9, 2026', 'March 9, 2026 4:00 PM',   'Priya Kumar',  '', '', ''),
('SB-2026-0002', 'out-for-delivery',  1410, 'March 8, 2026', 'March 9, 2026 11:30 AM',  'Rajesh Patel', '', '', ''),
('SB-2026-0003', 'delivered',         6338, 'March 7, 2026', 'March 8, 2026 2:00 PM',   'Anjali Singh', '', '', '');

INSERT IGNORE INTO order_items (order_id, item_text) VALUES
('SB-2026-0001', 'Red Velvet Cake (1kg)'),
('SB-2026-0001', 'Veg Puff x4'),
('SB-2026-0001', 'Chocolate Glazed Donut x2'),
('SB-2026-0002', 'Artisan Sourdough x2'),
('SB-2026-0002', 'Gulab Jamun Box'),
('SB-2026-0003', 'Black Forest Cake (1kg)'),
('SB-2026-0003', 'Macaron Box'),
('SB-2026-0003', 'Cinnamon Roll x6');
