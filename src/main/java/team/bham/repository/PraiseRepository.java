package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Praise;

/**
 * Spring Data JPA repository for the Praise entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PraiseRepository extends JpaRepository<Praise, Long> {}
