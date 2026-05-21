-- BACKA VARIEDADES - CRM & EXPANDED SUPABASE MIGRATION
-- Date: 2026-05-21
-- This migration script creates the necessary database tables, index structures, 
-- and configures the initial seed data.

-- ==========================================
-- 1. DROP EXISTING TABLES (If any)
-- ==========================================
DROP TABLE IF EXISTS transaction_items CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS clients CASCADE;

-- ==========================================
-- 2. CREATE SCHEMAS & TABLES
-- ==========================================

-- CLIENTS Table
CREATE TABLE clients (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    member_since VARCHAR(50) DEFAULT 'Jan 2023',
    total_spent NUMERIC(12, 2) DEFAULT 0.00,
    transactions_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PRODUCTS Table
CREATE TABLE products (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100) DEFAULT 'Other',
    price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    stock INTEGER NOT NULL DEFAULT 0,
    image TEXT,
    series VARCHAR(100) DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TRANSACTIONS Table
CREATE TABLE transactions (
    id VARCHAR(100) PRIMARY KEY, -- e.g. '#ORD-90241' or '#TRX-9821'
    client_id VARCHAR(100) REFERENCES clients(id) ON DELETE SET NULL,
    client_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Paid', 'Pending', 'Cancelled', 'Completed')),
    date VARCHAR(50) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- TRANSACTION ITEMS Table
CREATE TABLE transaction_items (
    id BIGSERIAL PRIMARY KEY,
    transaction_id VARCHAR(100) REFERENCES transactions(id) ON DELETE CASCADE,
    product_id VARCHAR(100) REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    qty INTEGER NOT NULL DEFAULT 1,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0.00
);

-- ==========================================
-- 3. ENABLE ROW LEVEL SECURITY (Optional but recommended)
-- ==========================================
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;

-- Create public read/write permission bypass (ideal for straightforward client usage)
CREATE POLICY "Enable all modifications for authenticated and anonymous users" ON clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all modifications for authenticated and anonymous users" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all modifications for authenticated and anonymous users" ON transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all modifications for authenticated and anonymous users" ON transaction_items FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- 4. SEED INITIAL CRM DATA
-- ==========================================

-- Seed Clients
INSERT INTO clients (id, name, email, phone, status, member_since, total_spent, transactions_count) VALUES
('cli-1', 'Adriana Valente', 'adriana.v@email.com', '+55 11 98765-4321', 'Active', 'Jan 2023', 4250.00, 24),
('cli-2', 'Ricardo Martins', 'r.martins@outlook.com', '+55 11 91234-5678', 'Active', 'Mar 2023', 1120.40, 8),
('cli-3', 'Lúcia Santos', 'lucia.santos@gmail.com', '+55 11 95555-0000', 'Inactive', 'Nov 2022', 85.00, 1),
('cli-4', 'Felipe Borges', 'felipe_b@company.com', '+55 11 96666-7777', 'Active', 'Jun 2023', 2890.15, 15),
('cli-5', 'Julia Mendes', 'j.mendes@web.com', '+55 11 94444-2222', 'Active', 'Feb 2023', 15400.00, 32);

-- Seed Products
INSERT INTO products (id, name, sku, category, price, stock, image, series) VALUES
('prod-1', 'Minimalist Quartz Watch', 'WA-102-SL', 'Accessories', 120.00, 85, 'https://lh3.googleusercontent.com/aida-public/AB6AXuB759hp5SOs8iBB79uA36jv4iOpsEx-SYH-EUQD0OvUx4QiDMCoSgUSBhtYUi1OHSi9WjBYbqfAfUGTShGaCIZrSSFiq6NUdDn9LAfXjL8o93-TI4z_IwUD88mqMllsy27830TcoRxnBdkzghIPDGAvUUJ4m889LI8mfADVqiRC630SXfviOuvrR_pBuoc2CBaaFCdMI5RHRKOL0qdL644yjLYvafEmbmIAaA7q_b446PugFlcTkLmHEBVoctL5FmyQxWSiSyoU1wA', 'Luxury Series'),
('prod-2', 'Ultra-Light Runner X1', 'SH-409-RD', 'Footwear', 89.99, 5, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoNYlei-TrclBfDqxk6jZjbe9Ra_GwaS0-hh8EUdW2pYaRlnYboSS7LvjdaHnTOEy-kwPZ4JT24SsvFu-ZKxM0K7-wSgV5j2OZLjcRzgvQmYmY6N26V42Os_l2Ul1brPkoWwheyUyntJ6_Mdio1FT_W7u6Q7nF_JixFuqctspeF8RvVyx-suQmrOKOCY9qBJ0aXUlUl3cCl2NFWVu6DV09arSITl0viRbJTbHuxR7oG_fG2Bq3JH6hYuzJUYP8X6rYRIQwfK89t9Q', 'Low Stock'),
('prod-3', 'Noise-Cancelling BT Headset', 'EL-882-BK', 'Tech', 245.00, 42, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpCZJlbhiCy2DKFnn_AcTYPohsWB8AziR2E4pGuaym9ABmO4fj9WnpDWqrEmHUowaH3UvKQDsVThooLnneSlJPMPKM9bkFMfYyiuFXGNihdXRUfTqbWgf-IliszoQVNaroOmwpYWMlDVv5bCx8Vs17IMtuIIrbgFbhDsQ3a8EjvxQ1aihqIKieZg8LBpgSF1Mr252widJzuSWkfbBKP_Pxz38Oo6OPAgDHuEqtGHhvFQR-FEMRAAhm2eWzef1a8FSfY2l1jmLOZPQ', 'Electronics'),
('prod-4', 'Vintage Instant Camera', 'EL-114-BL', 'Tech', 75.50, 28, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDC9KJuc7EPqzqkqWQ93bmMUGOK-TNCv4zMDP928IyE5V4jO_UfL09MZ3kPgQcbIPC4e26G9hwMBZjeshBRK5T7G5VfO9IAFw7qisUysVmoXo0wJSm5Fh7TeZ_vCzKYZekOZfLZ6aw50cKIPe-xovSzS85Gf_1brmhsvihgnCvnADkaeRHpl5JtPni_RuLI2JiAkGcdFUtoKDV5gxIHNRmo9TdV3RgpCwBUZc4PyX0BfZ0kGNCfzDxuXIRsO4aqQHj53Ul7g0X9snk', 'Limited Edition');

-- Seed Transactions
INSERT INTO transactions (id, client_id, client_name, status, date, amount) VALUES
('#TRX-9821', 'cli-1', 'Mariana Costa', 'Completed', 'May 12, 2026', 1240.00),
('#TRX-9822', 'cli-2', 'João Silva', 'Pending', 'May 12, 2026', 450.00),
('#TRX-9823', 'cli-3', 'Ricardo Alves', 'Cancelled', 'May 11, 2026', 2100.00),
('#ORD-90241', 'cli-1', 'Joana Santos', 'Paid', 'Oct 24, 2025', 342.50),
('#ORD-90238', 'cli-2', 'Ricardo Alves', 'Pending', 'Oct 23, 2025', 1200.00),
('#ORD-90235', 'cli-3', 'Maria Costa', 'Cancelled', 'Oct 22, 2025', 56.00),
('#ORD-90231', 'cli-4', 'Pedro Ferreira', 'Paid', 'Oct 22, 2025', 890.15),
('#ORD-90229', 'cli-5', 'Lúcia Viegas', 'Paid', 'Oct 21, 2025', 124.99);

-- Seed Transaction Items for complete mapping
INSERT INTO transaction_items (transaction_id, product_id, product_name, qty, price) VALUES
('#TRX-9821', 'prod-1', 'Minimalist Quartz Watch', 2, 120.00),
('#TRX-9821', 'prod-3', 'Noise-Cancelling BT Headset', 4, 245.00),
('#TRX-9822', 'prod-2', 'Ultra-Light Runner X1', 5, 89.99),
('#TRX-9823', 'prod-4', 'Vintage Instant Camera', 2, 75.50);

-- ==========================================
-- 5. VALUABLE INSTRUCTIONS
-- ==========================================
-- Como executar esta migração:
-- 1. Abra o seu painel do Supabase (https://supabase.com).
-- 2. Selecione o seu projeto do CRM Becka Variedades.
-- 3. Entre no menu "SQL Editor" (ícone de terminal/SQL na barra lateral esquerda).
-- 4. Clique em "New Query" (Nova Consulta).
-- 5. Copie e cole todo este arquivo SQL na caixa de texto.
-- 6. Clique em "Run" (Executar) no canto inferior direito.
-- 7. Suas tabelas serão criadas e populadas instantaneamente!
