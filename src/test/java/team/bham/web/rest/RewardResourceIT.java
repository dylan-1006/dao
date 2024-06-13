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
import team.bham.domain.Reward;
import team.bham.repository.RewardRepository;

/**
 * Integration tests for the {@link RewardResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RewardResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_REWARD_URL = "AAAAAAAAAA";
    private static final String UPDATED_REWARD_URL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/rewards";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RewardRepository rewardRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRewardMockMvc;

    private Reward reward;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Reward createEntity(EntityManager em) {
        Reward reward = new Reward().title(DEFAULT_TITLE).description(DEFAULT_DESCRIPTION).rewardUrl(DEFAULT_REWARD_URL);
        return reward;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Reward createUpdatedEntity(EntityManager em) {
        Reward reward = new Reward().title(UPDATED_TITLE).description(UPDATED_DESCRIPTION).rewardUrl(UPDATED_REWARD_URL);
        return reward;
    }

    @BeforeEach
    public void initTest() {
        reward = createEntity(em);
    }

    @Test
    @Transactional
    void createReward() throws Exception {
        int databaseSizeBeforeCreate = rewardRepository.findAll().size();
        // Create the Reward
        restRewardMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(reward)))
            .andExpect(status().isCreated());

        // Validate the Reward in the database
        List<Reward> rewardList = rewardRepository.findAll();
        assertThat(rewardList).hasSize(databaseSizeBeforeCreate + 1);
        Reward testReward = rewardList.get(rewardList.size() - 1);
        assertThat(testReward.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testReward.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testReward.getRewardUrl()).isEqualTo(DEFAULT_REWARD_URL);
    }

    @Test
    @Transactional
    void createRewardWithExistingId() throws Exception {
        // Create the Reward with an existing ID
        reward.setId(1L);

        int databaseSizeBeforeCreate = rewardRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRewardMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(reward)))
            .andExpect(status().isBadRequest());

        // Validate the Reward in the database
        List<Reward> rewardList = rewardRepository.findAll();
        assertThat(rewardList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRewards() throws Exception {
        // Initialize the database
        rewardRepository.saveAndFlush(reward);

        // Get all the rewardList
        restRewardMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(reward.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].rewardUrl").value(hasItem(DEFAULT_REWARD_URL)));
    }

    @Test
    @Transactional
    void getReward() throws Exception {
        // Initialize the database
        rewardRepository.saveAndFlush(reward);

        // Get the reward
        restRewardMockMvc
            .perform(get(ENTITY_API_URL_ID, reward.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(reward.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.rewardUrl").value(DEFAULT_REWARD_URL));
    }

    @Test
    @Transactional
    void getNonExistingReward() throws Exception {
        // Get the reward
        restRewardMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingReward() throws Exception {
        // Initialize the database
        rewardRepository.saveAndFlush(reward);

        int databaseSizeBeforeUpdate = rewardRepository.findAll().size();

        // Update the reward
        Reward updatedReward = rewardRepository.findById(reward.getId()).get();
        // Disconnect from session so that the updates on updatedReward are not directly saved in db
        em.detach(updatedReward);
        updatedReward.title(UPDATED_TITLE).description(UPDATED_DESCRIPTION).rewardUrl(UPDATED_REWARD_URL);

        restRewardMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedReward.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedReward))
            )
            .andExpect(status().isOk());

        // Validate the Reward in the database
        List<Reward> rewardList = rewardRepository.findAll();
        assertThat(rewardList).hasSize(databaseSizeBeforeUpdate);
        Reward testReward = rewardList.get(rewardList.size() - 1);
        assertThat(testReward.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testReward.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testReward.getRewardUrl()).isEqualTo(UPDATED_REWARD_URL);
    }

    @Test
    @Transactional
    void putNonExistingReward() throws Exception {
        int databaseSizeBeforeUpdate = rewardRepository.findAll().size();
        reward.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRewardMockMvc
            .perform(
                put(ENTITY_API_URL_ID, reward.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(reward))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reward in the database
        List<Reward> rewardList = rewardRepository.findAll();
        assertThat(rewardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchReward() throws Exception {
        int databaseSizeBeforeUpdate = rewardRepository.findAll().size();
        reward.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRewardMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(reward))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reward in the database
        List<Reward> rewardList = rewardRepository.findAll();
        assertThat(rewardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamReward() throws Exception {
        int databaseSizeBeforeUpdate = rewardRepository.findAll().size();
        reward.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRewardMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(reward)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Reward in the database
        List<Reward> rewardList = rewardRepository.findAll();
        assertThat(rewardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRewardWithPatch() throws Exception {
        // Initialize the database
        rewardRepository.saveAndFlush(reward);

        int databaseSizeBeforeUpdate = rewardRepository.findAll().size();

        // Update the reward using partial update
        Reward partialUpdatedReward = new Reward();
        partialUpdatedReward.setId(reward.getId());

        partialUpdatedReward.title(UPDATED_TITLE).rewardUrl(UPDATED_REWARD_URL);

        restRewardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReward.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedReward))
            )
            .andExpect(status().isOk());

        // Validate the Reward in the database
        List<Reward> rewardList = rewardRepository.findAll();
        assertThat(rewardList).hasSize(databaseSizeBeforeUpdate);
        Reward testReward = rewardList.get(rewardList.size() - 1);
        assertThat(testReward.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testReward.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testReward.getRewardUrl()).isEqualTo(UPDATED_REWARD_URL);
    }

    @Test
    @Transactional
    void fullUpdateRewardWithPatch() throws Exception {
        // Initialize the database
        rewardRepository.saveAndFlush(reward);

        int databaseSizeBeforeUpdate = rewardRepository.findAll().size();

        // Update the reward using partial update
        Reward partialUpdatedReward = new Reward();
        partialUpdatedReward.setId(reward.getId());

        partialUpdatedReward.title(UPDATED_TITLE).description(UPDATED_DESCRIPTION).rewardUrl(UPDATED_REWARD_URL);

        restRewardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReward.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedReward))
            )
            .andExpect(status().isOk());

        // Validate the Reward in the database
        List<Reward> rewardList = rewardRepository.findAll();
        assertThat(rewardList).hasSize(databaseSizeBeforeUpdate);
        Reward testReward = rewardList.get(rewardList.size() - 1);
        assertThat(testReward.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testReward.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testReward.getRewardUrl()).isEqualTo(UPDATED_REWARD_URL);
    }

    @Test
    @Transactional
    void patchNonExistingReward() throws Exception {
        int databaseSizeBeforeUpdate = rewardRepository.findAll().size();
        reward.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRewardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, reward.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(reward))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reward in the database
        List<Reward> rewardList = rewardRepository.findAll();
        assertThat(rewardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchReward() throws Exception {
        int databaseSizeBeforeUpdate = rewardRepository.findAll().size();
        reward.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRewardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(reward))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reward in the database
        List<Reward> rewardList = rewardRepository.findAll();
        assertThat(rewardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamReward() throws Exception {
        int databaseSizeBeforeUpdate = rewardRepository.findAll().size();
        reward.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRewardMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(reward)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Reward in the database
        List<Reward> rewardList = rewardRepository.findAll();
        assertThat(rewardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteReward() throws Exception {
        // Initialize the database
        rewardRepository.saveAndFlush(reward);

        int databaseSizeBeforeDelete = rewardRepository.findAll().size();

        // Delete the reward
        restRewardMockMvc
            .perform(delete(ENTITY_API_URL_ID, reward.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Reward> rewardList = rewardRepository.findAll();
        assertThat(rewardList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
