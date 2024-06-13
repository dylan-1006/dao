package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A AllTimeUserAnalytics.
 */
@Entity
@Table(name = "all_time_user_analytics")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AllTimeUserAnalytics implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "total_study_time")
    private Integer totalStudyTime;

    @Column(name = "total_pomodoro_session")
    private Integer totalPomodoroSession;

    @Column(name = "daily_streaks")
    private Integer dailyStreaks;

    @Column(name = "most_focused_period")
    private Instant mostFocusedPeriod;

    @Column(name = "task_completion_rate")
    private Float taskCompletionRate;

    @Column(name = "average_focus_duration")
    private Integer averageFocusDuration;

    @Column(name = "focus_count")
    private Integer focusCount;

    @Column(name = "total_focus_duration")
    private Integer totalFocusDuration;

    @Column(name = "session_record")
    private Integer sessionRecord;

    @Column(name = "total_break_time")
    private Integer totalBreakTime;

    @Column(name = "average_break_duration")
    private Integer averageBreakDuration;

    @OneToMany(mappedBy = "allTimeUserAnalytics")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "session", "allTimeUserAnalytics" }, allowSetters = true)
    private Set<SessionAnalytic> sessionAnalytics = new HashSet<>();

    @JsonIgnoreProperties(
        value = { "internalUser", "allTimeAnalytics", "currentMilestone", "messages", "kanbanTask", "session" },
        allowSetters = true
    )
    @OneToOne(mappedBy = "allTimeAnalytics")
    private ApplicationUser user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AllTimeUserAnalytics id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getTotalStudyTime() {
        return this.totalStudyTime;
    }

    public AllTimeUserAnalytics totalStudyTime(Integer totalStudyTime) {
        this.setTotalStudyTime(totalStudyTime);
        return this;
    }

    public void setTotalStudyTime(Integer totalStudyTime) {
        this.totalStudyTime = totalStudyTime;
    }

    public Integer getTotalPomodoroSession() {
        return this.totalPomodoroSession;
    }

    public AllTimeUserAnalytics totalPomodoroSession(Integer totalPomodoroSession) {
        this.setTotalPomodoroSession(totalPomodoroSession);
        return this;
    }

    public void setTotalPomodoroSession(Integer totalPomodoroSession) {
        this.totalPomodoroSession = totalPomodoroSession;
    }

    public Integer getDailyStreaks() {
        return this.dailyStreaks;
    }

    public AllTimeUserAnalytics dailyStreaks(Integer dailyStreaks) {
        this.setDailyStreaks(dailyStreaks);
        return this;
    }

    public void setDailyStreaks(Integer dailyStreaks) {
        this.dailyStreaks = dailyStreaks;
    }

    public Instant getMostFocusedPeriod() {
        return this.mostFocusedPeriod;
    }

    public AllTimeUserAnalytics mostFocusedPeriod(Instant mostFocusedPeriod) {
        this.setMostFocusedPeriod(mostFocusedPeriod);
        return this;
    }

    public void setMostFocusedPeriod(Instant mostFocusedPeriod) {
        this.mostFocusedPeriod = mostFocusedPeriod;
    }

    public Float getTaskCompletionRate() {
        return this.taskCompletionRate;
    }

    public AllTimeUserAnalytics taskCompletionRate(Float taskCompletionRate) {
        this.setTaskCompletionRate(taskCompletionRate);
        return this;
    }

    public void setTaskCompletionRate(Float taskCompletionRate) {
        this.taskCompletionRate = taskCompletionRate;
    }

    public Integer getAverageFocusDuration() {
        return this.averageFocusDuration;
    }

    public AllTimeUserAnalytics averageFocusDuration(Integer averageFocusDuration) {
        this.setAverageFocusDuration(averageFocusDuration);
        return this;
    }

    public void setAverageFocusDuration(Integer averageFocusDuration) {
        this.averageFocusDuration = averageFocusDuration;
    }

    public Integer getFocusCount() {
        return this.focusCount;
    }

    public AllTimeUserAnalytics focusCount(Integer focusCount) {
        this.setFocusCount(focusCount);
        return this;
    }

    public void setFocusCount(Integer focusCount) {
        this.focusCount = focusCount;
    }

    public Integer getTotalFocusDuration() {
        return this.totalFocusDuration;
    }

    public AllTimeUserAnalytics totalFocusDuration(Integer totalFocusDuration) {
        this.setTotalFocusDuration(totalFocusDuration);
        return this;
    }

    public void setTotalFocusDuration(Integer totalFocusDuration) {
        this.totalFocusDuration = totalFocusDuration;
    }

    public Integer getSessionRecord() {
        return this.sessionRecord;
    }

    public AllTimeUserAnalytics sessionRecord(Integer sessionRecord) {
        this.setSessionRecord(sessionRecord);
        return this;
    }

    public void setSessionRecord(Integer sessionRecord) {
        this.sessionRecord = sessionRecord;
    }

    public Integer getTotalBreakTime() {
        return this.totalBreakTime;
    }

    public AllTimeUserAnalytics totalBreakTime(Integer totalBreakTime) {
        this.setTotalBreakTime(totalBreakTime);
        return this;
    }

    public void setTotalBreakTime(Integer totalBreakTime) {
        this.totalBreakTime = totalBreakTime;
    }

    public Integer getAverageBreakDuration() {
        return this.averageBreakDuration;
    }

    public AllTimeUserAnalytics averageBreakDuration(Integer averageBreakDuration) {
        this.setAverageBreakDuration(averageBreakDuration);
        return this;
    }

    public void setAverageBreakDuration(Integer averageBreakDuration) {
        this.averageBreakDuration = averageBreakDuration;
    }

    public Set<SessionAnalytic> getSessionAnalytics() {
        return this.sessionAnalytics;
    }

    public void setSessionAnalytics(Set<SessionAnalytic> sessionAnalytics) {
        if (this.sessionAnalytics != null) {
            this.sessionAnalytics.forEach(i -> i.setAllTimeUserAnalytics(null));
        }
        if (sessionAnalytics != null) {
            sessionAnalytics.forEach(i -> i.setAllTimeUserAnalytics(this));
        }
        this.sessionAnalytics = sessionAnalytics;
    }

    public AllTimeUserAnalytics sessionAnalytics(Set<SessionAnalytic> sessionAnalytics) {
        this.setSessionAnalytics(sessionAnalytics);
        return this;
    }

    public AllTimeUserAnalytics addSessionAnalytics(SessionAnalytic sessionAnalytic) {
        this.sessionAnalytics.add(sessionAnalytic);
        sessionAnalytic.setAllTimeUserAnalytics(this);
        return this;
    }

    public AllTimeUserAnalytics removeSessionAnalytics(SessionAnalytic sessionAnalytic) {
        this.sessionAnalytics.remove(sessionAnalytic);
        sessionAnalytic.setAllTimeUserAnalytics(null);
        return this;
    }

    public ApplicationUser getUser() {
        return this.user;
    }

    public void setUser(ApplicationUser applicationUser) {
        if (this.user != null) {
            this.user.setAllTimeAnalytics(null);
        }
        if (applicationUser != null) {
            applicationUser.setAllTimeAnalytics(this);
        }
        this.user = applicationUser;
    }

    public AllTimeUserAnalytics user(ApplicationUser applicationUser) {
        this.setUser(applicationUser);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AllTimeUserAnalytics)) {
            return false;
        }
        return id != null && id.equals(((AllTimeUserAnalytics) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AllTimeUserAnalytics{" +
            "id=" + getId() +
            ", totalStudyTime=" + getTotalStudyTime() +
            ", totalPomodoroSession=" + getTotalPomodoroSession() +
            ", dailyStreaks=" + getDailyStreaks() +
            ", mostFocusedPeriod='" + getMostFocusedPeriod() + "'" +
            ", taskCompletionRate=" + getTaskCompletionRate() +
            ", averageFocusDuration=" + getAverageFocusDuration() +
            ", focusCount=" + getFocusCount() +
            ", totalFocusDuration=" + getTotalFocusDuration() +
            ", sessionRecord=" + getSessionRecord() +
            ", totalBreakTime=" + getTotalBreakTime() +
            ", averageBreakDuration=" + getAverageBreakDuration() +
            "}";
    }
}
