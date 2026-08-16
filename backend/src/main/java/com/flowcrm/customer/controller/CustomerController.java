package com.flowcrm.customer.controller;

import com.flowcrm.common.ApiResponse;
import com.flowcrm.customer.entity.Contact;
import com.flowcrm.customer.entity.Customer;
import com.flowcrm.customer.service.ContactService;
import com.flowcrm.customer.service.CustomerService;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;
    private final ContactService contactService;

    @GetMapping
    @PreAuthorize("hasAuthority('CUSTOMER_VIEW') or hasAuthority('TENANT_ADMIN')")
    public ApiResponse<Page<Customer>> searchCustomers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        Page<Customer> customers = customerService.searchCustomers(search, type, status, pageRequest);
        return ApiResponse.success(customers, "Customers retrieved successfully.");
    }

    @PostMapping
    @PreAuthorize("hasAuthority('CUSTOMER_CREATE') or hasAuthority('TENANT_ADMIN')")
    public ApiResponse<Customer> createCustomer(@Valid @RequestBody CustomerRequest request) {
        Customer customer = Customer.builder()
                .customerType(request.getCustomerType() != null ? request.getCustomerType() : "COMPANY")
                .displayName(request.getDisplayName())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .companyName(request.getCompanyName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .website(request.getWebsite())
                .taxNumber(request.getTaxNumber())
                .industry(request.getIndustry())
                .customerStatus(request.getCustomerStatus() != null ? request.getCustomerStatus() : "ACTIVE")
                .billingAddress(request.getBillingAddress())
                .billingCity(request.getBillingCity())
                .billingCountry(request.getBillingCountry())
                .build();

        Customer created = customerService.createCustomer(customer);
        return ApiResponse.success(created, "Customer created successfully.");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('CUSTOMER_VIEW') or hasAuthority('TENANT_ADMIN')")
    public ApiResponse<Customer360Response> getCustomer360(@PathVariable Long id) {
        Customer customer = customerService.getCustomerById(id);
        List<Contact> contacts = contactService.getCustomerContacts(id);
        String health = customerService.calculateCustomerHealth(customer);

        Customer360Response response = Customer360Response.builder()
                .customer(customer)
                .contacts(contacts)
                .healthIndicator(health)
                .build();

        return ApiResponse.success(response, "Customer 360 view retrieved.");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('CUSTOMER_UPDATE') or hasAuthority('TENANT_ADMIN')")
    public ApiResponse<Customer> updateCustomer(@PathVariable Long id, @RequestBody CustomerRequest request) {
        Customer updatedData = Customer.builder()
                .displayName(request.getDisplayName())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .companyName(request.getCompanyName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .taxNumber(request.getTaxNumber())
                .industry(request.getIndustry())
                .customerStatus(request.getCustomerStatus())
                .billingAddress(request.getBillingAddress())
                .build();

        Customer updated = customerService.updateCustomer(id, updatedData);
        return ApiResponse.success(updated, "Customer updated successfully.");
    }

    @PatchMapping("/{id}/archive")
    @PreAuthorize("hasAuthority('CUSTOMER_UPDATE') or hasAuthority('TENANT_ADMIN')")
    public ApiResponse<Void> archiveCustomer(@PathVariable Long id) {
        customerService.archiveCustomer(id);
        return ApiResponse.success(null, "Customer archived.");
    }

    @PatchMapping("/{id}/restore")
    @PreAuthorize("hasAuthority('CUSTOMER_UPDATE') or hasAuthority('TENANT_ADMIN')")
    public ApiResponse<Void> restoreCustomer(@PathVariable Long id) {
        customerService.restoreCustomer(id);
        return ApiResponse.success(null, "Customer restored.");
    }

    @PostMapping("/duplicate-check")
    public ApiResponse<List<Customer>> duplicateCheck(@RequestBody DuplicateCheckRequest request) {
        List<Customer> duplicates = customerService.checkDuplicates(
                request.getEmail(), request.getPhone(), request.getTaxNumber(), request.getCompanyName()
        );
        return ApiResponse.success(duplicates, "Duplicate check completed.");
    }

    @GetMapping("/{id}/contacts")
    public ApiResponse<List<Contact>> getContacts(@PathVariable Long id) {
        return ApiResponse.success(contactService.getCustomerContacts(id));
    }

    @PostMapping("/{id}/contacts")
    public ApiResponse<Contact> addContact(@PathVariable Long id, @RequestBody ContactRequest request) {
        Contact contact = Contact.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .designation(request.getDesignation())
                .department(request.getDepartment())
                .email(request.getEmail())
                .phone(request.getPhone())
                .contactType(request.getContactType() != null ? request.getContactType() : "PRIMARY")
                .primary(request.isPrimary())
                .decisionMaker(request.isDecisionMaker())
                .build();

        Contact created = contactService.createContact(id, contact);
        return ApiResponse.success(created, "Contact added to customer.");
    }

    @Data
    public static class CustomerRequest {
        private String customerType;
        private String displayName;
        private String firstName;
        private String lastName;
        private String companyName;
        private String email;
        private String phone;
        private String website;
        private String taxNumber;
        private String industry;
        private String customerStatus;
        private String billingAddress;
        private String billingCity;
        private String billingCountry;
    }

    @Data
    @lombok.Builder
    public static class Customer360Response {
        private Customer customer;
        private List<Contact> contacts;
        private String healthIndicator;
    }

    @Data
    public static class DuplicateCheckRequest {
        private String email;
        private String phone;
        private String taxNumber;
        private String companyName;
    }

    @Data
    public static class ContactRequest {
        private String firstName;
        private String lastName;
        private String designation;
        private String department;
        private String email;
        private String phone;
        private String contactType;
        private boolean primary;
        private boolean decisionMaker;
    }
}
