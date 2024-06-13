package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.SessionAnalytic;
import team.bham.repository.SessionAnalyticRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.SessionAnalytic}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SessionAnalyticResource {

    private final Logger log = LoggerFactory.getLogger(SessionAnalyticResource.class);

    private static final String ENTITY_NAME = "sessionAnalytic";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SessionAnalyticRepository sessionAnalyticRepository;

    public SessionAnalyticResource(SessionAnalyticRepository sessionAnalyticRepository) {
        this.sessionAnalyticRepository = sessionAnalyticRepository;
    }

    /**
     * {@code POST  /session-analytics} : Create a new sessionAnalytic.
     *
     * @param sessionAnalytic the sessionAnalytic to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sessionAnalytic, or with status {@code 400 (Bad Request)} if the sessionAnalytic has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/session-analytics")
    public ResponseEntity<SessionAnalytic> createSessionAnalytic(@RequestBody SessionAnalytic sessionAnalytic) throws URISyntaxException {
        log.debug("REST request to save SessionAnalytic : {}", sessionAnalytic);
        if (sessionAnalytic.getId() != null) {
            throw new BadRequestAlertException("A new sessionAnalytic cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SessionAnalytic result = sessionAnalyticRepository.save(sessionAnalytic);
        return ResponseEntity
            .created(new URI("/api/session-analytics/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /session-analytics/:id} : Updates an existing sessionAnalytic.
     *
     * @param id the id of the sessionAnalytic to save.
     * @param sessionAnalytic the sessionAnalytic to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sessionAnalytic,
     * or with status {@code 400 (Bad Request)} if the sessionAnalytic is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sessionAnalytic couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/session-analytics/{id}")
    public ResponseEntity<SessionAnalytic> updateSessionAnalytic(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SessionAnalytic sessionAnalytic
    ) throws URISyntaxException {
        log.debug("REST request to update SessionAnalytic : {}, {}", id, sessionAnalytic);
        if (sessionAnalytic.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sessionAnalytic.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sessionAnalyticRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SessionAnalytic result = sessionAnalyticRepository.save(sessionAnalytic);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, sessionAnalytic.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /session-analytics/:id} : Partial updates given fields of an existing sessionAnalytic, field will ignore if it is null
     *
     * @param id the id of the sessionAnalytic to save.
     * @param sessionAnalytic the sessionAnalytic to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sessionAnalytic,
     * or with status {@code 400 (Bad Request)} if the sessionAnalytic is not valid,
     * or with status {@code 404 (Not Found)} if the sessionAnalytic is not found,
     * or with status {@code 500 (Internal Server Error)} if the sessionAnalytic couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/session-analytics/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SessionAnalytic> partialUpdateSessionAnalytic(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SessionAnalytic sessionAnalytic
    ) throws URISyntaxException {
        log.debug("REST request to partial update SessionAnalytic partially : {}, {}", id, sessionAnalytic);
        if (sessionAnalytic.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sessionAnalytic.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sessionAnalyticRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SessionAnalytic> result = sessionAnalyticRepository
            .findById(sessionAnalytic.getId())
            .map(existingSessionAnalytic -> {
                if (sessionAnalytic.getSessionDuration() != null) {
                    existingSessionAnalytic.setSessionDuration(sessionAnalytic.getSessionDuration());
                }
                if (sessionAnalytic.getTaskTotal() != null) {
                    existingSessionAnalytic.setTaskTotal(sessionAnalytic.getTaskTotal());
                }
                if (sessionAnalytic.getTaskCompleted() != null) {
                    existingSessionAnalytic.setTaskCompleted(sessionAnalytic.getTaskCompleted());
                }
                if (sessionAnalytic.getPointsGained() != null) {
                    existingSessionAnalytic.setPointsGained(sessionAnalytic.getPointsGained());
                }
                if (sessionAnalytic.getNumOfPomodoroFinished() != null) {
                    existingSessionAnalytic.setNumOfPomodoroFinished(sessionAnalytic.getNumOfPomodoroFinished());
                }
                if (sessionAnalytic.getPraiseCount() != null) {
                    existingSessionAnalytic.setPraiseCount(sessionAnalytic.getPraiseCount());
                }

                return existingSessionAnalytic;
            })
            .map(sessionAnalyticRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, sessionAnalytic.getId().toString())
        );
    }

    /**
     * {@code GET  /session-analytics} : get all the sessionAnalytics.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sessionAnalytics in body.
     */
    @GetMapping("/session-analytics")
    public List<SessionAnalytic> getAllSessionAnalytics(@RequestParam(required = false) String filter) {
        if ("session-is-null".equals(filter)) {
            log.debug("REST request to get all SessionAnalytics where session is null");
            return StreamSupport
                .stream(sessionAnalyticRepository.findAll().spliterator(), false)
                .filter(sessionAnalytic -> sessionAnalytic.getSession() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all SessionAnalytics");
        return sessionAnalyticRepository.findAll();
    }

    /**
     * {@code GET  /session-analytics/:id} : get the "id" sessionAnalytic.
     *
     * @param id the id of the sessionAnalytic to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sessionAnalytic, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/session-analytics/{id}")
    public ResponseEntity<SessionAnalytic> getSessionAnalytic(@PathVariable Long id) {
        log.debug("REST request to get SessionAnalytic : {}", id);
        Optional<SessionAnalytic> sessionAnalytic = sessionAnalyticRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(sessionAnalytic);
    }

    /**
     * {@code DELETE  /session-analytics/:id} : delete the "id" sessionAnalytic.
     *
     * @param id the id of the sessionAnalytic to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/session-analytics/{id}")
    public ResponseEntity<Void> deleteSessionAnalytic(@PathVariable Long id) {
        log.debug("REST request to delete SessionAnalytic : {}", id);
        sessionAnalyticRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
