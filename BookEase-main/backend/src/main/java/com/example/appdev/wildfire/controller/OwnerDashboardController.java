package com.example.appdev.wildfire.controller;

import com.example.appdev.wildfire.dto.owner.OwnerDashboardSummaryDTO;
import com.example.appdev.wildfire.security.SecurityUtils;
import com.example.appdev.wildfire.service.OwnerDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.attribute.UserPrincipal;

@RestController
@RequestMapping("/api/owner/dashboard")
@RequiredArgsConstructor
public class OwnerDashboardController {

    private final OwnerDashboardService ownerDashboardService;

    @GetMapping
    public OwnerDashboardSummaryDTO dashboard() {
        Long ownerId = SecurityUtils.getCurrentUserId();
        return ownerDashboardService.getDashboardSummary(ownerId);
    }

}
