-- Flyway V6 Seed Data: Phase 3 Seed Data for Demo Tenant (Tenant ID 1)

-- Seed Customers for Tenant 1
INSERT INTO customers (id, public_id, tenant_id, customer_number, customer_type, display_name, first_name, last_name, company_name, email, phone, website, tax_number, industry, customer_status, assigned_to, billing_city, billing_country, created_at) VALUES
(1, 'c1111111-1111-1111-1111-111111111111', 1, 'CUS-000001', 'COMPANY', 'Acme Technologies Pvt Ltd', 'Aarav', 'Mehta', 'Acme Technologies Pvt Ltd', 'contact@acmetech.in', '+91 9820011223', 'https://acmetech.in', 'GSTIN27AAACA1234A1Z1', 'Software & IT Services', 'ACTIVE', 2, 'Mumbai', 'India', CURRENT_TIMESTAMP - INTERVAL '30 days'),
(2, 'c2222222-2222-2222-2222-222222222222', 1, 'CUS-000002', 'COMPANY', 'BrightEdge Solutions', 'Rohan', 'Deshmukh', 'BrightEdge Solutions', 'hello@brightedge.io', '+91 9811099887', 'https://brightedge.io', 'GSTIN29BBBBA5678B1Z2', 'Consulting', 'ACTIVE', 3, 'Bangalore', 'India', CURRENT_TIMESTAMP - INTERVAL '20 days'),
(3, 'c3333333-3333-3333-3333-333333333333', 1, 'CUS-000003', 'INDIVIDUAL', 'Dr. Rajesh Khanna', 'Rajesh', 'Khanna', NULL, 'dr.khanna@medicalclinic.com', '+91 9844011224', NULL, NULL, 'Healthcare', 'ACTIVE', 2, 'Delhi', 'India', CURRENT_TIMESTAMP - INTERVAL '15 days'),
(4, 'c4444444-4444-4444-4444-444444444444', 1, 'CUS-000004', 'COMPANY', 'UrbanNest Realty Pvt Ltd', 'Vikram', 'Singhania', 'UrbanNest Realty', 'office@urbannest.com', '+91 9877055443', 'https://urbannest.com', 'GSTIN06CCCCA9012C1Z3', 'Real Estate', 'PROSPECT', 2, 'Gurgaon', 'India', CURRENT_TIMESTAMP - INTERVAL '10 days');

-- Seed Contacts for Customers
INSERT INTO contacts (id, public_id, tenant_id, customer_id, first_name, last_name, designation, department, email, phone, contact_type, is_primary, is_decision_maker) VALUES
(1, 'cnt-1111-1111-1111-111111111111', 1, 1, 'Aarav', 'Mehta', 'Chief Technology Officer', 'Engineering', 'aarav.mehta@acmetech.in', '+91 9820011223', 'PRIMARY', true, true),
(2, 'cnt-2222-2222-2222-222222222222', 1, 1, 'Sunita', 'Rao', 'Finance Director', 'Finance', 'sunita.rao@acmetech.in', '+91 9820011224', 'FINANCE', false, true),
(3, 'cnt-3333-3333-3333-333333333333', 1, 2, 'Rohan', 'Deshmukh', 'VP Sales', 'Sales', 'rohan@brightedge.io', '+91 9811099887', 'PRIMARY', true, true),
(4, 'cnt-4444-4444-4444-444444444444', 1, 4, 'Vikram', 'Singhania', 'Managing Director', 'Executive', 'vikram@urbannest.com', '+91 9877055443', 'PRIMARY', true, true);

-- Update Opportunities with customer_id
UPDATE opportunities SET customer_id = 1 WHERE id = 1;
UPDATE opportunities SET customer_id = 2 WHERE id = 2;
UPDATE opportunities SET customer_id = 4 WHERE id = 3;
