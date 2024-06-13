package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.ApplicationUser;
import team.bham.domain.Session;
import team.bham.domain.User;

/**
 * Spring Data JPA repository for the ApplicationUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ApplicationUserRepository extends JpaRepository<ApplicationUser, Long> {
    Optional<ApplicationUser> findByInternalUser(User internalUser);
    List<ApplicationUser> findAllBySession(Session session);

    List<ApplicationUser> findAllBySession_Id(Long sessionID);
}
