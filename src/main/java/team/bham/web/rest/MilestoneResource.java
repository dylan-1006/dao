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
import team.bham.domain.Milestone;
import team.bham.repository.MilestoneRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Milestone}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MilestoneResource {

    private final Logger log = LoggerFactory.getLogger(MilestoneResource.class);

    private static final String ENTITY_NAME = "milestone";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MilestoneRepository milestoneRepository;

    public MilestoneResource(MilestoneRepository milestoneRepository) {
        this.milestoneRepository = milestoneRepository;
    }

    /**
     * {@code POST  /milestones} : Create a new milestone.
     *
     * @param milestone the milestone to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new milestone, or with status {@code 400 (Bad Request)} if the milestone has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/milestones")
    public ResponseEntity<Milestone> createMilestone(@RequestBody Milestone milestone) throws URISyntaxException {
        log.debug("REST request to save Milestone : {}", milestone);
        if (milestone.getId() != null) {
            throw new BadRequestAlertException("A new milestone cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Milestone result = milestoneRepository.save(milestone);
        return ResponseEntity
            .created(new URI("/api/milestones/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /milestones/:id} : Updates an existing milestone.
     *
     * @param id the id of the milestone to save.
     * @param milestone the milestone to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated milestone,
     * or with status {@code 400 (Bad Request)} if the milestone is not valid,
     * or with status {@code 500 (Internal Server Error)} if the milestone couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/milestones/{id}")
    public ResponseEntity<Milestone> updateMilestone(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Milestone milestone
    ) throws URISyntaxException {
        log.debug("REST request to update Milestone : {}, {}", id, milestone);
        if (milestone.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, milestone.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!milestoneRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Milestone result = milestoneRepository.save(milestone);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, milestone.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /milestones/:id} : Partial updates given fields of an existing milestone, field will ignore if it is null
     *
     * @param id the id of the milestone to save.
     * @param milestone the milestone to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated milestone,
     * or with status {@code 400 (Bad Request)} if the milestone is not valid,
     * or with status {@code 404 (Not Found)} if the milestone is not found,
     * or with status {@code 500 (Internal Server Error)} if the milestone couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/milestones/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Milestone> partialUpdateMilestone(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Milestone milestone
    ) throws URISyntaxException {
        log.debug("REST request to partial update Milestone partially : {}, {}", id, milestone);
        if (milestone.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, milestone.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!milestoneRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Milestone> result = milestoneRepository
            .findById(milestone.getId())
            .map(existingMilestone -> {
                if (milestone.getRequiredHours() != null) {
                    existingMilestone.setRequiredHours(milestone.getRequiredHours());
                }
                if (milestone.getAchievements() != null) {
                    existingMilestone.setAchievements(milestone.getAchievements());
                }

                return existingMilestone;
            })
            .map(milestoneRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, milestone.getId().toString())
        );
    }

    /**
     * {@code GET  /milestones} : get all the milestones.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of milestones in body.
     */
    @GetMapping("/milestones")
    public List<Milestone> getAllMilestones() {
        log.debug("REST request to get all Milestones");
        return milestoneRepository.findAll();
    }

    /**
     * {@code GET  /milestones/:id} : get the "id" milestone.
     *
     * @param id the id of the milestone to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the milestone, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/milestones/{id}")
    public ResponseEntity<Milestone> getMilestone(@PathVariable Long id) {
        log.debug("REST request to get Milestone : {}", id);
        Optional<Milestone> milestone = milestoneRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(milestone);
    }

    /**
     * {@code DELETE  /milestones/:id} : delete the "id" milestone.
     *
     * @param id the id of the milestone to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/milestones/{id}")
    public ResponseEntity<Void> deleteMilestone(@PathVariable Long id) {
        log.debug("REST request to delete Milestone : {}", id);
        milestoneRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
