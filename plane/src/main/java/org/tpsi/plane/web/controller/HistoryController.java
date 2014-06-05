package org.tpsi.plane.web.controller;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.tpsi.plane.core.model.History;
import org.tpsi.plane.core.repo.HistoryRepo;
import org.tpsi.plane.core.repo.UserRepo;

@Controller
@RequestMapping("history")
public class HistoryController {
    private static final Logger log = Logger.getLogger(HistoryController.class);
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private HistoryRepo historyRepo;

    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    public Long save(@RequestBody History history) {
	// log.debug(SecurityContextHolder.getContext().getAuthentication()
	// .getName());
	historyRepo.save(history);
	return history.getId();
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @ResponseBody
    public History get(@PathVariable Long id) {
	return historyRepo.getOne(id);
    }

    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    public List<History> getAll() {
	return historyRepo.findAll();
    }

}
