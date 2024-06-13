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
import team.bham.domain.Praise;
import team.bham.repository.PraiseRepository;

/**
 * Integration tests for the {@link PraiseResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PraiseResourceIT {

    private static final String DEFAULT_PRAISE_MESSAGE = "AAAAAAAAAA";
    private static final String UPDATED_PRAISE_MESSAGE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/praises";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PraiseRepository praiseRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPraiseMockMvc;

    private Praise praise;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Praise createEntity(EntityManager em) {
        Praise praise = new Praise().praiseMessage(DEFAULT_PRAISE_MESSAGE);
        return praise;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Praise createUpdatedEntity(EntityManager em) {
        Praise praise = new Praise().praiseMessage(UPDATED_PRAISE_MESSAGE);
        return praise;
    }

    @BeforeEach
    public void initTest() {
        praise = createEntity(em);
    }

    @Test
    @Transactional
    void createPraise() throws Exception {
        int databaseSizeBeforeCreate = praiseRepository.findAll().size();
        // Create the Praise
        restPraiseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(praise)))
            .andExpect(status().isCreated());

        // Validate the Praise in the database
        List<Praise> praiseList = praiseRepository.findAll();
        assertThat(praiseList).hasSize(databaseSizeBeforeCreate + 1);
        Praise testPraise = praiseList.get(praiseList.size() - 1);
        assertThat(testPraise.getPraiseMessage()).isEqualTo(DEFAULT_PRAISE_MESSAGE);
    }

    @Test
    @Transactional
    void createPraiseWithExistingId() throws Exception {
        // Create the Praise with an existing ID
        praise.setId(1L);

        int databaseSizeBeforeCreate = praiseRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPraiseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(praise)))
            .andExpect(status().isBadRequest());

        // Validate the Praise in the database
        List<Praise> praiseList = praiseRepository.findAll();
        assertThat(praiseList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPraises() throws Exception {
        // Initialize the database
        praiseRepository.saveAndFlush(praise);

        // Get all the praiseList
        restPraiseMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(praise.getId().intValue())))
            .andExpect(jsonPath("$.[*].praiseMessage").value(hasItem(DEFAULT_PRAISE_MESSAGE)));
    }

    @Test
    @Transactional
    void getPraise() throws Exception {
        // Initialize the database
        praiseRepository.saveAndFlush(praise);

        // Get the praise
        restPraiseMockMvc
            .perform(get(ENTITY_API_URL_ID, praise.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(praise.getId().intValue()))
            .andExpect(jsonPath("$.praiseMessage").value(DEFAULT_PRAISE_MESSAGE));
    }

    @Test
    @Transactional
    void getNonExistingPraise() throws Exception {
        // Get the praise
        restPraiseMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPraise() throws Exception {
        // Initialize the database
        praiseRepository.saveAndFlush(praise);

        int databaseSizeBeforeUpdate = praiseRepository.findAll().size();

        // Update the praise
        Praise updatedPraise = praiseRepository.findById(praise.getId()).get();
        // Disconnect from session so that the updates on updatedPraise are not directly saved in db
        em.detach(updatedPraise);
        updatedPraise.praiseMessage(UPDATED_PRAISE_MESSAGE);

        restPraiseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPraise.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPraise))
            )
            .andExpect(status().isOk());

        // Validate the Praise in the database
        List<Praise> praiseList = praiseRepository.findAll();
        assertThat(praiseList).hasSize(databaseSizeBeforeUpdate);
        Praise testPraise = praiseList.get(praiseList.size() - 1);
        assertThat(testPraise.getPraiseMessage()).isEqualTo(UPDATED_PRAISE_MESSAGE);
    }

    @Test
    @Transactional
    void putNonExistingPraise() throws Exception {
        int databaseSizeBeforeUpdate = praiseRepository.findAll().size();
        praise.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPraiseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, praise.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(praise))
            )
            .andExpect(status().isBadRequest());

        // Validate the Praise in the database
        List<Praise> praiseList = praiseRepository.findAll();
        assertThat(praiseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPraise() throws Exception {
        int databaseSizeBeforeUpdate = praiseRepository.findAll().size();
        praise.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPraiseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(praise))
            )
            .andExpect(status().isBadRequest());

        // Validate the Praise in the database
        List<Praise> praiseList = praiseRepository.findAll();
        assertThat(praiseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPraise() throws Exception {
        int databaseSizeBeforeUpdate = praiseRepository.findAll().size();
        praise.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPraiseMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(praise)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Praise in the database
        List<Praise> praiseList = praiseRepository.findAll();
        assertThat(praiseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePraiseWithPatch() throws Exception {
        // Initialize the database
        praiseRepository.saveAndFlush(praise);

        int databaseSizeBeforeUpdate = praiseRepository.findAll().size();

        // Update the praise using partial update
        Praise partialUpdatedPraise = new Praise();
        partialUpdatedPraise.setId(praise.getId());

        restPraiseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPraise.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPraise))
            )
            .andExpect(status().isOk());

        // Validate the Praise in the database
        List<Praise> praiseList = praiseRepository.findAll();
        assertThat(praiseList).hasSize(databaseSizeBeforeUpdate);
        Praise testPraise = praiseList.get(praiseList.size() - 1);
        assertThat(testPraise.getPraiseMessage()).isEqualTo(DEFAULT_PRAISE_MESSAGE);
    }

    @Test
    @Transactional
    void fullUpdatePraiseWithPatch() throws Exception {
        // Initialize the database
        praiseRepository.saveAndFlush(praise);

        int databaseSizeBeforeUpdate = praiseRepository.findAll().size();

        // Update the praise using partial update
        Praise partialUpdatedPraise = new Praise();
        partialUpdatedPraise.setId(praise.getId());

        partialUpdatedPraise.praiseMessage(UPDATED_PRAISE_MESSAGE);

        restPraiseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPraise.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPraise))
            )
            .andExpect(status().isOk());

        // Validate the Praise in the database
        List<Praise> praiseList = praiseRepository.findAll();
        assertThat(praiseList).hasSize(databaseSizeBeforeUpdate);
        Praise testPraise = praiseList.get(praiseList.size() - 1);
        assertThat(testPraise.getPraiseMessage()).isEqualTo(UPDATED_PRAISE_MESSAGE);
    }

    @Test
    @Transactional
    void patchNonExistingPraise() throws Exception {
        int databaseSizeBeforeUpdate = praiseRepository.findAll().size();
        praise.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPraiseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, praise.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(praise))
            )
            .andExpect(status().isBadRequest());

        // Validate the Praise in the database
        List<Praise> praiseList = praiseRepository.findAll();
        assertThat(praiseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPraise() throws Exception {
        int databaseSizeBeforeUpdate = praiseRepository.findAll().size();
        praise.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPraiseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(praise))
            )
            .andExpect(status().isBadRequest());

        // Validate the Praise in the database
        List<Praise> praiseList = praiseRepository.findAll();
        assertThat(praiseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPraise() throws Exception {
        int databaseSizeBeforeUpdate = praiseRepository.findAll().size();
        praise.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPraiseMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(praise)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Praise in the database
        List<Praise> praiseList = praiseRepository.findAll();
        assertThat(praiseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePraise() throws Exception {
        // Initialize the database
        praiseRepository.saveAndFlush(praise);

        int databaseSizeBeforeDelete = praiseRepository.findAll().size();

        // Delete the praise
        restPraiseMockMvc
            .perform(delete(ENTITY_API_URL_ID, praise.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Praise> praiseList = praiseRepository.findAll();
        assertThat(praiseList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
