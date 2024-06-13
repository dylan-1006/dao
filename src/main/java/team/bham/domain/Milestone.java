package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Milestone.
 */
@Entity
@Table(name = "milestone")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Milestone implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "required_hours")
    private Integer requiredHours;

    @Column(name = "achievements")
    private String achievements;

    @OneToMany(mappedBy = "milestone")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "milestone" }, allowSetters = true)
    private Set<Reward> rewards = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Milestone id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getRequiredHours() {
        return this.requiredHours;
    }

    public Milestone requiredHours(Integer requiredHours) {
        this.setRequiredHours(requiredHours);
        return this;
    }

    public void setRequiredHours(Integer requiredHours) {
        this.requiredHours = requiredHours;
    }

    public String getAchievements() {
        return this.achievements;
    }

    public Milestone achievements(String achievements) {
        this.setAchievements(achievements);
        return this;
    }

    public void setAchievements(String achievements) {
        this.achievements = achievements;
    }

    public Set<Reward> getRewards() {
        return this.rewards;
    }

    public void setRewards(Set<Reward> rewards) {
        if (this.rewards != null) {
            this.rewards.forEach(i -> i.setMilestone(null));
        }
        if (rewards != null) {
            rewards.forEach(i -> i.setMilestone(this));
        }
        this.rewards = rewards;
    }

    public Milestone rewards(Set<Reward> rewards) {
        this.setRewards(rewards);
        return this;
    }

    public Milestone addRewards(Reward reward) {
        this.rewards.add(reward);
        reward.setMilestone(this);
        return this;
    }

    public Milestone removeRewards(Reward reward) {
        this.rewards.remove(reward);
        reward.setMilestone(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Milestone)) {
            return false;
        }
        return id != null && id.equals(((Milestone) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Milestone{" +
            "id=" + getId() +
            ", requiredHours=" + getRequiredHours() +
            ", achievements='" + getAchievements() + "'" +
            "}";
    }
}
