package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class KanbanBoardTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(KanbanBoard.class);
        KanbanBoard kanbanBoard1 = new KanbanBoard();
        kanbanBoard1.setId(1L);
        KanbanBoard kanbanBoard2 = new KanbanBoard();
        kanbanBoard2.setId(kanbanBoard1.getId());
        assertThat(kanbanBoard1).isEqualTo(kanbanBoard2);
        kanbanBoard2.setId(2L);
        assertThat(kanbanBoard1).isNotEqualTo(kanbanBoard2);
        kanbanBoard1.setId(null);
        assertThat(kanbanBoard1).isNotEqualTo(kanbanBoard2);
    }
}
