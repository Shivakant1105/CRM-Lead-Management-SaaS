package com.flowcrm.followup.service;

import com.flowcrm.common.exceptions.ResourceNotFoundException;
import com.flowcrm.followup.entity.FollowUp;
import com.flowcrm.followup.repository.FollowUpRepository;
import com.flowcrm.lead.entity.Lead;
import com.flowcrm.lead.repository.LeadRepository;
import com.flowcrm.tenant.TenantContext;
import com.flowcrm.user.User;
import com.flowcrm.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FollowUpService {

    private final FollowUpRepository followUpRepository;
    private final LeadRepository leadRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<FollowUp> getTenantFollowUps(String filter) {
        Long tenantId = TenantContext.getCurrentTenantId();
        Instant now = Instant.now();

        if ("OVERDUE".equalsIgnoreCase(filter)) {
            return followUpRepository.findOverdueFollowUps(tenantId, now);
        } else if ("COMPLETED".equalsIgnoreCase(filter)) {
            return followUpRepository.findByTenantIdAndStatusOrderByScheduledAtAsc(tenantId, "COMPLETED");
        }
        return followUpRepository.findByTenantIdOrderByScheduledAtAsc(tenantId);
    }

    @Transactional
    public FollowUp createFollowUp(Long leadId, Long assignedToUserId, String type, String title, Instant scheduledAt, String notes) {
        Long tenantId = TenantContext.getCurrentTenantId();

        Lead lead = null;
        if (leadId != null) {
            lead = leadRepository.findByIdAndTenantId(leadId, tenantId).orElse(null);
        }

        User assignedTo = null;
        if (assignedToUserId != null) {
            assignedTo = userRepository.findById(assignedToUserId).orElse(null);
        }

        FollowUp followUp = FollowUp.builder()
                .tenantId(tenantId)
                .lead(lead)
                .assignedTo(assignedTo)
                .type(type)
                .title(title)
                .scheduledAt(scheduledAt)
                .notes(notes)
                .status("PENDING")
                .build();

        FollowUp saved = followUpRepository.save(followUp);

        if (lead != null) {
            lead.setNextFollowupAt(scheduledAt);
            leadRepository.save(lead);
        }

        return saved;
    }

    @Transactional
    public FollowUp completeFollowUp(Long id, String notes) {
        Long tenantId = TenantContext.getCurrentTenantId();
        FollowUp followUp = followUpRepository.findById(id)
                .filter(f -> f.getTenantId().equals(tenantId))
                .orElseThrow(() -> new ResourceNotFoundException("FollowUp", "id", id));

        followUp.setStatus("COMPLETED");
        followUp.setCompletedAt(Instant.now());
        if (notes != null) followUp.setNotes(notes);

        return followUpRepository.save(followUp);
    }

    @Transactional
    public FollowUp rescheduleFollowUp(Long id, Instant newScheduledAt) {
        Long tenantId = TenantContext.getCurrentTenantId();
        FollowUp followUp = followUpRepository.findById(id)
                .filter(f -> f.getTenantId().equals(tenantId))
                .orElseThrow(() -> new ResourceNotFoundException("FollowUp", "id", id));

        followUp.setScheduledAt(newScheduledAt);
        if (followUp.getStatus().equals("OVERDUE")) {
            followUp.setStatus("PENDING");
        }

        FollowUp saved = followUpRepository.save(followUp);

        if (saved.getLead() != null) {
            saved.getLead().setNextFollowupAt(newScheduledAt);
            leadRepository.save(saved.getLead());
        }

        return saved;
    }
}
