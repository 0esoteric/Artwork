-- Seed data for Artisan Handmade E-commerce

-- Insert Categories
INSERT INTO categories (name, slug, description, image_url) VALUES
('Paintings', 'paintings', 'Original handpainted artworks from master artisans', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80'),
('Sculptures', 'sculptures', 'Handcrafted sculptures and figurines', 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800&q=80'),
('Textiles', 'textiles', 'Traditional handwoven textiles and fabrics', 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=800&q=80'),
('Pottery', 'pottery', 'Artisanal pottery and ceramics', 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80'),
('Jewelry', 'jewelry', 'Handcrafted traditional jewelry', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'),
('Home Decor', 'home-decor', 'Unique handmade home decor items', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80');

-- Insert sub-categories
INSERT INTO categories (name, slug, description, parent_id) VALUES
('Madhubani', 'madhubani', 'Traditional Madhubani paintings from Bihar', 1),
('Warli', 'warli', 'Tribal Warli art from Maharashtra', 1),
('Gond', 'gond', 'Gond tribal art from Madhya Pradesh', 1),
('Kalamkari', 'kalamkari', 'Ancient Kalamkari paintings', 1),
('Pichwai', 'pichwai', 'Traditional Pichwai paintings from Rajasthan', 1),
('Pattachitra', 'pattachitra', 'Scroll paintings from Odisha', 1),
('Tanjore', 'tanjore', 'Classic South Indian painting style', 1);

-- Insert Artists
INSERT INTO artists (name, slug, bio, location, art_form, is_featured) VALUES
('Ambika Devi', 'ambika-devi', 'A renowned Madhubani artist with over 30 years of experience, known for her intricate patterns and vibrant colors.', 'Bihar, India', 'Madhubani', TRUE),
('Kalyan Joshi', 'kalyan-joshi', 'National Award winning Phad painter, preserving the ancient tradition of scroll painting.', 'Rajasthan, India', 'Phad', TRUE),
('Sandeep Dhurve', 'sandeep-dhurve', 'Master Gond artist known for his detailed wildlife paintings using natural colors.', 'Madhya Pradesh, India', 'Gond', TRUE),
('Dilip Bahotha', 'dilip-bahotha', 'Expert Warli artist keeping the tribal art tradition alive through contemporary themes.', 'Maharashtra, India', 'Warli', TRUE),
('Harinath N', 'harinath-n', 'Kalamkari master artist specializing in mythological narratives and temple art.', 'Andhra Pradesh, India', 'Kalamkari', TRUE),
('Gitanjali Das', 'gitanjali-das', 'Award-winning Pattachitra artist known for her divine feminine art.', 'Odisha, India', 'Pattachitra', TRUE);

-- Insert Products
INSERT INTO products (name, slug, description, short_description, price, compare_price, stock_quantity, category_id, artist_id, dimensions, medium, art_form, is_featured, is_ready_to_ship) VALUES
('Tree of Life in Madhubani', 'tree-of-life-madhubani', 'This stunning Tree of Life painting captures the essence of Madhubani art with intricate patterns depicting birds, flowers, and sacred symbols. Each element tells a story of harmony between nature and spirituality.', 'Intricate Madhubani painting featuring the sacred Tree of Life motif', 15000.00, 18000.00, 5, 1, 1, '24 in X 36 in', 'Natural colors on handmade paper', 'Madhubani', TRUE, TRUE),
('Dancing Peacocks in Gond', 'dancing-peacocks-gond', 'A mesmerizing Gond artwork featuring dancing peacocks with signature dotted patterns. The vibrant colors and intricate detailing showcase the artists mastery of this ancient tribal art form.', 'Vibrant Gond art featuring dancing peacocks', 12000.00, NULL, 3, 1, 3, '20 in X 30 in', 'Acrylic on canvas', 'Gond', TRUE, TRUE),
('Village Life Warli', 'village-life-warli', 'This beautiful Warli painting depicts everyday village scenes with the characteristic stick figures and geometric patterns. A perfect representation of tribal life and traditions.', 'Traditional Warli art depicting village life scenes', 8500.00, 10000.00, 8, 1, 4, '18 in X 24 in', 'White paint on mud base', 'Warli', FALSE, TRUE),
('Krishna Leela Pichwai', 'krishna-leela-pichwai', 'An exquisite Pichwai painting depicting the divine play of Lord Krishna with gopis. Rich in detail and spiritual significance, this artwork is created using natural pigments and gold leaf.', 'Divine Pichwai painting of Krishna Leela', 45000.00, 52000.00, 2, 1, NULL, '36 in X 48 in', 'Natural pigments with gold leaf on cloth', 'Pichwai', TRUE, FALSE),
('Mythological Kalamkari', 'mythological-kalamkari', 'A masterpiece Kalamkari painting depicting scenes from Indian epics. Hand-drawn with bamboo pen using natural dyes, this artwork showcases the finest traditions of Srikalahasti style.', 'Hand-drawn Kalamkari depicting mythological scenes', 28000.00, NULL, 4, 1, 5, '30 in X 40 in', 'Natural dyes on cotton fabric', 'Kalamkari', TRUE, TRUE),
('Durga in Pattachitra', 'durga-pattachitra', 'A magnificent Pattachitra depicting Goddess Durga in all her glory. The intricate borders and vibrant colors make this a stunning piece of devotional art.', 'Stunning Pattachitra of Goddess Durga', 35000.00, 40000.00, 3, 1, 6, '28 in X 38 in', 'Natural colors on treated cloth', 'Pattachitra', TRUE, TRUE),
('Fish Motif Madhubani', 'fish-motif-madhubani', 'A beautiful Madhubani painting featuring the auspicious fish motif, symbolizing fertility and prosperity. Perfect for adding traditional charm to any space.', 'Auspicious fish motif in Madhubani style', 5500.00, 6500.00, 10, 1, 1, '12 in X 16 in', 'Acrylic on paper', 'Madhubani', FALSE, TRUE),
('Elephant Gond Art', 'elephant-gond-art', 'A majestic elephant rendered in the distinctive Gond style with intricate patterns and vibrant colors. Each element is filled with symbolic meaning and artistic precision.', 'Majestic elephant in Gond tribal art style', 18000.00, 22000.00, 4, 1, 3, '24 in X 30 in', 'Acrylic on canvas', 'Gond', TRUE, FALSE),
('Sacred Lotus Warli', 'sacred-lotus-warli', 'A serene Warli artwork featuring the sacred lotus surrounded by dancing figures. The minimalist aesthetic captures the spiritual essence of tribal traditions.', 'Minimalist Warli art with lotus motif', 6000.00, NULL, 6, 1, 4, '14 in X 18 in', 'White and brown on handmade paper', 'Warli', FALSE, TRUE),
('Radha Krishna Pichwai', 'radha-krishna-pichwai', 'An enchanting Pichwai painting of the divine couple Radha Krishna. Created with traditional techniques using natural pigments and intricate gold detailing.', 'Divine Radha Krishna Pichwai painting', 55000.00, 65000.00, 1, 1, NULL, '40 in X 52 in', 'Natural pigments with gold on cloth', 'Pichwai', TRUE, FALSE);

-- Insert Product Images
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
(1, 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80', 'Tree of Life Madhubani Painting - Front View', TRUE, 1),
(1, 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800&q=80', 'Tree of Life Madhubani Painting - Detail', FALSE, 2),
(2, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80', 'Dancing Peacocks Gond Art - Front View', TRUE, 1),
(2, 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80', 'Dancing Peacocks Gond Art - Close Up', FALSE, 2),
(3, 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=800&q=80', 'Village Life Warli Painting', TRUE, 1),
(4, 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80', 'Krishna Leela Pichwai - Full View', TRUE, 1),
(5, 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=800&q=80', 'Mythological Kalamkari - Front View', TRUE, 1),
(6, 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&q=80', 'Durga Pattachitra - Full View', TRUE, 1),
(7, 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=800&q=80', 'Fish Motif Madhubani', TRUE, 1),
(8, 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80', 'Elephant Gond Art', TRUE, 1),
(9, 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe1?w=800&q=80', 'Sacred Lotus Warli', TRUE, 1),
(10, 'https://images.unsplash.com/photo-1579783922514-0010926a15b9?w=800&q=80', 'Radha Krishna Pichwai', TRUE, 1);

-- Insert Tags
INSERT INTO product_tags (name, slug) VALUES
('Mythology', 'mythology'),
('Nature', 'nature'),
('Religious', 'religious'),
('Wildlife', 'wildlife'),
('Traditional', 'traditional'),
('Contemporary', 'contemporary'),
('Bestseller', 'bestseller'),
('New Arrival', 'new-arrival');

-- Insert Admin User (password: admin123 - should be changed in production)
INSERT INTO users (email, password_hash, name, role, provider, email_verified) VALUES
('admin@artisanhaven.com', '$2b$10$rQZ5yN5oX5HVJQRJmGFvO.7r8c0QZc8xQ5ZVzQZ5yN5oX5HVJQRJm', 'Admin User', 'admin', 'email', TRUE);
