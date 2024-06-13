package team.bham.domain;

import java.io.Serializable;
import java.time.Duration;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.TimerState;
import team.bham.domain.enumeration.TimerType;

/**
 * A PomodoroTimer.
 */
@Entity
@Table(name = "pomodoro_timer")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PomodoroTimer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "start_time")
    private Instant startTime;

    @Column(name = "end_time")
    private Instant endTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "state")
    private TimerState state;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private TimerType type;

    @Column(name = "duration")
    private Duration duration;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public PomodoroTimer id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getStartTime() {
        return this.startTime;
    }

    public PomodoroTimer startTime(Instant startTime) {
        this.setStartTime(startTime);
        return this;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Instant getEndTime() {
        return this.endTime;
    }

    public PomodoroTimer endTime(Instant endTime) {
        this.setEndTime(endTime);
        return this;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }

    public TimerState getState() {
        return this.state;
    }

    public PomodoroTimer state(TimerState state) {
        this.setState(state);
        return this;
    }

    public void setState(TimerState state) {
        this.state = state;
    }

    public TimerType getType() {
        return this.type;
    }

    public PomodoroTimer type(TimerType type) {
        this.setType(type);
        return this;
    }

    public void setType(TimerType type) {
        this.type = type;
    }

    public Duration getDuration() {
        return this.duration;
    }

    public PomodoroTimer duration(Duration duration) {
        this.setDuration(duration);
        return this;
    }

    public void setDuration(Duration duration) {
        this.duration = duration;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PomodoroTimer)) {
            return false;
        }
        return id != null && id.equals(((PomodoroTimer) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PomodoroTimer{" +
            "id=" + getId() +
            ", startTime='" + getStartTime() + "'" +
            ", endTime='" + getEndTime() + "'" +
            ", state='" + getState() + "'" +
            ", type='" + getType() + "'" +
            ", duration='" + getDuration() + "'" +
            "}";
    }
}
