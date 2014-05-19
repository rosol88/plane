package org.tpsi.plane.core.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;

import org.tpsi.plane.core.cfg.CustomNamingStrategy;

@Entity
public class User
{
    @Id
    @GeneratedValue
    private Long id;

    @Column( unique = true )
    private String userName;

    private String password;

    private String firstName;

    private String lastName;

    @ElementCollection( fetch = FetchType.EAGER )
    @CollectionTable( name = CustomNamingStrategy.TABLE_PREFIX + "roles", joinColumns = @JoinColumn( name = "user_id" ) )
    @Column( name = "role_name" )
    private Set<String> roles;

    public User()
    {
        super();
    }

    public User( String userName, String password, String... roles )
    {
        super();
        this.userName = userName;
        this.password = password;
        this.roles = new HashSet<String>();
        for ( String role : roles )
        {
            this.roles.add( role );
        }
    }

    public Long getId()
    {
        return id;
    }

    public void setId( Long id )
    {
        this.id = id;
    }

    public String getUserName()
    {
        return userName;
    }

    public void setUserName( String userName )
    {
        this.userName = userName;
    }

    public String getPassword()
    {
        return password;
    }

    public void setPassword( String password )
    {
        this.password = password;
    }

    public Set<String> getRoles()
    {
        return roles;
    }

    public void setRoles( Set<String> roles )
    {
        this.roles = roles;
    }

    public String getFirstName()
    {
        return firstName;
    }

    public void setFirstName( String firstName )
    {
        this.firstName = firstName;
    }

    public String getLastName()
    {
        return lastName;
    }

    public void setLastName( String lastName )
    {
        this.lastName = lastName;
    }

    @Override
    public String toString()
    {
        return "User [id=" + id + ", userName=" + userName + ", password=" + password + ", firstName=" + firstName + ", lastName=" + lastName
            + ", roles=" + roles + "]";
    }

    public void addRole( String role )
    {
        if ( roles == null )
        {
            roles = new HashSet<String>();
        }
        roles.add( role );
    }

}
