package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class SessionAnalyticTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SessionAnalytic.class);
        SessionAnalytic sessionAnalytic1 = new SessionAnalytic();
        sessionAnalytic1.setId(1L);
        SessionAnalytic sessionAnalytic2 = new SessionAnalytic();
        sessionAnalytic2.setId(sessionAnalytic1.getId());
        assertThat(sessionAnalytic1).isEqualTo(sessionAnalytic2);
        sessionAnalytic2.setId(2L);
        assertThat(sessionAnalytic1).isNotEqualTo(sessionAnalytic2);
        sessionAnalytic1.setId(null);
        assertThat(sessionAnalytic1).isNotEqualTo(sessionAnalytic2);
    }
}
