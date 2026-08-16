-- Flyway V4 Seed Data: Phase 2 Seed Data for Demo Tenant (Tenant ID 1)

-- Seed Lead Sources for Tenant 1
INSERT INTO lead_sources (id, tenant_id, name, code, is_active, display_order) VALUES
(1, 1, 'Website', 'WEBSITE', true, 1),
(2, 1, 'Google Search', 'GOOGLE', true, 2),
(3, 1, 'Facebook', 'FACEBOOK', true, 3),
(4, 1, 'Instagram', 'INSTAGRAM', true, 4),
(5, 1, 'WhatsApp', 'WHATSAPP', true, 5),
(6, 1, 'Referral', 'REFERRAL', true, 6),
(7, 1, 'Advertisement', 'ADVERTISEMENT', true, 7),
(8, 1, 'Manual Input', 'MANUAL', true, 8),
(9, 1, 'Excel Import', 'IMPORT', true, 9),
(10, 1, 'Other', 'OTHER', true, 10);

-- Seed Lead Statuses for Tenant 1
INSERT INTO lead_statuses (id, tenant_id, name, code, color_token, display_order, is_active) VALUES
(1, 1, 'New', 'NEW', '#4F46E5', 1, true),
(2, 1, 'Contacted', 'CONTACTED', '#06B6D4', 2, true),
(3, 1, 'Qualified', 'QUALIFIED', '#10B981', 3, true),
(4, 1, 'Proposal', 'PROPOSAL', '#7C3AED', 4, true),
(5, 1, 'Negotiation', 'NEGOTIATION', '#F59E0B', 5, true),
(6, 1, 'Won', 'WON', '#059669', 6, true),
(7, 1, 'Lost', 'LOST', '#EF4444', 7, true),
(8, 1, 'Converted', 'CONVERTED', '#6366F1', 8, true);

-- Seed Tags for Tenant 1
INSERT INTO tags (id, tenant_id, name, color_token) VALUES
(1, 1, 'Hot Lead', '#EF4444'),
(2, 1, 'Enterprise', '#7C3AED'),
(3, 1, 'VIP', '#F59E0B'),
(4, 1, 'Follow-up Needed', '#3B82F6'),
(5, 1, 'High Value', '#10B981');

-- Seed Pipelines for Tenant 1
INSERT INTO pipelines (id, public_id, tenant_id, name, description, is_default, is_active) VALUES
(1, '88888888-8888-8888-8888-888888888888', 1, 'Standard Sales Pipeline', 'Default B2B SaaS Sales Pipeline', true, true);

-- Seed Pipeline Stages for Pipeline 1
INSERT INTO pipeline_stages (id, public_id, pipeline_id, name, display_order, color_token, probability, is_won, is_lost) VALUES
(1, 'stage-1111-1111-1111-111111111111', 1, 'New Prospect', 1, '#4F46E5', 10, false, false),
(2, 'stage-2222-2222-2222-222222222222', 1, 'Contacted & Discovery', 2, '#06B6D4', 25, false, false),
(3, 'stage-3333-3333-3333-333333333333', 1, 'Qualified Proposal', 3, '#7C3AED', 50, false, false),
(4, 'stage-4444-4444-4444-444444444444', 1, 'Contract Negotiation', 4, '#F59E0B', 80, false, false),
(5, 'stage-5555-5555-5555-555555555555', 1, 'Closed Won', 5, '#10B981', 100, true, false),
(6, 'stage-6666-6666-6666-666666666666', 1, 'Closed Lost', 6, '#EF4444', 0, false, true);

