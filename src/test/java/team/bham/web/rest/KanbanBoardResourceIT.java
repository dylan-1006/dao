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
import team.bham.domain.KanbanBoard;
import team.bham.repository.KanbanBoardRepository;

/**
 * Integration tests for the {@link KanbanBoardResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class KanbanBoardResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/kanban-boards";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private KanbanBoardRepository kanbanBoardRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restKanbanBoardMockMvc;

    private KanbanBoard kanbanBoard;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static KanbanBoard createEntity(EntityManager em) {
        KanbanBoard kanbanBoard = new KanbanBoard().title(DEFAULT_TITLE).description(DEFAULT_DESCRIPTION);
        return kanbanBoard;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static KanbanBoard createUpdatedEntity(EntityManager em) {
        KanbanBoard kanbanBoard = new KanbanBoard().title(UPDATED_TITLE).description(UPDATED_DESCRIPTION);
        return kanbanBoard;
    }

    @BeforeEach
    public void initTest() {
        kanbanBoard = createEntity(em);
    }

    @Test
    @Transactional
    void createKanbanBoard() throws Exception {
        int databaseSizeBeforeCreate = kanbanBoardRepository.findAll().size();
        // Create the KanbanBoard
        restKanbanBoardMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(kanbanBoard)))
            .andExpect(status().isCreated());

        // Validate the KanbanBoard in the database
        List<KanbanBoard> kanbanBoardList = kanbanBoardRepository.findAll();
        assertThat(kanbanBoardList).hasSize(databaseSizeBeforeCreate + 1);
        KanbanBoard testKanbanBoard = kanbanBoardList.get(kanbanBoardList.size() - 1);
        assertThat(testKanbanBoard.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testKanbanBoard.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createKanbanBoardWithExistingId() throws Exception {
        // Create the KanbanBoard with an existing ID
        kanbanBoard.setId(1L);

        int databaseSizeBeforeCreate = kanbanBoardRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restKanbanBoardMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(kanbanBoard)))
            .andExpect(status().isBadRequest());

        // Validate the KanbanBoard in the database
        List<KanbanBoard> kanbanBoardList = kanbanBoardRepository.findAll();
        assertThat(kanbanBoardList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllKanbanBoards() throws Exception {
        // Initialize the database
        kanbanBoardRepository.saveAndFlush(kanbanBoard);

        // Get all the kanbanBoardList
        restKanbanBoardMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(kanbanBoard.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getKanbanBoard() throws Exception {
        // Initialize the database
        kanbanBoardRepository.saveAndFlush(kanbanBoard);

        // Get the kanbanBoard
        restKanbanBoardMockMvc
            .perform(get(ENTITY_API_URL_ID, kanbanBoard.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(kanbanBoard.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingKanbanBoard() throws Exception {
        // Get the kanbanBoard
        restKanbanBoardMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingKanbanBoard() throws Exception {
        // Initialize the database
        kanbanBoardRepository.saveAndFlush(kanbanBoard);

        int databaseSizeBeforeUpdate = kanbanBoardRepository.findAll().size();

        // Update the kanbanBoard
        KanbanBoard updatedKanbanBoard = kanbanBoardRepository.findById(kanbanBoard.getId()).get();
        // Disconnect from session so that the updates on updatedKanbanBoard are not directly saved in db
        em.detach(updatedKanbanBoard);
        updatedKanbanBoard.title(UPDATED_TITLE).description(UPDATED_DESCRIPTION);

        restKanbanBoardMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedKanbanBoard.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedKanbanBoard))
            )
            .andExpect(status().isOk());

        // Validate the KanbanBoard in the database
        List<KanbanBoard> kanbanBoardList = kanbanBoardRepository.findAll();
        assertThat(kanbanBoardList).hasSize(databaseSizeBeforeUpdate);
        KanbanBoard testKanbanBoard = kanbanBoardList.get(kanbanBoardList.size() - 1);
        assertThat(testKanbanBoard.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testKanbanBoard.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingKanbanBoard() throws Exception {
        int databaseSizeBeforeUpdate = kanbanBoardRepository.findAll().size();
        kanbanBoard.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKanbanBoardMockMvc
            .perform(
                put(ENTITY_API_URL_ID, kanbanBoard.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(kanbanBoard))
            )
            .andExpect(status().isBadRequest());

        // Validate the KanbanBoard in the database
        List<KanbanBoard> kanbanBoardList = kanbanBoardRepository.findAll();
        assertThat(kanbanBoardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchKanbanBoard() throws Exception {
        int databaseSizeBeforeUpdate = kanbanBoardRepository.findAll().size();
        kanbanBoard.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKanbanBoardMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(kanbanBoard))
            )
            .andExpect(status().isBadRequest());

        // Validate the KanbanBoard in the database
        List<KanbanBoard> kanbanBoardList = kanbanBoardRepository.findAll();
        assertThat(kanbanBoardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamKanbanBoard() throws Exception {
        int databaseSizeBeforeUpdate = kanbanBoardRepository.findAll().size();
        kanbanBoard.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKanbanBoardMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(kanbanBoard)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the KanbanBoard in the database
        List<KanbanBoard> kanbanBoardList = kanbanBoardRepository.findAll();
        assertThat(kanbanBoardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateKanbanBoardWithPatch() throws Exception {
        // Initialize the database
        kanbanBoardRepository.saveAndFlush(kanbanBoard);

        int databaseSizeBeforeUpdate = kanbanBoardRepository.findAll().size();

        // Update the kanbanBoard using partial update
        KanbanBoard partialUpdatedKanbanBoard = new KanbanBoard();
        partialUpdatedKanbanBoard.setId(kanbanBoard.getId());

        restKanbanBoardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedKanbanBoard.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedKanbanBoard))
            )
            .andExpect(status().isOk());

        // Validate the KanbanBoard in the database
        List<KanbanBoard> kanbanBoardList = kanbanBoardRepository.findAll();
        assertThat(kanbanBoardList).hasSize(databaseSizeBeforeUpdate);
        KanbanBoard testKanbanBoard = kanbanBoardList.get(kanbanBoardList.size() - 1);
        assertThat(testKanbanBoard.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testKanbanBoard.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateKanbanBoardWithPatch() throws Exception {
        // Initialize the database
        kanbanBoardRepository.saveAndFlush(kanbanBoard);

        int databaseSizeBeforeUpdate = kanbanBoardRepository.findAll().size();

        // Update the kanbanBoard using partial update
        KanbanBoard partialUpdatedKanbanBoard = new KanbanBoard();
        partialUpdatedKanbanBoard.setId(kanbanBoard.getId());

        partialUpdatedKanbanBoard.title(UPDATED_TITLE).description(UPDATED_DESCRIPTION);

        restKanbanBoardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedKanbanBoard.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedKanbanBoard))
            )
            .andExpect(status().isOk());

        // Validate the KanbanBoard in the database
        List<KanbanBoard> kanbanBoardList = kanbanBoardRepository.findAll();
        assertThat(kanbanBoardList).hasSize(databaseSizeBeforeUpdate);
        KanbanBoard testKanbanBoard = kanbanBoardList.get(kanbanBoardList.size() - 1);
        assertThat(testKanbanBoard.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testKanbanBoard.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingKanbanBoard() throws Exception {
        int databaseSizeBeforeUpdate = kanbanBoardRepository.findAll().size();
        kanbanBoard.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKanbanBoardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, kanbanBoard.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(kanbanBoard))
            )
            .andExpect(status().isBadRequest());

        // Validate the KanbanBoard in the database
        List<KanbanBoard> kanbanBoardList = kanbanBoardRepository.findAll();
        assertThat(kanbanBoardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchKanbanBoard() throws Exception {
        int databaseSizeBeforeUpdate = kanbanBoardRepository.findAll().size();
        kanbanBoard.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKanbanBoardMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(kanbanBoard))
            )
            .andExpect(status().isBadRequest());

        // Validate the KanbanBoard in the database
        List<KanbanBoard> kanbanBoardList = kanbanBoardRepository.findAll();
        assertThat(kanbanBoardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamKanbanBoard() throws Exception {
        int databaseSizeBeforeUpdate = kanbanBoardRepository.findAll().size();
        kanbanBoard.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKanbanBoardMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(kanbanBoard))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the KanbanBoard in the database
        List<KanbanBoard> kanbanBoardList = kanbanBoardRepository.findAll();
        assertThat(kanbanBoardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteKanbanBoard() throws Exception {
        // Initialize the database
        kanbanBoardRepository.saveAndFlush(kanbanBoard);

        int databaseSizeBeforeDelete = kanbanBoardRepository.findAll().size();

        // Delete the kanbanBoard
        restKanbanBoardMockMvc
            .perform(delete(ENTITY_API_URL_ID, kanbanBoard.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<KanbanBoard> kanbanBoardList = kanbanBoardRepository.findAll();
        assertThat(kanbanBoardList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
