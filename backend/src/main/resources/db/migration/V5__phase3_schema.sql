-- Flyway V5 Migration: Phase 3 Schema (Customers, Contacts, Customer 360, Customer Notes & Activities)

-- Customers Table
CREATE TABLE customers (
    id BIGSERIAL PRIMARY KEY,
    public_id UUID NOT NULL UNIQUE,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    customer_number VARCHAR(30) NOT NULL,
    customer_type VARCHAR(20) NOT NULL DEFAULT 'COMPANY', -- INDIVIDUAL, COMPANY
    display_name VARCHAR(150) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    company_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(30),
    alternate_phone VARCHAR(30),
    website VARCHAR(255),
    tax_number VARCHAR(50),
    industry VARCHAR(50),
    customer_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, PROSPECT, BLOCKED
    assigned_to BIGINT REFERENCES users(id) ON DELETE SET NULL,
    source_id BIGINT REFERENCES lead_sources(id) ON DELETE SET NULL,
    description TEXT,
    billing_address VARCHAR(255),
    billing_city VARCHAR(50),
    billing_state VARCHAR(50),
    billing_country VARCHAR(50),
    billing_postal_code VARCHAR(20),
    shipping_address VARCHAR(255),
    shipping_city VARCHAR(50),
    shipping_state VARCHAR(50),
    shipping_country VARCHAR(50),
    shipping_postal_code VARCHAR(20),
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uk_tenant_customer_number UNIQUE (tenant_id, customer_number)
);

CREATE INDEX idx_customers_tenant_status ON customers(tenant_id, customer_status);
CREATE INDEX idx_customers_tenant_assigned ON customers(tenant_id, assigned_to);
CREATE INDEX idx_customers_tenant_type ON customers(tenant_id, customer_type);

-- Contacts Table
CREATE TABLE contacts (
    id BIGSERIAL PRIMARY KEY,
    public_id UUID NOT NULL UNIQUE,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    designation VARCHAR(100),
    department VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(30),
    alternate_phone VARCHAR(30),
    whatsapp VARCHAR(30),
    contact_type VARCHAR(30) NOT NULL DEFAULT 'PRIMARY', -- PRIMARY, DECISION_MAKER, FINANCE, TECHNICAL, OPERATIONS, OTHER
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    is_decision_maker BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_contacts_customer ON contacts(customer_id);

-- Customer Notes Table
CREATE TABLE customer_notes (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customer_notes_customer ON customer_notes(customer_id);

-- Customer Activities Table
CREATE TABLE customer_activities (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    activity_type VARCHAR(30) NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customer_activities_customer ON customer_activities(customer_id);

-- Customer Merges Table
CREATE TABLE customer_merges (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    primary_customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    merged_customer_id BIGINT NOT NULL,
    merged_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    merged_data_snapshot TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add FK Constraint from Opportunities to Customers
ALTER TABLE opportunities ADD CONSTRAINT fk_opportunities_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;
