package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import team.bham.domain.enumeration.MessageStatus;

/**
 * A Message.
 */
@Entity
@Table(name = "message")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Message implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "content")
    private String content;

    @Column(name = "sent_time")
    private Instant sentTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private MessageStatus status;

    @Column(name = "has_attachment")
    private Boolean hasAttachment;

    @Column(name = "is_pinned")
    private Boolean isPinned;

    @OneToOne
    @JoinColumn(unique = true)
    private Attachment attachment;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "internalUser", "allTimeAnalytics", "currentMilestone", "messages", "kanbanTask", "session" },
        allowSetters = true
    )
    private ApplicationUser applicationUser;

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

    public Message id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return this.content;
    }

    public Message content(String content) {
        this.setContent(content);
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getSentTime() {
        return this.sentTime;
    }

    public Message sentTime(Instant sentTime) {
        this.setSentTime(sentTime);
        return this;
    }

    public void setSentTime(Instant sentTime) {
        this.sentTime = sentTime;
    }

    public MessageStatus getStatus() {
        return this.status;
    }

    public Message status(MessageStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(MessageStatus status) {
        this.status = status;
    }

    public Boolean getHasAttachment() {
        return this.hasAttachment;
    }

    public Message hasAttachment(Boolean hasAttachment) {
        this.setHasAttachment(hasAttachment);
        return this;
    }

    public void setHasAttachment(Boolean hasAttachment) {
        this.hasAttachment = hasAttachment;
    }

    public Boolean getIsPinned() {
        return this.isPinned;
    }

    public Message isPinned(Boolean isPinned) {
        this.setIsPinned(isPinned);
        return this;
    }

    public void setIsPinned(Boolean isPinned) {
        this.isPinned = isPinned;
    }

    public Attachment getAttachment() {
        return this.attachment;
    }

    public void setAttachment(Attachment attachment) {
        this.attachment = attachment;
    }

    public Message attachment(Attachment attachment) {
        this.setAttachment(attachment);
        return this;
    }

    public ApplicationUser getApplicationUser() {
        return this.applicationUser;
    }

    public void setApplicationUser(ApplicationUser applicationUser) {
        this.applicationUser = applicationUser;
    }

    public Message applicationUser(ApplicationUser applicationUser) {
        this.setApplicationUser(applicationUser);
        return this;
    }

    public Session getSession() {
        return this.session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public Message session(Session session) {
        this.setSession(session);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Message)) {
            return false;
        }
        return id != null && id.equals(((Message) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Message{" +
            "id=" + getId() +
            ", content='" + getContent() + "'" +
            ", sentTime='" + getSentTime() + "'" +
            ", status='" + getStatus() + "'" +
            ", hasAttachment='" + getHasAttachment() + "'" +
            ", isPinned='" + getIsPinned() + "'" +
            "}";
    }
}
