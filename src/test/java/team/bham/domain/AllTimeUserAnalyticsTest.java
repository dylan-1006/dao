package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class AllTimeUserAnalyticsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AllTimeUserAnalytics.class);
        AllTimeUserAnalytics allTimeUserAnalytics1 = new AllTimeUserAnalytics();
        allTimeUserAnalytics1.setId(1L);
        AllTimeUserAnalytics allTimeUserAnalytics2 = new AllTimeUserAnalytics();
        allTimeUserAnalytics2.setId(allTimeUserAnalytics1.getId());
        assertThat(allTimeUserAnalytics1).isEqualTo(allTimeUserAnalytics2);
        allTimeUserAnalytics2.setId(2L);
        assertThat(allTimeUserAnalytics1).isNotEqualTo(allTimeUserAnalytics2);
        allTimeUserAnalytics1.setId(null);
        assertThat(allTimeUserAnalytics1).isNotEqualTo(allTimeUserAnalytics2);
    }
}
