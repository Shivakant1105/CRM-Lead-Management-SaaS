package com.flowcrm.customer.service;

import com.flowcrm.common.exceptions.ResourceNotFoundException;
import com.flowcrm.customer.entity.Contact;
import com.flowcrm.customer.entity.Customer;
import com.flowcrm.customer.repository.ContactRepository;
import com.flowcrm.customer.repository.CustomerRepository;
import com.flowcrm.tenant.TenantContext;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final ContactRepository contactRepository;

    @Transactional(readOnly = true)
    public Page<Customer> searchCustomers(String search, String type, String status, Pageable pageable) {
        Long tenantId = TenantContext.getCurrentTenantId();

        Specification<Customer> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("tenantId"), tenantId));
            predicates.add(cb.equal(root.get("archived"), false));

            if (search != null && !search.isBlank()) {
                String term = "%" + search.toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("displayName")), term);
                Predicate companyMatch = cb.like(cb.lower(root.get("companyName")), term);
                Predicate emailMatch = cb.like(cb.lower(root.get("email")), term);
                Predicate phoneMatch = cb.like(cb.lower(root.get("phone")), term);
                Predicate numMatch = cb.like(cb.lower(root.get("customerNumber")), term);

                predicates.add(cb.or(nameMatch, companyMatch, emailMatch, phoneMatch, numMatch));
            }

            if (type != null && !type.isBlank()) {
                predicates.add(cb.equal(root.get("customerType"), type));
            }
            if (status != null && !status.isBlank()) {
                predicates.add(cb.equal(root.get("customerStatus"), status));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return customerRepository.findAll(spec, pageable);
    }

    @Transactional
    public Customer createCustomer(Customer customer) {
        Long tenantId = TenantContext.getCurrentTenantId();
        customer.setTenantId(tenantId);

        String customerNumber = generateCustomerNumber(tenantId);
        customer.setCustomerNumber(customerNumber);

        if (customer.getDisplayName() == null || customer.getDisplayName().isBlank()) {
            if ("COMPANY".equalsIgnoreCase(customer.getCustomerType())) {
                customer.setDisplayName(customer.getCompanyName());
            } else {
                customer.setDisplayName(customer.getFirstName() + " " + customer.getLastName());
            }
        }

        return customerRepository.save(customer);
    }

    @Transactional(readOnly = true)
    public Customer getCustomerById(Long id) {
        Long tenantId = TenantContext.getCurrentTenantId();
        return customerRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));
    }

    @Transactional
    public Customer updateCustomer(Long id, Customer updatedData) {
        Customer existing = getCustomerById(id);

        existing.setDisplayName(updatedData.getDisplayName());
        existing.setFirstName(updatedData.getFirstName());
        existing.setLastName(updatedData.getLastName());
        existing.setCompanyName(updatedData.getCompanyName());
        existing.setEmail(updatedData.getEmail());
        existing.setPhone(updatedData.getPhone());
        existing.setTaxNumber(updatedData.getTaxNumber());
        existing.setIndustry(updatedData.getIndustry());
        existing.setCustomerStatus(updatedData.getCustomerStatus());
        existing.setBillingAddress(updatedData.getBillingAddress());
        existing.setShippingAddress(updatedData.getShippingAddress());

        return customerRepository.save(existing);
    }

    @Transactional
    public void archiveCustomer(Long id) {
        Customer customer = getCustomerById(id);
        customer.setArchived(true);
        customerRepository.save(customer);
    }

    @Transactional
    public void restoreCustomer(Long id) {
        Customer customer = getCustomerById(id);
        customer.setArchived(false);
        customerRepository.save(customer);
    }

    @Transactional(readOnly = true)
    public List<Customer> checkDuplicates(String email, String phone, String taxNumber, String companyName) {
        Long tenantId = TenantContext.getCurrentTenantId();
        return customerRepository.findByTenantIdAndEmailOrPhoneOrTaxNumberOrCompanyName(
                tenantId, email, phone, taxNumber, companyName
        );
    }

    public String calculateCustomerHealth(Customer customer) {
        // Business engagement health indicator
        if ("BLOCKED".equalsIgnoreCase(customer.getCustomerStatus())) {
            return "At Risk";
        }
        if ("INACTIVE".equalsIgnoreCase(customer.getCustomerStatus())) {
            return "Needs Attention";
        }
        return "Healthy";
    }

    private synchronized String generateCustomerNumber(Long tenantId) {
        long count = customerRepository.countByTenantId(tenantId) + 1;
        return String.format("CUS-%06d", count);
    }
}
