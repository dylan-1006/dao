package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.PomodoroTimer;
import team.bham.domain.Session;

/**
 * Spring Data JPA repository for the PomodoroTimer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PomodoroTimerRepository extends JpaRepository<PomodoroTimer, Long> {}
