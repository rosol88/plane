package org.tpsi.plane.web.cfg;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.www.DigestAuthenticationEntryPoint;
import org.springframework.security.web.authentication.www.DigestAuthenticationFilter;
import org.tpsi.plane.core.security.DigestUserDetailsService;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    protected void configure(AuthenticationManagerBuilder auth)
	    throws Exception {
	DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
	authProvider.setUserDetailsService(digestDetailsService);
	auth.authenticationProvider(authProvider);

    }

    protected void configure(HttpSecurity http) throws Exception {
	http.antMatcher("/**").exceptionHandling()
		.authenticationEntryPoint(digestEntryPoint()).and()
		.authorizeRequests().antMatchers("/**").authenticated().and()
		.addFilter(digestAuthenticationFilter(digestEntryPoint()));
    }

    @Autowired
    private DigestUserDetailsService digestDetailsService;

    @Bean
    public DigestAuthenticationEntryPoint digestEntryPoint() {
	DigestAuthenticationEntryPoint digestAuthenticationEntryPoint = new DigestAuthenticationEntryPoint();
	digestAuthenticationEntryPoint.setKey("acegi");
	digestAuthenticationEntryPoint.setRealmName("Digest Authentication");
	return digestAuthenticationEntryPoint;
    }

    public DigestAuthenticationFilter digestAuthenticationFilter(
	    DigestAuthenticationEntryPoint digestAuthenticationEntryPoint) {
	DigestAuthenticationFilter digestAuthenticationFilter = new DigestAuthenticationFilter();
	digestAuthenticationFilter
		.setAuthenticationEntryPoint(digestEntryPoint());
	digestAuthenticationFilter.setUserDetailsService(digestDetailsService);
	return digestAuthenticationFilter;
    }

}
