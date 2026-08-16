package com.flowcrm.opportunity.service;

import com.flowcrm.common.exceptions.ResourceNotFoundException;
import com.flowcrm.lead.service.LeadService;
import com.flowcrm.opportunity.entity.Opportunity;
import com.flowcrm.opportunity.repository.OpportunityRepository;
import com.flowcrm.pipeline.entity.PipelineStage;
import com.flowcrm.pipeline.repository.PipelineStageRepository;
import com.flowcrm.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OpportunityService {

    private final OpportunityRepository opportunityRepository;
    private final PipelineStageRepository pipelineStageRepository;
    private final LeadService leadService;

    @Transactional(readOnly = true)
    public List<Opportunity> getTenantOpportunities(Long pipelineId) {
        Long tenantId = TenantContext.getCurrentTenantId();
        return opportunityRepository.findByTenantIdAndPipelineId(tenantId, pipelineId);
    }

    @Transactional
    public Opportunity updateOpportunityStage(Long opportunityId, Long stageId) {
        Long tenantId = TenantContext.getCurrentTenantId();
        Opportunity opportunity = opportunityRepository.findByIdAndTenantId(opportunityId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Opportunity", "id", opportunityId));

        PipelineStage newStage = pipelineStageRepository.findById(stageId)
                .orElseThrow(() -> new ResourceNotFoundException("PipelineStage", "id", stageId));

        String oldStageName = opportunity.getStage().getName();
        opportunity.setStage(newStage);
        opportunity.setProbability(newStage.getProbability());

        if (newStage.isWon()) {
            opportunity.setStatus("WON");
        } else if (newStage.isLost()) {
            opportunity.setStatus("LOST");
        } else {
            opportunity.setStatus("OPEN");
        }

        Opportunity updated = opportunityRepository.save(opportunity);

        if (updated.getLead() != null) {
            leadService.logActivity(
                    updated.getLead().getId(),
                    "STATUS_CHANGE",
                    "Pipeline Stage Moved",
                    "Opportunity moved from " + oldStageName + " to " + newStage.getName()
            );
        }

        return updated;
    }
}
