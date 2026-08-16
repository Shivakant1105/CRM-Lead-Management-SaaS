package com.flowcrm.customer.repository;

import com.flowcrm.customer.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long>, JpaSpecificationExecutor<Customer> {
    Optional<Customer> findByIdAndTenantId(Long id, Long tenantId);
    long countByTenantId(Long tenantId);
    List<Customer> findByTenantIdAndEmailOrPhoneOrTaxNumberOrCompanyName(Long tenantId, String email, String phone, String taxNumber, String companyName);
}
