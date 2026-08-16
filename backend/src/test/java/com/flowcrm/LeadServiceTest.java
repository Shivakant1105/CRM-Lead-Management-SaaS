package com.flowcrm;

import com.flowcrm.lead.entity.Lead;
import com.flowcrm.lead.entity.LeadStatus;
import com.flowcrm.lead.repository.LeadRepository;
import com.flowcrm.lead.repository.LeadStatusRepository;
import com.flowcrm.lead.service.LeadService;
import com.flowcrm.opportunity.entity.Opportunity;
import com.flowcrm.opportunity.service.OpportunityService;
import com.flowcrm.pipeline.entity.Pipeline;
import com.flowcrm.pipeline.entity.PipelineStage;
import com.flowcrm.pipeline.repository.PipelineRepository;
import com.flowcrm.pipeline.repository.PipelineStageRepository;
import com.flowcrm.tenant.Tenant;
import com.flowcrm.tenant.TenantContext;
import com.flowcrm.tenant.TenantRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class LeadServiceTest {

    @Autowired
    private LeadService leadService;

    @Autowired
    private LeadRepository leadRepository;

    @Autowired
    private LeadStatusRepository leadStatusRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private PipelineRepository pipelineRepository;

    @Autowired
    private PipelineStageRepository pipelineStageRepository;

    @Autowired
    private OpportunityService opportunityService;

    private Tenant tenant;
    private Pipeline pipeline;
    private PipelineStage stage1;
    private PipelineStage stage2;

    @BeforeEach
    public void setUp() {
        tenant = tenantRepository.save(Tenant.builder()
                .name("Phase2 Demo Tenant")
                .slug("phase2-demo")
                .status("ACTIVE")
                .build());

        TenantContext.setCurrentTenantId(tenant.getId());

        leadStatusRepository.save(LeadStatus.builder()
                .tenantId(tenant.getId())
                .name("New")
                .code("NEW")
                .build());

        leadStatusRepository.save(LeadStatus.builder()
                .tenantId(tenant.getId())
                .name("Converted")
                .code("CONVERTED")
                .build());

        pipeline = pipelineRepository.save(Pipeline.builder()
                .tenantId(tenant.getId())
                .name("Test Pipeline")
                .isDefault(true)
                .build());

        stage1 = pipelineStageRepository.save(PipelineStage.builder()
                .pipeline(pipeline)
                .name("Prospect")
                .probability(10)
                .displayOrder(1)
                .build());

        stage2 = pipelineStageRepository.save(PipelineStage.builder()
                .pipeline(pipeline)
                .name("Closed Won")
                .probability(100)
                .won(true)
                .displayOrder(2)
                .build());
    }

    @Test
    @DisplayName("Create Lead generates tenant-safe lead number LD-000001")
    public void testCreateLeadAutoNumber() {
        Lead leadData = Lead.builder()
                .firstName("Shiva")
                .lastName("Kant")
                .companyName("FlowCRM Enterprise")
                .email("shiva@flowcrm.local")
                .expectedValue(new BigDecimal("500000.00"))
                .priority("HIGH")
                .build();

        Lead created = leadService.createLead(leadData, null, null, null);
        assertNotNull(created.getId());
        assertEquals("LD-000001", created.getLeadNumber());
        assertEquals(tenant.getId(), created.getTenantId());
    }

    @Test
    @DisplayName("Convert Lead to Opportunity updates Lead status to CONVERTED")
    public void testConvertLeadToOpportunity() {
        Lead lead = leadService.createLead(Lead.builder()
                .firstName("John")
                .lastName("Doe")
                .companyName("Acme Corp")
                .expectedValue(new BigDecimal("250000.00"))
                .build(), null, null, null);

        Opportunity opp = leadService.convertLeadToOpportunity(
                lead.getId(), pipeline.getId(), stage1.getId(), new BigDecimal("250000.00"), "Acme Enterprise Deal"
        );

        assertNotNull(opp.getId());
        assertEquals("OPP-000001", opp.getOpportunityNumber());
        assertEquals(lead.getId(), opp.getLead().getId());

        Lead updatedLead = leadService.getLeadById(lead.getId());
        assertEquals("CONVERTED", updatedLead.getStatus().getCode());
    }

    @Test
    @DisplayName("Kanban Stage movement updates opportunity status to WON when moving to Won stage")
    public void testKanbanStageMovement() {
        Lead lead = leadService.createLead(Lead.builder()
                .firstName("Jane")
                .lastName("Smith")
                .companyName("TechCorp")
                .build(), null, null, null);

        Opportunity opp = leadService.convertLeadToOpportunity(
                lead.getId(), pipeline.getId(), stage1.getId(), new BigDecimal("100000.00"), "TechCorp Deal"
        );

        assertEquals("OPEN", opp.getStatus());

        Opportunity moved = opportunityService.updateOpportunityStage(opp.getId(), stage2.getId());
        assertEquals("WON", moved.getStatus());
        assertEquals(100, moved.getProbability());
    }
}
