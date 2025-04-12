import { Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../database/connection.database';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Inject } from '@nestjs/common';
import * as usersSchema from './users.schema';
import { users } from './users.schema';

@Injectable()
export class UsersService {
    constructor(
        @Inject(DATABASE_CONNECTION)
        private readonly db: PostgresJsDatabase<typeof usersSchema>,
    ) {}

    async findAll() {
        return this.db.query.users.findMany();
    }
}