-- Seed Realistic Demo Leads (Tenant ID 1)
INSERT INTO leads (id, public_id, tenant_id, lead_number, first_name, last_name, company_name, email, phone, job_title, source_id, status_id, priority, assigned_to, expected_value, currency, industry, city, state, country, description, next_followup_at, created_at) VALUES
(1, 'l1111111-1111-1111-1111-111111111111', 1, 'LD-000001', 'Aarav', 'Mehta', 'Acme Technologies Pvt Ltd', 'aarav.mehta@acmetech.in', '+91 9820011223', 'CTO', 1, 3, 'HIGH', 2, 450000.00, 'INR', 'Software & IT Services', 'Mumbai', 'Maharashtra', 'India', 'Looking for enterprise CRM implementation for 50 sales reps.', CURRENT_TIMESTAMP + INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '5 days'),
(2, 'l2222222-2222-2222-2222-222222222222', 1, 'LD-000002', 'Rohan', 'Deshmukh', 'BrightEdge Solutions', 'rohan@brightedge.io', '+91 9811099887', 'VP Sales', 2, 4, 'URGENT', 3, 780000.00, 'INR', 'Consulting', 'Bangalore', 'Karnataka', 'India', 'Requested formal proposal and pricing quote for multi-tenant setup.', CURRENT_TIMESTAMP + INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '10 days'),
(3, 'l3333333-3333-3333-3333-333333333333', 1, 'LD-000003', 'Sneha', 'Kapoor', 'Nova Education Group', 'sneha@novaedu.org', '+91 9833077665', 'Director', 5, 2, 'MEDIUM', 3, 250000.00, 'INR', 'Education', 'Delhi', 'NCR', 'India', 'Inquired via WhatsApp for student lead management system.', CURRENT_TIMESTAMP + INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(4, 'l4444444-4444-4444-4444-444444444444', 1, 'LD-000004', 'Vikram', 'Singhania', 'UrbanNest Realty', 'vikram@urbannest.com', '+91 9877055443', 'Managing Director', 6, 5, 'HIGH', 2, 1200000.00, 'INR', 'Real Estate', 'Gurgaon', 'Haryana', 'India', 'Commercial real estate CRM deal in final contract negotiation phase.', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '15 days'),
(5, 'l5555555-5555-5555-5555-555555555555', 1, 'LD-000005', 'Ananya', 'Roy', 'CloudBridge Systems', 'ananya@cloudbridge.net', '+91 9844033221', 'Head of IT', 1, 1, 'LOW', 3, 180000.00, 'INR', 'Software & IT Services', 'Pune', 'Maharashtra', 'India', 'Inbound lead filled out website demo request form.', CURRENT_TIMESTAMP + INTERVAL '4 days', CURRENT_TIMESTAMP - INTERVAL '1 day');

-- Seed Lead Tag Mappings
INSERT INTO lead_tag_mapping (lead_id, tag_id) VALUES
(1, 1), (1, 2),
(2, 1), (2, 5),
(4, 2), (4, 3), (4, 5);

-- Seed Follow-ups for Tenant 1
INSERT INTO follow_ups (id, tenant_id, lead_id, assigned_to, type, title, scheduled_at, status, notes) VALUES
(1, 1, 1, 2, 'CALL', 'Follow up on technical architecture requirements', CURRENT_TIMESTAMP + INTERVAL '1 day', 'PENDING', 'Discuss PostgreSQL schema and multi-tenancy requirements'),
(2, 1, 2, 3, 'MEETING', 'Product demo meeting with VP Sales', CURRENT_TIMESTAMP + INTERVAL '2 hours', 'PENDING', 'Demonstrate Sales Pipeline Kanban and Lead Management'),
(3, 1, 4, 2, 'CALL', 'Overdue contract negotiation call', CURRENT_TIMESTAMP - INTERVAL '1 day', 'OVERDUE', 'Finalize payment terms and billing cycle');

-- Seed Activities for Tenant 1
INSERT INTO lead_activities (id, tenant_id, lead_id, activity_type, title, description, performed_by, performed_at) VALUES
(1, 1, 1, 'CALL', 'Initial Discovery Call', 'Discussed current CRM pain points and team size of 50 reps.', 2, CURRENT_TIMESTAMP - INTERVAL '4 days'),
(2, 1, 2, 'EMAIL', 'Sent Proposal & Pricing Quotation', 'Emailed formal commercial quote #QUO-000018', 3, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(3, 1, 4, 'MEETING', 'In-person Executive Pitch', 'Met Singhania group directors in Gurgaon office.', 2, CURRENT_TIMESTAMP - INTERVAL '8 days');

-- Seed Opportunities for Tenant 1
INSERT INTO opportunities (id, public_id, tenant_id, opportunity_number, name, lead_id, pipeline_id, stage_id, amount, probability, expected_close_date, assigned_to, priority, status) VALUES
(1, 'opp-11111111-1111-1111-1111-111111111111', 1, 'OPP-000001', 'Acme CRM Deployment Deal', 1, 1, 3, 450000.00, 50, CURRENT_TIMESTAMP + INTERVAL '15 days', 2, 'HIGH', 'OPEN'),
(2, 'opp-22222222-2222-2222-2222-222222222222', 1, 'OPP-000002', 'BrightEdge Enterprise SaaS', 2, 1, 4, 780000.00, 80, CURRENT_TIMESTAMP + INTERVAL '7 days', 3, 'URGENT', 'OPEN'),
(3, 'opp-33333333-3333-3333-3333-333333333333', 1, 'OPP-000003', 'UrbanNest Realty Automation', 4, 1, 4, 1200000.00, 80, CURRENT_TIMESTAMP + INTERVAL '5 days', 2, 'HIGH', 'OPEN');
