package com.flowcrm.lead.entity;

import com.flowcrm.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "lead_activities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Column(name = "lead_id", nullable = false)
    private Long leadId;

    @Column(name = "activity_type", nullable = false, length = 30)
    private String activityType; // CALL, EMAIL, MEETING, WHATSAPP, DEMO, SITE_VISIT, NOTE, STATUS_CHANGE

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "performed_by")
    private User performedBy;

    @CreationTimestamp
    @Column(name = "performed_at", updatable = false)
    private Instant performedAt;

    @Column(name = "metadata_json", columnDefinition = "TEXT")
    private String metadataJson;
}
