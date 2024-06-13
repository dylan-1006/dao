package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team.bham.domain.KanbanBoard;
import team.bham.domain.KanbanTask;

/**
 * Spring Data JPA repository for the KanbanTask entity.
 *
 * When extending this class, extend KanbanTaskRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface KanbanTaskRepository extends KanbanTaskRepositoryWithBagRelationships, JpaRepository<KanbanTask, Long> {
    List<KanbanTask> findAllByKanbanBoard(Optional<KanbanBoard> kanbanBoard);

    default Optional<KanbanTask> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<KanbanTask> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<KanbanTask> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }
}
