package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import team.bham.domain.KanbanTask;

public interface KanbanTaskRepositoryWithBagRelationships {
    Optional<KanbanTask> fetchBagRelationships(Optional<KanbanTask> kanbanTask);

    List<KanbanTask> fetchBagRelationships(List<KanbanTask> kanbanTasks);

    Page<KanbanTask> fetchBagRelationships(Page<KanbanTask> kanbanTasks);
}
