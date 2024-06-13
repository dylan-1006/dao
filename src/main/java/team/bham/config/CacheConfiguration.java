package team.bham.config;

import java.time.Duration;
import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;
import org.hibernate.cache.jcache.ConfigSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.*;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.config.cache.PrefixedKeyGenerator;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration =
            Eh107Configuration.fromEhcacheCacheConfiguration(
                CacheConfigurationBuilder
                    .newCacheConfigurationBuilder(Object.class, Object.class, ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                    .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                    .build()
            );
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, team.bham.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, team.bham.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, team.bham.domain.User.class.getName());
            createCache(cm, team.bham.domain.Authority.class.getName());
            createCache(cm, team.bham.domain.User.class.getName() + ".authorities");
            createCache(cm, team.bham.domain.ApplicationUser.class.getName());
            createCache(cm, team.bham.domain.ApplicationUser.class.getName() + ".praises");
            createCache(cm, team.bham.domain.AllTimeUserAnalytics.class.getName());
            createCache(cm, team.bham.domain.AllTimeUserAnalytics.class.getName() + ".sessionAnalytics");
            createCache(cm, team.bham.domain.SessionAnalytic.class.getName());
            createCache(cm, team.bham.domain.Session.class.getName());
            createCache(cm, team.bham.domain.Session.class.getName() + ".messages");
            createCache(cm, team.bham.domain.Session.class.getName() + ".users");
            createCache(cm, team.bham.domain.Message.class.getName());
            createCache(cm, team.bham.domain.Attachment.class.getName());
            createCache(cm, team.bham.domain.Praise.class.getName());
            createCache(cm, team.bham.domain.KanbanBoard.class.getName());
            createCache(cm, team.bham.domain.KanbanBoard.class.getName() + ".tasks");
            createCache(cm, team.bham.domain.KanbanTask.class.getName());
            createCache(cm, team.bham.domain.KanbanTask.class.getName() + ".assignees");
            createCache(cm, team.bham.domain.KanbanTask.class.getName() + ".labels");
            createCache(cm, team.bham.domain.KanbanTask.class.getName() + ".comments");
            createCache(cm, team.bham.domain.KanbanTaskComment.class.getName());
            createCache(cm, team.bham.domain.KanbanLabel.class.getName());
            createCache(cm, team.bham.domain.Milestone.class.getName());
            createCache(cm, team.bham.domain.Milestone.class.getName() + ".rewards");
            createCache(cm, team.bham.domain.Reward.class.getName());
            createCache(cm, team.bham.domain.PomodoroTimer.class.getName());
            createCache(cm, team.bham.domain.Playlist.class.getName());
            createCache(cm, team.bham.domain.Session.class.getName() + ".applicationUsers");
            createCache(cm, team.bham.domain.KanbanBoard.class.getName() + ".kanbanTasks");
            createCache(cm, team.bham.domain.KanbanTask.class.getName() + ".applicationUsers");
            createCache(cm, team.bham.domain.KanbanTask.class.getName() + ".kanbanLabels");
            createCache(cm, team.bham.domain.KanbanTask.class.getName() + ".kanbanTaskComments");
            createCache(cm, team.bham.domain.KanbanLabel.class.getName() + ".tasks");
            createCache(cm, team.bham.domain.ApplicationUser.class.getName() + ".sessionAnalytics");
            createCache(cm, team.bham.domain.KanbanLabel.class.getName() + ".labels");
            createCache(cm, team.bham.domain.KanbanBoard.class.getName() + ".labels");
            createCache(cm, team.bham.domain.KanbanLabel.class.getName() + ".boards");
            createCache(cm, team.bham.domain.ApplicationUser.class.getName() + ".messages");
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        } else {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}
