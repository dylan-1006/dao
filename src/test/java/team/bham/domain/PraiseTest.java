package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class PraiseTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Praise.class);
        Praise praise1 = new Praise();
        praise1.setId(1L);
        Praise praise2 = new Praise();
        praise2.setId(praise1.getId());
        assertThat(praise1).isEqualTo(praise2);
        praise2.setId(2L);
        assertThat(praise1).isNotEqualTo(praise2);
        praise1.setId(null);
        assertThat(praise1).isNotEqualTo(praise2);
    }
}
