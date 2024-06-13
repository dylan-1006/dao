package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.KanbanBoard;

/**
 * Spring Data JPA repository for the KanbanBoard entity.
 */
@SuppressWarnings("unused")
@Repository
public interface KanbanBoardRepository extends JpaRepository<KanbanBoard, Long> {}
