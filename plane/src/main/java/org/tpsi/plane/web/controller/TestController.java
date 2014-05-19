package org.tpsi.plane.web.controller;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.tpsi.plane.core.model.User;
import org.tpsi.plane.core.repo.UserRepo;

@Controller
public class TestController
{
    private static final Logger log = Logger.getLogger( TestController.class );

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder encoder;

    @RequestMapping( value = "/signup", method = RequestMethod.GET )
    public String signUp()
    {
        return "signup";
    }

    @RequestMapping( value = "/plane", method = RequestMethod.GET )
    public String plane()
    {
        return "testpage";
    }

    @RequestMapping( value = "/login", method = RequestMethod.GET )
    public String login()
    {
        return "login";
    }

    @RequestMapping( value = "/test", method = RequestMethod.GET )
    public String test( Model model )
    {
        model.addAttribute( "name", "adas" );
        return "test";
    }

    @RequestMapping( value = "/signup", method = RequestMethod.POST )
    public String signUp( User user )
    {
        log.debug( user );
        user.addRole( "ROLE_USER" );
        String encoded = DigestUtils.md5DigestAsHex( user.getPassword().getBytes() );
        user.setPassword( encoded );
        userRepo.save( user );
        return "login";
    }
}
