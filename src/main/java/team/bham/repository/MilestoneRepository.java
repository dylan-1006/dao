package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Milestone;

/**
 * Spring Data JPA repository for the Milestone entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MilestoneRepository extends JpaRepository<Milestone, Long> {}
