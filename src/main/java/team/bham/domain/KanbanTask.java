package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.TaskStatus;

/**
 * A KanbanTask.
 */
@Entity
@Table(name = "kanban_task")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class KanbanTask implements Serializable {

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

    @Enumerated(EnumType.STRING)
    @Column(name = "task_status")
    private TaskStatus taskStatus;

    @Column(name = "due_date")
    private Instant dueDate;

    @JsonIgnoreProperties(
        value = { "internalUser", "allTimeAnalytics", "currentMilestone", "messages", "kanbanTask", "session" },
        allowSetters = true
    )
    @OneToOne
    @JoinColumn(unique = true)
    private ApplicationUser author;

    @OneToMany(mappedBy = "kanbanTask")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "internalUser", "allTimeAnalytics", "currentMilestone", "messages", "kanbanTask", "session" },
        allowSetters = true
    )
    private Set<ApplicationUser> assignees = new HashSet<>();

    @OneToMany(mappedBy = "kanbanTask")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "author", "kanbanTask" }, allowSetters = true)
    private Set<KanbanTaskComment> comments = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "rel_kanban_task__labels",
        joinColumns = @JoinColumn(name = "kanban_task_id"),
        inverseJoinColumns = @JoinColumn(name = "labels_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "boards", "tasks" }, allowSetters = true)
    private Set<KanbanLabel> labels = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "tasks", "labels" }, allowSetters = true)
    private KanbanBoard kanbanBoard;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public KanbanTask id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public KanbanTask title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public KanbanTask description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TaskStatus getTaskStatus() {
        return this.taskStatus;
    }

    public KanbanTask taskStatus(TaskStatus taskStatus) {
        this.setTaskStatus(taskStatus);
        return this;
    }

    public void setTaskStatus(TaskStatus taskStatus) {
        this.taskStatus = taskStatus;
    }

    public Instant getDueDate() {
        return this.dueDate;
    }

    public KanbanTask dueDate(Instant dueDate) {
        this.setDueDate(dueDate);
        return this;
    }

    public void setDueDate(Instant dueDate) {
        this.dueDate = dueDate;
    }

    public ApplicationUser getAuthor() {
        return this.author;
    }

    public void setAuthor(ApplicationUser applicationUser) {
        this.author = applicationUser;
    }

    public KanbanTask author(ApplicationUser applicationUser) {
        this.setAuthor(applicationUser);
        return this;
    }

    public Set<ApplicationUser> getAssignees() {
        return this.assignees;
    }

    public void setAssignees(Set<ApplicationUser> applicationUsers) {
        if (this.assignees != null) {
            this.assignees.forEach(i -> i.setKanbanTask(null));
        }
        if (applicationUsers != null) {
            applicationUsers.forEach(i -> i.setKanbanTask(this));
        }
        this.assignees = applicationUsers;
    }

    public KanbanTask assignees(Set<ApplicationUser> applicationUsers) {
        this.setAssignees(applicationUsers);
        return this;
    }

    public KanbanTask addAssignees(ApplicationUser applicationUser) {
        this.assignees.add(applicationUser);
        applicationUser.setKanbanTask(this);
        return this;
    }

    public KanbanTask removeAssignees(ApplicationUser applicationUser) {
        this.assignees.remove(applicationUser);
        applicationUser.setKanbanTask(null);
        return this;
    }

    public Set<KanbanTaskComment> getComments() {
        return this.comments;
    }

    public void setComments(Set<KanbanTaskComment> kanbanTaskComments) {
        if (this.comments != null) {
            this.comments.forEach(i -> i.setKanbanTask(null));
        }
        if (kanbanTaskComments != null) {
            kanbanTaskComments.forEach(i -> i.setKanbanTask(this));
        }
        this.comments = kanbanTaskComments;
    }

    public KanbanTask comments(Set<KanbanTaskComment> kanbanTaskComments) {
        this.setComments(kanbanTaskComments);
        return this;
    }

    public KanbanTask addComments(KanbanTaskComment kanbanTaskComment) {
        this.comments.add(kanbanTaskComment);
        kanbanTaskComment.setKanbanTask(this);
        return this;
    }

    public KanbanTask removeComments(KanbanTaskComment kanbanTaskComment) {
        this.comments.remove(kanbanTaskComment);
        kanbanTaskComment.setKanbanTask(null);
        return this;
    }

    public Set<KanbanLabel> getLabels() {
        return this.labels;
    }

    public void setLabels(Set<KanbanLabel> kanbanLabels) {
        this.labels = kanbanLabels;
    }

    public KanbanTask labels(Set<KanbanLabel> kanbanLabels) {
        this.setLabels(kanbanLabels);
        return this;
    }

    public KanbanTask addLabels(KanbanLabel kanbanLabel) {
        this.labels.add(kanbanLabel);
        kanbanLabel.getTasks().add(this);
        return this;
    }

    public KanbanTask removeLabels(KanbanLabel kanbanLabel) {
        this.labels.remove(kanbanLabel);
        kanbanLabel.getTasks().remove(this);
        return this;
    }

    public KanbanBoard getKanbanBoard() {
        return this.kanbanBoard;
    }

    public void setKanbanBoard(KanbanBoard kanbanBoard) {
        this.kanbanBoard = kanbanBoard;
    }

    public KanbanTask kanbanBoard(KanbanBoard kanbanBoard) {
        this.setKanbanBoard(kanbanBoard);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof KanbanTask)) {
            return false;
        }
        return id != null && id.equals(((KanbanTask) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "KanbanTask{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", taskStatus='" + getTaskStatus() + "'" +
            ", dueDate='" + getDueDate() + "'" +
            "}";
    }
}
