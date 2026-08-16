package com.flowcrm.lead.service;

import com.flowcrm.common.exceptions.ResourceNotFoundException;
import com.flowcrm.common.exceptions.ValidationException;
import com.flowcrm.lead.entity.*;
import com.flowcrm.lead.repository.*;
import com.flowcrm.opportunity.entity.Opportunity;
import com.flowcrm.opportunity.repository.OpportunityRepository;
import com.flowcrm.pipeline.entity.Pipeline;
import com.flowcrm.pipeline.entity.PipelineStage;
import com.flowcrm.pipeline.repository.PipelineRepository;
import com.flowcrm.pipeline.repository.PipelineStageRepository;
import com.flowcrm.tenant.TenantContext;
import com.flowcrm.user.User;
import com.flowcrm.user.UserRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;
    private final LeadSourceRepository leadSourceRepository;
    private final LeadStatusRepository leadStatusRepository;
    private final TagRepository tagRepository;
    private final LeadNoteRepository leadNoteRepository;
    private final LeadActivityRepository leadActivityRepository;
    private final UserRepository userRepository;
    private final OpportunityRepository opportunityRepository;
    private final PipelineRepository pipelineRepository;
    private final PipelineStageRepository pipelineStageRepository;

    @Transactional(readOnly = true)
    public Page<Lead> searchLeads(String search, Long statusId, Long sourceId, String priority, Long assignedTo, Pageable pageable) {
        Long tenantId = TenantContext.getCurrentTenantId();

        Specification<Lead> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("tenantId"), tenantId));
            predicates.add(cb.isNull(root.get("deletedAt")));

            if (search != null && !search.isBlank()) {
                String term = "%" + search.toLowerCase() + "%";
                Predicate firstNameMatch = cb.like(cb.lower(root.get("firstName")), term);
                Predicate lastNameMatch = cb.like(cb.lower(root.get("lastName")), term);
                Predicate companyMatch = cb.like(cb.lower(root.get("companyName")), term);
                Predicate emailMatch = cb.like(cb.lower(root.get("email")), term);
                Predicate phoneMatch = cb.like(cb.lower(root.get("phone")), term);
                Predicate numberMatch = cb.like(cb.lower(root.get("leadNumber")), term);

                predicates.add(cb.or(firstNameMatch, lastNameMatch, companyMatch, emailMatch, phoneMatch, numberMatch));
            }

            if (statusId != null) {
                predicates.add(cb.equal(root.get("status").get("id"), statusId));
            }
            if (sourceId != null) {
                predicates.add(cb.equal(root.get("source").get("id"), sourceId));
            }
            if (priority != null && !priority.isBlank()) {
                predicates.add(cb.equal(root.get("priority"), priority));
            }
            if (assignedTo != null) {
                predicates.add(cb.equal(root.get("assignedTo").get("id"), assignedTo));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return leadRepository.findAll(spec, pageable);
    }

    @Transactional
    public Lead createLead(Lead leadData, Long sourceId, Long statusId, Long assignedToUserId) {
        Long tenantId = TenantContext.getCurrentTenantId();

        String leadNumber = generateLeadNumber(tenantId);
        leadData.setTenantId(tenantId);
        leadData.setLeadNumber(leadNumber);

        if (sourceId != null) {
            leadData.setSource(leadSourceRepository.findById(sourceId).orElse(null));
        } else {
            leadSourceRepository.findByTenantIdAndCode(tenantId, "WEBSITE").ifPresent(leadData::setSource);
        }

        if (statusId != null) {
            leadData.setStatus(leadStatusRepository.findById(statusId).orElse(null));
        } else {
            leadStatusRepository.findByTenantIdAndCode(tenantId, "NEW").ifPresent(leadData::setStatus);
        }

        if (assignedToUserId != null) {
            leadData.setAssignedTo(userRepository.findById(assignedToUserId).orElse(null));
        }

        Lead saved = leadRepository.save(leadData);

        // Record Initial Activity
        logActivity(saved.getId(), "LEAD_CREATED", "Lead Created", "Lead number " + leadNumber + " created in workspace.");
        return saved;
    }

    @Transactional(readOnly = true)
    public Lead getLeadById(Long id) {
        Long tenantId = TenantContext.getCurrentTenantId();
        return leadRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", id));
    }

    @Transactional
    public Lead updateLead(Long id, Lead updateData, Long sourceId, Long statusId, Long assignedToUserId) {
        Lead existing = getLeadById(id);

        existing.setFirstName(updateData.getFirstName());
        existing.setLastName(updateData.getLastName());
        existing.setCompanyName(updateData.getCompanyName());
        existing.setEmail(updateData.getEmail());
        existing.setPhone(updateData.getPhone());
        existing.setJobTitle(updateData.getJobTitle());
        existing.setPriority(updateData.getPriority());
        existing.setExpectedValue(updateData.getExpectedValue());
        existing.setIndustry(updateData.getIndustry());
        existing.setDescription(updateData.getDescription());

        if (sourceId != null) existing.setSource(leadSourceRepository.findById(sourceId).orElse(null));
        if (statusId != null) existing.setStatus(leadStatusRepository.findById(statusId).orElse(null));
        if (assignedToUserId != null) existing.setAssignedTo(userRepository.findById(assignedToUserId).orElse(null));

        Lead saved = leadRepository.save(existing);
        logActivity(saved.getId(), "LEAD_UPDATED", "Lead Updated", "Lead details updated.");
        return saved;
    }

    @Transactional
    public void deleteLead(Long id) {
        Lead lead = getLeadById(id);
        lead.setDeletedAt(Instant.now());
        leadRepository.save(lead);
    }

    @Transactional
    public void bulkAssign(List<Long> leadIds, Long assignedUserId) {
        Long tenantId = TenantContext.getCurrentTenantId();
        User user = userRepository.findById(assignedUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", assignedUserId));

        List<Lead> leads = leadRepository.findAllById(leadIds);
        for (Lead lead : leads) {
            if (lead.getTenantId().equals(tenantId)) {
                lead.setAssignedTo(user);
                logActivity(lead.getId(), "LEAD_ASSIGNED", "Bulk Assigned", "Lead assigned to " + user.getFirstName() + " " + user.getLastName());
            }
        }
        leadRepository.saveAll(leads);
    }

    @Transactional
    public Opportunity convertLeadToOpportunity(Long leadId, Long pipelineId, Long stageId, BigDecimal amount, String oppName) {
        Lead lead = getLeadById(leadId);

        Pipeline pipeline = pipelineRepository.findById(pipelineId)
                .orElseThrow(() -> new ResourceNotFoundException("Pipeline", "id", pipelineId));

        PipelineStage stage = pipelineStageRepository.findById(stageId)
                .orElseThrow(() -> new ResourceNotFoundException("PipelineStage", "id", stageId));

        Long tenantId = TenantContext.getCurrentTenantId();
        String oppNumber = "OPP-" + String.format("%06d", opportunityRepository.countByTenantId(tenantId) + 1);

        Opportunity opportunity = Opportunity.builder()
                .tenantId(tenantId)
                .opportunityNumber(oppNumber)
                .name(oppName != null && !oppName.isBlank() ? oppName : lead.getCompanyName() + " Opportunity")
                .lead(lead)
                .pipeline(pipeline)
                .stage(stage)
                .amount(amount != null ? amount : lead.getExpectedValue())
                .probability(stage.getProbability())
                .assignedTo(lead.getAssignedTo())
                .status("OPEN")
                .build();

        Opportunity savedOpp = opportunityRepository.save(opportunity);

        // Update Lead status to CONVERTED
        leadStatusRepository.findByTenantIdAndCode(tenantId, "CONVERTED").ifPresent(lead::setStatus);
        leadRepository.save(lead);

        logActivity(leadId, "LEAD_CONVERTED", "Converted to Opportunity", "Opportunity " + oppNumber + " created.");
        return savedOpp;
    }

    @Transactional
    public LeadNote addNote(Long leadId, String content) {
        Lead lead = getLeadById(leadId);
        Long tenantId = TenantContext.getCurrentTenantId();

        LeadNote note = LeadNote.builder()
                .tenantId(tenantId)
                .leadId(lead.getId())
                .content(content)
                .build();

        LeadNote saved = leadNoteRepository.save(note);
        logActivity(leadId, "NOTE_ADDED", "Note Added", content);
        return saved;
    }

    @Transactional(readOnly = true)
    public List<LeadNote> getNotes(Long leadId) {
        Long tenantId = TenantContext.getCurrentTenantId();
        return leadNoteRepository.findByTenantIdAndLeadIdOrderByCreatedAtDesc(tenantId, leadId);
    }

    @Transactional(readOnly = true)
    public List<LeadActivity> getActivities(Long leadId) {
        Long tenantId = TenantContext.getCurrentTenantId();
        return leadActivityRepository.findByTenantIdAndLeadIdOrderByPerformedAtDesc(tenantId, leadId);
    }

    public void logActivity(Long leadId, String type, String title, String description) {
        Long tenantId = TenantContext.getCurrentTenantId();
        LeadActivity activity = LeadActivity.builder()
                .tenantId(tenantId)
                .leadId(leadId)
                .activityType(type)
                .title(title)
                .description(description)
                .performedAt(Instant.now())
                .build();
        leadActivityRepository.save(activity);
    }

    private synchronized String generateLeadNumber(Long tenantId) {
        long count = leadRepository.countByTenantId(tenantId) + 1;
        return String.format("LD-%06d", count);
    }
}
