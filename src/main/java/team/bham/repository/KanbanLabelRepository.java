package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team.bham.domain.KanbanBoard;
import team.bham.domain.KanbanLabel;
import team.bham.domain.KanbanTask;

/**
 * Spring Data JPA repository for the KanbanLabel entity.
 *
 * When extending this class, extend KanbanLabelRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface KanbanLabelRepository extends KanbanLabelRepositoryWithBagRelationships, JpaRepository<KanbanLabel, Long> {
    List<KanbanLabel> findAllByTasks(Optional<KanbanTask> tasks);

    List<KanbanLabel> findKanbanLabelsByBoards(Optional<KanbanBoard> kanbanBoard);

    default Optional<KanbanLabel> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<KanbanLabel> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<KanbanLabel> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }
}
