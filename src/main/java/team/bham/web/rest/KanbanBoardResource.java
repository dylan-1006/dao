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
import team.bham.repository.KanbanBoardRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.KanbanBoard}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class KanbanBoardResource {

    private final Logger log = LoggerFactory.getLogger(KanbanBoardResource.class);

    private static final String ENTITY_NAME = "kanbanBoard";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final KanbanBoardRepository kanbanBoardRepository;

    public KanbanBoardResource(KanbanBoardRepository kanbanBoardRepository) {
        this.kanbanBoardRepository = kanbanBoardRepository;
    }

    /**
     * {@code POST  /kanban-boards} : Create a new kanbanBoard.
     *
     * @param kanbanBoard the kanbanBoard to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new kanbanBoard, or with status {@code 400 (Bad Request)} if the kanbanBoard has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/kanban-boards")
    public ResponseEntity<KanbanBoard> createKanbanBoard(@RequestBody KanbanBoard kanbanBoard) throws URISyntaxException {
        log.debug("REST request to save KanbanBoard : {}", kanbanBoard);
        if (kanbanBoard.getId() != null) {
            throw new BadRequestAlertException("A new kanbanBoard cannot already have an ID", ENTITY_NAME, "idexists");
        }
        KanbanBoard result = kanbanBoardRepository.save(kanbanBoard);
        return ResponseEntity
            .created(new URI("/api/kanban-boards/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /kanban-boards/:id} : Updates an existing kanbanBoard.
     *
     * @param id the id of the kanbanBoard to save.
     * @param kanbanBoard the kanbanBoard to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated kanbanBoard,
     * or with status {@code 400 (Bad Request)} if the kanbanBoard is not valid,
     * or with status {@code 500 (Internal Server Error)} if the kanbanBoard couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/kanban-boards/{id}")
    public ResponseEntity<KanbanBoard> updateKanbanBoard(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody KanbanBoard kanbanBoard
    ) throws URISyntaxException {
        log.debug("REST request to update KanbanBoard : {}, {}", id, kanbanBoard);
        if (kanbanBoard.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, kanbanBoard.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!kanbanBoardRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        KanbanBoard result = kanbanBoardRepository.save(kanbanBoard);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, kanbanBoard.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /kanban-boards/:id} : Partial updates given fields of an existing kanbanBoard, field will ignore if it is null
     *
     * @param id the id of the kanbanBoard to save.
     * @param kanbanBoard the kanbanBoard to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated kanbanBoard,
     * or with status {@code 400 (Bad Request)} if the kanbanBoard is not valid,
     * or with status {@code 404 (Not Found)} if the kanbanBoard is not found,
     * or with status {@code 500 (Internal Server Error)} if the kanbanBoard couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/kanban-boards/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<KanbanBoard> partialUpdateKanbanBoard(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody KanbanBoard kanbanBoard
    ) throws URISyntaxException {
        log.debug("REST request to partial update KanbanBoard partially : {}, {}", id, kanbanBoard);
        if (kanbanBoard.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, kanbanBoard.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!kanbanBoardRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<KanbanBoard> result = kanbanBoardRepository
            .findById(kanbanBoard.getId())
            .map(existingKanbanBoard -> {
                if (kanbanBoard.getTitle() != null) {
                    existingKanbanBoard.setTitle(kanbanBoard.getTitle());
                }
                if (kanbanBoard.getDescription() != null) {
                    existingKanbanBoard.setDescription(kanbanBoard.getDescription());
                }

                return existingKanbanBoard;
            })
            .map(kanbanBoardRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, kanbanBoard.getId().toString())
        );
    }

    /**
     * {@code GET  /kanban-boards} : get all the kanbanBoards.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of kanbanBoards in body.
     */
    @GetMapping("/kanban-boards")
    public List<KanbanBoard> getAllKanbanBoards() {
        log.debug("REST request to get all KanbanBoards");
        return kanbanBoardRepository.findAll();
    }

    /**
     * {@code GET  /kanban-boards/:id} : get the "id" kanbanBoard.
     *
     * @param id the id of the kanbanBoard to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the kanbanBoard, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/kanban-boards/{id}")
    public ResponseEntity<KanbanBoard> getKanbanBoard(@PathVariable Long id) {
        log.debug("REST request to get KanbanBoard : {}", id);
        Optional<KanbanBoard> kanbanBoard = kanbanBoardRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(kanbanBoard);
    }

    /**
     * {@code DELETE  /kanban-boards/:id} : delete the "id" kanbanBoard.
     *
     * @param id the id of the kanbanBoard to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/kanban-boards/{id}")
    public ResponseEntity<Void> deleteKanbanBoard(@PathVariable Long id) {
        log.debug("REST request to delete KanbanBoard : {}", id);
        kanbanBoardRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
