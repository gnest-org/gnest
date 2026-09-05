import { DataSource, EntityManager, ObjectLiteral } from 'typeorm';
import { AppDataSource } from '../config';

export async function GetById(entityName: string, id: number) {
  const repository = AppDataSource.getRepository(entityName);
  try {
    const result = await repository.findOne({
      where: { id: id }
    });
    if (!result) return null;
    else return result;
  } catch (error) {
    logging.error('Error fetching data:', error);
    throw new Error(
      `Error while getting ${entityName} by id.${id}: ${
        error instanceof Error ? error.message : 'Unexpected error'
      }`
    );
  }
}

export async function GetAll(entityName: string) {
  const repository = AppDataSource.getRepository(entityName);
  try {
    const result = await repository.find();
    return result;
  } catch (error) {
    logging.error('Error fetching data:', error);
    throw new Error(
      `Error while getting all ${entityName}: ${
        error instanceof Error ? error.message : 'Unexpected error'
      }`
    );
  }
}

export async function Query(entityName: string, query: any) {
  const repository = AppDataSource.getRepository(entityName);
  try {
    const queryBuilder = repository.createQueryBuilder(entityName);
    let index = 0;
    for (const [key, value] of Object.entries(query)) {
      const paramKey = `param${index++}`;
      if (typeof value === 'string')
        queryBuilder.andWhere(`${entityName}.${key} ILIKE :${paramKey}`, {
          [paramKey]: `%${value}%`
        });
      else queryBuilder.andWhere(`${entityName}.${key} = :${paramKey}`, { [paramKey]: value });
    }
    const result = await queryBuilder.getMany();
    if (result.length === 0) return null;
    else return result;
  } catch (error) {
    logging.error('Error fetching data:', error);
    throw new Error(
      `Error while getting ${entityName} by query.${query}: ${
        error instanceof Error ? error.message : 'Unexpected error'
      }`
    );
  }
}

export async function Create(entityName: string, data: any) {
  const repository = AppDataSource.getRepository(entityName);
  try {
    const createEntity = await repository.create({ ...data });
    const result = await repository.save(createEntity);
    return result;
  } catch (error) {
    logging.error('Error fetching data:', error);
    throw new Error(
      `Error while creating data ${entityName} : ${
        error instanceof Error ? error.message : 'Unexpected error'
      }`
    );
  }
}

export async function Update(entityName: string, id: number, data: any) {
  const repository = AppDataSource.getRepository(entityName);
  try {
    const result = await repository.findOne({
      where: { id: id }
    });
    if (!result) return null;
    else {
      const entityUpdated = repository.merge(result, data);
      await repository.save(entityUpdated);
      return entityUpdated;
    }
  } catch (error) {
    logging.error('Error fetching data:', error);
    throw new Error(
      `Error while updatind ${entityName} by id.${id}: ${
        error instanceof Error ? error.message : 'Unexpected error'
      }`
    );
  }
}

export async function Delete(entityName: string, id: number) {
  const repository = AppDataSource.getRepository(entityName);
  try {
    const result = await repository.findOne({
      where: { id: id }
    });
    if (!result) return null;
    else {
      const res = await repository.delete(id);
      return res.affected === 1;
    }
  } catch (error) {
    logging.error('Error deleting data:', error);
    throw new Error(
      `Error while deleting ${entityName} by id.${id}: ${
        error instanceof Error ? error.message : 'Unexpected error'
      }`
    );
  }
}

export function Transaction<T extends ObjectLiteral>(
  dataSource: DataSource,
  transactionCallback: (manager: EntityManager) => Promise<any>
) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await dataSource.transaction(async (manager) => {
        return transactionCallback(manager);
      });
      args.unshift(result);
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}

export const TypeORM = {
  Query,
  GetAll,
  Update,
  Create,
  Delete,
  GetById,
  Transaction
};
