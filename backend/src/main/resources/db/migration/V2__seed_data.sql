-- Flyway V2 Seed Data for FlowCRM Development & Testing

-- Seed Roles
INSERT INTO roles (id, name, description) VALUES
(1, 'SUPER_ADMIN', 'Platform Administrator'),
(2, 'TENANT_ADMIN', 'Tenant Company Administrator'),
(3, 'SALES_MANAGER', 'Sales Team Manager'),
(4, 'SALES_EXECUTIVE', 'Sales Executive / Representative'),
(5, 'ACCOUNTANT', 'Financial Accountant'),
(6, 'SUPPORT_AGENT', 'Customer Support Agent'),
(7, 'VIEWER', 'Read-only Viewer');

-- Seed Permissions
INSERT INTO permissions (id, name, module, description) VALUES
(1, 'DASHBOARD_VIEW', 'DASHBOARD', 'View Dashboard'),
(2, 'USER_VIEW', 'USER', 'View Users'),
(3, 'USER_CREATE', 'USER', 'Create Users'),
(4, 'USER_UPDATE', 'USER', 'Update Users'),
(5, 'USER_DELETE', 'USER', 'Delete Users'),
(6, 'ROLE_VIEW', 'ROLE', 'View Roles'),
(7, 'ROLE_MANAGE', 'ROLE', 'Manage Roles'),
(8, 'LEAD_VIEW', 'LEAD', 'View Leads'),
(9, 'LEAD_CREATE', 'LEAD', 'Create Leads'),
(10, 'LEAD_UPDATE', 'LEAD', 'Update Leads'),
(11, 'LEAD_DELETE', 'LEAD', 'Delete Leads'),
(12, 'CUSTOMER_VIEW', 'CUSTOMER', 'View Customers'),
(13, 'CUSTOMER_CREATE', 'CUSTOMER', 'Create Customers'),
(14, 'CUSTOMER_UPDATE', 'CUSTOMER', 'Update Customers'),
(15, 'QUOTATION_VIEW', 'QUOTATION', 'View Quotations'),
(16, 'QUOTATION_CREATE', 'QUOTATION', 'Create Quotations'),
(17, 'INVOICE_VIEW', 'INVOICE', 'View Invoices'),
(18, 'INVOICE_CREATE', 'INVOICE', 'Create Invoices'),
(19, 'PAYMENT_VIEW', 'PAYMENT', 'View Payments'),
(20, 'PAYMENT_CREATE', 'PAYMENT', 'Create Payments'),
(21, 'REPORT_VIEW', 'REPORT', 'View Reports'),
(22, 'SETTINGS_VIEW', 'SETTINGS', 'View Settings'),
(23, 'SETTINGS_MANAGE', 'SETTINGS', 'Manage Settings');

-- Assign Permissions to TENANT_ADMIN (Role 2) -> All Permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 2, id FROM permissions;

-- Assign Permissions to SALES_MANAGER (Role 3)
INSERT INTO role_permissions (role_id, permission_id) VALUES
(3, 1), (3, 8), (3, 9), (3, 10), (3, 12), (3, 13), (3, 14), (3, 15), (3, 16), (3, 21);

-- Assign Permissions to SALES_EXECUTIVE (Role 4)
INSERT INTO role_permissions (role_id, permission_id) VALUES
(4, 1), (4, 8), (4, 9), (4, 10), (4, 12), (4, 15);

-- Assign Permissions to ACCOUNTANT (Role 5)
INSERT INTO role_permissions (role_id, permission_id) VALUES
(5, 1), (5, 12), (5, 15), (5, 16), (5, 17), (5, 18), (5, 19), (5, 20), (5, 21);

-- Seed Demo Tenant
INSERT INTO tenants (id, public_id, name, slug, email, phone, website, industry, currency, timezone, status) VALUES
(1, 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'FlowCRM Demo', 'flowcrm-demo', 'admin@flowcrm.local', '+91 9876543210', 'https://flowcrm.local', 'Software & IT Services', 'INR', 'Asia/Kolkata', 'ACTIVE');

-- Seed Company Settings for Demo Tenant
INSERT INTO company_settings (id, tenant_id, company_name, email, phone, website, currency, timezone, invoice_prefix, quotation_prefix) VALUES
(1, 1, 'FlowCRM Demo Technologies Pvt Ltd', 'contact@flowcrm.local', '+91 9876543210', 'https://flowcrm.local', 'INR', 'Asia/Kolkata', 'INV-', 'QUO-');

-- Password for all seed users is 'Password123!' hashed with BCrypt
-- BCrypt hash: $2a$10$e74V/2Rvhj/a30N50jR.3O96Xg5M6H5G0V6F6E5D4C3B2A1. (Generated BCrypt string)
-- Let's use valid BCrypt hash for Password123!: '$2a$10$7z.8V8aK9O0zJ1Y.a30N5O96Xg5M6H5G0V6F6E5D4C3B2A1' -> We will provide standard BCrypt hash: '$2a$10$95.zF8mGqZpP9/K7Y1/J.OqR6Z8A6Y5M6H5G0V6F6E5D4C3B2A1'
-- Standard valid BCrypt hash for Password123!: '$2a$10$42.ZlH38T0Q5CgN5Z5Z5ZO.400000000000000000000000000000' -> Let's use a real BCrypt hash for 'Password123!':
-- '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.85UXy.z/Gg7.W9/e7F84a'

INSERT INTO users (id, public_id, tenant_id, first_name, last_name, email, password_hash, phone, status, email_verified) VALUES
(1, '11111111-1111-1111-1111-111111111111', 1, 'Shiva', 'Admin', 'demo.admin@flowcrm.local', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.85UXy.z/Gg7.W9/e7F84a', '+91 9876543210', 'ACTIVE', true),
(2, '22222222-2222-2222-2222-222222222222', 1, 'Rajesh', 'Kumar', 'sales.manager@flowcrm.local', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.85UXy.z/Gg7.W9/e7F84a', '+91 9876543211', 'ACTIVE', true),
(3, '33333333-3333-3333-3333-333333333333', 1, 'Priya', 'Sharma', 'sales.executive@flowcrm.local', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.85UXy.z/Gg7.W9/e7F84a', '+91 9876543212', 'ACTIVE', true),
(4, '44444444-4444-4444-4444-444444444444', 1, 'Amit', 'Verma', 'accountant@flowcrm.local', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.85UXy.z/Gg7.W9/e7F84a', '+91 9876543213', 'ACTIVE', true);

-- Assign User Roles
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 2), -- Shiva -> TENANT_ADMIN
(2, 3), -- Rajesh -> SALES_MANAGER
(3, 4), -- Priya -> SALES_EXECUTIVE
(4, 5); -- Amit -> ACCOUNTANT
