package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ApplicationUser.
 */
@Entity
@Table(name = "application_user")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ApplicationUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @OneToOne
    @JoinColumn(unique = true)
    private User internalUser;

    @JsonIgnoreProperties(value = { "sessionAnalytics", "user" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private AllTimeUserAnalytics allTimeAnalytics;

    @JsonIgnoreProperties(value = { "rewards" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Milestone currentMilestone;

    @OneToMany(mappedBy = "applicationUser")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "attachment", "applicationUser", "session" }, allowSetters = true)
    private Set<Message> messages = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "author", "assignees", "comments", "labels", "kanbanBoard" }, allowSetters = true)
    private KanbanTask kanbanTask;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "sessionAnalytic", "kanbanBoard", "pomodoroTimer", "playlist", "messages", "users" },
        allowSetters = true
    )
    private Session session;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ApplicationUser id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getInternalUser() {
        return this.internalUser;
    }

    public void setInternalUser(User user) {
        this.internalUser = user;
    }

    public ApplicationUser internalUser(User user) {
        this.setInternalUser(user);
        return this;
    }

    public AllTimeUserAnalytics getAllTimeAnalytics() {
        return this.allTimeAnalytics;
    }

    public void setAllTimeAnalytics(AllTimeUserAnalytics allTimeUserAnalytics) {
        this.allTimeAnalytics = allTimeUserAnalytics;
    }

    public ApplicationUser allTimeAnalytics(AllTimeUserAnalytics allTimeUserAnalytics) {
        this.setAllTimeAnalytics(allTimeUserAnalytics);
        return this;
    }

    public Milestone getCurrentMilestone() {
        return this.currentMilestone;
    }

    public void setCurrentMilestone(Milestone milestone) {
        this.currentMilestone = milestone;
    }

    public ApplicationUser currentMilestone(Milestone milestone) {
        this.setCurrentMilestone(milestone);
        return this;
    }

    public Set<Message> getMessages() {
        return this.messages;
    }

    public void setMessages(Set<Message> messages) {
        if (this.messages != null) {
            this.messages.forEach(i -> i.setApplicationUser(null));
        }
        if (messages != null) {
            messages.forEach(i -> i.setApplicationUser(this));
        }
        this.messages = messages;
    }

    public ApplicationUser messages(Set<Message> messages) {
        this.setMessages(messages);
        return this;
    }

    public ApplicationUser addMessages(Message message) {
        this.messages.add(message);
        message.setApplicationUser(this);
        return this;
    }

    public ApplicationUser removeMessages(Message message) {
        this.messages.remove(message);
        message.setApplicationUser(null);
        return this;
    }

    public KanbanTask getKanbanTask() {
        return this.kanbanTask;
    }

    public void setKanbanTask(KanbanTask kanbanTask) {
        this.kanbanTask = kanbanTask;
    }

    public ApplicationUser kanbanTask(KanbanTask kanbanTask) {
        this.setKanbanTask(kanbanTask);
        return this;
    }

    public Session getSession() {
        return this.session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public ApplicationUser session(Session session) {
        this.setSession(session);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ApplicationUser)) {
            return false;
        }
        return id != null && id.equals(((ApplicationUser) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ApplicationUser{" +
            "id=" + getId() +
            "}";
    }
}
