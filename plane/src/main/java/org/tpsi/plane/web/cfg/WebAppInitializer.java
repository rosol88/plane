package org.tpsi.plane.web.cfg;

import javax.servlet.ServletContext;

import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;
import org.tpsi.plane.core.cfg.AppConfig;

public class WebAppInitializer
    extends AbstractAnnotationConfigDispatcherServletInitializer
{
    @Override
    protected void registerContextLoaderListener( ServletContext servletContext )
    {
        super.registerContextLoaderListener( servletContext );
        servletContext.addListener( new HttpSessionEventPublisher() );
        servletContext.addListener( new SessionCounterListener() );
    }

    @Override
    protected Class<?>[] getRootConfigClasses()
    {
        return new Class<?>[] { AppConfig.class, SecurityConfig.class };
    }

    @Override
    protected Class<?>[] getServletConfigClasses()
    {
        return new Class<?>[] { DispatcherConfig.class };
    }

    @Override
    protected String[] getServletMappings()
    {
        return new String[] { "/" };
    }

}
