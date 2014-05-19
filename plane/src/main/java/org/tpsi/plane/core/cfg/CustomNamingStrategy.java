package org.tpsi.plane.core.cfg;

import org.hibernate.cfg.ImprovedNamingStrategy;

@SuppressWarnings( "serial" )
public class CustomNamingStrategy
    extends ImprovedNamingStrategy
{

    public static final String TABLE_PREFIX = "tpsi_";

    @Override
    public String classToTableName( final String className )
    {
        return this.addPrefix( super.classToTableName( className ) );
    }

    @Override
    public String collectionTableName( final String ownerEntity, final String ownerEntityTable, final String associatedEntity,
                                       final String associatedEntityTable, final String propertyName )
    {
        return this.addPrefix( super.collectionTableName( ownerEntity, ownerEntityTable, associatedEntity, associatedEntityTable, propertyName ) );
    }

    @Override
    public String logicalCollectionTableName( final String tableName, final String ownerEntityTable, final String associatedEntityTable,
                                              final String propertyName )
    {
        return this.addPrefix( super.logicalCollectionTableName( tableName, ownerEntityTable, associatedEntityTable, propertyName ) );
    }

    private String addPrefix( final String composedTableName )
    {
        return TABLE_PREFIX + composedTableName.toUpperCase().replace( "_", "" );

    }

}
