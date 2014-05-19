package org.tpsi.plane.web.cfg;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.authentication.dao.ReflectionSaltSource;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.www.DigestAuthenticationEntryPoint;
import org.springframework.security.web.authentication.www.DigestAuthenticationFilter;
import org.tpsi.plane.core.security.HibernateUserDetailsService;

@Configuration
@EnableWebSecurity
public class SecurityConfig
    extends WebSecurityConfigurerAdapter
{

    @Autowired
    private HibernateUserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    public void configureGlobal( AuthenticationManagerBuilder auth )
        throws Exception
    {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService( userDetailsService );
        auth.authenticationProvider( authProvider );
    }

    @Override
    protected void configure( HttpSecurity http )
        throws Exception
    {
        // http = http.exceptionHandling().authenticationEntryPoint( digestEntryPoint() ).and();
        http =
            http.authorizeRequests().antMatchers( "/presenter/**", "/signup", "/about" ).permitAll().anyRequest().authenticated().and().csrf().disable().formLogin().loginPage( "/login" ).permitAll().and();
        http = http.requiresChannel().anyRequest().requiresSecure().and();
        http = http.logout().deleteCookies( "JSESSIONID" ).invalidateHttpSession( true ).and();
        // http.addFilter( digestAuthenticationFilter( digestEntryPoint() ) );
        http.sessionManagement().maximumSessions( 1 ).and().invalidSessionUrl( "/invalidSession" );
    }

    @Bean
    public DigestAuthenticationEntryPoint digestEntryPoint()
    {
        DigestAuthenticationEntryPoint digestAuthenticationEntryPoint = new DigestAuthenticationEntryPoint();
        digestAuthenticationEntryPoint.setKey( "acegi" );
        digestAuthenticationEntryPoint.setRealmName( "Digest Authentication" );
        return digestAuthenticationEntryPoint;
    }

    public DigestAuthenticationFilter digestAuthenticationFilter( DigestAuthenticationEntryPoint digestAuthenticationEntryPoint )
    {
        DigestAuthenticationFilter digestAuthenticationFilter = new DigestAuthenticationFilter();
        digestAuthenticationFilter.setAuthenticationEntryPoint( digestEntryPoint() );
        digestAuthenticationFilter.setUserDetailsService( userDetailsService );
        return digestAuthenticationFilter;
    }

}
