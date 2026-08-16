package com.flowcrm.followup.controller;

import com.flowcrm.common.ApiResponse;
import com.flowcrm.followup.entity.FollowUp;
import com.flowcrm.followup.service.FollowUpService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/v1/follow-ups")
@RequiredArgsConstructor
public class FollowUpController {

    private final FollowUpService followUpService;

    @GetMapping
    @PreAuthorize("hasAuthority('LEAD_VIEW') or hasAuthority('TENANT_ADMIN')")
    public ApiResponse<List<FollowUp>> getFollowUps(@RequestParam(required = false) String filter) {
        List<FollowUp> followUps = followUpService.getTenantFollowUps(filter);
        return ApiResponse.success(followUps, "Follow-ups retrieved.");
    }

    @PostMapping
    @PreAuthorize("hasAuthority('LEAD_UPDATE') or hasAuthority('TENANT_ADMIN')")
    public ApiResponse<FollowUp> createFollowUp(@RequestBody FollowUpRequest request) {
        FollowUp followUp = followUpService.createFollowUp(
                request.getLeadId(),
                request.getAssignedToUserId(),
                request.getType(),
                request.getTitle(),
                request.getScheduledAt(),
                request.getNotes()
        );
        return ApiResponse.success(followUp, "Follow-up scheduled successfully.");
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasAuthority('LEAD_UPDATE') or hasAuthority('TENANT_ADMIN')")
    public ApiResponse<FollowUp> completeFollowUp(@PathVariable Long id, @RequestBody(required = false) CompleteRequest request) {
        String notes = request != null ? request.getNotes() : null;
        FollowUp completed = followUpService.completeFollowUp(id, notes);
        return ApiResponse.success(completed, "Follow-up marked as completed.");
    }

    @PutMapping("/{id}/reschedule")
    @PreAuthorize("hasAuthority('LEAD_UPDATE') or hasAuthority('TENANT_ADMIN')")
    public ApiResponse<FollowUp> rescheduleFollowUp(@PathVariable Long id, @RequestBody RescheduleRequest request) {
        FollowUp rescheduled = followUpService.rescheduleFollowUp(id, request.getNewScheduledAt());
        return ApiResponse.success(rescheduled, "Follow-up rescheduled successfully.");
    }

    @Data
    public static class FollowUpRequest {
        private Long leadId;
        private Long assignedToUserId;
        private String type;
        private String title;
        private Instant scheduledAt;
        private String notes;
    }

    @Data
    public static class CompleteRequest {
        private String notes;
    }

    @Data
    public static class RescheduleRequest {
        private Instant newScheduledAt;
    }
}
