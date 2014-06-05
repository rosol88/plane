package org.tpsi.plane.web.cfg;

import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;
import org.tpsi.plane.core.cfg.AppConfig;

public class WebAppInitializer extends
	AbstractAnnotationConfigDispatcherServletInitializer {

    @Override
    protected Class<?>[] getRootConfigClasses() {
	return new Class<?>[] { AppConfig.class, SecurityConfig.class };
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
	return new Class<?>[] { DispatcherConfig.class };
    }

    @Override
    protected String[] getServletMappings() {
	return new String[] { "/" };
    }

}
