package com.flowcrm.customer.repository;

import com.flowcrm.customer.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    List<Contact> findByTenantIdAndCustomerIdAndDeletedAtIsNull(Long tenantId, Long customerId);
    Optional<Contact> findByIdAndTenantId(Long id, Long tenantId);

    @Modifying
    @Query("UPDATE Contact c SET c.primary = false WHERE c.tenantId = :tenantId AND c.customerId = :customerId")
    void clearPrimaryContacts(Long tenantId, Long customerId);
}
