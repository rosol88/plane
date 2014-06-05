package org.tpsi.plane.core.security;

import org.springframework.stereotype.Service;
import org.tpsi.plane.core.model.User;

@Service( "digestUserService" )
public class DigestUserDetailsService
    extends HibernateUserDetailsService
{

    protected String getPassword( User user )
    {
        return user.getPlainPass();
    }

}
