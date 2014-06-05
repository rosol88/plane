package org.tpsi.plane.web.cfg;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.tpsi.plane.core.security.HibernateUserDetailsService;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private HibernateUserDetailsService userDetailsService;

    @Autowired
    protected void configure(AuthenticationManagerBuilder auth)
	    throws Exception {
	DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
	authProvider.setUserDetailsService(userDetailsService);
	auth.authenticationProvider(authProvider);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {

	http.authorizeRequests()
		.antMatchers("/presenter/**", "/signup", "/about", "/login")
		.permitAll().antMatchers("/*").authenticated().anyRequest()
		.denyAll().and().formLogin().loginPage("/login").and().csrf()
		.disable().logout().deleteCookies("JSESSIONID")
		.invalidateHttpSession(true).and().sessionManagement()
		.maximumSessions(1).expiredUrl("/plane");
    }

}
