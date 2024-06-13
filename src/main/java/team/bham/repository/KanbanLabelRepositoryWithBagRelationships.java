package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import team.bham.domain.KanbanLabel;
import team.bham.domain.KanbanTask;

public interface KanbanLabelRepositoryWithBagRelationships {
    Optional<KanbanLabel> fetchBagRelationships(Optional<KanbanLabel> kanbanLabel);

    List<KanbanLabel> fetchBagRelationships(List<KanbanLabel> kanbanLabels);

    Page<KanbanLabel> fetchBagRelationships(Page<KanbanLabel> kanbanLabels);
}
