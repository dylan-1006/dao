package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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
import team.bham.domain.SessionAnalytic;
import team.bham.repository.SessionAnalyticRepository;

/**
 * Integration tests for the {@link SessionAnalyticResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SessionAnalyticResourceIT {

    private static final Integer DEFAULT_SESSION_DURATION = 1;
    private static final Integer UPDATED_SESSION_DURATION = 2;

    private static final Integer DEFAULT_TASK_TOTAL = 1;
    private static final Integer UPDATED_TASK_TOTAL = 2;

    private static final Integer DEFAULT_TASK_COMPLETED = 1;
    private static final Integer UPDATED_TASK_COMPLETED = 2;

    private static final Integer DEFAULT_POINTS_GAINED = 1;
    private static final Integer UPDATED_POINTS_GAINED = 2;

    private static final Integer DEFAULT_NUM_OF_POMODORO_FINISHED = 1;
    private static final Integer UPDATED_NUM_OF_POMODORO_FINISHED = 2;

    private static final Integer DEFAULT_PRAISE_COUNT = 1;
    private static final Integer UPDATED_PRAISE_COUNT = 2;

    private static final String ENTITY_API_URL = "/api/session-analytics";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SessionAnalyticRepository sessionAnalyticRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSessionAnalyticMockMvc;

    private SessionAnalytic sessionAnalytic;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SessionAnalytic createEntity(EntityManager em) {
        SessionAnalytic sessionAnalytic = new SessionAnalytic()
            .sessionDuration(DEFAULT_SESSION_DURATION)
            .taskTotal(DEFAULT_TASK_TOTAL)
            .taskCompleted(DEFAULT_TASK_COMPLETED)
            .pointsGained(DEFAULT_POINTS_GAINED)
            .numOfPomodoroFinished(DEFAULT_NUM_OF_POMODORO_FINISHED)
            .praiseCount(DEFAULT_PRAISE_COUNT);
        return sessionAnalytic;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SessionAnalytic createUpdatedEntity(EntityManager em) {
        SessionAnalytic sessionAnalytic = new SessionAnalytic()
            .sessionDuration(UPDATED_SESSION_DURATION)
            .taskTotal(UPDATED_TASK_TOTAL)
            .taskCompleted(UPDATED_TASK_COMPLETED)
            .pointsGained(UPDATED_POINTS_GAINED)
            .numOfPomodoroFinished(UPDATED_NUM_OF_POMODORO_FINISHED)
            .praiseCount(UPDATED_PRAISE_COUNT);
        return sessionAnalytic;
    }

    @BeforeEach
    public void initTest() {
        sessionAnalytic = createEntity(em);
    }

    @Test
    @Transactional
    void createSessionAnalytic() throws Exception {
        int databaseSizeBeforeCreate = sessionAnalyticRepository.findAll().size();
        // Create the SessionAnalytic
        restSessionAnalyticMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sessionAnalytic))
            )
            .andExpect(status().isCreated());

        // Validate the SessionAnalytic in the database
        List<SessionAnalytic> sessionAnalyticList = sessionAnalyticRepository.findAll();
        assertThat(sessionAnalyticList).hasSize(databaseSizeBeforeCreate + 1);
        SessionAnalytic testSessionAnalytic = sessionAnalyticList.get(sessionAnalyticList.size() - 1);
        assertThat(testSessionAnalytic.getSessionDuration()).isEqualTo(DEFAULT_SESSION_DURATION);
        assertThat(testSessionAnalytic.getTaskTotal()).isEqualTo(DEFAULT_TASK_TOTAL);
        assertThat(testSessionAnalytic.getTaskCompleted()).isEqualTo(DEFAULT_TASK_COMPLETED);
        assertThat(testSessionAnalytic.getPointsGained()).isEqualTo(DEFAULT_POINTS_GAINED);
        assertThat(testSessionAnalytic.getNumOfPomodoroFinished()).isEqualTo(DEFAULT_NUM_OF_POMODORO_FINISHED);
        assertThat(testSessionAnalytic.getPraiseCount()).isEqualTo(DEFAULT_PRAISE_COUNT);
    }

    @Test
    @Transactional
    void createSessionAnalyticWithExistingId() throws Exception {
        // Create the SessionAnalytic with an existing ID
        sessionAnalytic.setId(1L);

        int databaseSizeBeforeCreate = sessionAnalyticRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSessionAnalyticMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sessionAnalytic))
            )
            .andExpect(status().isBadRequest());

        // Validate the SessionAnalytic in the database
        List<SessionAnalytic> sessionAnalyticList = sessionAnalyticRepository.findAll();
        assertThat(sessionAnalyticList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSessionAnalytics() throws Exception {
        // Initialize the database
        sessionAnalyticRepository.saveAndFlush(sessionAnalytic);

        // Get all the sessionAnalyticList
        restSessionAnalyticMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sessionAnalytic.getId().intValue())))
            .andExpect(jsonPath("$.[*].sessionDuration").value(hasItem(DEFAULT_SESSION_DURATION)))
            .andExpect(jsonPath("$.[*].taskTotal").value(hasItem(DEFAULT_TASK_TOTAL)))
            .andExpect(jsonPath("$.[*].taskCompleted").value(hasItem(DEFAULT_TASK_COMPLETED)))
            .andExpect(jsonPath("$.[*].pointsGained").value(hasItem(DEFAULT_POINTS_GAINED)))
            .andExpect(jsonPath("$.[*].numOfPomodoroFinished").value(hasItem(DEFAULT_NUM_OF_POMODORO_FINISHED)))
            .andExpect(jsonPath("$.[*].praiseCount").value(hasItem(DEFAULT_PRAISE_COUNT)));
    }

    @Test
    @Transactional
    void getSessionAnalytic() throws Exception {
        // Initialize the database
        sessionAnalyticRepository.saveAndFlush(sessionAnalytic);

        // Get the sessionAnalytic
        restSessionAnalyticMockMvc
            .perform(get(ENTITY_API_URL_ID, sessionAnalytic.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sessionAnalytic.getId().intValue()))
            .andExpect(jsonPath("$.sessionDuration").value(DEFAULT_SESSION_DURATION))
            .andExpect(jsonPath("$.taskTotal").value(DEFAULT_TASK_TOTAL))
            .andExpect(jsonPath("$.taskCompleted").value(DEFAULT_TASK_COMPLETED))
            .andExpect(jsonPath("$.pointsGained").value(DEFAULT_POINTS_GAINED))
            .andExpect(jsonPath("$.numOfPomodoroFinished").value(DEFAULT_NUM_OF_POMODORO_FINISHED))
            .andExpect(jsonPath("$.praiseCount").value(DEFAULT_PRAISE_COUNT));
    }

    @Test
    @Transactional
    void getNonExistingSessionAnalytic() throws Exception {
        // Get the sessionAnalytic
        restSessionAnalyticMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSessionAnalytic() throws Exception {
        // Initialize the database
        sessionAnalyticRepository.saveAndFlush(sessionAnalytic);

        int databaseSizeBeforeUpdate = sessionAnalyticRepository.findAll().size();

        // Update the sessionAnalytic
        SessionAnalytic updatedSessionAnalytic = sessionAnalyticRepository.findById(sessionAnalytic.getId()).get();
        // Disconnect from session so that the updates on updatedSessionAnalytic are not directly saved in db
        em.detach(updatedSessionAnalytic);
        updatedSessionAnalytic
            .sessionDuration(UPDATED_SESSION_DURATION)
            .taskTotal(UPDATED_TASK_TOTAL)
            .taskCompleted(UPDATED_TASK_COMPLETED)
            .pointsGained(UPDATED_POINTS_GAINED)
            .numOfPomodoroFinished(UPDATED_NUM_OF_POMODORO_FINISHED)
            .praiseCount(UPDATED_PRAISE_COUNT);

        restSessionAnalyticMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSessionAnalytic.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSessionAnalytic))
            )
            .andExpect(status().isOk());

        // Validate the SessionAnalytic in the database
        List<SessionAnalytic> sessionAnalyticList = sessionAnalyticRepository.findAll();
        assertThat(sessionAnalyticList).hasSize(databaseSizeBeforeUpdate);
        SessionAnalytic testSessionAnalytic = sessionAnalyticList.get(sessionAnalyticList.size() - 1);
        assertThat(testSessionAnalytic.getSessionDuration()).isEqualTo(UPDATED_SESSION_DURATION);
        assertThat(testSessionAnalytic.getTaskTotal()).isEqualTo(UPDATED_TASK_TOTAL);
        assertThat(testSessionAnalytic.getTaskCompleted()).isEqualTo(UPDATED_TASK_COMPLETED);
        assertThat(testSessionAnalytic.getPointsGained()).isEqualTo(UPDATED_POINTS_GAINED);
        assertThat(testSessionAnalytic.getNumOfPomodoroFinished()).isEqualTo(UPDATED_NUM_OF_POMODORO_FINISHED);
        assertThat(testSessionAnalytic.getPraiseCount()).isEqualTo(UPDATED_PRAISE_COUNT);
    }

    @Test
    @Transactional
    void putNonExistingSessionAnalytic() throws Exception {
        int databaseSizeBeforeUpdate = sessionAnalyticRepository.findAll().size();
        sessionAnalytic.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSessionAnalyticMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sessionAnalytic.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sessionAnalytic))
            )
            .andExpect(status().isBadRequest());

        // Validate the SessionAnalytic in the database
        List<SessionAnalytic> sessionAnalyticList = sessionAnalyticRepository.findAll();
        assertThat(sessionAnalyticList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSessionAnalytic() throws Exception {
        int databaseSizeBeforeUpdate = sessionAnalyticRepository.findAll().size();
        sessionAnalytic.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSessionAnalyticMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sessionAnalytic))
            )
            .andExpect(status().isBadRequest());

        // Validate the SessionAnalytic in the database
        List<SessionAnalytic> sessionAnalyticList = sessionAnalyticRepository.findAll();
        assertThat(sessionAnalyticList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSessionAnalytic() throws Exception {
        int databaseSizeBeforeUpdate = sessionAnalyticRepository.findAll().size();
        sessionAnalytic.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSessionAnalyticMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sessionAnalytic))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SessionAnalytic in the database
        List<SessionAnalytic> sessionAnalyticList = sessionAnalyticRepository.findAll();
        assertThat(sessionAnalyticList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSessionAnalyticWithPatch() throws Exception {
        // Initialize the database
        sessionAnalyticRepository.saveAndFlush(sessionAnalytic);

        int databaseSizeBeforeUpdate = sessionAnalyticRepository.findAll().size();

        // Update the sessionAnalytic using partial update
        SessionAnalytic partialUpdatedSessionAnalytic = new SessionAnalytic();
        partialUpdatedSessionAnalytic.setId(sessionAnalytic.getId());

        partialUpdatedSessionAnalytic
            .sessionDuration(UPDATED_SESSION_DURATION)
            .taskTotal(UPDATED_TASK_TOTAL)
            .taskCompleted(UPDATED_TASK_COMPLETED);

        restSessionAnalyticMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSessionAnalytic.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSessionAnalytic))
            )
            .andExpect(status().isOk());

        // Validate the SessionAnalytic in the database
        List<SessionAnalytic> sessionAnalyticList = sessionAnalyticRepository.findAll();
        assertThat(sessionAnalyticList).hasSize(databaseSizeBeforeUpdate);
        SessionAnalytic testSessionAnalytic = sessionAnalyticList.get(sessionAnalyticList.size() - 1);
        assertThat(testSessionAnalytic.getSessionDuration()).isEqualTo(UPDATED_SESSION_DURATION);
        assertThat(testSessionAnalytic.getTaskTotal()).isEqualTo(UPDATED_TASK_TOTAL);
        assertThat(testSessionAnalytic.getTaskCompleted()).isEqualTo(UPDATED_TASK_COMPLETED);
        assertThat(testSessionAnalytic.getPointsGained()).isEqualTo(DEFAULT_POINTS_GAINED);
        assertThat(testSessionAnalytic.getNumOfPomodoroFinished()).isEqualTo(DEFAULT_NUM_OF_POMODORO_FINISHED);
        assertThat(testSessionAnalytic.getPraiseCount()).isEqualTo(DEFAULT_PRAISE_COUNT);
    }

    @Test
    @Transactional
    void fullUpdateSessionAnalyticWithPatch() throws Exception {
        // Initialize the database
        sessionAnalyticRepository.saveAndFlush(sessionAnalytic);

        int databaseSizeBeforeUpdate = sessionAnalyticRepository.findAll().size();

        // Update the sessionAnalytic using partial update
        SessionAnalytic partialUpdatedSessionAnalytic = new SessionAnalytic();
        partialUpdatedSessionAnalytic.setId(sessionAnalytic.getId());

        partialUpdatedSessionAnalytic
            .sessionDuration(UPDATED_SESSION_DURATION)
            .taskTotal(UPDATED_TASK_TOTAL)
            .taskCompleted(UPDATED_TASK_COMPLETED)
            .pointsGained(UPDATED_POINTS_GAINED)
            .numOfPomodoroFinished(UPDATED_NUM_OF_POMODORO_FINISHED)
            .praiseCount(UPDATED_PRAISE_COUNT);

        restSessionAnalyticMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSessionAnalytic.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSessionAnalytic))
            )
            .andExpect(status().isOk());

        // Validate the SessionAnalytic in the database
        List<SessionAnalytic> sessionAnalyticList = sessionAnalyticRepository.findAll();
        assertThat(sessionAnalyticList).hasSize(databaseSizeBeforeUpdate);
        SessionAnalytic testSessionAnalytic = sessionAnalyticList.get(sessionAnalyticList.size() - 1);
        assertThat(testSessionAnalytic.getSessionDuration()).isEqualTo(UPDATED_SESSION_DURATION);
        assertThat(testSessionAnalytic.getTaskTotal()).isEqualTo(UPDATED_TASK_TOTAL);
        assertThat(testSessionAnalytic.getTaskCompleted()).isEqualTo(UPDATED_TASK_COMPLETED);
        assertThat(testSessionAnalytic.getPointsGained()).isEqualTo(UPDATED_POINTS_GAINED);
        assertThat(testSessionAnalytic.getNumOfPomodoroFinished()).isEqualTo(UPDATED_NUM_OF_POMODORO_FINISHED);
        assertThat(testSessionAnalytic.getPraiseCount()).isEqualTo(UPDATED_PRAISE_COUNT);
    }

    @Test
    @Transactional
    void patchNonExistingSessionAnalytic() throws Exception {
        int databaseSizeBeforeUpdate = sessionAnalyticRepository.findAll().size();
        sessionAnalytic.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSessionAnalyticMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, sessionAnalytic.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sessionAnalytic))
            )
            .andExpect(status().isBadRequest());

        // Validate the SessionAnalytic in the database
        List<SessionAnalytic> sessionAnalyticList = sessionAnalyticRepository.findAll();
        assertThat(sessionAnalyticList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSessionAnalytic() throws Exception {
        int databaseSizeBeforeUpdate = sessionAnalyticRepository.findAll().size();
        sessionAnalytic.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSessionAnalyticMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sessionAnalytic))
            )
            .andExpect(status().isBadRequest());

        // Validate the SessionAnalytic in the database
        List<SessionAnalytic> sessionAnalyticList = sessionAnalyticRepository.findAll();
        assertThat(sessionAnalyticList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSessionAnalytic() throws Exception {
        int databaseSizeBeforeUpdate = sessionAnalyticRepository.findAll().size();
        sessionAnalytic.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSessionAnalyticMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sessionAnalytic))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SessionAnalytic in the database
        List<SessionAnalytic> sessionAnalyticList = sessionAnalyticRepository.findAll();
        assertThat(sessionAnalyticList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSessionAnalytic() throws Exception {
        // Initialize the database
        sessionAnalyticRepository.saveAndFlush(sessionAnalytic);

        int databaseSizeBeforeDelete = sessionAnalyticRepository.findAll().size();

        // Delete the sessionAnalytic
        restSessionAnalyticMockMvc
            .perform(delete(ENTITY_API_URL_ID, sessionAnalytic.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SessionAnalytic> sessionAnalyticList = sessionAnalyticRepository.findAll();
        assertThat(sessionAnalyticList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
