package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A KanbanLabel.
 */
@Entity
@Table(name = "kanban_label")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class KanbanLabel implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Pattern(regexp = "#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})")
    @Column(name = "colour")
    private String colour;

    @ManyToMany
    @JoinTable(
        name = "rel_kanban_label__board",
        joinColumns = @JoinColumn(name = "kanban_label_id"),
        inverseJoinColumns = @JoinColumn(name = "board_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "tasks", "labels" }, allowSetters = true)
    private Set<KanbanBoard> boards = new HashSet<>();

    @ManyToMany(mappedBy = "labels")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "author", "assignees", "comments", "labels", "kanbanBoard" }, allowSetters = true)
    private Set<KanbanTask> tasks = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public KanbanLabel id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public KanbanLabel name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColour() {
        return this.colour;
    }

    public KanbanLabel colour(String colour) {
        this.setColour(colour);
        return this;
    }

    public void setColour(String colour) {
        this.colour = colour;
    }

    public Set<KanbanBoard> getBoards() {
        return this.boards;
    }

    public void setBoards(Set<KanbanBoard> kanbanBoards) {
        this.boards = kanbanBoards;
    }

    public KanbanLabel boards(Set<KanbanBoard> kanbanBoards) {
        this.setBoards(kanbanBoards);
        return this;
    }

    public KanbanLabel addBoard(KanbanBoard kanbanBoard) {
        this.boards.add(kanbanBoard);
        kanbanBoard.getLabels().add(this);
        return this;
    }

    public KanbanLabel removeBoard(KanbanBoard kanbanBoard) {
        this.boards.remove(kanbanBoard);
        kanbanBoard.getLabels().remove(this);
        return this;
    }

    public Set<KanbanTask> getTasks() {
        return this.tasks;
    }

    public void setTasks(Set<KanbanTask> kanbanTasks) {
        if (this.tasks != null) {
            this.tasks.forEach(i -> i.removeLabels(this));
        }
        if (kanbanTasks != null) {
            kanbanTasks.forEach(i -> i.addLabels(this));
        }
        this.tasks = kanbanTasks;
    }

    public KanbanLabel tasks(Set<KanbanTask> kanbanTasks) {
        this.setTasks(kanbanTasks);
        return this;
    }

    public KanbanLabel addTasks(KanbanTask kanbanTask) {
        this.tasks.add(kanbanTask);
        kanbanTask.getLabels().add(this);
        return this;
    }

    public KanbanLabel removeTasks(KanbanTask kanbanTask) {
        this.tasks.remove(kanbanTask);
        kanbanTask.getLabels().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof KanbanLabel)) {
            return false;
        }
        return id != null && id.equals(((KanbanLabel) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "KanbanLabel{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", colour='" + getColour() + "'" +
            "}";
    }
}
