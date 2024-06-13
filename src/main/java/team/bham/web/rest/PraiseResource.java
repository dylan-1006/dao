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
import team.bham.domain.Praise;
import team.bham.repository.PraiseRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Praise}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PraiseResource {

    private final Logger log = LoggerFactory.getLogger(PraiseResource.class);

    private static final String ENTITY_NAME = "praise";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PraiseRepository praiseRepository;

    public PraiseResource(PraiseRepository praiseRepository) {
        this.praiseRepository = praiseRepository;
    }

    /**
     * {@code POST  /praises} : Create a new praise.
     *
     * @param praise the praise to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new praise, or with status {@code 400 (Bad Request)} if the praise has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/praises")
    public ResponseEntity<Praise> createPraise(@RequestBody Praise praise) throws URISyntaxException {
        log.debug("REST request to save Praise : {}", praise);
        if (praise.getId() != null) {
            throw new BadRequestAlertException("A new praise cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Praise result = praiseRepository.save(praise);
        return ResponseEntity
            .created(new URI("/api/praises/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /praises/:id} : Updates an existing praise.
     *
     * @param id the id of the praise to save.
     * @param praise the praise to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated praise,
     * or with status {@code 400 (Bad Request)} if the praise is not valid,
     * or with status {@code 500 (Internal Server Error)} if the praise couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/praises/{id}")
    public ResponseEntity<Praise> updatePraise(@PathVariable(value = "id", required = false) final Long id, @RequestBody Praise praise)
        throws URISyntaxException {
        log.debug("REST request to update Praise : {}, {}", id, praise);
        if (praise.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, praise.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!praiseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Praise result = praiseRepository.save(praise);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, praise.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /praises/:id} : Partial updates given fields of an existing praise, field will ignore if it is null
     *
     * @param id the id of the praise to save.
     * @param praise the praise to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated praise,
     * or with status {@code 400 (Bad Request)} if the praise is not valid,
     * or with status {@code 404 (Not Found)} if the praise is not found,
     * or with status {@code 500 (Internal Server Error)} if the praise couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/praises/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Praise> partialUpdatePraise(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Praise praise
    ) throws URISyntaxException {
        log.debug("REST request to partial update Praise partially : {}, {}", id, praise);
        if (praise.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, praise.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!praiseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Praise> result = praiseRepository
            .findById(praise.getId())
            .map(existingPraise -> {
                if (praise.getPraiseMessage() != null) {
                    existingPraise.setPraiseMessage(praise.getPraiseMessage());
                }

                return existingPraise;
            })
            .map(praiseRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, praise.getId().toString())
        );
    }

    /**
     * {@code GET  /praises} : get all the praises.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of praises in body.
     */
    @GetMapping("/praises")
    public List<Praise> getAllPraises() {
        log.debug("REST request to get all Praises");
        return praiseRepository.findAll();
    }

    /**
     * {@code GET  /praises/:id} : get the "id" praise.
     *
     * @param id the id of the praise to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the praise, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/praises/{id}")
    public ResponseEntity<Praise> getPraise(@PathVariable Long id) {
        log.debug("REST request to get Praise : {}", id);
        Optional<Praise> praise = praiseRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(praise);
    }

    /**
     * {@code DELETE  /praises/:id} : delete the "id" praise.
     *
     * @param id the id of the praise to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/praises/{id}")
    public ResponseEntity<Void> deletePraise(@PathVariable Long id) {
        log.debug("REST request to delete Praise : {}", id);
        praiseRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
