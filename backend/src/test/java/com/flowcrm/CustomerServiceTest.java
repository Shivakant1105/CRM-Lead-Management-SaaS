package com.flowcrm;

import com.flowcrm.customer.entity.Contact;
import com.flowcrm.customer.entity.Customer;
import com.flowcrm.customer.repository.ContactRepository;
import com.flowcrm.customer.repository.CustomerRepository;
import com.flowcrm.customer.service.ContactService;
import com.flowcrm.customer.service.CustomerService;
import com.flowcrm.tenant.Tenant;
import com.flowcrm.tenant.TenantContext;
import com.flowcrm.tenant.TenantRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class CustomerServiceTest {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private ContactService contactService;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private TenantRepository tenantRepository;

    private Tenant tenant;

    @BeforeEach
    public void setUp() {
        tenant = tenantRepository.save(Tenant.builder()
                .name("Phase3 Demo Tenant")
                .slug("phase3-demo")
                .status("ACTIVE")
                .build());

        TenantContext.setCurrentTenantId(tenant.getId());
    }

    @Test
    @DisplayName("Create Customer generates tenant-safe customer number CUS-000001")
    public void testCreateCustomerAutoNumber() {
        Customer customerData = Customer.builder()
                .displayName("Acme Global Pvt Ltd")
                .companyName("Acme Global")
                .customerType("COMPANY")
                .email("info@acmeglobal.com")
                .build();

        Customer created = customerService.createCustomer(customerData);
        assertNotNull(created.getId());
        assertEquals("CUS-000001", created.getCustomerNumber());
        assertEquals(tenant.getId(), created.getTenantId());
    }

    @Test
    @DisplayName("Transactional Primary Contact toggle clears primary flag on existing contacts")
    public void testPrimaryContactToggle() {
        Customer customer = customerService.createCustomer(Customer.builder()
                .displayName("BrightEdge Corp")
                .customerType("COMPANY")
                .build());

        Contact contact1 = contactService.createContact(customer.getId(), Contact.builder()
                .firstName("Rohan")
                .lastName("Deshmukh")
                .email("rohan@brightedge.io")
                .primary(true)
                .build());

        assertTrue(contact1.isPrimary());

        Contact contact2 = contactService.createContact(customer.getId(), Contact.builder()
                .firstName("Sunita")
                .lastName("Rao")
                .email("sunita@brightedge.io")
                .primary(true)
                .build());

        assertTrue(contact2.isPrimary());

        Contact reloadedContact1 = contactRepository.findById(contact1.getId()).orElseThrow();
        assertFalse(reloadedContact1.isPrimary(), "Contact 1 primary flag must be automatically cleared when Contact 2 becomes primary");
    }

    @Test
    @DisplayName("Customer duplicate check finds existing customer by email or company name")
    public void testDuplicateCheck() {
        customerService.createCustomer(Customer.builder()
                .displayName("UrbanNest Realty")
                .companyName("UrbanNest Realty")
                .email("office@urbannest.com")
                .taxNumber("GSTIN12345")
                .build());

        List<Customer> duplicates = customerService.checkDuplicates("office@urbannest.com", null, null, null);
        assertFalse(duplicates.isEmpty());
        assertEquals("UrbanNest Realty", duplicates.get(0).getDisplayName());
    }
}
