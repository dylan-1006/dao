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
import team.bham.domain.KanbanTaskComment;
import team.bham.repository.KanbanTaskCommentRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.KanbanTaskComment}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class KanbanTaskCommentResource {

    private final Logger log = LoggerFactory.getLogger(KanbanTaskCommentResource.class);

    private static final String ENTITY_NAME = "kanbanTaskComment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final KanbanTaskCommentRepository kanbanTaskCommentRepository;

    public KanbanTaskCommentResource(KanbanTaskCommentRepository kanbanTaskCommentRepository) {
        this.kanbanTaskCommentRepository = kanbanTaskCommentRepository;
    }

    /**
     * {@code POST  /kanban-task-comments} : Create a new kanbanTaskComment.
     *
     * @param kanbanTaskComment the kanbanTaskComment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new kanbanTaskComment, or with status {@code 400 (Bad Request)} if the kanbanTaskComment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/kanban-task-comments")
    public ResponseEntity<KanbanTaskComment> createKanbanTaskComment(@RequestBody KanbanTaskComment kanbanTaskComment)
        throws URISyntaxException {
        log.debug("REST request to save KanbanTaskComment : {}", kanbanTaskComment);
        if (kanbanTaskComment.getId() != null) {
            throw new BadRequestAlertException("A new kanbanTaskComment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        KanbanTaskComment result = kanbanTaskCommentRepository.save(kanbanTaskComment);
        return ResponseEntity
            .created(new URI("/api/kanban-task-comments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /kanban-task-comments/:id} : Updates an existing kanbanTaskComment.
     *
     * @param id the id of the kanbanTaskComment to save.
     * @param kanbanTaskComment the kanbanTaskComment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated kanbanTaskComment,
     * or with status {@code 400 (Bad Request)} if the kanbanTaskComment is not valid,
     * or with status {@code 500 (Internal Server Error)} if the kanbanTaskComment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/kanban-task-comments/{id}")
    public ResponseEntity<KanbanTaskComment> updateKanbanTaskComment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody KanbanTaskComment kanbanTaskComment
    ) throws URISyntaxException {
        log.debug("REST request to update KanbanTaskComment : {}, {}", id, kanbanTaskComment);
        if (kanbanTaskComment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, kanbanTaskComment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!kanbanTaskCommentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        KanbanTaskComment result = kanbanTaskCommentRepository.save(kanbanTaskComment);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, kanbanTaskComment.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /kanban-task-comments/:id} : Partial updates given fields of an existing kanbanTaskComment, field will ignore if it is null
     *
     * @param id the id of the kanbanTaskComment to save.
     * @param kanbanTaskComment the kanbanTaskComment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated kanbanTaskComment,
     * or with status {@code 400 (Bad Request)} if the kanbanTaskComment is not valid,
     * or with status {@code 404 (Not Found)} if the kanbanTaskComment is not found,
     * or with status {@code 500 (Internal Server Error)} if the kanbanTaskComment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/kanban-task-comments/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<KanbanTaskComment> partialUpdateKanbanTaskComment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody KanbanTaskComment kanbanTaskComment
    ) throws URISyntaxException {
        log.debug("REST request to partial update KanbanTaskComment partially : {}, {}", id, kanbanTaskComment);
        if (kanbanTaskComment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, kanbanTaskComment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!kanbanTaskCommentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<KanbanTaskComment> result = kanbanTaskCommentRepository
            .findById(kanbanTaskComment.getId())
            .map(existingKanbanTaskComment -> {
                if (kanbanTaskComment.getContent() != null) {
                    existingKanbanTaskComment.setContent(kanbanTaskComment.getContent());
                }
                if (kanbanTaskComment.getTimeStamp() != null) {
                    existingKanbanTaskComment.setTimeStamp(kanbanTaskComment.getTimeStamp());
                }

                return existingKanbanTaskComment;
            })
            .map(kanbanTaskCommentRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, kanbanTaskComment.getId().toString())
        );
    }

    /**
     * {@code GET  /kanban-task-comments} : get all the kanbanTaskComments.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of kanbanTaskComments in body.
     */
    @GetMapping("/kanban-task-comments")
    public List<KanbanTaskComment> getAllKanbanTaskComments() {
        log.debug("REST request to get all KanbanTaskComments");
        return kanbanTaskCommentRepository.findAll();
    }

    /**
     * {@code GET  /kanban-task-comments/:id} : get the "id" kanbanTaskComment.
     *
     * @param id the id of the kanbanTaskComment to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the kanbanTaskComment, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/kanban-task-comments/{id}")
    public ResponseEntity<KanbanTaskComment> getKanbanTaskComment(@PathVariable Long id) {
        log.debug("REST request to get KanbanTaskComment : {}", id);
        Optional<KanbanTaskComment> kanbanTaskComment = kanbanTaskCommentRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(kanbanTaskComment);
    }

    /**
     * {@code DELETE  /kanban-task-comments/:id} : delete the "id" kanbanTaskComment.
     *
     * @param id the id of the kanbanTaskComment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/kanban-task-comments/{id}")
    public ResponseEntity<Void> deleteKanbanTaskComment(@PathVariable Long id) {
        log.debug("REST request to delete KanbanTaskComment : {}", id);
        kanbanTaskCommentRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
