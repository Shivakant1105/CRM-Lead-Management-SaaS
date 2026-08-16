package com.flowcrm.customer.entity;

import com.flowcrm.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "customers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "public_id", nullable = false, unique = true, updatable = false)
    private UUID publicId;

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Column(name = "customer_number", nullable = false, length = 30)
    private String customerNumber;

    @Column(name = "customer_type", nullable = false, length = 20)
    @Builder.Default
    private String customerType = "COMPANY"; // INDIVIDUAL, COMPANY

    @Column(name = "display_name", nullable = false, length = 150)
    private String displayName;

    @Column(name = "first_name", length = 50)
    private String firstName;

    @Column(name = "last_name", length = 50)
    private String lastName;

    @Column(name = "company_name", length = 100)
    private String companyName;

    @Column(length = 100)
    private String email;

    @Column(length = 30)
    private String phone;

    @Column(name = "alternate_phone", length = 30)
    private String alternatePhone;

    private String website;

    @Column(name = "tax_number", length = 50)
    private String taxNumber;

    @Column(length = 50)
    private String industry;

    @Column(name = "customer_status", nullable = false, length = 20)
    @Builder.Default
    private String customerStatus = "ACTIVE"; // ACTIVE, INACTIVE, PROSPECT, BLOCKED

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @Column(name = "source_id")
    private Long sourceId;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "billing_address")
    private String billingAddress;

    @Column(name = "billing_city", length = 50)
    private String billingCity;

    @Column(name = "billing_state", length = 50)
    private String billingState;

    @Column(name = "billing_country", length = 50)
    private String billingCountry;

    @Column(name = "billing_postal_code", length = 20)
    private String billingPostalCode;

    @Column(name = "shipping_address")
    private String shippingAddress;

    @Column(name = "shipping_city", length = 50)
    private String shippingCity;

    @Column(name = "shipping_state", length = 50)
    private String shippingState;

    @Column(name = "shipping_country", length = 50)
    private String shippingCountry;

    @Column(name = "shipping_postal_code", length = 20)
    private String shippingPostalCode;

    @Column(name = "is_archived", nullable = false)
    @Builder.Default
    private boolean archived = false;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "updated_by")
    private Long updatedBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    @PrePersist
    public void ensurePublicId() {
        if (publicId == null) {
            publicId = UUID.randomUUID();
        }
    }
}
