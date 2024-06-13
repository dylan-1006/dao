package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
import team.bham.domain.KanbanTask;
import team.bham.domain.enumeration.TaskStatus;
import team.bham.repository.KanbanTaskRepository;

/**
 * Integration tests for the {@link KanbanTaskResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class KanbanTaskResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final TaskStatus DEFAULT_TASK_STATUS = TaskStatus.TODO;
    private static final TaskStatus UPDATED_TASK_STATUS = TaskStatus.IN_PROGRESS;

    private static final Instant DEFAULT_DUE_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DUE_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/kanban-tasks";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private KanbanTaskRepository kanbanTaskRepository;

    @Mock
    private KanbanTaskRepository kanbanTaskRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restKanbanTaskMockMvc;

    private KanbanTask kanbanTask;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static KanbanTask createEntity(EntityManager em) {
        KanbanTask kanbanTask = new KanbanTask()
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION)
            .taskStatus(DEFAULT_TASK_STATUS)
            .dueDate(DEFAULT_DUE_DATE);
        return kanbanTask;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static KanbanTask createUpdatedEntity(EntityManager em) {
        KanbanTask kanbanTask = new KanbanTask()
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .taskStatus(UPDATED_TASK_STATUS)
            .dueDate(UPDATED_DUE_DATE);
        return kanbanTask;
    }

    @BeforeEach
    public void initTest() {
        kanbanTask = createEntity(em);
    }

    @Test
    @Transactional
    void createKanbanTask() throws Exception {
        int databaseSizeBeforeCreate = kanbanTaskRepository.findAll().size();
        // Create the KanbanTask
        restKanbanTaskMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(kanbanTask)))
            .andExpect(status().isCreated());

        // Validate the KanbanTask in the database
        List<KanbanTask> kanbanTaskList = kanbanTaskRepository.findAll();
        assertThat(kanbanTaskList).hasSize(databaseSizeBeforeCreate + 1);
        KanbanTask testKanbanTask = kanbanTaskList.get(kanbanTaskList.size() - 1);
        assertThat(testKanbanTask.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testKanbanTask.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testKanbanTask.getTaskStatus()).isEqualTo(DEFAULT_TASK_STATUS);
        assertThat(testKanbanTask.getDueDate()).isEqualTo(DEFAULT_DUE_DATE);
    }

    @Test
    @Transactional
    void createKanbanTaskWithExistingId() throws Exception {
        // Create the KanbanTask with an existing ID
        kanbanTask.setId(1L);

        int databaseSizeBeforeCreate = kanbanTaskRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restKanbanTaskMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(kanbanTask)))
            .andExpect(status().isBadRequest());

        // Validate the KanbanTask in the database
        List<KanbanTask> kanbanTaskList = kanbanTaskRepository.findAll();
        assertThat(kanbanTaskList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllKanbanTasks() throws Exception {
        // Initialize the database
        kanbanTaskRepository.saveAndFlush(kanbanTask);

        // Get all the kanbanTaskList
        restKanbanTaskMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(kanbanTask.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].taskStatus").value(hasItem(DEFAULT_TASK_STATUS.toString())))
            .andExpect(jsonPath("$.[*].dueDate").value(hasItem(DEFAULT_DUE_DATE.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllKanbanTasksWithEagerRelationshipsIsEnabled() throws Exception {
        when(kanbanTaskRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restKanbanTaskMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(kanbanTaskRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllKanbanTasksWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(kanbanTaskRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restKanbanTaskMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(kanbanTaskRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getKanbanTask() throws Exception {
        // Initialize the database
        kanbanTaskRepository.saveAndFlush(kanbanTask);

        // Get the kanbanTask
        restKanbanTaskMockMvc
            .perform(get(ENTITY_API_URL_ID, kanbanTask.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(kanbanTask.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.taskStatus").value(DEFAULT_TASK_STATUS.toString()))
            .andExpect(jsonPath("$.dueDate").value(DEFAULT_DUE_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingKanbanTask() throws Exception {
        // Get the kanbanTask
        restKanbanTaskMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingKanbanTask() throws Exception {
        // Initialize the database
        kanbanTaskRepository.saveAndFlush(kanbanTask);

        int databaseSizeBeforeUpdate = kanbanTaskRepository.findAll().size();

        // Update the kanbanTask
        KanbanTask updatedKanbanTask = kanbanTaskRepository.findById(kanbanTask.getId()).get();
        // Disconnect from session so that the updates on updatedKanbanTask are not directly saved in db
        em.detach(updatedKanbanTask);
        updatedKanbanTask.title(UPDATED_TITLE).description(UPDATED_DESCRIPTION).taskStatus(UPDATED_TASK_STATUS).dueDate(UPDATED_DUE_DATE);

        restKanbanTaskMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedKanbanTask.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedKanbanTask))
            )
            .andExpect(status().isOk());

        // Validate the KanbanTask in the database
        List<KanbanTask> kanbanTaskList = kanbanTaskRepository.findAll();
        assertThat(kanbanTaskList).hasSize(databaseSizeBeforeUpdate);
        KanbanTask testKanbanTask = kanbanTaskList.get(kanbanTaskList.size() - 1);
        assertThat(testKanbanTask.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testKanbanTask.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testKanbanTask.getTaskStatus()).isEqualTo(UPDATED_TASK_STATUS);
        assertThat(testKanbanTask.getDueDate()).isEqualTo(UPDATED_DUE_DATE);
    }

    @Test
    @Transactional
    void putNonExistingKanbanTask() throws Exception {
        int databaseSizeBeforeUpdate = kanbanTaskRepository.findAll().size();
        kanbanTask.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKanbanTaskMockMvc
            .perform(
                put(ENTITY_API_URL_ID, kanbanTask.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(kanbanTask))
            )
            .andExpect(status().isBadRequest());

        // Validate the KanbanTask in the database
        List<KanbanTask> kanbanTaskList = kanbanTaskRepository.findAll();
        assertThat(kanbanTaskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchKanbanTask() throws Exception {
        int databaseSizeBeforeUpdate = kanbanTaskRepository.findAll().size();
        kanbanTask.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKanbanTaskMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(kanbanTask))
            )
            .andExpect(status().isBadRequest());

        // Validate the KanbanTask in the database
        List<KanbanTask> kanbanTaskList = kanbanTaskRepository.findAll();
        assertThat(kanbanTaskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamKanbanTask() throws Exception {
        int databaseSizeBeforeUpdate = kanbanTaskRepository.findAll().size();
        kanbanTask.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKanbanTaskMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(kanbanTask)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the KanbanTask in the database
        List<KanbanTask> kanbanTaskList = kanbanTaskRepository.findAll();
        assertThat(kanbanTaskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateKanbanTaskWithPatch() throws Exception {
        // Initialize the database
        kanbanTaskRepository.saveAndFlush(kanbanTask);

        int databaseSizeBeforeUpdate = kanbanTaskRepository.findAll().size();

        // Update the kanbanTask using partial update
        KanbanTask partialUpdatedKanbanTask = new KanbanTask();
        partialUpdatedKanbanTask.setId(kanbanTask.getId());

        partialUpdatedKanbanTask.title(UPDATED_TITLE).description(UPDATED_DESCRIPTION).taskStatus(UPDATED_TASK_STATUS);

        restKanbanTaskMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedKanbanTask.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedKanbanTask))
            )
            .andExpect(status().isOk());

        // Validate the KanbanTask in the database
        List<KanbanTask> kanbanTaskList = kanbanTaskRepository.findAll();
        assertThat(kanbanTaskList).hasSize(databaseSizeBeforeUpdate);
        KanbanTask testKanbanTask = kanbanTaskList.get(kanbanTaskList.size() - 1);
        assertThat(testKanbanTask.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testKanbanTask.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testKanbanTask.getTaskStatus()).isEqualTo(UPDATED_TASK_STATUS);
        assertThat(testKanbanTask.getDueDate()).isEqualTo(DEFAULT_DUE_DATE);
    }

    @Test
    @Transactional
    void fullUpdateKanbanTaskWithPatch() throws Exception {
        // Initialize the database
        kanbanTaskRepository.saveAndFlush(kanbanTask);

        int databaseSizeBeforeUpdate = kanbanTaskRepository.findAll().size();

        // Update the kanbanTask using partial update
        KanbanTask partialUpdatedKanbanTask = new KanbanTask();
        partialUpdatedKanbanTask.setId(kanbanTask.getId());

        partialUpdatedKanbanTask
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .taskStatus(UPDATED_TASK_STATUS)
            .dueDate(UPDATED_DUE_DATE);

        restKanbanTaskMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedKanbanTask.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedKanbanTask))
            )
            .andExpect(status().isOk());

        // Validate the KanbanTask in the database
        List<KanbanTask> kanbanTaskList = kanbanTaskRepository.findAll();
        assertThat(kanbanTaskList).hasSize(databaseSizeBeforeUpdate);
        KanbanTask testKanbanTask = kanbanTaskList.get(kanbanTaskList.size() - 1);
        assertThat(testKanbanTask.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testKanbanTask.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testKanbanTask.getTaskStatus()).isEqualTo(UPDATED_TASK_STATUS);
        assertThat(testKanbanTask.getDueDate()).isEqualTo(UPDATED_DUE_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingKanbanTask() throws Exception {
        int databaseSizeBeforeUpdate = kanbanTaskRepository.findAll().size();
        kanbanTask.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKanbanTaskMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, kanbanTask.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(kanbanTask))
            )
            .andExpect(status().isBadRequest());

        // Validate the KanbanTask in the database
        List<KanbanTask> kanbanTaskList = kanbanTaskRepository.findAll();
        assertThat(kanbanTaskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchKanbanTask() throws Exception {
        int databaseSizeBeforeUpdate = kanbanTaskRepository.findAll().size();
        kanbanTask.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKanbanTaskMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(kanbanTask))
            )
            .andExpect(status().isBadRequest());

        // Validate the KanbanTask in the database
        List<KanbanTask> kanbanTaskList = kanbanTaskRepository.findAll();
        assertThat(kanbanTaskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamKanbanTask() throws Exception {
        int databaseSizeBeforeUpdate = kanbanTaskRepository.findAll().size();
        kanbanTask.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKanbanTaskMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(kanbanTask))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the KanbanTask in the database
        List<KanbanTask> kanbanTaskList = kanbanTaskRepository.findAll();
        assertThat(kanbanTaskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteKanbanTask() throws Exception {
        // Initialize the database
        kanbanTaskRepository.saveAndFlush(kanbanTask);

        int databaseSizeBeforeDelete = kanbanTaskRepository.findAll().size();

        // Delete the kanbanTask
        restKanbanTaskMockMvc
            .perform(delete(ENTITY_API_URL_ID, kanbanTask.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<KanbanTask> kanbanTaskList = kanbanTaskRepository.findAll();
        assertThat(kanbanTaskList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
