package org.springframework.security.crypto.bcrypt;

import junit.framework.TestCase;

import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.support.AnnotationConfigContextLoader;
import org.springframework.util.DigestUtils;
import org.testng.annotations.Test;
import org.tpsi.plane.core.cfg.AppConfig;

@Test
@ContextConfiguration( loader = AnnotationConfigContextLoader.class, classes = AppConfig.class )
public class PassTest
    extends TestCase
{

    @Test
    public void create()
    {
        String s = DigestUtils.md5DigestAsHex( "abc".getBytes() );
        System.out.println( s );
    }
}
