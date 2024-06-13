package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class KanbanTaskTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(KanbanTask.class);
        KanbanTask kanbanTask1 = new KanbanTask();
        kanbanTask1.setId(1L);
        KanbanTask kanbanTask2 = new KanbanTask();
        kanbanTask2.setId(kanbanTask1.getId());
        assertThat(kanbanTask1).isEqualTo(kanbanTask2);
        kanbanTask2.setId(2L);
        assertThat(kanbanTask1).isNotEqualTo(kanbanTask2);
        kanbanTask1.setId(null);
        assertThat(kanbanTask1).isNotEqualTo(kanbanTask2);
    }
}
