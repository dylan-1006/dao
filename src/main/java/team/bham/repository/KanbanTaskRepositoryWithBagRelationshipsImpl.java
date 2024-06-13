package team.bham.repository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import team.bham.domain.KanbanTask;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class KanbanTaskRepositoryWithBagRelationshipsImpl implements KanbanTaskRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<KanbanTask> fetchBagRelationships(Optional<KanbanTask> kanbanTask) {
        return kanbanTask.map(this::fetchLabels);
    }

    @Override
    public Page<KanbanTask> fetchBagRelationships(Page<KanbanTask> kanbanTasks) {
        return new PageImpl<>(fetchBagRelationships(kanbanTasks.getContent()), kanbanTasks.getPageable(), kanbanTasks.getTotalElements());
    }

    @Override
    public List<KanbanTask> fetchBagRelationships(List<KanbanTask> kanbanTasks) {
        return Optional.of(kanbanTasks).map(this::fetchLabels).orElse(Collections.emptyList());
    }

    KanbanTask fetchLabels(KanbanTask result) {
        return entityManager
            .createQuery(
                "select kanbanTask from KanbanTask kanbanTask left join fetch kanbanTask.labels where kanbanTask is :kanbanTask",
                KanbanTask.class
            )
            .setParameter("kanbanTask", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<KanbanTask> fetchLabels(List<KanbanTask> kanbanTasks) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, kanbanTasks.size()).forEach(index -> order.put(kanbanTasks.get(index).getId(), index));
        List<KanbanTask> result = entityManager
            .createQuery(
                "select distinct kanbanTask from KanbanTask kanbanTask left join fetch kanbanTask.labels where kanbanTask in :kanbanTasks",
                KanbanTask.class
            )
            .setParameter("kanbanTasks", kanbanTasks)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
