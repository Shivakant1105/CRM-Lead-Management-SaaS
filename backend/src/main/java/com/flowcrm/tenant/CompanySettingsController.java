package com.flowcrm.tenant;

import com.flowcrm.common.ApiResponse;
import com.flowcrm.common.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/settings/company")
@RequiredArgsConstructor
public class CompanySettingsController {

    private final CompanySettingsRepository companySettingsRepository;

    @GetMapping
    @PreAuthorize("hasAuthority('SETTINGS_VIEW') or hasAuthority('TENANT_ADMIN')")
    public ApiResponse<CompanySettings> getCompanySettings() {
        Long tenantId = TenantContext.getCurrentTenantId();
        CompanySettings settings = companySettingsRepository.findByTenantId(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("CompanySettings", "tenantId", tenantId));
        return ApiResponse.success(settings, "Company settings retrieved successfully.");
    }

    @PutMapping
    @PreAuthorize("hasAuthority('SETTINGS_MANAGE') or hasAuthority('TENANT_ADMIN')")
    public ApiResponse<CompanySettings> updateCompanySettings(@RequestBody CompanySettings updatedSettings) {
        Long tenantId = TenantContext.getCurrentTenantId();
        CompanySettings settings = companySettingsRepository.findByTenantId(tenantId)
                .orElseGet(() -> CompanySettings.builder().tenantId(tenantId).build());

        settings.setCompanyName(updatedSettings.getCompanyName());
        settings.setLogoUrl(updatedSettings.getLogoUrl());
        settings.setEmail(updatedSettings.getEmail());
        settings.setPhone(updatedSettings.getPhone());
        settings.setWebsite(updatedSettings.getWebsite());
        settings.setAddress(updatedSettings.getAddress());
        settings.setTaxNumber(updatedSettings.getTaxNumber());
        settings.setCurrency(updatedSettings.getCurrency());
        settings.setTimezone(updatedSettings.getTimezone());
        if (updatedSettings.getInvoicePrefix() != null) settings.setInvoicePrefix(updatedSettings.getInvoicePrefix());
        if (updatedSettings.getQuotationPrefix() != null) settings.setQuotationPrefix(updatedSettings.getQuotationPrefix());

        CompanySettings saved = companySettingsRepository.save(settings);
        return ApiResponse.success(saved, "Company settings updated successfully.");
    }
}
