package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A SessionAnalytic.
 */
@Entity
@Table(name = "session_analytic")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SessionAnalytic implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "session_duration")
    private Integer sessionDuration;

    @Column(name = "task_total")
    private Integer taskTotal;

    @Column(name = "task_completed")
    private Integer taskCompleted;

    @Column(name = "points_gained")
    private Integer pointsGained;

    @Column(name = "num_of_pomodoro_finished")
    private Integer numOfPomodoroFinished;

    @Column(name = "praise_count")
    private Integer praiseCount;

    @JsonIgnoreProperties(
        value = { "internalUser", "allTimeAnalytics", "currentMilestone", "messages", "kanbanTask", "session" },
        allowSetters = true
    )
    @OneToOne
    @JoinColumn(unique = true)
    private ApplicationUser user;

    @JsonIgnoreProperties(
        value = { "sessionAnalytic", "kanbanBoard", "pomodoroTimer", "playlist", "messages", "users" },
        allowSetters = true
    )
    @OneToOne(mappedBy = "sessionAnalytic")
    private Session session;

    @ManyToOne
    @JsonIgnoreProperties(value = { "sessionAnalytics", "user" }, allowSetters = true)
    private AllTimeUserAnalytics allTimeUserAnalytics;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public SessionAnalytic id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getSessionDuration() {
        return this.sessionDuration;
    }

    public SessionAnalytic sessionDuration(Integer sessionDuration) {
        this.setSessionDuration(sessionDuration);
        return this;
    }

    public void setSessionDuration(Integer sessionDuration) {
        this.sessionDuration = sessionDuration;
    }

    public Integer getTaskTotal() {
        return this.taskTotal;
    }

    public SessionAnalytic taskTotal(Integer taskTotal) {
        this.setTaskTotal(taskTotal);
        return this;
    }

    public void setTaskTotal(Integer taskTotal) {
        this.taskTotal = taskTotal;
    }

    public Integer getTaskCompleted() {
        return this.taskCompleted;
    }

    public SessionAnalytic taskCompleted(Integer taskCompleted) {
        this.setTaskCompleted(taskCompleted);
        return this;
    }

    public void setTaskCompleted(Integer taskCompleted) {
        this.taskCompleted = taskCompleted;
    }

    public Integer getPointsGained() {
        return this.pointsGained;
    }

    public SessionAnalytic pointsGained(Integer pointsGained) {
        this.setPointsGained(pointsGained);
        return this;
    }

    public void setPointsGained(Integer pointsGained) {
        this.pointsGained = pointsGained;
    }

    public Integer getNumOfPomodoroFinished() {
        return this.numOfPomodoroFinished;
    }

    public SessionAnalytic numOfPomodoroFinished(Integer numOfPomodoroFinished) {
        this.setNumOfPomodoroFinished(numOfPomodoroFinished);
        return this;
    }

    public void setNumOfPomodoroFinished(Integer numOfPomodoroFinished) {
        this.numOfPomodoroFinished = numOfPomodoroFinished;
    }

    public Integer getPraiseCount() {
        return this.praiseCount;
    }

    public SessionAnalytic praiseCount(Integer praiseCount) {
        this.setPraiseCount(praiseCount);
        return this;
    }

    public void setPraiseCount(Integer praiseCount) {
        this.praiseCount = praiseCount;
    }

    public ApplicationUser getUser() {
        return this.user;
    }

    public void setUser(ApplicationUser applicationUser) {
        this.user = applicationUser;
    }

    public SessionAnalytic user(ApplicationUser applicationUser) {
        this.setUser(applicationUser);
        return this;
    }

    public Session getSession() {
        return this.session;
    }

    public void setSession(Session session) {
        if (this.session != null) {
            this.session.setSessionAnalytic(null);
        }
        if (session != null) {
            session.setSessionAnalytic(this);
        }
        this.session = session;
    }

    public SessionAnalytic session(Session session) {
        this.setSession(session);
        return this;
    }

    public AllTimeUserAnalytics getAllTimeUserAnalytics() {
        return this.allTimeUserAnalytics;
    }

    public void setAllTimeUserAnalytics(AllTimeUserAnalytics allTimeUserAnalytics) {
        this.allTimeUserAnalytics = allTimeUserAnalytics;
    }

    public SessionAnalytic allTimeUserAnalytics(AllTimeUserAnalytics allTimeUserAnalytics) {
        this.setAllTimeUserAnalytics(allTimeUserAnalytics);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SessionAnalytic)) {
            return false;
        }
        return id != null && id.equals(((SessionAnalytic) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SessionAnalytic{" +
            "id=" + getId() +
            ", sessionDuration=" + getSessionDuration() +
            ", taskTotal=" + getTaskTotal() +
            ", taskCompleted=" + getTaskCompleted() +
            ", pointsGained=" + getPointsGained() +
            ", numOfPomodoroFinished=" + getNumOfPomodoroFinished() +
            ", praiseCount=" + getPraiseCount() +
            "}";
    }
}
