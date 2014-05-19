package org.tpsi.plane.core.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.tpsi.plane.core.model.History;

public interface HistoryRepo
    extends JpaRepository<History, Long>
{

}
