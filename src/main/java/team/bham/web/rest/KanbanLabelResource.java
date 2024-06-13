package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.KanbanBoard;
import team.bham.domain.KanbanLabel;
import team.bham.domain.KanbanTask;
import team.bham.repository.KanbanBoardRepository;
import team.bham.repository.KanbanLabelRepository;
import team.bham.repository.KanbanTaskRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.KanbanLabel}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class KanbanLabelResource {

    private final Logger log = LoggerFactory.getLogger(KanbanLabelResource.class);

    private static final String ENTITY_NAME = "kanbanLabel";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final KanbanLabelRepository kanbanLabelRepository;
    private final KanbanTaskRepository kanbanTaskRepository;

    private final KanbanBoardRepository kanbanBoardRepository;

    public KanbanLabelResource(
        KanbanLabelRepository kanbanLabelRepository,
        KanbanTaskRepository kanbanTaskRepository,
        KanbanBoardRepository kanbanBoardRepository
    ) {
        this.kanbanTaskRepository = kanbanTaskRepository;
        this.kanbanLabelRepository = kanbanLabelRepository;
        this.kanbanBoardRepository = kanbanBoardRepository;
    }

    /**
     * {@code POST  /kanban-labels} : Create a new kanbanLabel.
     *
     * @param kanbanLabel the kanbanLabel to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new kanbanLabel, or with status {@code 400 (Bad Request)} if the kanbanLabel has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/kanban-labels")
    public ResponseEntity<KanbanLabel> createKanbanLabel(@Valid @RequestBody KanbanLabel kanbanLabel) throws URISyntaxException {
        log.debug("REST request to save KanbanLabel : {}", kanbanLabel);
        if (kanbanLabel.getId() != null) {
            throw new BadRequestAlertException("A new kanbanLabel cannot already have an ID", ENTITY_NAME, "idexists");
        }
        KanbanLabel result = kanbanLabelRepository.save(kanbanLabel);
        return ResponseEntity
            .created(new URI("/api/kanban-labels/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /kanban-labels/:id} : Updates an existing kanbanLabel.
     *
     * @param id the id of the kanbanLabel to save.
     * @param kanbanLabel the kanbanLabel to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated kanbanLabel,
     * or with status {@code 400 (Bad Request)} if the kanbanLabel is not valid,
     * or with status {@code 500 (Internal Server Error)} if the kanbanLabel couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/kanban-labels/{id}")
    public ResponseEntity<KanbanLabel> updateKanbanLabel(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody KanbanLabel kanbanLabel
    ) throws URISyntaxException {
        log.debug("REST request to update KanbanLabel : {}, {}", id, kanbanLabel);
        if (kanbanLabel.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, kanbanLabel.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!kanbanLabelRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        KanbanLabel result = kanbanLabelRepository.save(kanbanLabel);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, kanbanLabel.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /kanban-labels/:id} : Partial updates given fields of an existing kanbanLabel, field will ignore if it is null
     *
     * @param id the id of the kanbanLabel to save.
     * @param kanbanLabel the kanbanLabel to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated kanbanLabel,
     * or with status {@code 400 (Bad Request)} if the kanbanLabel is not valid,
     * or with status {@code 404 (Not Found)} if the kanbanLabel is not found,
     * or with status {@code 500 (Internal Server Error)} if the kanbanLabel couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/kanban-labels/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<KanbanLabel> partialUpdateKanbanLabel(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody KanbanLabel kanbanLabel
    ) throws URISyntaxException {
        log.debug("REST request to partial update KanbanLabel partially : {}, {}", id, kanbanLabel);
        if (kanbanLabel.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, kanbanLabel.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!kanbanLabelRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<KanbanLabel> result = kanbanLabelRepository
            .findById(kanbanLabel.getId())
            .map(existingKanbanLabel -> {
                if (kanbanLabel.getName() != null) {
                    existingKanbanLabel.setName(kanbanLabel.getName());
                }
                if (kanbanLabel.getColour() != null) {
                    existingKanbanLabel.setColour(kanbanLabel.getColour());
                }

                return existingKanbanLabel;
            })
            .map(kanbanLabelRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, kanbanLabel.getId().toString())
        );
    }

    /**
     * {@code GET  /kanban-labels} : get all the kanbanLabels.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of kanbanLabels in body.
     */
    @GetMapping("/kanban-labels")
    public List<KanbanLabel> getAllKanbanLabels(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all KanbanLabels");
        if (eagerload) {
            return kanbanLabelRepository.findAllWithEagerRelationships();
        } else {
            return kanbanLabelRepository.findAll();
        }
    }

    /**
     * {@code GET  /kanban-labels/:id} : get the "id" kanbanLabel.
     *
     * @param id the id of the kanbanLabel to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the kanbanLabel, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/kanban-labels/{id}")
    public ResponseEntity<KanbanLabel> getKanbanLabel(@PathVariable Long id) {
        log.debug("REST request to get KanbanLabel : {}", id);
        Optional<KanbanLabel> kanbanLabel = kanbanLabelRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(kanbanLabel);
    }

    @GetMapping("/in-kanban-task-kanban-labels/{kanbanTaskId}")
    public List<KanbanLabel> getKanbanLabelInKanbanTask(@PathVariable String kanbanTaskId) {
        Optional<KanbanTask> kanbanTask = kanbanTaskRepository.findById(Long.parseLong(kanbanTaskId));
        return kanbanLabelRepository.findAllByTasks(kanbanTask);
    }

    @GetMapping("/in-kanban-board-kanban-labels/{kanbanBoardId}")
    public List<KanbanLabel> getKanbanLabelInKanbanBoard(@PathVariable String kanbanBoardId) {
        Optional<KanbanBoard> kanbanBoard = kanbanBoardRepository.findById(Long.parseLong(kanbanBoardId));
        return kanbanLabelRepository.findKanbanLabelsByBoards(kanbanBoard);
    }

    /**
     * {@code DELETE  /kanban-labels/:id} : delete the "id" kanbanLabel.
     *
     * @param id the id of the kanbanLabel to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/kanban-labels/{id}")
    public ResponseEntity<Void> deleteKanbanLabel(@PathVariable Long id) {
        log.debug("REST request to delete KanbanLabel : {}", id);
        kanbanLabelRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
