package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A KanbanTaskComment.
 */
@Entity
@Table(name = "kanban_task_comment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class KanbanTaskComment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "content")
    private String content;

    @Column(name = "time_stamp")
    private Instant timeStamp;

    @JsonIgnoreProperties(
        value = { "internalUser", "allTimeAnalytics", "currentMilestone", "messages", "kanbanTask", "session" },
        allowSetters = true
    )
    @OneToOne
    @JoinColumn(unique = true)
    private ApplicationUser author;

    @ManyToOne
    @JsonIgnoreProperties(value = { "author", "assignees", "comments", "labels", "kanbanBoard" }, allowSetters = true)
    private KanbanTask kanbanTask;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public KanbanTaskComment id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return this.content;
    }

    public KanbanTaskComment content(String content) {
        this.setContent(content);
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getTimeStamp() {
        return this.timeStamp;
    }

    public KanbanTaskComment timeStamp(Instant timeStamp) {
        this.setTimeStamp(timeStamp);
        return this;
    }

    public void setTimeStamp(Instant timeStamp) {
        this.timeStamp = timeStamp;
    }

    public ApplicationUser getAuthor() {
        return this.author;
    }

    public void setAuthor(ApplicationUser applicationUser) {
        this.author = applicationUser;
    }

    public KanbanTaskComment author(ApplicationUser applicationUser) {
        this.setAuthor(applicationUser);
        return this;
    }

    public KanbanTask getKanbanTask() {
        return this.kanbanTask;
    }

    public void setKanbanTask(KanbanTask kanbanTask) {
        this.kanbanTask = kanbanTask;
    }

    public KanbanTaskComment kanbanTask(KanbanTask kanbanTask) {
        this.setKanbanTask(kanbanTask);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof KanbanTaskComment)) {
            return false;
        }
        return id != null && id.equals(((KanbanTaskComment) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "KanbanTaskComment{" +
            "id=" + getId() +
            ", content='" + getContent() + "'" +
            ", timeStamp='" + getTimeStamp() + "'" +
            "}";
    }
}
