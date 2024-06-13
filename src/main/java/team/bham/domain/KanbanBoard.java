package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A KanbanBoard.
 */
@Entity
@Table(name = "kanban_board")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class KanbanBoard implements Serializable {

    public KanbanBoard() {
        this.description = null;
        this.title = null;
    }

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "kanbanBoard")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "author", "assignees", "comments", "labels", "kanbanBoard" }, allowSetters = true)
    private Set<KanbanTask> tasks = new HashSet<>();

    @ManyToMany(mappedBy = "boards")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "boards", "tasks" }, allowSetters = true)
    private Set<KanbanLabel> labels = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public KanbanBoard id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public KanbanBoard title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public KanbanBoard description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<KanbanTask> getTasks() {
        return this.tasks;
    }

    public void setTasks(Set<KanbanTask> kanbanTasks) {
        if (this.tasks != null) {
            this.tasks.forEach(i -> i.setKanbanBoard(null));
        }
        if (kanbanTasks != null) {
            kanbanTasks.forEach(i -> i.setKanbanBoard(this));
        }
        this.tasks = kanbanTasks;
    }

    public KanbanBoard tasks(Set<KanbanTask> kanbanTasks) {
        this.setTasks(kanbanTasks);
        return this;
    }

    public KanbanBoard addTasks(KanbanTask kanbanTask) {
        this.tasks.add(kanbanTask);
        kanbanTask.setKanbanBoard(this);
        return this;
    }

    public KanbanBoard removeTasks(KanbanTask kanbanTask) {
        this.tasks.remove(kanbanTask);
        kanbanTask.setKanbanBoard(null);
        return this;
    }

    public Set<KanbanLabel> getLabels() {
        return this.labels;
    }

    public void setLabels(Set<KanbanLabel> kanbanLabels) {
        if (this.labels != null) {
            this.labels.forEach(i -> i.removeBoard(this));
        }
        if (kanbanLabels != null) {
            kanbanLabels.forEach(i -> i.addBoard(this));
        }
        this.labels = kanbanLabels;
    }

    public KanbanBoard labels(Set<KanbanLabel> kanbanLabels) {
        this.setLabels(kanbanLabels);
        return this;
    }

    public KanbanBoard addLabel(KanbanLabel kanbanLabel) {
        this.labels.add(kanbanLabel);
        kanbanLabel.getBoards().add(this);
        return this;
    }

    public KanbanBoard removeLabel(KanbanLabel kanbanLabel) {
        this.labels.remove(kanbanLabel);
        kanbanLabel.getBoards().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof KanbanBoard)) {
            return false;
        }
        return id != null && id.equals(((KanbanBoard) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "KanbanBoard{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
