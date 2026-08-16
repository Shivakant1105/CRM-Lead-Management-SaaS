-- Flyway V3 Migration: Phase 2 Schema (Leads, Follow-ups, Pipelines, Opportunities, Tags)

-- Lead Sources Table
CREATE TABLE lead_sources (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_tenant_source_code UNIQUE (tenant_id, code)
);

-- Lead Statuses Table
CREATE TABLE lead_statuses (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(50) NOT NULL,
    color_token VARCHAR(20) DEFAULT '#4F46E5',
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_tenant_status_code UNIQUE (tenant_id, code)
);

-- Tags Table
CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    color_token VARCHAR(20) DEFAULT '#7C3AED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_tenant_tag_name UNIQUE (tenant_id, name)
);

-- Leads Table
CREATE TABLE leads (
    id BIGSERIAL PRIMARY KEY,
    public_id UUID NOT NULL UNIQUE,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    lead_number VARCHAR(30) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    company_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(30),
    alternate_phone VARCHAR(30),
    job_title VARCHAR(100),
    website VARCHAR(255),
    source_id BIGINT REFERENCES lead_sources(id) ON DELETE SET NULL,
    status_id BIGINT REFERENCES lead_statuses(id) ON DELETE SET NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
    assigned_to BIGINT REFERENCES users(id) ON DELETE SET NULL,
    expected_value NUMERIC(15, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'INR',
    industry VARCHAR(50),
    address VARCHAR(255),
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50),
    postal_code VARCHAR(20),
    description TEXT,
    next_followup_at TIMESTAMP WITH TIME ZONE,
    last_contacted_at TIMESTAMP WITH TIME ZONE,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uk_tenant_lead_number UNIQUE (tenant_id, lead_number)
);

CREATE INDEX idx_leads_tenant_status ON leads(tenant_id, status_id);
CREATE INDEX idx_leads_tenant_assigned ON leads(tenant_id, assigned_to);
CREATE INDEX idx_leads_tenant_created ON leads(tenant_id, created_at);
CREATE INDEX idx_leads_tenant_followup ON leads(tenant_id, next_followup_at);

-- Lead Tag Mapping Junction Table
CREATE TABLE lead_tag_mapping (
    lead_id BIGINT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (lead_id, tag_id)
);

-- Lead Notes Table
CREATE TABLE lead_notes (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    lead_id BIGINT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    updated_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notes_lead ON lead_notes(lead_id);

-- Lead Activities Table
CREATE TABLE lead_activities (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    lead_id BIGINT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    activity_type VARCHAR(30) NOT NULL, -- CALL, EMAIL, MEETING, WHATSAPP, DEMO, SITE_VISIT, NOTE, STATUS_CHANGE
    title VARCHAR(150) NOT NULL,
    description TEXT,
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata_json TEXT
);

CREATE INDEX idx_activities_lead ON lead_activities(lead_id);

-- Follow-ups Table
CREATE TABLE follow_ups (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    lead_id BIGINT REFERENCES leads(id) ON DELETE CASCADE,
    assigned_to BIGINT REFERENCES users(id) ON DELETE SET NULL,
    type VARCHAR(30) NOT NULL, -- CALL, EMAIL, MEETING, WHATSAPP, DEMO, SITE_VISIT, OTHER
    title VARCHAR(150) NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    reminder_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, COMPLETED, MISSED, CANCELLED, OVERDUE
    notes TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    completed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_followups_tenant_scheduled ON follow_ups(tenant_id, scheduled_at, status);
CREATE INDEX idx_followups_assigned ON follow_ups(assigned_to);

-- Pipelines Table
CREATE TABLE pipelines (
    id BIGSERIAL PRIMARY KEY,
    public_id UUID NOT NULL UNIQUE,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pipeline Stages Table
CREATE TABLE pipeline_stages (
    id BIGSERIAL PRIMARY KEY,
    public_id UUID NOT NULL UNIQUE,
    pipeline_id BIGINT NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    color_token VARCHAR(20) DEFAULT '#4F46E5',
    probability INT NOT NULL DEFAULT 10,
    is_won BOOLEAN NOT NULL DEFAULT FALSE,
    is_lost BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_stages_pipeline ON pipeline_stages(pipeline_id, display_order);

-- Opportunities Table
CREATE TABLE opportunities (
    id BIGSERIAL PRIMARY KEY,
    public_id UUID NOT NULL UNIQUE,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    opportunity_number VARCHAR(30) NOT NULL,
    name VARCHAR(150) NOT NULL,
    lead_id BIGINT REFERENCES leads(id) ON DELETE SET NULL,
    customer_id BIGINT, -- Will reference customers table in Phase 3
    pipeline_id BIGINT NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
    stage_id BIGINT NOT NULL REFERENCES pipeline_stages(id) ON DELETE RESTRICT,
    amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    probability INT NOT NULL DEFAULT 10,
    expected_close_date TIMESTAMP WITH TIME ZONE,
    assigned_to BIGINT REFERENCES users(id) ON DELETE SET NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN', -- OPEN, WON, LOST
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_tenant_opp_number UNIQUE (tenant_id, opportunity_number)
);

CREATE INDEX idx_opportunities_tenant_stage ON opportunities(tenant_id, stage_id, status);
CREATE INDEX idx_opportunities_lead ON opportunities(lead_id);

-- Lead Attachments Table
CREATE TABLE lead_attachments (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    lead_id BIGINT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    content_type VARCHAR(100),
    storage_path VARCHAR(255) NOT NULL,
    uploaded_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
