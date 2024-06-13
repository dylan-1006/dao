package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Session.
 */
@Entity
@Table(name = "session")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Session implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "join_code")
    private String joinCode;

    @Column(name = "user_id_list")
    private String userIdList;

    @Column(name = "start_time")
    private Instant startTime;

    @Column(name = "end_time")
    private Instant endTime;

    @JsonIgnoreProperties(value = { "user", "session", "allTimeUserAnalytics" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private SessionAnalytic sessionAnalytic;

    @JsonIgnoreProperties(value = { "tasks", "labels" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private KanbanBoard kanbanBoard;

    @OneToOne
    @JoinColumn(unique = true)
    private PomodoroTimer pomodoroTimer;

    @OneToOne
    @JoinColumn(unique = true)
    private Playlist playlist;

    @OneToMany(mappedBy = "session")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "attachment", "applicationUser", "session" }, allowSetters = true)
    private Set<Message> messages = new HashSet<>();

    @OneToMany(mappedBy = "session")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "internalUser", "allTimeAnalytics", "currentMilestone", "messages", "kanbanTask", "session" },
        allowSetters = true
    )
    private Set<ApplicationUser> users = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Session id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Session title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getJoinCode() {
        return this.joinCode;
    }

    public Session joinCode(String joinCode) {
        this.setJoinCode(joinCode);
        return this;
    }

    public void setJoinCode(String joinCode) {
        this.joinCode = joinCode;
    }

    public String getUserIdList() {
        return this.userIdList;
    }

    public Session userIdList(String userIdList) {
        this.setUserIdList(userIdList);
        return this;
    }

    public void setUserIdList(String userIdList) {
        this.userIdList = userIdList;
    }

    public Instant getStartTime() {
        return this.startTime;
    }

    public Session startTime(Instant startTime) {
        this.setStartTime(startTime);
        return this;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Instant getEndTime() {
        return this.endTime;
    }

    public Session endTime(Instant endTime) {
        this.setEndTime(endTime);
        return this;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }

    public SessionAnalytic getSessionAnalytic() {
        return this.sessionAnalytic;
    }

    public void setSessionAnalytic(SessionAnalytic sessionAnalytic) {
        this.sessionAnalytic = sessionAnalytic;
    }

    public Session sessionAnalytic(SessionAnalytic sessionAnalytic) {
        this.setSessionAnalytic(sessionAnalytic);
        return this;
    }

    public KanbanBoard getKanbanBoard() {
        return this.kanbanBoard;
    }

    public void setKanbanBoard(KanbanBoard kanbanBoard) {
        this.kanbanBoard = kanbanBoard;
    }

    public Session kanbanBoard(KanbanBoard kanbanBoard) {
        this.setKanbanBoard(kanbanBoard);
        return this;
    }

    public PomodoroTimer getPomodoroTimer() {
        return this.pomodoroTimer;
    }

    public void setPomodoroTimer(PomodoroTimer pomodoroTimer) {
        this.pomodoroTimer = pomodoroTimer;
    }

    public Session pomodoroTimer(PomodoroTimer pomodoroTimer) {
        this.setPomodoroTimer(pomodoroTimer);
        return this;
    }

    public Playlist getPlaylist() {
        return this.playlist;
    }

    public void setPlaylist(Playlist playlist) {
        this.playlist = playlist;
    }

    public Session playlist(Playlist playlist) {
        this.setPlaylist(playlist);
        return this;
    }

    public Set<Message> getMessages() {
        return this.messages;
    }

    public void setMessages(Set<Message> messages) {
        if (this.messages != null) {
            this.messages.forEach(i -> i.setSession(null));
        }
        if (messages != null) {
            messages.forEach(i -> i.setSession(this));
        }
        this.messages = messages;
    }

    public Session messages(Set<Message> messages) {
        this.setMessages(messages);
        return this;
    }

    public Session addMessages(Message message) {
        this.messages.add(message);
        message.setSession(this);
        return this;
    }

    public Session removeMessages(Message message) {
        this.messages.remove(message);
        message.setSession(null);
        return this;
    }

    public Set<ApplicationUser> getUsers() {
        return this.users;
    }

    public void setUsers(Set<ApplicationUser> applicationUsers) {
        if (this.users != null) {
            this.users.forEach(i -> i.setSession(null));
        }
        if (applicationUsers != null) {
            applicationUsers.forEach(i -> i.setSession(this));
        }
        this.users = applicationUsers;
    }

    public Session users(Set<ApplicationUser> applicationUsers) {
        this.setUsers(applicationUsers);
        return this;
    }

    public Session addUsers(ApplicationUser applicationUser) {
        this.users.add(applicationUser);
        applicationUser.setSession(this);
        return this;
    }

    public Session removeUsers(ApplicationUser applicationUser) {
        this.users.remove(applicationUser);
        applicationUser.setSession(null);
        return this;
    }

    public Session() {
        this.title = "No Title";
        this.joinCode = null;
        this.userIdList = null;
        this.startTime = null;
        this.endTime = null;
        this.sessionAnalytic = null;
        this.kanbanBoard = null;
        this.pomodoroTimer = null;
        this.playlist = null;
        this.messages = null;
        this.users = null;
    }

    public String generateJoinCode() {
        Random random = new Random();
        int number = 10000 + random.nextInt(90000); // Generate a random number between 10000 and 99999
        String joinCode = String.valueOf(number);
        return joinCode;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Session)) {
            return false;
        }
        return id != null && id.equals(((Session) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Session{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", joinCode='" + getJoinCode() + "'" +
            ", userIdList='" + getUserIdList() + "'" +
            ", startTime='" + getStartTime() + "'" +
            ", endTime='" + getEndTime() + "'" +
            "}";
    }
}
