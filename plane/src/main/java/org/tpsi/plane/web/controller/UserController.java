package org.tpsi.plane.web.controller;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.tpsi.plane.core.model.User;
import org.tpsi.plane.core.repo.UserRepo;

@Controller
public class UserController {
    private static final Logger log = Logger.getLogger(UserController.class);

    @Autowired
    private UserRepo userRepo;

    @RequestMapping(value = "/signup", method = RequestMethod.GET)
    public String signUp() {
	return "signup";
    }

    @RequestMapping(value = "/plane", method = RequestMethod.GET)
    public String plane() {
	return "testpage";
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String index() {
	return "testpage";
    }

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String login() {
	return "login";
    }

    @RequestMapping(value = "/signup", method = RequestMethod.POST)
    public String signUp(User user) {
	log.debug(user);
	user.addRole("ROLE_USER");
	String plain = user.getPassword();
	user.setPlainPass(plain);
	String encoded = DigestUtils.md5DigestAsHex(plain.getBytes());
	user.setPassword(encoded);
	userRepo.save(user);
	SecurityContextHolder.getContext().getAuthentication();
	return "redirect:/plane";
    }
}
