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
import team.bham.domain.Milestone;
import team.bham.repository.MilestoneRepository;

/**
 * Integration tests for the {@link MilestoneResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MilestoneResourceIT {

    private static final Integer DEFAULT_REQUIRED_HOURS = 1;
    private static final Integer UPDATED_REQUIRED_HOURS = 2;

    private static final String DEFAULT_ACHIEVEMENTS = "AAAAAAAAAA";
    private static final String UPDATED_ACHIEVEMENTS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/milestones";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MilestoneRepository milestoneRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMilestoneMockMvc;

    private Milestone milestone;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Milestone createEntity(EntityManager em) {
        Milestone milestone = new Milestone().requiredHours(DEFAULT_REQUIRED_HOURS).achievements(DEFAULT_ACHIEVEMENTS);
        return milestone;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Milestone createUpdatedEntity(EntityManager em) {
        Milestone milestone = new Milestone().requiredHours(UPDATED_REQUIRED_HOURS).achievements(UPDATED_ACHIEVEMENTS);
        return milestone;
    }

    @BeforeEach
    public void initTest() {
        milestone = createEntity(em);
    }

    @Test
    @Transactional
    void createMilestone() throws Exception {
        int databaseSizeBeforeCreate = milestoneRepository.findAll().size();
        // Create the Milestone
        restMilestoneMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(milestone)))
            .andExpect(status().isCreated());

        // Validate the Milestone in the database
        List<Milestone> milestoneList = milestoneRepository.findAll();
        assertThat(milestoneList).hasSize(databaseSizeBeforeCreate + 1);
        Milestone testMilestone = milestoneList.get(milestoneList.size() - 1);
        assertThat(testMilestone.getRequiredHours()).isEqualTo(DEFAULT_REQUIRED_HOURS);
        assertThat(testMilestone.getAchievements()).isEqualTo(DEFAULT_ACHIEVEMENTS);
    }

    @Test
    @Transactional
    void createMilestoneWithExistingId() throws Exception {
        // Create the Milestone with an existing ID
        milestone.setId(1L);

        int databaseSizeBeforeCreate = milestoneRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMilestoneMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(milestone)))
            .andExpect(status().isBadRequest());

        // Validate the Milestone in the database
        List<Milestone> milestoneList = milestoneRepository.findAll();
        assertThat(milestoneList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMilestones() throws Exception {
        // Initialize the database
        milestoneRepository.saveAndFlush(milestone);

        // Get all the milestoneList
        restMilestoneMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(milestone.getId().intValue())))
            .andExpect(jsonPath("$.[*].requiredHours").value(hasItem(DEFAULT_REQUIRED_HOURS)))
            .andExpect(jsonPath("$.[*].achievements").value(hasItem(DEFAULT_ACHIEVEMENTS)));
    }

    @Test
    @Transactional
    void getMilestone() throws Exception {
        // Initialize the database
        milestoneRepository.saveAndFlush(milestone);

        // Get the milestone
        restMilestoneMockMvc
            .perform(get(ENTITY_API_URL_ID, milestone.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(milestone.getId().intValue()))
            .andExpect(jsonPath("$.requiredHours").value(DEFAULT_REQUIRED_HOURS))
            .andExpect(jsonPath("$.achievements").value(DEFAULT_ACHIEVEMENTS));
    }

    @Test
    @Transactional
    void getNonExistingMilestone() throws Exception {
        // Get the milestone
        restMilestoneMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMilestone() throws Exception {
        // Initialize the database
        milestoneRepository.saveAndFlush(milestone);

        int databaseSizeBeforeUpdate = milestoneRepository.findAll().size();

        // Update the milestone
        Milestone updatedMilestone = milestoneRepository.findById(milestone.getId()).get();
        // Disconnect from session so that the updates on updatedMilestone are not directly saved in db
        em.detach(updatedMilestone);
        updatedMilestone.requiredHours(UPDATED_REQUIRED_HOURS).achievements(UPDATED_ACHIEVEMENTS);

        restMilestoneMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMilestone.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMilestone))
            )
            .andExpect(status().isOk());

        // Validate the Milestone in the database
        List<Milestone> milestoneList = milestoneRepository.findAll();
        assertThat(milestoneList).hasSize(databaseSizeBeforeUpdate);
        Milestone testMilestone = milestoneList.get(milestoneList.size() - 1);
        assertThat(testMilestone.getRequiredHours()).isEqualTo(UPDATED_REQUIRED_HOURS);
        assertThat(testMilestone.getAchievements()).isEqualTo(UPDATED_ACHIEVEMENTS);
    }

    @Test
    @Transactional
    void putNonExistingMilestone() throws Exception {
        int databaseSizeBeforeUpdate = milestoneRepository.findAll().size();
        milestone.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMilestoneMockMvc
            .perform(
                put(ENTITY_API_URL_ID, milestone.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(milestone))
            )
            .andExpect(status().isBadRequest());

        // Validate the Milestone in the database
        List<Milestone> milestoneList = milestoneRepository.findAll();
        assertThat(milestoneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMilestone() throws Exception {
        int databaseSizeBeforeUpdate = milestoneRepository.findAll().size();
        milestone.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMilestoneMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(milestone))
            )
            .andExpect(status().isBadRequest());

        // Validate the Milestone in the database
        List<Milestone> milestoneList = milestoneRepository.findAll();
        assertThat(milestoneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMilestone() throws Exception {
        int databaseSizeBeforeUpdate = milestoneRepository.findAll().size();
        milestone.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMilestoneMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(milestone)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Milestone in the database
        List<Milestone> milestoneList = milestoneRepository.findAll();
        assertThat(milestoneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMilestoneWithPatch() throws Exception {
        // Initialize the database
        milestoneRepository.saveAndFlush(milestone);

        int databaseSizeBeforeUpdate = milestoneRepository.findAll().size();

        // Update the milestone using partial update
        Milestone partialUpdatedMilestone = new Milestone();
        partialUpdatedMilestone.setId(milestone.getId());

        restMilestoneMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMilestone.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMilestone))
            )
            .andExpect(status().isOk());

        // Validate the Milestone in the database
        List<Milestone> milestoneList = milestoneRepository.findAll();
        assertThat(milestoneList).hasSize(databaseSizeBeforeUpdate);
        Milestone testMilestone = milestoneList.get(milestoneList.size() - 1);
        assertThat(testMilestone.getRequiredHours()).isEqualTo(DEFAULT_REQUIRED_HOURS);
        assertThat(testMilestone.getAchievements()).isEqualTo(DEFAULT_ACHIEVEMENTS);
    }

    @Test
    @Transactional
    void fullUpdateMilestoneWithPatch() throws Exception {
        // Initialize the database
        milestoneRepository.saveAndFlush(milestone);

        int databaseSizeBeforeUpdate = milestoneRepository.findAll().size();

        // Update the milestone using partial update
        Milestone partialUpdatedMilestone = new Milestone();
        partialUpdatedMilestone.setId(milestone.getId());

        partialUpdatedMilestone.requiredHours(UPDATED_REQUIRED_HOURS).achievements(UPDATED_ACHIEVEMENTS);

        restMilestoneMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMilestone.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMilestone))
            )
            .andExpect(status().isOk());

        // Validate the Milestone in the database
        List<Milestone> milestoneList = milestoneRepository.findAll();
        assertThat(milestoneList).hasSize(databaseSizeBeforeUpdate);
        Milestone testMilestone = milestoneList.get(milestoneList.size() - 1);
        assertThat(testMilestone.getRequiredHours()).isEqualTo(UPDATED_REQUIRED_HOURS);
        assertThat(testMilestone.getAchievements()).isEqualTo(UPDATED_ACHIEVEMENTS);
    }

    @Test
    @Transactional
    void patchNonExistingMilestone() throws Exception {
        int databaseSizeBeforeUpdate = milestoneRepository.findAll().size();
        milestone.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMilestoneMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, milestone.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(milestone))
            )
            .andExpect(status().isBadRequest());

        // Validate the Milestone in the database
        List<Milestone> milestoneList = milestoneRepository.findAll();
        assertThat(milestoneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMilestone() throws Exception {
        int databaseSizeBeforeUpdate = milestoneRepository.findAll().size();
        milestone.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMilestoneMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(milestone))
            )
            .andExpect(status().isBadRequest());

        // Validate the Milestone in the database
        List<Milestone> milestoneList = milestoneRepository.findAll();
        assertThat(milestoneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMilestone() throws Exception {
        int databaseSizeBeforeUpdate = milestoneRepository.findAll().size();
        milestone.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMilestoneMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(milestone))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Milestone in the database
        List<Milestone> milestoneList = milestoneRepository.findAll();
        assertThat(milestoneList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMilestone() throws Exception {
        // Initialize the database
        milestoneRepository.saveAndFlush(milestone);

        int databaseSizeBeforeDelete = milestoneRepository.findAll().size();

        // Delete the milestone
        restMilestoneMockMvc
            .perform(delete(ENTITY_API_URL_ID, milestone.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Milestone> milestoneList = milestoneRepository.findAll();
        assertThat(milestoneList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
