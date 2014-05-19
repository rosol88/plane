package org.tpsi.plane.core.cfg;

import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

@Component
public class ContextHolder
{
    private static ApplicationContext ctx;

    public void setApplicationContext( ApplicationContext ctx )
    {
        ContextHolder.ctx = ctx;
    }

    public static ApplicationContext getContext()
    {
        return ctx;
    }
}
