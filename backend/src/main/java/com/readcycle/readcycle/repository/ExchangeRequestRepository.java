package com.readcycle.readcycle.repository;

import com.readcycle.readcycle.entity.ExchangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.readcycle.readcycle.enums.ExchangeStatus;

@Repository
public interface ExchangeRequestRepository extends JpaRepository<ExchangeRequest, Long> {

    boolean existsByRequesterIdAndBookIdAndStatus(
            Long requesterId,
            Long bookId,
            ExchangeStatus status
    );

}