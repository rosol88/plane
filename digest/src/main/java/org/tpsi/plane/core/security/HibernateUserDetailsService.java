package org.tpsi.plane.core.security;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.tpsi.plane.core.model.User;
import org.tpsi.plane.core.repo.UserRepo;

@Service
@Primary
public class HibernateUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepo userRepo;

    private static final Logger log = Logger
	    .getLogger(HibernateUserDetailsService.class);

    @Override
    public UserDetails loadUserByUsername(String userName)
	    throws UsernameNotFoundException {
	try {
	    User user = userRepo.findByUserName(userName);
	    if (user == null) {
		throw new UsernameNotFoundException("not found: " + userName);
	    }
	    List<GrantedAuthority> roles = new ArrayList<GrantedAuthority>();
	    for (String role : user.getRoles()) {
		roles.add(new SimpleGrantedAuthority(role));
	    }
	    return new org.springframework.security.core.userdetails.User(
		    user.getUserName(), getPassword(user), roles);
	} catch (Exception e) {
	    log.error(e, e);
	    throw new RuntimeException(e);
	}

    }

    protected String getPassword(User user) {
	return user.getPassword();
    }

}
