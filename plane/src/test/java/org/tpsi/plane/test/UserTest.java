package org.tpsi.plane.test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.support.AnnotationConfigContextLoader;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;
import org.testng.Assert;
import org.testng.annotations.Test;
import org.tpsi.plane.core.cfg.AppConfig;
import org.tpsi.plane.core.model.User;
import org.tpsi.plane.core.repo.UserRepo;

@Test
@ContextConfiguration( loader = AnnotationConfigContextLoader.class, classes = AppConfig.class )
public class UserTest
    extends AbstractTestNGSpringContextTests
{
    @Autowired
    private UserRepo ur;

    @Test
    public void create()
    {
        User user = new User( "u1", "pass", "ROLE_ADMIN", "ROLE_USER" );
        ur.save( user );

        user = ur.findByUserName( "u1" );
        Assert.assertEquals( "u1", user.getUserName() );
        Assert.assertEquals( 2, user.getRoles().size() );
    }
}
