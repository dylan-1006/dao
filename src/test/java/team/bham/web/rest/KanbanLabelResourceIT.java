package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import team.bham.IntegrationTest;
import team.bham.domain.KanbanLabel;
import team.bham.repository.KanbanLabelRepository;

/**
 * Integration tests for the {@link KanbanLabelResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class KanbanLabelResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_COLOUR = "#a1BAdF";
    private static final String UPDATED_COLOUR = "#eDE";

    private static final String ENTITY_API_URL = "/api/kanban-labels";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private KanbanLabelRepository kanbanLabelRepository;

    @Mock
    private KanbanLabelRepository kanbanLabelRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restKanbanLabelMockMvc;

    private KanbanLabel kanbanLabel;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static KanbanLabel createEntity(EntityManager em) {
        KanbanLabel kanbanLabel = new KanbanLabel().name(DEFAULT_NAME).colour(DEFAULT_COLOUR);
        return kanbanLabel;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static KanbanLabel createUpdatedEntity(EntityManager em) {
        KanbanLabel kanbanLabel = new KanbanLabel().name(UPDATED_NAME).colour(UPDATED_COLOUR);
        return kanbanLabel;
    }

    @BeforeEach
    public void initTest() {
        kanbanLabel = createEntity(em);
    }

    @Test
    @Transactional
    void createKanbanLabel() throws Exception {
        int databaseSizeBeforeCreate = kanbanLabelRepository.findAll().size();
        // Create the KanbanLabel
        restKanbanLabelMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(kanbanLabel)))
            .andExpect(status().isCreated());

        // Validate the KanbanLabel in the database
        List<KanbanLabel> kanbanLabelList = kanbanLabelRepository.findAll();
        assertThat(kanbanLabelList).hasSize(databaseSizeBeforeCreate + 1);
        KanbanLabel testKanbanLabel = kanbanLabelList.get(kanbanLabelList.size() - 1);
        assertThat(testKanbanLabel.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testKanbanLabel.getColour()).isEqualTo(DEFAULT_COLOUR);
    }

    @Test
    @Transactional
    void createKanbanLabelWithExistingId() throws Exception {
        // Create the KanbanLabel with an existing ID
        kanbanLabel.setId(1L);

        int databaseSizeBeforeCreate = kanbanLabelRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restKanbanLabelMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(kanbanLabel)))
            .andExpect(status().isBadRequest());

        // Validate the KanbanLabel in the database
        List<KanbanLabel> kanbanLabelList = kanbanLabelRepository.findAll();
        assertThat(kanbanLabelList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllKanbanLabels() throws Exception {
        // Initialize the database
        kanbanLabelRepository.saveAndFlush(kanbanLabel);

        // Get all the kanbanLabelList
        restKanbanLabelMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(kanbanLabel.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].colour").value(hasItem(DEFAULT_COLOUR)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllKanbanLabelsWithEagerRelationshipsIsEnabled() throws Exception {
        when(kanbanLabelRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restKanbanLabelMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(kanbanLabelRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllKanbanLabelsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(kanbanLabelRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restKanbanLabelMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(kanbanLabelRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getKanbanLabel() throws Exception {
        // Initialize the database
        kanbanLabelRepository.saveAndFlush(kanbanLabel);

        // Get the kanbanLabel
        restKanbanLabelMockMvc
            .perform(get(ENTITY_API_URL_ID, kanbanLabel.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(kanbanLabel.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.colour").value(DEFAULT_COLOUR));
    }

    @Test
    @Transactional
    void getNonExistingKanbanLabel() throws Exception {
        // Get the kanbanLabel
        restKanbanLabelMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingKanbanLabel() throws Exception {
        // Initialize the database
        kanbanLabelRepository.saveAndFlush(kanbanLabel);

        int databaseSizeBeforeUpdate = kanbanLabelRepository.findAll().size();

        // Update the kanbanLabel
        KanbanLabel updatedKanbanLabel = kanbanLabelRepository.findById(kanbanLabel.getId()).get();
        // Disconnect from session so that the updates on updatedKanbanLabel are not directly saved in db
        em.detach(updatedKanbanLabel);
        updatedKanbanLabel.name(UPDATED_NAME).colour(UPDATED_COLOUR);

        restKanbanLabelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedKanbanLabel.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedKanbanLabel))
            )
            .andExpect(status().isOk());

        // Validate the KanbanLabel in the database
        List<KanbanLabel> kanbanLabelList = kanbanLabelRepository.findAll();
        assertThat(kanbanLabelList).hasSize(databaseSizeBeforeUpdate);
        KanbanLabel testKanbanLabel = kanbanLabelList.get(kanbanLabelList.size() - 1);
        assertThat(testKanbanLabel.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testKanbanLabel.getColour()).isEqualTo(UPDATED_COLOUR);
    }

    @Test
    @Transactional
    void putNonExistingKanbanLabel() throws Exception {
        int databaseSizeBeforeUpdate = kanbanLabelRepository.findAll().size();
        kanbanLabel.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKanbanLabelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, kanbanLabel.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(kanbanLabel))
            )
            .andExpect(status().isBadRequest());

        // Validate the KanbanLabel in the database
        List<KanbanLabel> kanbanLabelList = kanbanLabelRepository.findAll();
        assertThat(kanbanLabelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchKanbanLabel() throws Exception {
        int databaseSizeBeforeUpdate = kanbanLabelRepository.findAll().size();
        kanbanLabel.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKanbanLabelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(kanbanLabel))
            )
            .andExpect(status().isBadRequest());

        // Validate the KanbanLabel in the database
        List<KanbanLabel> kanbanLabelList = kanbanLabelRepository.findAll();
        assertThat(kanbanLabelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamKanbanLabel() throws Exception {
        int databaseSizeBeforeUpdate = kanbanLabelRepository.findAll().size();
        kanbanLabel.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKanbanLabelMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(kanbanLabel)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the KanbanLabel in the database
        List<KanbanLabel> kanbanLabelList = kanbanLabelRepository.findAll();
        assertThat(kanbanLabelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateKanbanLabelWithPatch() throws Exception {
        // Initialize the database
        kanbanLabelRepository.saveAndFlush(kanbanLabel);

        int databaseSizeBeforeUpdate = kanbanLabelRepository.findAll().size();

        // Update the kanbanLabel using partial update
        KanbanLabel partialUpdatedKanbanLabel = new KanbanLabel();
        partialUpdatedKanbanLabel.setId(kanbanLabel.getId());

        partialUpdatedKanbanLabel.colour(UPDATED_COLOUR);

        restKanbanLabelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedKanbanLabel.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedKanbanLabel))
            )
            .andExpect(status().isOk());

        // Validate the KanbanLabel in the database
        List<KanbanLabel> kanbanLabelList = kanbanLabelRepository.findAll();
        assertThat(kanbanLabelList).hasSize(databaseSizeBeforeUpdate);
        KanbanLabel testKanbanLabel = kanbanLabelList.get(kanbanLabelList.size() - 1);
        assertThat(testKanbanLabel.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testKanbanLabel.getColour()).isEqualTo(UPDATED_COLOUR);
    }

    @Test
    @Transactional
    void fullUpdateKanbanLabelWithPatch() throws Exception {
        // Initialize the database
        kanbanLabelRepository.saveAndFlush(kanbanLabel);

        int databaseSizeBeforeUpdate = kanbanLabelRepository.findAll().size();

        // Update the kanbanLabel using partial update
        KanbanLabel partialUpdatedKanbanLabel = new KanbanLabel();
        partialUpdatedKanbanLabel.setId(kanbanLabel.getId());

        partialUpdatedKanbanLabel.name(UPDATED_NAME).colour(UPDATED_COLOUR);

        restKanbanLabelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedKanbanLabel.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedKanbanLabel))
            )
            .andExpect(status().isOk());

        // Validate the KanbanLabel in the database
        List<KanbanLabel> kanbanLabelList = kanbanLabelRepository.findAll();
        assertThat(kanbanLabelList).hasSize(databaseSizeBeforeUpdate);
        KanbanLabel testKanbanLabel = kanbanLabelList.get(kanbanLabelList.size() - 1);
        assertThat(testKanbanLabel.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testKanbanLabel.getColour()).isEqualTo(UPDATED_COLOUR);
    }

    @Test
    @Transactional
    void patchNonExistingKanbanLabel() throws Exception {
        int databaseSizeBeforeUpdate = kanbanLabelRepository.findAll().size();
        kanbanLabel.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKanbanLabelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, kanbanLabel.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(kanbanLabel))
            )
            .andExpect(status().isBadRequest());

        // Validate the KanbanLabel in the database
        List<KanbanLabel> kanbanLabelList = kanbanLabelRepository.findAll();
        assertThat(kanbanLabelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchKanbanLabel() throws Exception {
        int databaseSizeBeforeUpdate = kanbanLabelRepository.findAll().size();
        kanbanLabel.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKanbanLabelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(kanbanLabel))
            )
            .andExpect(status().isBadRequest());

        // Validate the KanbanLabel in the database
        List<KanbanLabel> kanbanLabelList = kanbanLabelRepository.findAll();
        assertThat(kanbanLabelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamKanbanLabel() throws Exception {
        int databaseSizeBeforeUpdate = kanbanLabelRepository.findAll().size();
        kanbanLabel.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKanbanLabelMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(kanbanLabel))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the KanbanLabel in the database
        List<KanbanLabel> kanbanLabelList = kanbanLabelRepository.findAll();
        assertThat(kanbanLabelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteKanbanLabel() throws Exception {
        // Initialize the database
        kanbanLabelRepository.saveAndFlush(kanbanLabel);

        int databaseSizeBeforeDelete = kanbanLabelRepository.findAll().size();

        // Delete the kanbanLabel
        restKanbanLabelMockMvc
            .perform(delete(ENTITY_API_URL_ID, kanbanLabel.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<KanbanLabel> kanbanLabelList = kanbanLabelRepository.findAll();
        assertThat(kanbanLabelList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
