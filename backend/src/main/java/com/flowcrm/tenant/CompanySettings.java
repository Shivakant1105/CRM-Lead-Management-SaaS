package com.flowcrm.tenant;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "company_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanySettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id", nullable = false, unique = true)
    private Long tenantId;

    @Column(name = "company_name", nullable = false, length = 100)
    private String companyName;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(length = 100)
    private String email;

    @Column(length = 30)
    private String phone;

    private String website;

    private String address;

    @Column(name = "tax_number", length = 50)
    private String taxNumber;

    @Column(length = 10)
    @Builder.Default
    private String currency = "INR";

    @Column(length = 50)
    @Builder.Default
    private String timezone = "Asia/Kolkata";

    @Column(name = "invoice_prefix", length = 10)
    @Builder.Default
    private String invoicePrefix = "INV-";

    @Column(name = "quotation_prefix", length = 10)
    @Builder.Default
    private String quotationPrefix = "QUO-";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
