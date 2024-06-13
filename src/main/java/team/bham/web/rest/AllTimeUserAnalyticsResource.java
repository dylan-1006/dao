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
import team.bham.domain.AllTimeUserAnalytics;
import team.bham.repository.AllTimeUserAnalyticsRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.AllTimeUserAnalytics}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AllTimeUserAnalyticsResource {

    private final Logger log = LoggerFactory.getLogger(AllTimeUserAnalyticsResource.class);

    private static final String ENTITY_NAME = "allTimeUserAnalytics";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AllTimeUserAnalyticsRepository allTimeUserAnalyticsRepository;

    public AllTimeUserAnalyticsResource(AllTimeUserAnalyticsRepository allTimeUserAnalyticsRepository) {
        this.allTimeUserAnalyticsRepository = allTimeUserAnalyticsRepository;
    }

    /**
     * {@code POST  /all-time-user-analytics} : Create a new allTimeUserAnalytics.
     *
     * @param allTimeUserAnalytics the allTimeUserAnalytics to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new allTimeUserAnalytics, or with status {@code 400 (Bad Request)} if the allTimeUserAnalytics has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/all-time-user-analytics")
    public ResponseEntity<AllTimeUserAnalytics> createAllTimeUserAnalytics(@RequestBody AllTimeUserAnalytics allTimeUserAnalytics)
        throws URISyntaxException {
        log.debug("REST request to save AllTimeUserAnalytics : {}", allTimeUserAnalytics);
        if (allTimeUserAnalytics.getId() != null) {
            throw new BadRequestAlertException("A new allTimeUserAnalytics cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AllTimeUserAnalytics result = allTimeUserAnalyticsRepository.save(allTimeUserAnalytics);
        return ResponseEntity
            .created(new URI("/api/all-time-user-analytics/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /all-time-user-analytics/:id} : Updates an existing allTimeUserAnalytics.
     *
     * @param id the id of the allTimeUserAnalytics to save.
     * @param allTimeUserAnalytics the allTimeUserAnalytics to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated allTimeUserAnalytics,
     * or with status {@code 400 (Bad Request)} if the allTimeUserAnalytics is not valid,
     * or with status {@code 500 (Internal Server Error)} if the allTimeUserAnalytics couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/all-time-user-analytics/{id}")
    public ResponseEntity<AllTimeUserAnalytics> updateAllTimeUserAnalytics(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AllTimeUserAnalytics allTimeUserAnalytics
    ) throws URISyntaxException {
        log.debug("REST request to update AllTimeUserAnalytics : {}, {}", id, allTimeUserAnalytics);
        if (allTimeUserAnalytics.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, allTimeUserAnalytics.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!allTimeUserAnalyticsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AllTimeUserAnalytics result = allTimeUserAnalyticsRepository.save(allTimeUserAnalytics);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, allTimeUserAnalytics.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /all-time-user-analytics/:id} : Partial updates given fields of an existing allTimeUserAnalytics, field will ignore if it is null
     *
     * @param id the id of the allTimeUserAnalytics to save.
     * @param allTimeUserAnalytics the allTimeUserAnalytics to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated allTimeUserAnalytics,
     * or with status {@code 400 (Bad Request)} if the allTimeUserAnalytics is not valid,
     * or with status {@code 404 (Not Found)} if the allTimeUserAnalytics is not found,
     * or with status {@code 500 (Internal Server Error)} if the allTimeUserAnalytics couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/all-time-user-analytics/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AllTimeUserAnalytics> partialUpdateAllTimeUserAnalytics(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AllTimeUserAnalytics allTimeUserAnalytics
    ) throws URISyntaxException {
        log.debug("REST request to partial update AllTimeUserAnalytics partially : {}, {}", id, allTimeUserAnalytics);
        if (allTimeUserAnalytics.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, allTimeUserAnalytics.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!allTimeUserAnalyticsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AllTimeUserAnalytics> result = allTimeUserAnalyticsRepository
            .findById(allTimeUserAnalytics.getId())
            .map(existingAllTimeUserAnalytics -> {
                if (allTimeUserAnalytics.getTotalStudyTime() != null) {
                    existingAllTimeUserAnalytics.setTotalStudyTime(allTimeUserAnalytics.getTotalStudyTime());
                }
                if (allTimeUserAnalytics.getTotalPomodoroSession() != null) {
                    existingAllTimeUserAnalytics.setTotalPomodoroSession(allTimeUserAnalytics.getTotalPomodoroSession());
                }
                if (allTimeUserAnalytics.getDailyStreaks() != null) {
                    existingAllTimeUserAnalytics.setDailyStreaks(allTimeUserAnalytics.getDailyStreaks());
                }
                if (allTimeUserAnalytics.getMostFocusedPeriod() != null) {
                    existingAllTimeUserAnalytics.setMostFocusedPeriod(allTimeUserAnalytics.getMostFocusedPeriod());
                }
                if (allTimeUserAnalytics.getTaskCompletionRate() != null) {
                    existingAllTimeUserAnalytics.setTaskCompletionRate(allTimeUserAnalytics.getTaskCompletionRate());
                }
                if (allTimeUserAnalytics.getAverageFocusDuration() != null) {
                    existingAllTimeUserAnalytics.setAverageFocusDuration(allTimeUserAnalytics.getAverageFocusDuration());
                }
                if (allTimeUserAnalytics.getFocusCount() != null) {
                    existingAllTimeUserAnalytics.setFocusCount(allTimeUserAnalytics.getFocusCount());
                }
                if (allTimeUserAnalytics.getTotalFocusDuration() != null) {
                    existingAllTimeUserAnalytics.setTotalFocusDuration(allTimeUserAnalytics.getTotalFocusDuration());
                }
                if (allTimeUserAnalytics.getSessionRecord() != null) {
                    existingAllTimeUserAnalytics.setSessionRecord(allTimeUserAnalytics.getSessionRecord());
                }
                if (allTimeUserAnalytics.getTotalBreakTime() != null) {
                    existingAllTimeUserAnalytics.setTotalBreakTime(allTimeUserAnalytics.getTotalBreakTime());
                }
                if (allTimeUserAnalytics.getAverageBreakDuration() != null) {
                    existingAllTimeUserAnalytics.setAverageBreakDuration(allTimeUserAnalytics.getAverageBreakDuration());
                }

                return existingAllTimeUserAnalytics;
            })
            .map(allTimeUserAnalyticsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, allTimeUserAnalytics.getId().toString())
        );
    }

    /**
     * {@code GET  /all-time-user-analytics} : get all the allTimeUserAnalytics.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of allTimeUserAnalytics in body.
     */
    @GetMapping("/all-time-user-analytics")
    public List<AllTimeUserAnalytics> getAllAllTimeUserAnalytics(@RequestParam(required = false) String filter) {
        if ("user-is-null".equals(filter)) {
            log.debug("REST request to get all AllTimeUserAnalyticss where user is null");
            return StreamSupport
                .stream(allTimeUserAnalyticsRepository.findAll().spliterator(), false)
                .filter(allTimeUserAnalytics -> allTimeUserAnalytics.getUser() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all AllTimeUserAnalytics");
        return allTimeUserAnalyticsRepository.findAll();
    }

    /**
     * {@code GET  /all-time-user-analytics/:id} : get the "id" allTimeUserAnalytics.
     *
     * @param id the id of the allTimeUserAnalytics to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the allTimeUserAnalytics, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/all-time-user-analytics/{id}")
    public ResponseEntity<AllTimeUserAnalytics> getAllTimeUserAnalytics(@PathVariable Long id) {
        log.debug("REST request to get AllTimeUserAnalytics : {}", id);
        Optional<AllTimeUserAnalytics> allTimeUserAnalytics = allTimeUserAnalyticsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(allTimeUserAnalytics);
    }

    /**
     * {@code DELETE  /all-time-user-analytics/:id} : delete the "id" allTimeUserAnalytics.
     *
     * @param id the id of the allTimeUserAnalytics to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/all-time-user-analytics/{id}")
    public ResponseEntity<Void> deleteAllTimeUserAnalytics(@PathVariable Long id) {
        log.debug("REST request to delete AllTimeUserAnalytics : {}", id);
        allTimeUserAnalyticsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
