package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class KanbanLabelTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(KanbanLabel.class);
        KanbanLabel kanbanLabel1 = new KanbanLabel();
        kanbanLabel1.setId(1L);
        KanbanLabel kanbanLabel2 = new KanbanLabel();
        kanbanLabel2.setId(kanbanLabel1.getId());
        assertThat(kanbanLabel1).isEqualTo(kanbanLabel2);
        kanbanLabel2.setId(2L);
        assertThat(kanbanLabel1).isNotEqualTo(kanbanLabel2);
        kanbanLabel1.setId(null);
        assertThat(kanbanLabel1).isNotEqualTo(kanbanLabel2);
    }
}
