package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class KanbanTaskCommentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(KanbanTaskComment.class);
        KanbanTaskComment kanbanTaskComment1 = new KanbanTaskComment();
        kanbanTaskComment1.setId(1L);
        KanbanTaskComment kanbanTaskComment2 = new KanbanTaskComment();
        kanbanTaskComment2.setId(kanbanTaskComment1.getId());
        assertThat(kanbanTaskComment1).isEqualTo(kanbanTaskComment2);
        kanbanTaskComment2.setId(2L);
        assertThat(kanbanTaskComment1).isNotEqualTo(kanbanTaskComment2);
        kanbanTaskComment1.setId(null);
        assertThat(kanbanTaskComment1).isNotEqualTo(kanbanTaskComment2);
    }
}
