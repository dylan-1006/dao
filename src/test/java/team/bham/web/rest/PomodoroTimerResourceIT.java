package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Duration;
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
import team.bham.domain.PomodoroTimer;
import team.bham.domain.enumeration.TimerState;
import team.bham.domain.enumeration.TimerType;
import team.bham.repository.PomodoroTimerRepository;

/**
 * Integration tests for the {@link PomodoroTimerResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PomodoroTimerResourceIT {

    private static final Instant DEFAULT_START_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_END_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final TimerState DEFAULT_STATE = TimerState.STARTED;
    private static final TimerState UPDATED_STATE = TimerState.PAUSED;

    private static final TimerType DEFAULT_TYPE = TimerType.POMODORO_TIMER;
    private static final TimerType UPDATED_TYPE = TimerType.SHORT_BREAK_TIMER;

    private static final Duration DEFAULT_DURATION = Duration.ofHours(6);
    private static final Duration UPDATED_DURATION = Duration.ofHours(12);

    private static final String ENTITY_API_URL = "/api/pomodoro-timers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PomodoroTimerRepository pomodoroTimerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPomodoroTimerMockMvc;

    private PomodoroTimer pomodoroTimer;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PomodoroTimer createEntity(EntityManager em) {
        PomodoroTimer pomodoroTimer = new PomodoroTimer()
            .startTime(DEFAULT_START_TIME)
            .endTime(DEFAULT_END_TIME)
            .state(DEFAULT_STATE)
            .type(DEFAULT_TYPE)
            .duration(DEFAULT_DURATION);
        return pomodoroTimer;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PomodoroTimer createUpdatedEntity(EntityManager em) {
        PomodoroTimer pomodoroTimer = new PomodoroTimer()
            .startTime(UPDATED_START_TIME)
            .endTime(UPDATED_END_TIME)
            .state(UPDATED_STATE)
            .type(UPDATED_TYPE)
            .duration(UPDATED_DURATION);
        return pomodoroTimer;
    }

    @BeforeEach
    public void initTest() {
        pomodoroTimer = createEntity(em);
    }

    @Test
    @Transactional
    void createPomodoroTimer() throws Exception {
        int databaseSizeBeforeCreate = pomodoroTimerRepository.findAll().size();
        // Create the PomodoroTimer
        restPomodoroTimerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pomodoroTimer)))
            .andExpect(status().isCreated());

        // Validate the PomodoroTimer in the database
        List<PomodoroTimer> pomodoroTimerList = pomodoroTimerRepository.findAll();
        assertThat(pomodoroTimerList).hasSize(databaseSizeBeforeCreate + 1);
        PomodoroTimer testPomodoroTimer = pomodoroTimerList.get(pomodoroTimerList.size() - 1);
        assertThat(testPomodoroTimer.getStartTime()).isEqualTo(DEFAULT_START_TIME);
        assertThat(testPomodoroTimer.getEndTime()).isEqualTo(DEFAULT_END_TIME);
        assertThat(testPomodoroTimer.getState()).isEqualTo(DEFAULT_STATE);
        assertThat(testPomodoroTimer.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testPomodoroTimer.getDuration()).isEqualTo(DEFAULT_DURATION);
    }

    @Test
    @Transactional
    void createPomodoroTimerWithExistingId() throws Exception {
        // Create the PomodoroTimer with an existing ID
        pomodoroTimer.setId(1L);

        int databaseSizeBeforeCreate = pomodoroTimerRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPomodoroTimerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pomodoroTimer)))
            .andExpect(status().isBadRequest());

        // Validate the PomodoroTimer in the database
        List<PomodoroTimer> pomodoroTimerList = pomodoroTimerRepository.findAll();
        assertThat(pomodoroTimerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPomodoroTimers() throws Exception {
        // Initialize the database
        pomodoroTimerRepository.saveAndFlush(pomodoroTimer);

        // Get all the pomodoroTimerList
        restPomodoroTimerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pomodoroTimer.getId().intValue())))
            .andExpect(jsonPath("$.[*].startTime").value(hasItem(DEFAULT_START_TIME.toString())))
            .andExpect(jsonPath("$.[*].endTime").value(hasItem(DEFAULT_END_TIME.toString())))
            .andExpect(jsonPath("$.[*].state").value(hasItem(DEFAULT_STATE.toString())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].duration").value(hasItem(DEFAULT_DURATION.toString())));
    }

    @Test
    @Transactional
    void getPomodoroTimer() throws Exception {
        // Initialize the database
        pomodoroTimerRepository.saveAndFlush(pomodoroTimer);

        // Get the pomodoroTimer
        restPomodoroTimerMockMvc
            .perform(get(ENTITY_API_URL_ID, pomodoroTimer.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(pomodoroTimer.getId().intValue()))
            .andExpect(jsonPath("$.startTime").value(DEFAULT_START_TIME.toString()))
            .andExpect(jsonPath("$.endTime").value(DEFAULT_END_TIME.toString()))
            .andExpect(jsonPath("$.state").value(DEFAULT_STATE.toString()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.duration").value(DEFAULT_DURATION.toString()));
    }

    @Test
    @Transactional
    void getNonExistingPomodoroTimer() throws Exception {
        // Get the pomodoroTimer
        restPomodoroTimerMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPomodoroTimer() throws Exception {
        // Initialize the database
        pomodoroTimerRepository.saveAndFlush(pomodoroTimer);

        int databaseSizeBeforeUpdate = pomodoroTimerRepository.findAll().size();

        // Update the pomodoroTimer
        PomodoroTimer updatedPomodoroTimer = pomodoroTimerRepository.findById(pomodoroTimer.getId()).get();
        // Disconnect from session so that the updates on updatedPomodoroTimer are not directly saved in db
        em.detach(updatedPomodoroTimer);
        updatedPomodoroTimer
            .startTime(UPDATED_START_TIME)
            .endTime(UPDATED_END_TIME)
            .state(UPDATED_STATE)
            .type(UPDATED_TYPE)
            .duration(UPDATED_DURATION);

        restPomodoroTimerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPomodoroTimer.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPomodoroTimer))
            )
            .andExpect(status().isOk());

        // Validate the PomodoroTimer in the database
        List<PomodoroTimer> pomodoroTimerList = pomodoroTimerRepository.findAll();
        assertThat(pomodoroTimerList).hasSize(databaseSizeBeforeUpdate);
        PomodoroTimer testPomodoroTimer = pomodoroTimerList.get(pomodoroTimerList.size() - 1);
        assertThat(testPomodoroTimer.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testPomodoroTimer.getEndTime()).isEqualTo(UPDATED_END_TIME);
        assertThat(testPomodoroTimer.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testPomodoroTimer.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testPomodoroTimer.getDuration()).isEqualTo(UPDATED_DURATION);
    }

    @Test
    @Transactional
    void putNonExistingPomodoroTimer() throws Exception {
        int databaseSizeBeforeUpdate = pomodoroTimerRepository.findAll().size();
        pomodoroTimer.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPomodoroTimerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, pomodoroTimer.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pomodoroTimer))
            )
            .andExpect(status().isBadRequest());

        // Validate the PomodoroTimer in the database
        List<PomodoroTimer> pomodoroTimerList = pomodoroTimerRepository.findAll();
        assertThat(pomodoroTimerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPomodoroTimer() throws Exception {
        int databaseSizeBeforeUpdate = pomodoroTimerRepository.findAll().size();
        pomodoroTimer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPomodoroTimerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pomodoroTimer))
            )
            .andExpect(status().isBadRequest());

        // Validate the PomodoroTimer in the database
        List<PomodoroTimer> pomodoroTimerList = pomodoroTimerRepository.findAll();
        assertThat(pomodoroTimerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPomodoroTimer() throws Exception {
        int databaseSizeBeforeUpdate = pomodoroTimerRepository.findAll().size();
        pomodoroTimer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPomodoroTimerMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pomodoroTimer)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PomodoroTimer in the database
        List<PomodoroTimer> pomodoroTimerList = pomodoroTimerRepository.findAll();
        assertThat(pomodoroTimerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePomodoroTimerWithPatch() throws Exception {
        // Initialize the database
        pomodoroTimerRepository.saveAndFlush(pomodoroTimer);

        int databaseSizeBeforeUpdate = pomodoroTimerRepository.findAll().size();

        // Update the pomodoroTimer using partial update
        PomodoroTimer partialUpdatedPomodoroTimer = new PomodoroTimer();
        partialUpdatedPomodoroTimer.setId(pomodoroTimer.getId());

        partialUpdatedPomodoroTimer.startTime(UPDATED_START_TIME).type(UPDATED_TYPE).duration(UPDATED_DURATION);

        restPomodoroTimerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPomodoroTimer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPomodoroTimer))
            )
            .andExpect(status().isOk());

        // Validate the PomodoroTimer in the database
        List<PomodoroTimer> pomodoroTimerList = pomodoroTimerRepository.findAll();
        assertThat(pomodoroTimerList).hasSize(databaseSizeBeforeUpdate);
        PomodoroTimer testPomodoroTimer = pomodoroTimerList.get(pomodoroTimerList.size() - 1);
        assertThat(testPomodoroTimer.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testPomodoroTimer.getEndTime()).isEqualTo(DEFAULT_END_TIME);
        assertThat(testPomodoroTimer.getState()).isEqualTo(DEFAULT_STATE);
        assertThat(testPomodoroTimer.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testPomodoroTimer.getDuration()).isEqualTo(UPDATED_DURATION);
    }

    @Test
    @Transactional
    void fullUpdatePomodoroTimerWithPatch() throws Exception {
        // Initialize the database
        pomodoroTimerRepository.saveAndFlush(pomodoroTimer);

        int databaseSizeBeforeUpdate = pomodoroTimerRepository.findAll().size();

        // Update the pomodoroTimer using partial update
        PomodoroTimer partialUpdatedPomodoroTimer = new PomodoroTimer();
        partialUpdatedPomodoroTimer.setId(pomodoroTimer.getId());

        partialUpdatedPomodoroTimer
            .startTime(UPDATED_START_TIME)
            .endTime(UPDATED_END_TIME)
            .state(UPDATED_STATE)
            .type(UPDATED_TYPE)
            .duration(UPDATED_DURATION);

        restPomodoroTimerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPomodoroTimer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPomodoroTimer))
            )
            .andExpect(status().isOk());

        // Validate the PomodoroTimer in the database
        List<PomodoroTimer> pomodoroTimerList = pomodoroTimerRepository.findAll();
        assertThat(pomodoroTimerList).hasSize(databaseSizeBeforeUpdate);
        PomodoroTimer testPomodoroTimer = pomodoroTimerList.get(pomodoroTimerList.size() - 1);
        assertThat(testPomodoroTimer.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testPomodoroTimer.getEndTime()).isEqualTo(UPDATED_END_TIME);
        assertThat(testPomodoroTimer.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testPomodoroTimer.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testPomodoroTimer.getDuration()).isEqualTo(UPDATED_DURATION);
    }

    @Test
    @Transactional
    void patchNonExistingPomodoroTimer() throws Exception {
        int databaseSizeBeforeUpdate = pomodoroTimerRepository.findAll().size();
        pomodoroTimer.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPomodoroTimerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, pomodoroTimer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pomodoroTimer))
            )
            .andExpect(status().isBadRequest());

        // Validate the PomodoroTimer in the database
        List<PomodoroTimer> pomodoroTimerList = pomodoroTimerRepository.findAll();
        assertThat(pomodoroTimerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPomodoroTimer() throws Exception {
        int databaseSizeBeforeUpdate = pomodoroTimerRepository.findAll().size();
        pomodoroTimer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPomodoroTimerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pomodoroTimer))
            )
            .andExpect(status().isBadRequest());

        // Validate the PomodoroTimer in the database
        List<PomodoroTimer> pomodoroTimerList = pomodoroTimerRepository.findAll();
        assertThat(pomodoroTimerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPomodoroTimer() throws Exception {
        int databaseSizeBeforeUpdate = pomodoroTimerRepository.findAll().size();
        pomodoroTimer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPomodoroTimerMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(pomodoroTimer))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PomodoroTimer in the database
        List<PomodoroTimer> pomodoroTimerList = pomodoroTimerRepository.findAll();
        assertThat(pomodoroTimerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePomodoroTimer() throws Exception {
        // Initialize the database
        pomodoroTimerRepository.saveAndFlush(pomodoroTimer);

        int databaseSizeBeforeDelete = pomodoroTimerRepository.findAll().size();

        // Delete the pomodoroTimer
        restPomodoroTimerMockMvc
            .perform(delete(ENTITY_API_URL_ID, pomodoroTimer.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PomodoroTimer> pomodoroTimerList = pomodoroTimerRepository.findAll();
        assertThat(pomodoroTimerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
