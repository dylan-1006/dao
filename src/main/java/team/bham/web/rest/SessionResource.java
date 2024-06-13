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
import team.bham.domain.Session;
import team.bham.repository.SessionRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Session}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SessionResource {

    private final Logger log = LoggerFactory.getLogger(SessionResource.class);

    private static final String ENTITY_NAME = "session";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SessionRepository sessionRepository;

    public SessionResource(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    /**
     * {@code POST  /sessions} : Create a new session.
     *
     * @param session the session to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new session, or with status {@code 400 (Bad Request)} if the session has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sessions")
    public ResponseEntity<Session> createSession(@RequestBody Session session) throws URISyntaxException {
        log.debug("REST request to save Session : {}", session);
        if (session.getId() != null) {
            throw new BadRequestAlertException("A new session cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Session result = sessionRepository.save(session);
        return ResponseEntity
            .created(new URI("/api/sessions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PostMapping("/sessions/newSession")
    public ResponseEntity<Session> createNewSession() throws URISyntaxException {
        Session session = new Session();

        log.debug("REST request to save new Session : {}", session);
        if (session.getId() != null) {
            throw new BadRequestAlertException("A new session cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Session preCodeResult = sessionRepository.save(session);
        log.debug("Session created: {}", preCodeResult);
        preCodeResult.setJoinCode(preCodeResult.generateJoinCode());
        Session result = sessionRepository.save(preCodeResult);
        log.debug("Join code added to session: {}", result);

        return ResponseEntity
            .created(new URI("/api/sessions/newSession" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sessions/:id} : Updates an existing session.
     *
     * @param id the id of the session to save.
     * @param session the session to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated session,
     * or with status {@code 400 (Bad Request)} if the session is not valid,
     * or with status {@code 500 (Internal Server Error)} if the session couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sessions/{id}")
    public ResponseEntity<Session> updateSession(@PathVariable(value = "id", required = false) final Long id, @RequestBody Session session)
        throws URISyntaxException {
        log.debug("REST request to update Session : {}, {}", id, session);
        if (session.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, session.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sessionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Session result = sessionRepository.save(session);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, session.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sessions/:id} : Partial updates given fields of an existing session, field will ignore if it is null
     *
     * @param id the id of the session to save.
     * @param session the session to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated session,
     * or with status {@code 400 (Bad Request)} if the session is not valid,
     * or with status {@code 404 (Not Found)} if the session is not found,
     * or with status {@code 500 (Internal Server Error)} if the session couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sessions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Session> partialUpdateSession(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Session session
    ) throws URISyntaxException {
        log.debug("REST request to partial update Session partially : {}, {}", id, session);
        if (session.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, session.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sessionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Session> result = sessionRepository
            .findById(session.getId())
            .map(existingSession -> {
                if (session.getTitle() != null) {
                    existingSession.setTitle(session.getTitle());
                }
                if (session.getJoinCode() != null) {
                    existingSession.setJoinCode(session.getJoinCode());
                }
                if (session.getUserIdList() != null) {
                    existingSession.setUserIdList(session.getUserIdList());
                }
                if (session.getStartTime() != null) {
                    existingSession.setStartTime(session.getStartTime());
                }
                if (session.getEndTime() != null) {
                    existingSession.setEndTime(session.getEndTime());
                }

                return existingSession;
            })
            .map(sessionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, session.getId().toString())
        );
    }

    /**
     * {@code GET  /sessions} : get all the sessions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sessions in body.
     */
    @GetMapping("/sessions")
    public List<Session> getAllSessions() {
        log.debug("REST request to get all Sessions");
        return sessionRepository.findAll();
    }

    /**
     * {@code GET  /sessions/:id} : get the "id" session.
     *
     * @param id the id of the session to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the session, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sessions/{id}")
    public ResponseEntity<Session> getSession(@PathVariable Long id) {
        log.debug("REST request to get Session : {}", id);
        Optional<Session> session = sessionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(session);
    }

    @GetMapping("/sessions/getSessionFromJoinCode/{joinCode}")
    public ResponseEntity<Session> getSessionFromJoinCode(@PathVariable String joinCode) {
        log.debug("REST request to get Session with join code: {}", joinCode);
        Optional<Session> session = sessionRepository.findByJoinCode(joinCode);
        return ResponseUtil.wrapOrNotFound(session);
    }

    /**
     * {@code DELETE  /sessions/:id} : delete the "id" session.
     *
     * @param id the id of the session to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sessions/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        log.debug("REST request to delete Session : {}", id);
        sessionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
