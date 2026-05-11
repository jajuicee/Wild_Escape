package com.example.appdev.wildfire.service;

import com.example.appdev.wildfire.dto.owner.OwnerDashboardSummaryDTO;

public interface OwnerDashboardService {
    OwnerDashboardSummaryDTO getDashboardSummary(Long ownerId);
}
