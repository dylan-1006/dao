package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import team.bham.IntegrationTest;
import team.bham.domain.AllTimeUserAnalytics;
import team.bham.repository.AllTimeUserAnalyticsRepository;

/**
 * Integration tests for the {@link AllTimeUserAnalyticsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AllTimeUserAnalyticsResourceIT {

    private static final Integer DEFAULT_TOTAL_STUDY_TIME = 1;
    private static final Integer UPDATED_TOTAL_STUDY_TIME = 2;

    private static final Integer DEFAULT_TOTAL_POMODORO_SESSION = 1;
    private static final Integer UPDATED_TOTAL_POMODORO_SESSION = 2;

    private static final Integer DEFAULT_DAILY_STREAKS = 1;
    private static final Integer UPDATED_DAILY_STREAKS = 2;

    private static final Instant DEFAULT_MOST_FOCUSED_PERIOD = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_MOST_FOCUSED_PERIOD = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Float DEFAULT_TASK_COMPLETION_RATE = 1F;
    private static final Float UPDATED_TASK_COMPLETION_RATE = 2F;

    private static final Integer DEFAULT_AVERAGE_FOCUS_DURATION = 1;
    private static final Integer UPDATED_AVERAGE_FOCUS_DURATION = 2;

    private static final Integer DEFAULT_FOCUS_COUNT = 1;
    private static final Integer UPDATED_FOCUS_COUNT = 2;

    private static final Integer DEFAULT_TOTAL_FOCUS_DURATION = 1;
    private static final Integer UPDATED_TOTAL_FOCUS_DURATION = 2;

    private static final Integer DEFAULT_SESSION_RECORD = 1;
    private static final Integer UPDATED_SESSION_RECORD = 2;

    private static final Integer DEFAULT_TOTAL_BREAK_TIME = 1;
    private static final Integer UPDATED_TOTAL_BREAK_TIME = 2;

    private static final Integer DEFAULT_AVERAGE_BREAK_DURATION = 1;
    private static final Integer UPDATED_AVERAGE_BREAK_DURATION = 2;

    private static final String ENTITY_API_URL = "/api/all-time-user-analytics";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AllTimeUserAnalyticsRepository allTimeUserAnalyticsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAllTimeUserAnalyticsMockMvc;

    private AllTimeUserAnalytics allTimeUserAnalytics;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AllTimeUserAnalytics createEntity(EntityManager em) {
        AllTimeUserAnalytics allTimeUserAnalytics = new AllTimeUserAnalytics()
            .totalStudyTime(DEFAULT_TOTAL_STUDY_TIME)
            .totalPomodoroSession(DEFAULT_TOTAL_POMODORO_SESSION)
            .dailyStreaks(DEFAULT_DAILY_STREAKS)
            .mostFocusedPeriod(DEFAULT_MOST_FOCUSED_PERIOD)
            .taskCompletionRate(DEFAULT_TASK_COMPLETION_RATE)
            .averageFocusDuration(DEFAULT_AVERAGE_FOCUS_DURATION)
            .focusCount(DEFAULT_FOCUS_COUNT)
            .totalFocusDuration(DEFAULT_TOTAL_FOCUS_DURATION)
            .sessionRecord(DEFAULT_SESSION_RECORD)
            .totalBreakTime(DEFAULT_TOTAL_BREAK_TIME)
            .averageBreakDuration(DEFAULT_AVERAGE_BREAK_DURATION);
        return allTimeUserAnalytics;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AllTimeUserAnalytics createUpdatedEntity(EntityManager em) {
        AllTimeUserAnalytics allTimeUserAnalytics = new AllTimeUserAnalytics()
            .totalStudyTime(UPDATED_TOTAL_STUDY_TIME)
            .totalPomodoroSession(UPDATED_TOTAL_POMODORO_SESSION)
            .dailyStreaks(UPDATED_DAILY_STREAKS)
            .mostFocusedPeriod(UPDATED_MOST_FOCUSED_PERIOD)
            .taskCompletionRate(UPDATED_TASK_COMPLETION_RATE)
            .averageFocusDuration(UPDATED_AVERAGE_FOCUS_DURATION)
            .focusCount(UPDATED_FOCUS_COUNT)
            .totalFocusDuration(UPDATED_TOTAL_FOCUS_DURATION)
            .sessionRecord(UPDATED_SESSION_RECORD)
            .totalBreakTime(UPDATED_TOTAL_BREAK_TIME)
            .averageBreakDuration(UPDATED_AVERAGE_BREAK_DURATION);
        return allTimeUserAnalytics;
    }

    @BeforeEach
    public void initTest() {
        allTimeUserAnalytics = createEntity(em);
    }

    @Test
    @Transactional
    void createAllTimeUserAnalytics() throws Exception {
        int databaseSizeBeforeCreate = allTimeUserAnalyticsRepository.findAll().size();
        // Create the AllTimeUserAnalytics
        restAllTimeUserAnalyticsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(allTimeUserAnalytics))
            )
            .andExpect(status().isCreated());

        // Validate the AllTimeUserAnalytics in the database
        List<AllTimeUserAnalytics> allTimeUserAnalyticsList = allTimeUserAnalyticsRepository.findAll();
        assertThat(allTimeUserAnalyticsList).hasSize(databaseSizeBeforeCreate + 1);
        AllTimeUserAnalytics testAllTimeUserAnalytics = allTimeUserAnalyticsList.get(allTimeUserAnalyticsList.size() - 1);
        assertThat(testAllTimeUserAnalytics.getTotalStudyTime()).isEqualTo(DEFAULT_TOTAL_STUDY_TIME);
        assertThat(testAllTimeUserAnalytics.getTotalPomodoroSession()).isEqualTo(DEFAULT_TOTAL_POMODORO_SESSION);
        assertThat(testAllTimeUserAnalytics.getDailyStreaks()).isEqualTo(DEFAULT_DAILY_STREAKS);
        assertThat(testAllTimeUserAnalytics.getMostFocusedPeriod()).isEqualTo(DEFAULT_MOST_FOCUSED_PERIOD);
        assertThat(testAllTimeUserAnalytics.getTaskCompletionRate()).isEqualTo(DEFAULT_TASK_COMPLETION_RATE);
        assertThat(testAllTimeUserAnalytics.getAverageFocusDuration()).isEqualTo(DEFAULT_AVERAGE_FOCUS_DURATION);
        assertThat(testAllTimeUserAnalytics.getFocusCount()).isEqualTo(DEFAULT_FOCUS_COUNT);
        assertThat(testAllTimeUserAnalytics.getTotalFocusDuration()).isEqualTo(DEFAULT_TOTAL_FOCUS_DURATION);
        assertThat(testAllTimeUserAnalytics.getSessionRecord()).isEqualTo(DEFAULT_SESSION_RECORD);
        assertThat(testAllTimeUserAnalytics.getTotalBreakTime()).isEqualTo(DEFAULT_TOTAL_BREAK_TIME);
        assertThat(testAllTimeUserAnalytics.getAverageBreakDuration()).isEqualTo(DEFAULT_AVERAGE_BREAK_DURATION);
    }

    @Test
    @Transactional
    void createAllTimeUserAnalyticsWithExistingId() throws Exception {
        // Create the AllTimeUserAnalytics with an existing ID
        allTimeUserAnalytics.setId(1L);

        int databaseSizeBeforeCreate = allTimeUserAnalyticsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAllTimeUserAnalyticsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(allTimeUserAnalytics))
            )
            .andExpect(status().isBadRequest());

        // Validate the AllTimeUserAnalytics in the database
        List<AllTimeUserAnalytics> allTimeUserAnalyticsList = allTimeUserAnalyticsRepository.findAll();
        assertThat(allTimeUserAnalyticsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAllTimeUserAnalytics() throws Exception {
        // Initialize the database
        allTimeUserAnalyticsRepository.saveAndFlush(allTimeUserAnalytics);

        // Get all the allTimeUserAnalyticsList
        restAllTimeUserAnalyticsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(allTimeUserAnalytics.getId().intValue())))
            .andExpect(jsonPath("$.[*].totalStudyTime").value(hasItem(DEFAULT_TOTAL_STUDY_TIME)))
            .andExpect(jsonPath("$.[*].totalPomodoroSession").value(hasItem(DEFAULT_TOTAL_POMODORO_SESSION)))
            .andExpect(jsonPath("$.[*].dailyStreaks").value(hasItem(DEFAULT_DAILY_STREAKS)))
            .andExpect(jsonPath("$.[*].mostFocusedPeriod").value(hasItem(DEFAULT_MOST_FOCUSED_PERIOD.toString())))
            .andExpect(jsonPath("$.[*].taskCompletionRate").value(hasItem(DEFAULT_TASK_COMPLETION_RATE.doubleValue())))
            .andExpect(jsonPath("$.[*].averageFocusDuration").value(hasItem(DEFAULT_AVERAGE_FOCUS_DURATION)))
            .andExpect(jsonPath("$.[*].focusCount").value(hasItem(DEFAULT_FOCUS_COUNT)))
            .andExpect(jsonPath("$.[*].totalFocusDuration").value(hasItem(DEFAULT_TOTAL_FOCUS_DURATION)))
            .andExpect(jsonPath("$.[*].sessionRecord").value(hasItem(DEFAULT_SESSION_RECORD)))
            .andExpect(jsonPath("$.[*].totalBreakTime").value(hasItem(DEFAULT_TOTAL_BREAK_TIME)))
            .andExpect(jsonPath("$.[*].averageBreakDuration").value(hasItem(DEFAULT_AVERAGE_BREAK_DURATION)));
    }

    @Test
    @Transactional
    void getAllTimeUserAnalytics() throws Exception {
        // Initialize the database
        allTimeUserAnalyticsRepository.saveAndFlush(allTimeUserAnalytics);

        // Get the allTimeUserAnalytics
        restAllTimeUserAnalyticsMockMvc
            .perform(get(ENTITY_API_URL_ID, allTimeUserAnalytics.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(allTimeUserAnalytics.getId().intValue()))
            .andExpect(jsonPath("$.totalStudyTime").value(DEFAULT_TOTAL_STUDY_TIME))
            .andExpect(jsonPath("$.totalPomodoroSession").value(DEFAULT_TOTAL_POMODORO_SESSION))
            .andExpect(jsonPath("$.dailyStreaks").value(DEFAULT_DAILY_STREAKS))
            .andExpect(jsonPath("$.mostFocusedPeriod").value(DEFAULT_MOST_FOCUSED_PERIOD.toString()))
            .andExpect(jsonPath("$.taskCompletionRate").value(DEFAULT_TASK_COMPLETION_RATE.doubleValue()))
            .andExpect(jsonPath("$.averageFocusDuration").value(DEFAULT_AVERAGE_FOCUS_DURATION))
            .andExpect(jsonPath("$.focusCount").value(DEFAULT_FOCUS_COUNT))
            .andExpect(jsonPath("$.totalFocusDuration").value(DEFAULT_TOTAL_FOCUS_DURATION))
            .andExpect(jsonPath("$.sessionRecord").value(DEFAULT_SESSION_RECORD))
            .andExpect(jsonPath("$.totalBreakTime").value(DEFAULT_TOTAL_BREAK_TIME))
            .andExpect(jsonPath("$.averageBreakDuration").value(DEFAULT_AVERAGE_BREAK_DURATION));
    }

    @Test
    @Transactional
    void getNonExistingAllTimeUserAnalytics() throws Exception {
        // Get the allTimeUserAnalytics
        restAllTimeUserAnalyticsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAllTimeUserAnalytics() throws Exception {
        // Initialize the database
        allTimeUserAnalyticsRepository.saveAndFlush(allTimeUserAnalytics);

        int databaseSizeBeforeUpdate = allTimeUserAnalyticsRepository.findAll().size();

        // Update the allTimeUserAnalytics
        AllTimeUserAnalytics updatedAllTimeUserAnalytics = allTimeUserAnalyticsRepository.findById(allTimeUserAnalytics.getId()).get();
        // Disconnect from session so that the updates on updatedAllTimeUserAnalytics are not directly saved in db
        em.detach(updatedAllTimeUserAnalytics);
        updatedAllTimeUserAnalytics
            .totalStudyTime(UPDATED_TOTAL_STUDY_TIME)
            .totalPomodoroSession(UPDATED_TOTAL_POMODORO_SESSION)
            .dailyStreaks(UPDATED_DAILY_STREAKS)
            .mostFocusedPeriod(UPDATED_MOST_FOCUSED_PERIOD)
            .taskCompletionRate(UPDATED_TASK_COMPLETION_RATE)
            .averageFocusDuration(UPDATED_AVERAGE_FOCUS_DURATION)
            .focusCount(UPDATED_FOCUS_COUNT)
            .totalFocusDuration(UPDATED_TOTAL_FOCUS_DURATION)
            .sessionRecord(UPDATED_SESSION_RECORD)
            .totalBreakTime(UPDATED_TOTAL_BREAK_TIME)
            .averageBreakDuration(UPDATED_AVERAGE_BREAK_DURATION);

        restAllTimeUserAnalyticsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAllTimeUserAnalytics.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAllTimeUserAnalytics))
            )
            .andExpect(status().isOk());

        // Validate the AllTimeUserAnalytics in the database
        List<AllTimeUserAnalytics> allTimeUserAnalyticsList = allTimeUserAnalyticsRepository.findAll();
        assertThat(allTimeUserAnalyticsList).hasSize(databaseSizeBeforeUpdate);
        AllTimeUserAnalytics testAllTimeUserAnalytics = allTimeUserAnalyticsList.get(allTimeUserAnalyticsList.size() - 1);
        assertThat(testAllTimeUserAnalytics.getTotalStudyTime()).isEqualTo(UPDATED_TOTAL_STUDY_TIME);
        assertThat(testAllTimeUserAnalytics.getTotalPomodoroSession()).isEqualTo(UPDATED_TOTAL_POMODORO_SESSION);
        assertThat(testAllTimeUserAnalytics.getDailyStreaks()).isEqualTo(UPDATED_DAILY_STREAKS);
        assertThat(testAllTimeUserAnalytics.getMostFocusedPeriod()).isEqualTo(UPDATED_MOST_FOCUSED_PERIOD);
        assertThat(testAllTimeUserAnalytics.getTaskCompletionRate()).isEqualTo(UPDATED_TASK_COMPLETION_RATE);
        assertThat(testAllTimeUserAnalytics.getAverageFocusDuration()).isEqualTo(UPDATED_AVERAGE_FOCUS_DURATION);
        assertThat(testAllTimeUserAnalytics.getFocusCount()).isEqualTo(UPDATED_FOCUS_COUNT);
        assertThat(testAllTimeUserAnalytics.getTotalFocusDuration()).isEqualTo(UPDATED_TOTAL_FOCUS_DURATION);
        assertThat(testAllTimeUserAnalytics.getSessionRecord()).isEqualTo(UPDATED_SESSION_RECORD);
        assertThat(testAllTimeUserAnalytics.getTotalBreakTime()).isEqualTo(UPDATED_TOTAL_BREAK_TIME);
        assertThat(testAllTimeUserAnalytics.getAverageBreakDuration()).isEqualTo(UPDATED_AVERAGE_BREAK_DURATION);
    }

    @Test
    @Transactional
    void putNonExistingAllTimeUserAnalytics() throws Exception {
        int databaseSizeBeforeUpdate = allTimeUserAnalyticsRepository.findAll().size();
        allTimeUserAnalytics.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAllTimeUserAnalyticsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, allTimeUserAnalytics.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(allTimeUserAnalytics))
            )
            .andExpect(status().isBadRequest());

        // Validate the AllTimeUserAnalytics in the database
        List<AllTimeUserAnalytics> allTimeUserAnalyticsList = allTimeUserAnalyticsRepository.findAll();
        assertThat(allTimeUserAnalyticsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAllTimeUserAnalytics() throws Exception {
        int databaseSizeBeforeUpdate = allTimeUserAnalyticsRepository.findAll().size();
        allTimeUserAnalytics.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAllTimeUserAnalyticsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(allTimeUserAnalytics))
            )
            .andExpect(status().isBadRequest());

        // Validate the AllTimeUserAnalytics in the database
        List<AllTimeUserAnalytics> allTimeUserAnalyticsList = allTimeUserAnalyticsRepository.findAll();
        assertThat(allTimeUserAnalyticsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAllTimeUserAnalytics() throws Exception {
        int databaseSizeBeforeUpdate = allTimeUserAnalyticsRepository.findAll().size();
        allTimeUserAnalytics.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAllTimeUserAnalyticsMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(allTimeUserAnalytics))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AllTimeUserAnalytics in the database
        List<AllTimeUserAnalytics> allTimeUserAnalyticsList = allTimeUserAnalyticsRepository.findAll();
        assertThat(allTimeUserAnalyticsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAllTimeUserAnalyticsWithPatch() throws Exception {
        // Initialize the database
        allTimeUserAnalyticsRepository.saveAndFlush(allTimeUserAnalytics);

        int databaseSizeBeforeUpdate = allTimeUserAnalyticsRepository.findAll().size();

        // Update the allTimeUserAnalytics using partial update
        AllTimeUserAnalytics partialUpdatedAllTimeUserAnalytics = new AllTimeUserAnalytics();
        partialUpdatedAllTimeUserAnalytics.setId(allTimeUserAnalytics.getId());

        partialUpdatedAllTimeUserAnalytics
            .totalStudyTime(UPDATED_TOTAL_STUDY_TIME)
            .averageFocusDuration(UPDATED_AVERAGE_FOCUS_DURATION)
            .totalBreakTime(UPDATED_TOTAL_BREAK_TIME)
            .averageBreakDuration(UPDATED_AVERAGE_BREAK_DURATION);

        restAllTimeUserAnalyticsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAllTimeUserAnalytics.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAllTimeUserAnalytics))
            )
            .andExpect(status().isOk());

        // Validate the AllTimeUserAnalytics in the database
        List<AllTimeUserAnalytics> allTimeUserAnalyticsList = allTimeUserAnalyticsRepository.findAll();
        assertThat(allTimeUserAnalyticsList).hasSize(databaseSizeBeforeUpdate);
        AllTimeUserAnalytics testAllTimeUserAnalytics = allTimeUserAnalyticsList.get(allTimeUserAnalyticsList.size() - 1);
        assertThat(testAllTimeUserAnalytics.getTotalStudyTime()).isEqualTo(UPDATED_TOTAL_STUDY_TIME);
        assertThat(testAllTimeUserAnalytics.getTotalPomodoroSession()).isEqualTo(DEFAULT_TOTAL_POMODORO_SESSION);
        assertThat(testAllTimeUserAnalytics.getDailyStreaks()).isEqualTo(DEFAULT_DAILY_STREAKS);
        assertThat(testAllTimeUserAnalytics.getMostFocusedPeriod()).isEqualTo(DEFAULT_MOST_FOCUSED_PERIOD);
        assertThat(testAllTimeUserAnalytics.getTaskCompletionRate()).isEqualTo(DEFAULT_TASK_COMPLETION_RATE);
        assertThat(testAllTimeUserAnalytics.getAverageFocusDuration()).isEqualTo(UPDATED_AVERAGE_FOCUS_DURATION);
        assertThat(testAllTimeUserAnalytics.getFocusCount()).isEqualTo(DEFAULT_FOCUS_COUNT);
        assertThat(testAllTimeUserAnalytics.getTotalFocusDuration()).isEqualTo(DEFAULT_TOTAL_FOCUS_DURATION);
        assertThat(testAllTimeUserAnalytics.getSessionRecord()).isEqualTo(DEFAULT_SESSION_RECORD);
        assertThat(testAllTimeUserAnalytics.getTotalBreakTime()).isEqualTo(UPDATED_TOTAL_BREAK_TIME);
        assertThat(testAllTimeUserAnalytics.getAverageBreakDuration()).isEqualTo(UPDATED_AVERAGE_BREAK_DURATION);
    }

    @Test
    @Transactional
    void fullUpdateAllTimeUserAnalyticsWithPatch() throws Exception {
        // Initialize the database
        allTimeUserAnalyticsRepository.saveAndFlush(allTimeUserAnalytics);

        int databaseSizeBeforeUpdate = allTimeUserAnalyticsRepository.findAll().size();

        // Update the allTimeUserAnalytics using partial update
        AllTimeUserAnalytics partialUpdatedAllTimeUserAnalytics = new AllTimeUserAnalytics();
        partialUpdatedAllTimeUserAnalytics.setId(allTimeUserAnalytics.getId());

        partialUpdatedAllTimeUserAnalytics
            .totalStudyTime(UPDATED_TOTAL_STUDY_TIME)
            .totalPomodoroSession(UPDATED_TOTAL_POMODORO_SESSION)
            .dailyStreaks(UPDATED_DAILY_STREAKS)
            .mostFocusedPeriod(UPDATED_MOST_FOCUSED_PERIOD)
            .taskCompletionRate(UPDATED_TASK_COMPLETION_RATE)
            .averageFocusDuration(UPDATED_AVERAGE_FOCUS_DURATION)
            .focusCount(UPDATED_FOCUS_COUNT)
            .totalFocusDuration(UPDATED_TOTAL_FOCUS_DURATION)
            .sessionRecord(UPDATED_SESSION_RECORD)
            .totalBreakTime(UPDATED_TOTAL_BREAK_TIME)
            .averageBreakDuration(UPDATED_AVERAGE_BREAK_DURATION);

        restAllTimeUserAnalyticsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAllTimeUserAnalytics.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAllTimeUserAnalytics))
            )
            .andExpect(status().isOk());

        // Validate the AllTimeUserAnalytics in the database
        List<AllTimeUserAnalytics> allTimeUserAnalyticsList = allTimeUserAnalyticsRepository.findAll();
        assertThat(allTimeUserAnalyticsList).hasSize(databaseSizeBeforeUpdate);
        AllTimeUserAnalytics testAllTimeUserAnalytics = allTimeUserAnalyticsList.get(allTimeUserAnalyticsList.size() - 1);
        assertThat(testAllTimeUserAnalytics.getTotalStudyTime()).isEqualTo(UPDATED_TOTAL_STUDY_TIME);
        assertThat(testAllTimeUserAnalytics.getTotalPomodoroSession()).isEqualTo(UPDATED_TOTAL_POMODORO_SESSION);
        assertThat(testAllTimeUserAnalytics.getDailyStreaks()).isEqualTo(UPDATED_DAILY_STREAKS);
        assertThat(testAllTimeUserAnalytics.getMostFocusedPeriod()).isEqualTo(UPDATED_MOST_FOCUSED_PERIOD);
        assertThat(testAllTimeUserAnalytics.getTaskCompletionRate()).isEqualTo(UPDATED_TASK_COMPLETION_RATE);
        assertThat(testAllTimeUserAnalytics.getAverageFocusDuration()).isEqualTo(UPDATED_AVERAGE_FOCUS_DURATION);
        assertThat(testAllTimeUserAnalytics.getFocusCount()).isEqualTo(UPDATED_FOCUS_COUNT);
        assertThat(testAllTimeUserAnalytics.getTotalFocusDuration()).isEqualTo(UPDATED_TOTAL_FOCUS_DURATION);
        assertThat(testAllTimeUserAnalytics.getSessionRecord()).isEqualTo(UPDATED_SESSION_RECORD);
        assertThat(testAllTimeUserAnalytics.getTotalBreakTime()).isEqualTo(UPDATED_TOTAL_BREAK_TIME);
        assertThat(testAllTimeUserAnalytics.getAverageBreakDuration()).isEqualTo(UPDATED_AVERAGE_BREAK_DURATION);
    }

    @Test
    @Transactional
    void patchNonExistingAllTimeUserAnalytics() throws Exception {
        int databaseSizeBeforeUpdate = allTimeUserAnalyticsRepository.findAll().size();
        allTimeUserAnalytics.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAllTimeUserAnalyticsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, allTimeUserAnalytics.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(allTimeUserAnalytics))
            )
            .andExpect(status().isBadRequest());

        // Validate the AllTimeUserAnalytics in the database
        List<AllTimeUserAnalytics> allTimeUserAnalyticsList = allTimeUserAnalyticsRepository.findAll();
        assertThat(allTimeUserAnalyticsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAllTimeUserAnalytics() throws Exception {
        int databaseSizeBeforeUpdate = allTimeUserAnalyticsRepository.findAll().size();
        allTimeUserAnalytics.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAllTimeUserAnalyticsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(allTimeUserAnalytics))
            )
            .andExpect(status().isBadRequest());

        // Validate the AllTimeUserAnalytics in the database
        List<AllTimeUserAnalytics> allTimeUserAnalyticsList = allTimeUserAnalyticsRepository.findAll();
        assertThat(allTimeUserAnalyticsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAllTimeUserAnalytics() throws Exception {
        int databaseSizeBeforeUpdate = allTimeUserAnalyticsRepository.findAll().size();
        allTimeUserAnalytics.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAllTimeUserAnalyticsMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(allTimeUserAnalytics))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AllTimeUserAnalytics in the database
        List<AllTimeUserAnalytics> allTimeUserAnalyticsList = allTimeUserAnalyticsRepository.findAll();
        assertThat(allTimeUserAnalyticsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAllTimeUserAnalytics() throws Exception {
        // Initialize the database
        allTimeUserAnalyticsRepository.saveAndFlush(allTimeUserAnalytics);

        int databaseSizeBeforeDelete = allTimeUserAnalyticsRepository.findAll().size();

        // Delete the allTimeUserAnalytics
        restAllTimeUserAnalyticsMockMvc
            .perform(delete(ENTITY_API_URL_ID, allTimeUserAnalytics.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AllTimeUserAnalytics> allTimeUserAnalyticsList = allTimeUserAnalyticsRepository.findAll();
        assertThat(allTimeUserAnalyticsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
