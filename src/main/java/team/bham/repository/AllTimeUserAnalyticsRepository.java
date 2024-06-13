package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.AllTimeUserAnalytics;

/**
 * Spring Data JPA repository for the AllTimeUserAnalytics entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AllTimeUserAnalyticsRepository extends JpaRepository<AllTimeUserAnalytics, Long> {}
