package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.KanbanBoard;
import team.bham.domain.KanbanTask;
import team.bham.repository.KanbanBoardRepository;
import team.bham.repository.KanbanTaskRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.KanbanTask}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class KanbanTaskResource {

    private final Logger log = LoggerFactory.getLogger(KanbanTaskResource.class);

    private static final String ENTITY_NAME = "kanbanTask";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final KanbanTaskRepository kanbanTaskRepository;
    private final KanbanBoardRepository kanbanBoardRepository;

    public KanbanTaskResource(KanbanTaskRepository kanbanTaskRepository, KanbanBoardRepository kanbanBoardRepository) {
        this.kanbanBoardRepository = kanbanBoardRepository;
        this.kanbanTaskRepository = kanbanTaskRepository;
    }

    /**
     * {@code POST  /kanban-tasks} : Create a new kanbanTask.
     *
     * @param kanbanTask the kanbanTask to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new kanbanTask, or with status {@code 400 (Bad Request)} if the kanbanTask has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/kanban-tasks")
    public ResponseEntity<KanbanTask> createKanbanTask(@RequestBody KanbanTask kanbanTask) throws URISyntaxException {
        log.debug("REST request to save KanbanTask : {}", kanbanTask);
        if (kanbanTask.getId() != null) {
            throw new BadRequestAlertException("A new kanbanTask cannot already have an ID", ENTITY_NAME, "idexists");
        }
        KanbanTask result = kanbanTaskRepository.save(kanbanTask);
        return ResponseEntity
            .created(new URI("/api/kanban-tasks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /kanban-tasks/:id} : Updates an existing kanbanTask.
     *
     * @param id the id of the kanbanTask to save.
     * @param kanbanTask the kanbanTask to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated kanbanTask,
     * or with status {@code 400 (Bad Request)} if the kanbanTask is not valid,
     * or with status {@code 500 (Internal Server Error)} if the kanbanTask couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/kanban-tasks/{id}")
    public ResponseEntity<KanbanTask> updateKanbanTask(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody KanbanTask kanbanTask
    ) throws URISyntaxException {
        log.debug("REST request to update KanbanTask : {}, {}", id, kanbanTask);
        if (kanbanTask.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, kanbanTask.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!kanbanTaskRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        KanbanTask result = kanbanTaskRepository.save(kanbanTask);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, kanbanTask.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /kanban-tasks/:id} : Partial updates given fields of an existing kanbanTask, field will ignore if it is null
     *
     * @param id the id of the kanbanTask to save.
     * @param kanbanTask the kanbanTask to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated kanbanTask,
     * or with status {@code 400 (Bad Request)} if the kanbanTask is not valid,
     * or with status {@code 404 (Not Found)} if the kanbanTask is not found,
     * or with status {@code 500 (Internal Server Error)} if the kanbanTask couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/kanban-tasks/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<KanbanTask> partialUpdateKanbanTask(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody KanbanTask kanbanTask
    ) throws URISyntaxException {
        log.debug("REST request to partial update KanbanTask partially : {}, {}", id, kanbanTask);
        if (kanbanTask.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, kanbanTask.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!kanbanTaskRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<KanbanTask> result = kanbanTaskRepository
            .findById(kanbanTask.getId())
            .map(existingKanbanTask -> {
                if (kanbanTask.getTitle() != null) {
                    existingKanbanTask.setTitle(kanbanTask.getTitle());
                }
                if (kanbanTask.getDescription() != null) {
                    existingKanbanTask.setDescription(kanbanTask.getDescription());
                }
                if (kanbanTask.getTaskStatus() != null) {
                    existingKanbanTask.setTaskStatus(kanbanTask.getTaskStatus());
                }
                if (kanbanTask.getDueDate() != null) {
                    existingKanbanTask.setDueDate(kanbanTask.getDueDate());
                }

                return existingKanbanTask;
            })
            .map(kanbanTaskRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, kanbanTask.getId().toString())
        );
    }

    /**
     * {@code GET  /kanban-tasks} : get all the kanbanTasks.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of kanbanTasks in body.
     */
    @GetMapping("/kanban-tasks")
    public List<KanbanTask> getAllKanbanTasks(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all KanbanTasks");
        if (eagerload) {
            return kanbanTaskRepository.findAllWithEagerRelationships();
        } else {
            return kanbanTaskRepository.findAll();
        }
    }

    /**
     * {@code GET  /kanban-tasks/:id} : get the "id" kanbanTask.
     *
     * @param id the id of the kanbanTask to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the kanbanTask, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/kanban-tasks/{id}")
    public ResponseEntity<KanbanTask> getKanbanTask(@PathVariable Long id) {
        log.debug("REST request to get KanbanTask : {}", id);
        Optional<KanbanTask> kanbanTask = kanbanTaskRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(kanbanTask);
    }

    @GetMapping("/in-kanban-board-kanban-tasks/{kanbanBoardId}")
    public List<KanbanTask> getKanbanTaskInKanbanBoard(@PathVariable String kanbanBoardId) {
        Optional<KanbanBoard> kanbanBoard = kanbanBoardRepository.findById(Long.parseLong(kanbanBoardId));
        return kanbanTaskRepository.findAllByKanbanBoard(kanbanBoard);
        //        return kanbanTaskRepository.findAllByKanbanBoard(kanbanBoard);
    }

    /**
     * {@code DELETE  /kanban-tasks/:id} : delete the "id" kanbanTask.
     *
     * @param id the id of the kanbanTask to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/kanban-tasks/{id}")
    public ResponseEntity<Void> deleteKanbanTask(@PathVariable Long id) {
        log.debug("REST request to delete KanbanTask : {}", id);
        kanbanTaskRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
