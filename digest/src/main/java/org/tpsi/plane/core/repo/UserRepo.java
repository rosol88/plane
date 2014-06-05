package org.tpsi.plane.core.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.tpsi.plane.core.model.User;

public interface UserRepo
    extends JpaRepository<User, Long>
{

    public User findByUserName( String userName );
}
