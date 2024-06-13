package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Praise.
 */
@Entity
@Table(name = "praise")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Praise implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "praise_message")
    private String praiseMessage;

    @JsonIgnoreProperties(
        value = { "internalUser", "allTimeAnalytics", "currentMilestone", "messages", "kanbanTask", "session" },
        allowSetters = true
    )
    @OneToOne
    @JoinColumn(unique = true)
    private ApplicationUser sender;

    @JsonIgnoreProperties(
        value = { "internalUser", "allTimeAnalytics", "currentMilestone", "messages", "kanbanTask", "session" },
        allowSetters = true
    )
    @OneToOne
    @JoinColumn(unique = true)
    private ApplicationUser receiver;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Praise id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPraiseMessage() {
        return this.praiseMessage;
    }

    public Praise praiseMessage(String praiseMessage) {
        this.setPraiseMessage(praiseMessage);
        return this;
    }

    public void setPraiseMessage(String praiseMessage) {
        this.praiseMessage = praiseMessage;
    }

    public ApplicationUser getSender() {
        return this.sender;
    }

    public void setSender(ApplicationUser applicationUser) {
        this.sender = applicationUser;
    }

    public Praise sender(ApplicationUser applicationUser) {
        this.setSender(applicationUser);
        return this;
    }

    public ApplicationUser getReceiver() {
        return this.receiver;
    }

    public void setReceiver(ApplicationUser applicationUser) {
        this.receiver = applicationUser;
    }

    public Praise receiver(ApplicationUser applicationUser) {
        this.setReceiver(applicationUser);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Praise)) {
            return false;
        }
        return id != null && id.equals(((Praise) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Praise{" +
            "id=" + getId() +
            ", praiseMessage='" + getPraiseMessage() + "'" +
            "}";
    }
}
