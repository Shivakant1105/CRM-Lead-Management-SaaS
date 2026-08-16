package com.flowcrm.opportunity.controller;

import com.flowcrm.common.ApiResponse;
import com.flowcrm.opportunity.entity.Opportunity;
import com.flowcrm.opportunity.service.OpportunityService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/opportunities")
@RequiredArgsConstructor
public class OpportunityController {

    private final OpportunityService opportunityService;

    @GetMapping
    @PreAuthorize("hasAuthority('LEAD_VIEW') or hasAuthority('TENANT_ADMIN')")
    public ApiResponse<List<Opportunity>> getOpportunities(@RequestParam(defaultValue = "1") Long pipelineId) {
        List<Opportunity> opportunities = opportunityService.getTenantOpportunities(pipelineId);
        return ApiResponse.success(opportunities, "Opportunities retrieved.");
    }

    @PatchMapping("/{id}/stage")
    @PreAuthorize("hasAuthority('LEAD_UPDATE') or hasAuthority('TENANT_ADMIN')")
    public ApiResponse<Opportunity> updateStage(@PathVariable Long id, @RequestBody StagePatchRequest request) {
        Opportunity updated = opportunityService.updateOpportunityStage(id, request.getStageId());
        return ApiResponse.success(updated, "Opportunity stage updated.");
    }

    @Data
    public static class StagePatchRequest {
        private Long stageId;
    }
}
