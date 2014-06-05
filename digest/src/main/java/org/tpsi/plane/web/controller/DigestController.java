package org.tpsi.plane.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class DigestController {

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String index() {
	return "documentation";
    }

    @RequestMapping(value = "/documentation")
    public String documentation(Model model) {
	return "documentation";
    }

}
