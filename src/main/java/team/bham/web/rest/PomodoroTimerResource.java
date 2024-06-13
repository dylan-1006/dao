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
import team.bham.domain.PomodoroTimer;
import team.bham.domain.Session;
import team.bham.repository.PomodoroTimerRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.PomodoroTimer}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PomodoroTimerResource {

    private final Logger log = LoggerFactory.getLogger(PomodoroTimerResource.class);

    private static final String ENTITY_NAME = "pomodoroTimer";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PomodoroTimerRepository pomodoroTimerRepository;

    public PomodoroTimerResource(PomodoroTimerRepository pomodoroTimerRepository) {
        this.pomodoroTimerRepository = pomodoroTimerRepository;
    }

    /**
     * {@code POST  /pomodoro-timers} : Create a new pomodoroTimer.
     *
     * @param pomodoroTimer the pomodoroTimer to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new pomodoroTimer, or with status {@code 400 (Bad Request)} if the pomodoroTimer has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/pomodoro-timers")
    public ResponseEntity<PomodoroTimer> createPomodoroTimer(@RequestBody PomodoroTimer pomodoroTimer) throws URISyntaxException {
        log.debug("REST request to save PomodoroTimer : {}", pomodoroTimer);
        if (pomodoroTimer.getId() != null) {
            throw new BadRequestAlertException("A new pomodoroTimer cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PomodoroTimer result = pomodoroTimerRepository.save(pomodoroTimer);
        return ResponseEntity
            .created(new URI("/api/pomodoro-timers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /pomodoro-timers/:id} : Updates an existing pomodoroTimer.
     *
     * @param id the id of the pomodoroTimer to save.
     * @param pomodoroTimer the pomodoroTimer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pomodoroTimer,
     * or with status {@code 400 (Bad Request)} if the pomodoroTimer is not valid,
     * or with status {@code 500 (Internal Server Error)} if the pomodoroTimer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/pomodoro-timers/{id}")
    public ResponseEntity<PomodoroTimer> updatePomodoroTimer(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PomodoroTimer pomodoroTimer
    ) throws URISyntaxException {
        log.debug("REST request to update PomodoroTimer : {}, {}", id, pomodoroTimer);
        if (pomodoroTimer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pomodoroTimer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pomodoroTimerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PomodoroTimer result = pomodoroTimerRepository.save(pomodoroTimer);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, pomodoroTimer.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /pomodoro-timers/:id} : Partial updates given fields of an existing pomodoroTimer, field will ignore if it is null
     *
     * @param id the id of the pomodoroTimer to save.
     * @param pomodoroTimer the pomodoroTimer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pomodoroTimer,
     * or with status {@code 400 (Bad Request)} if the pomodoroTimer is not valid,
     * or with status {@code 404 (Not Found)} if the pomodoroTimer is not found,
     * or with status {@code 500 (Internal Server Error)} if the pomodoroTimer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/pomodoro-timers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PomodoroTimer> partialUpdatePomodoroTimer(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PomodoroTimer pomodoroTimer
    ) throws URISyntaxException {
        log.debug("REST request to partial update PomodoroTimer partially : {}, {}", id, pomodoroTimer);
        if (pomodoroTimer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pomodoroTimer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pomodoroTimerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PomodoroTimer> result = pomodoroTimerRepository
            .findById(pomodoroTimer.getId())
            .map(existingPomodoroTimer -> {
                if (pomodoroTimer.getStartTime() != null) {
                    existingPomodoroTimer.setStartTime(pomodoroTimer.getStartTime());
                }
                if (pomodoroTimer.getEndTime() != null) {
                    existingPomodoroTimer.setEndTime(pomodoroTimer.getEndTime());
                }
                if (pomodoroTimer.getState() != null) {
                    existingPomodoroTimer.setState(pomodoroTimer.getState());
                }
                if (pomodoroTimer.getType() != null) {
                    existingPomodoroTimer.setType(pomodoroTimer.getType());
                }
                if (pomodoroTimer.getDuration() != null) {
                    existingPomodoroTimer.setDuration(pomodoroTimer.getDuration());
                }

                return existingPomodoroTimer;
            })
            .map(pomodoroTimerRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, pomodoroTimer.getId().toString())
        );
    }

    /**
     * {@code GET  /pomodoro-timers} : get all the pomodoroTimers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of pomodoroTimers in body.
     */
    @GetMapping("/pomodoro-timers")
    public List<PomodoroTimer> getAllPomodoroTimers() {
        log.debug("REST request to get all PomodoroTimers");
        return pomodoroTimerRepository.findAll();
    }

    /**
     * {@code GET  /pomodoro-timers/:id} : get the "id" pomodoroTimer.
     *
     * @param id the id of the pomodoroTimer to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the pomodoroTimer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/pomodoro-timers/{id}")
    public ResponseEntity<PomodoroTimer> getPomodoroTimer(@PathVariable Long id) {
        log.debug("REST request to get PomodoroTimer : {}", id);
        Optional<PomodoroTimer> pomodoroTimer = pomodoroTimerRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(pomodoroTimer);
    }

    /**
     * {@code DELETE  /pomodoro-timers/:id} : delete the "id" pomodoroTimer.
     *
     * @param id the id of the pomodoroTimer to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/pomodoro-timers/{id}")
    public ResponseEntity<Void> deletePomodoroTimer(@PathVariable Long id) {
        log.debug("REST request to delete PomodoroTimer : {}", id);
        pomodoroTimerRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
