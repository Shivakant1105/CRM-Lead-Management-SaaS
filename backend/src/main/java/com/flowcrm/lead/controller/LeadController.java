package com.flowcrm.lead.controller;

import com.flowcrm.common.ApiResponse;
import com.flowcrm.lead.entity.*;
import com.flowcrm.lead.repository.LeadSourceRepository;
import com.flowcrm.lead.repository.LeadStatusRepository;
import com.flowcrm.lead.service.LeadService;
import com.flowcrm.opportunity.entity.Opportunity;
import com.flowcrm.tenant.TenantContext;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;
    private final LeadSourceRepository leadSourceRepository;
    private final LeadStatusRepository leadStatusRepository;

    @GetMapping
    @PreAuthorize("hasAuthority('LEAD_VIEW') or hasAuthority('TENANT_ADMIN')")
    public ApiResponse<Page<Lead>> searchLeads(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long statusId,
            @RequestParam(required = false) Long sourceId,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) Long assignedTo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        Page<Lead> leads = leadService.searchLeads(search, statusId, sourceId, priority, assignedTo, pageRequest);
        return ApiResponse.success(leads, "Leads retrieved successfully.");
    }

    @PostMapping
    @PreAuthorize("hasAuthority('LEAD_CREATE') or hasAuthority('TENANT_ADMIN')")
    public ApiResponse<Lead> createLead(@Valid @RequestBody LeadRequest request) {
        Lead lead = Lead.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .companyName(request.getCompanyName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .jobTitle(request.getJobTitle())
                .website(request.getWebsite())
                .priority(request.getPriority() != null ? request.getPriority() : "MEDIUM")
                .expectedValue(request.getExpectedValue())
                .industry(request.getIndustry())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .country(request.getCountry())
                .description(request.getDescription())
                .build();

        Lead created = leadService.createLead(lead, request.getSourceId(), request.getStatusId(), request.getAssignedToUserId());
        return ApiResponse.success(created, "Lead created successfully.");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('LEAD_VIEW') or hasAuthority('TENANT_ADMIN')")
    public ApiResponse<Lead> getLeadById(@PathVariable Long id) {
        Lead lead = leadService.getLeadById(id);
        return ApiResponse.success(lead, "Lead details retrieved.");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('LEAD_UPDATE') or hasAuthority('TENANT_ADMIN')")
    public ApiResponse<Lead> updateLead(@PathVariable Long id, @RequestBody LeadRequest request) {
        Lead updateData = Lead.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .companyName(request.getCompanyName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .jobTitle(request.getJobTitle())
                .priority(request.getPriority())
                .expectedValue(request.getExpectedValue())
                .industry(request.getIndustry())
                .description(request.getDescription())
                .build();

        Lead updated = leadService.updateLead(id, updateData, request.getSourceId(), request.getStatusId(), request.getAssignedToUserId());
        return ApiResponse.success(updated, "Lead updated successfully.");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('LEAD_DELETE') or hasAuthority('TENANT_ADMIN')")
    public ApiResponse<Void> deleteLead(@PathVariable Long id) {
        leadService.deleteLead(id);
        return ApiResponse.success(null, "Lead deleted successfully.");
    }

    @PostMapping("/bulk/assign")
    @PreAuthorize("hasAuthority('LEAD_UPDATE') or hasAuthority('TENANT_ADMIN')")
    public ApiResponse<Void> bulkAssign(@RequestBody BulkAssignRequest request) {
        leadService.bulkAssign(request.getLeadIds(), request.getAssignedUserId());
        return ApiResponse.success(null, "Leads assigned successfully.");
    }

    @PostMapping("/{id}/convert")
    @PreAuthorize("hasAuthority('LEAD_UPDATE') or hasAuthority('TENANT_ADMIN')")
    public ApiResponse<Opportunity> convertToOpportunity(@PathVariable Long id, @RequestBody ConvertRequest request) {
        Opportunity opportunity = leadService.convertLeadToOpportunity(
                id, request.getPipelineId(), request.getStageId(), request.getAmount(), request.getOpportunityName()
        );
        return ApiResponse.success(opportunity, "Lead successfully converted to Opportunity.");
    }

    @GetMapping("/{id}/notes")
    @PreAuthorize("hasAuthority('LEAD_VIEW') or hasAuthority('TENANT_ADMIN')")
    public ApiResponse<List<LeadNote>> getNotes(@PathVariable Long id) {
        return ApiResponse.success(leadService.getNotes(id), "Notes retrieved.");
    }

    @PostMapping("/{id}/notes")
    @PreAuthorize("hasAuthority('LEAD_UPDATE') or hasAuthority('TENANT_ADMIN')")
    public ApiResponse<LeadNote> addNote(@PathVariable Long id, @RequestBody NoteRequest request) {
        return ApiResponse.success(leadService.addNote(id, request.getContent()), "Note added successfully.");
    }

    @GetMapping("/{id}/activities")
    @PreAuthorize("hasAuthority('LEAD_VIEW') or hasAuthority('TENANT_ADMIN')")
    public ApiResponse<List<LeadActivity>> getActivities(@PathVariable Long id) {
        return ApiResponse.success(leadService.getActivities(id), "Activities retrieved.");
    }

    @GetMapping("/sources")
    public ApiResponse<List<LeadSource>> getSources() {
        Long tenantId = TenantContext.getCurrentTenantId();
        return ApiResponse.success(leadSourceRepository.findByTenantIdAndActiveTrueOrderByDisplayOrderAsc(tenantId));
    }

    @GetMapping("/statuses")
    public ApiResponse<List<LeadStatus>> getStatuses() {
        Long tenantId = TenantContext.getCurrentTenantId();
        return ApiResponse.success(leadStatusRepository.findByTenantIdAndActiveTrueOrderByDisplayOrderAsc(tenantId));
    }

    @Data
    public static class LeadRequest {
        private String firstName;
        private String lastName;
        private String companyName;
        private String email;
        private String phone;
        private String jobTitle;
        private String website;
        private Long sourceId;
        private Long statusId;
        private String priority;
        private Long assignedToUserId;
        private BigDecimal expectedValue;
        private String industry;
        private String address;
        private String city;
        private String state;
        private String country;
        private String description;
    }

    @Data
    public static class BulkAssignRequest {
        private List<Long> leadIds;
        private Long assignedUserId;
    }

    @Data
    public static class ConvertRequest {
        private Long pipelineId;
        private Long stageId;
        private BigDecimal amount;
        private String opportunityName;
    }

    @Data
    public static class NoteRequest {
        private String content;
    }
}
