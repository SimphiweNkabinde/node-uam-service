import Knex from 'knex';
import knexConfig from '../../../knexfile.js';
const knex = Knex(knexConfig);

async function findAll(entity) {
    return knex(entity.name.plural)
        .select('*');

    // let allData;
    // for (let index = 0; index < entity.relations?.length; index++) {
    //     const relation = entity.relations[index];

    //     const selfNumber = relation.type.split('-')[0] === 'one' ? 'singular' : 'plural';
    //     const relationNumber = relation.type.split('-')[2] === 'one' ? 'singular' : 'plural';

    //     const linkTableName = `${[entity.name[selfNumber], relation.entityName[relationNumber]].sort().join('_')}_links`;
    //     allData = await knex
    //         .select([
    //             ...entity.tableFields.map((fname) => `${entity.name.plural}.${fname} as ${fname}`),
    //             `${relation.entityName.singular}_id`,
    //             `${relation.entityName.plural}.name as ${relation.entityName.singular}_name`,

    //         ])
    //         .leftJoin(linkTableName, `${linkTableName}.${entity.name.singular}_id`, '=', `${entity.name.plural}.id`)
    //         .leftJoin(relation.entityName.plural, `${linkTableName}.${relation.entityName.singular}_id`, '=', `${relation.entityName.plural}.id`)
    //         .from(entity.name.plural);
    //     console.log(allData);
    // }
    // if (!entity.relations?.length) return knex(entity.name.plural).select('*');

    // return allData;

}

async function findOne(entity, filter) {
    const service = await knex(entity.name.plural)
        .select('*')
        .where(filter).first();

    const relationProperties = {};

    for (let index = 0; index < entity.relations?.length; index++) {
        const relation = entity.relations[index];

        const selfNumber = relation.type.split('-')[0] === 'one' ? 'singular' : 'plural';
        const relationNumber = relation.type.split('-')[2] === 'one' ? 'singular' : 'plural';

        const linkTableName = `${[entity.name[selfNumber], relation.entityName[relationNumber]].sort().join('_')}_links`;
        const relationData = await knex
            .select('*')
            .leftJoin(relation.entityName.plural, `${linkTableName}.${relation.entityName.singular}_id`, '=', `${relation.entityName.plural}.id`)
            .from(linkTableName)
            .where({ [`${linkTableName}.${entity.name.singular}_id`]: filter.id });

        relationProperties[relation.entityName[relationNumber]] = relationData;
        if (!!relationData.length && relationNumber === 'singular') {
            // eslint-disable-next-line prefer-destructuring
            relationProperties[relation.entityName[relationNumber]] = relationData[0];
        } else {
            relationProperties[relation.entityName[relationNumber]] = relationData;
        }
    }

    return { ...service, ...relationProperties };
}

export default { findAll, findOne  };
