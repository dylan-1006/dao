package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.KanbanTaskComment;

/**
 * Spring Data JPA repository for the KanbanTaskComment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface KanbanTaskCommentRepository extends JpaRepository<KanbanTaskComment, Long> {}
