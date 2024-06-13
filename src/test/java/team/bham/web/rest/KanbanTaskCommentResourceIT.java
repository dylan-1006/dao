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
import team.bham.domain.KanbanTaskComment;
import team.bham.repository.KanbanTaskCommentRepository;

/**
 * Integration tests for the {@link KanbanTaskCommentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class KanbanTaskCommentResourceIT {

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final Instant DEFAULT_TIME_STAMP = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_TIME_STAMP = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/kanban-task-comments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private KanbanTaskCommentRepository kanbanTaskCommentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restKanbanTaskCommentMockMvc;

    private KanbanTaskComment kanbanTaskComment;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static KanbanTaskComment createEntity(EntityManager em) {
        KanbanTaskComment kanbanTaskComment = new KanbanTaskComment().content(DEFAULT_CONTENT).timeStamp(DEFAULT_TIME_STAMP);
        return kanbanTaskComment;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static KanbanTaskComment createUpdatedEntity(EntityManager em) {
        KanbanTaskComment kanbanTaskComment = new KanbanTaskComment().content(UPDATED_CONTENT).timeStamp(UPDATED_TIME_STAMP);
        return kanbanTaskComment;
    }

    @BeforeEach
    public void initTest() {
        kanbanTaskComment = createEntity(em);
    }

    @Test
    @Transactional
    void createKanbanTaskComment() throws Exception {
        int databaseSizeBeforeCreate = kanbanTaskCommentRepository.findAll().size();
        // Create the KanbanTaskComment
        restKanbanTaskCommentMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(kanbanTaskComment))
            )
            .andExpect(status().isCreated());

        // Validate the KanbanTaskComment in the database
        List<KanbanTaskComment> kanbanTaskCommentList = kanbanTaskCommentRepository.findAll();
        assertThat(kanbanTaskCommentList).hasSize(databaseSizeBeforeCreate + 1);
        KanbanTaskComment testKanbanTaskComment = kanbanTaskCommentList.get(kanbanTaskCommentList.size() - 1);
        assertThat(testKanbanTaskComment.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testKanbanTaskComment.getTimeStamp()).isEqualTo(DEFAULT_TIME_STAMP);
    }

    @Test
    @Transactional
    void createKanbanTaskCommentWithExistingId() throws Exception {
        // Create the KanbanTaskComment with an existing ID
        kanbanTaskComment.setId(1L);

        int databaseSizeBeforeCreate = kanbanTaskCommentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restKanbanTaskCommentMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(kanbanTaskComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the KanbanTaskComment in the database
        List<KanbanTaskComment> kanbanTaskCommentList = kanbanTaskCommentRepository.findAll();
        assertThat(kanbanTaskCommentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllKanbanTaskComments() throws Exception {
        // Initialize the database
        kanbanTaskCommentRepository.saveAndFlush(kanbanTaskComment);

        // Get all the kanbanTaskCommentList
        restKanbanTaskCommentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(kanbanTaskComment.getId().intValue())))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT)))
            .andExpect(jsonPath("$.[*].timeStamp").value(hasItem(DEFAULT_TIME_STAMP.toString())));
    }

    @Test
    @Transactional
    void getKanbanTaskComment() throws Exception {
        // Initialize the database
        kanbanTaskCommentRepository.saveAndFlush(kanbanTaskComment);

        // Get the kanbanTaskComment
        restKanbanTaskCommentMockMvc
            .perform(get(ENTITY_API_URL_ID, kanbanTaskComment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(kanbanTaskComment.getId().intValue()))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT))
            .andExpect(jsonPath("$.timeStamp").value(DEFAULT_TIME_STAMP.toString()));
    }

    @Test
    @Transactional
    void getNonExistingKanbanTaskComment() throws Exception {
        // Get the kanbanTaskComment
        restKanbanTaskCommentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingKanbanTaskComment() throws Exception {
        // Initialize the database
        kanbanTaskCommentRepository.saveAndFlush(kanbanTaskComment);

        int databaseSizeBeforeUpdate = kanbanTaskCommentRepository.findAll().size();

        // Update the kanbanTaskComment
        KanbanTaskComment updatedKanbanTaskComment = kanbanTaskCommentRepository.findById(kanbanTaskComment.getId()).get();
        // Disconnect from session so that the updates on updatedKanbanTaskComment are not directly saved in db
        em.detach(updatedKanbanTaskComment);
        updatedKanbanTaskComment.content(UPDATED_CONTENT).timeStamp(UPDATED_TIME_STAMP);

        restKanbanTaskCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedKanbanTaskComment.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedKanbanTaskComment))
            )
            .andExpect(status().isOk());

        // Validate the KanbanTaskComment in the database
        List<KanbanTaskComment> kanbanTaskCommentList = kanbanTaskCommentRepository.findAll();
        assertThat(kanbanTaskCommentList).hasSize(databaseSizeBeforeUpdate);
        KanbanTaskComment testKanbanTaskComment = kanbanTaskCommentList.get(kanbanTaskCommentList.size() - 1);
        assertThat(testKanbanTaskComment.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testKanbanTaskComment.getTimeStamp()).isEqualTo(UPDATED_TIME_STAMP);
    }

    @Test
    @Transactional
    void putNonExistingKanbanTaskComment() throws Exception {
        int databaseSizeBeforeUpdate = kanbanTaskCommentRepository.findAll().size();
        kanbanTaskComment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKanbanTaskCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, kanbanTaskComment.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(kanbanTaskComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the KanbanTaskComment in the database
        List<KanbanTaskComment> kanbanTaskCommentList = kanbanTaskCommentRepository.findAll();
        assertThat(kanbanTaskCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchKanbanTaskComment() throws Exception {
        int databaseSizeBeforeUpdate = kanbanTaskCommentRepository.findAll().size();
        kanbanTaskComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKanbanTaskCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(kanbanTaskComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the KanbanTaskComment in the database
        List<KanbanTaskComment> kanbanTaskCommentList = kanbanTaskCommentRepository.findAll();
        assertThat(kanbanTaskCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamKanbanTaskComment() throws Exception {
        int databaseSizeBeforeUpdate = kanbanTaskCommentRepository.findAll().size();
        kanbanTaskComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKanbanTaskCommentMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(kanbanTaskComment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the KanbanTaskComment in the database
        List<KanbanTaskComment> kanbanTaskCommentList = kanbanTaskCommentRepository.findAll();
        assertThat(kanbanTaskCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateKanbanTaskCommentWithPatch() throws Exception {
        // Initialize the database
        kanbanTaskCommentRepository.saveAndFlush(kanbanTaskComment);

        int databaseSizeBeforeUpdate = kanbanTaskCommentRepository.findAll().size();

        // Update the kanbanTaskComment using partial update
        KanbanTaskComment partialUpdatedKanbanTaskComment = new KanbanTaskComment();
        partialUpdatedKanbanTaskComment.setId(kanbanTaskComment.getId());

        partialUpdatedKanbanTaskComment.content(UPDATED_CONTENT).timeStamp(UPDATED_TIME_STAMP);

        restKanbanTaskCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedKanbanTaskComment.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedKanbanTaskComment))
            )
            .andExpect(status().isOk());

        // Validate the KanbanTaskComment in the database
        List<KanbanTaskComment> kanbanTaskCommentList = kanbanTaskCommentRepository.findAll();
        assertThat(kanbanTaskCommentList).hasSize(databaseSizeBeforeUpdate);
        KanbanTaskComment testKanbanTaskComment = kanbanTaskCommentList.get(kanbanTaskCommentList.size() - 1);
        assertThat(testKanbanTaskComment.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testKanbanTaskComment.getTimeStamp()).isEqualTo(UPDATED_TIME_STAMP);
    }

    @Test
    @Transactional
    void fullUpdateKanbanTaskCommentWithPatch() throws Exception {
        // Initialize the database
        kanbanTaskCommentRepository.saveAndFlush(kanbanTaskComment);

        int databaseSizeBeforeUpdate = kanbanTaskCommentRepository.findAll().size();

        // Update the kanbanTaskComment using partial update
        KanbanTaskComment partialUpdatedKanbanTaskComment = new KanbanTaskComment();
        partialUpdatedKanbanTaskComment.setId(kanbanTaskComment.getId());

        partialUpdatedKanbanTaskComment.content(UPDATED_CONTENT).timeStamp(UPDATED_TIME_STAMP);

        restKanbanTaskCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedKanbanTaskComment.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedKanbanTaskComment))
            )
            .andExpect(status().isOk());

        // Validate the KanbanTaskComment in the database
        List<KanbanTaskComment> kanbanTaskCommentList = kanbanTaskCommentRepository.findAll();
        assertThat(kanbanTaskCommentList).hasSize(databaseSizeBeforeUpdate);
        KanbanTaskComment testKanbanTaskComment = kanbanTaskCommentList.get(kanbanTaskCommentList.size() - 1);
        assertThat(testKanbanTaskComment.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testKanbanTaskComment.getTimeStamp()).isEqualTo(UPDATED_TIME_STAMP);
    }

    @Test
    @Transactional
    void patchNonExistingKanbanTaskComment() throws Exception {
        int databaseSizeBeforeUpdate = kanbanTaskCommentRepository.findAll().size();
        kanbanTaskComment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKanbanTaskCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, kanbanTaskComment.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(kanbanTaskComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the KanbanTaskComment in the database
        List<KanbanTaskComment> kanbanTaskCommentList = kanbanTaskCommentRepository.findAll();
        assertThat(kanbanTaskCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchKanbanTaskComment() throws Exception {
        int databaseSizeBeforeUpdate = kanbanTaskCommentRepository.findAll().size();
        kanbanTaskComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKanbanTaskCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(kanbanTaskComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the KanbanTaskComment in the database
        List<KanbanTaskComment> kanbanTaskCommentList = kanbanTaskCommentRepository.findAll();
        assertThat(kanbanTaskCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamKanbanTaskComment() throws Exception {
        int databaseSizeBeforeUpdate = kanbanTaskCommentRepository.findAll().size();
        kanbanTaskComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKanbanTaskCommentMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(kanbanTaskComment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the KanbanTaskComment in the database
        List<KanbanTaskComment> kanbanTaskCommentList = kanbanTaskCommentRepository.findAll();
        assertThat(kanbanTaskCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteKanbanTaskComment() throws Exception {
        // Initialize the database
        kanbanTaskCommentRepository.saveAndFlush(kanbanTaskComment);

        int databaseSizeBeforeDelete = kanbanTaskCommentRepository.findAll().size();

        // Delete the kanbanTaskComment
        restKanbanTaskCommentMockMvc
            .perform(delete(ENTITY_API_URL_ID, kanbanTaskComment.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<KanbanTaskComment> kanbanTaskCommentList = kanbanTaskCommentRepository.findAll();
        assertThat(kanbanTaskCommentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
