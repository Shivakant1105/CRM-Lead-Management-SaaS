package com.flowcrm.customer.service;

import com.flowcrm.common.exceptions.ResourceNotFoundException;
import com.flowcrm.customer.entity.Contact;
import com.flowcrm.customer.repository.ContactRepository;
import com.flowcrm.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;

    @Transactional(readOnly = true)
    public List<Contact> getCustomerContacts(Long customerId) {
        Long tenantId = TenantContext.getCurrentTenantId();
        return contactRepository.findByTenantIdAndCustomerIdAndDeletedAtIsNull(tenantId, customerId);
    }

    @Transactional
    public Contact createContact(Long customerId, Contact contactData) {
        Long tenantId = TenantContext.getCurrentTenantId();
        contactData.setTenantId(tenantId);
        contactData.setCustomerId(customerId);

        if (contactData.isPrimary()) {
            contactRepository.clearPrimaryContacts(tenantId, customerId);
        }

        return contactRepository.save(contactData);
    }

    @Transactional
    public Contact updateContact(Long id, Contact updateData) {
        Long tenantId = TenantContext.getCurrentTenantId();
        Contact existing = contactRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact", "id", id));

        if (updateData.isPrimary() && !existing.isPrimary()) {
            contactRepository.clearPrimaryContacts(tenantId, existing.getCustomerId());
        }

        existing.setFirstName(updateData.getFirstName());
        existing.setLastName(updateData.getLastName());
        existing.setDesignation(updateData.getDesignation());
        existing.setDepartment(updateData.getDepartment());
        existing.setEmail(updateData.getEmail());
        existing.setPhone(updateData.getPhone());
        existing.setPrimary(updateData.isPrimary());
        existing.setDecisionMaker(updateData.isDecisionMaker());

        return contactRepository.save(existing);
    }

    @Transactional
    public void deleteContact(Long id) {
        Long tenantId = TenantContext.getCurrentTenantId();
        Contact contact = contactRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact", "id", id));
        contactRepository.delete(contact);
    }
}
