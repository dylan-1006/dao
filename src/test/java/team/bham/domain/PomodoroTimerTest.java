package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class PomodoroTimerTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PomodoroTimer.class);
        PomodoroTimer pomodoroTimer1 = new PomodoroTimer();
        pomodoroTimer1.setId(1L);
        PomodoroTimer pomodoroTimer2 = new PomodoroTimer();
        pomodoroTimer2.setId(pomodoroTimer1.getId());
        assertThat(pomodoroTimer1).isEqualTo(pomodoroTimer2);
        pomodoroTimer2.setId(2L);
        assertThat(pomodoroTimer1).isNotEqualTo(pomodoroTimer2);
        pomodoroTimer1.setId(null);
        assertThat(pomodoroTimer1).isNotEqualTo(pomodoroTimer2);
    }
}
