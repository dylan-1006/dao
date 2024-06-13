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
import team.bham.domain.KanbanLabel;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class KanbanLabelRepositoryWithBagRelationshipsImpl implements KanbanLabelRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<KanbanLabel> fetchBagRelationships(Optional<KanbanLabel> kanbanLabel) {
        return kanbanLabel.map(this::fetchBoards);
    }

    @Override
    public Page<KanbanLabel> fetchBagRelationships(Page<KanbanLabel> kanbanLabels) {
        return new PageImpl<>(
            fetchBagRelationships(kanbanLabels.getContent()),
            kanbanLabels.getPageable(),
            kanbanLabels.getTotalElements()
        );
    }

    @Override
    public List<KanbanLabel> fetchBagRelationships(List<KanbanLabel> kanbanLabels) {
        return Optional.of(kanbanLabels).map(this::fetchBoards).orElse(Collections.emptyList());
    }

    KanbanLabel fetchBoards(KanbanLabel result) {
        return entityManager
            .createQuery(
                "select kanbanLabel from KanbanLabel kanbanLabel left join fetch kanbanLabel.boards where kanbanLabel is :kanbanLabel",
                KanbanLabel.class
            )
            .setParameter("kanbanLabel", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<KanbanLabel> fetchBoards(List<KanbanLabel> kanbanLabels) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, kanbanLabels.size()).forEach(index -> order.put(kanbanLabels.get(index).getId(), index));
        List<KanbanLabel> result = entityManager
            .createQuery(
                "select distinct kanbanLabel from KanbanLabel kanbanLabel left join fetch kanbanLabel.boards where kanbanLabel in :kanbanLabels",
                KanbanLabel.class
            )
            .setParameter("kanbanLabels", kanbanLabels)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
