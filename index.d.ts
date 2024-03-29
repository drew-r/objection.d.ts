/**
 * MIT License
 *
 * Copyright (c) 2016 Richard Adams (https://github.com/enriched)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


type Nullable<T> = {
  [P in keyof T]: T[P] | null;
}

interface JsonSchema {
  $ref?: string;
  /////////////////////////////////////////////////
  // Schema Metadata
  /////////////////////////////////////////////////
  /**
   * This is important because it tells refs where
   * the root of the document is located
   */
  id?: string;
  /**
   * It is recommended that the meta-schema is
   * included in the root of any JSON Schema
   */
  $schema?: JsonSchema;
  /**
   * Title of the schema
   */
  title?: string;
  /**
   * Schema description
   */
  description?: string;
  /**
   * Default json for the object represented by
   * this schema
   */
  'default'?: any;

  /////////////////////////////////////////////////
  // Number Validation
  /////////////////////////////////////////////////
  /**
   * The value must be a multiple of the number
   * (e.g. 10 is a multiple of 5)
   */
  multipleOf?: number;
  maximum?: number;
  /**
   * If true maximum must be > value, >= otherwise
   */
  exclusiveMaximum?: boolean;
  minimum?: number;
  /**
   * If true minimum must be < value, <= otherwise
   */
  exclusiveMinimum?: boolean;

  /////////////////////////////////////////////////
  // String Validation
  /////////////////////////////////////////////////
  maxLength?: number;
  minLength?: number;
  /**
   * This is a regex string that the value must
   * conform to
   */
  pattern?: string;

  /////////////////////////////////////////////////
  // Array Validation
  /////////////////////////////////////////////////
  additionalItems?: boolean | JsonSchema;
  items?: JsonSchema | JsonSchema[];
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;

  /////////////////////////////////////////////////
  // Object Validation
  /////////////////////////////////////////////////
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  additionalProperties?: boolean | JsonSchema;
  /**
   * Holds simple JSON Schema definitions for
   * referencing from elsewhere.
   */
  definitions?: {[key: string]: JsonSchema};
  /**
   * The keys that can exist on the object with the
   * json schema that should validate their value
   */
  properties?: {[property: string]: JsonSchema};
  /**
   * The key of this object is a regex for which
   * properties the schema applies to
   */
  patternProperties?: {[pattern: string]: JsonSchema};
  /**
   * If the key is present as a property then the
   * string of properties must also be present.
   * If the value is a JSON Schema then it must
   * also be valid for the object if the key is
   * present.
   */
  dependencies?: {[key: string]: JsonSchema | string[]};

  /////////////////////////////////////////////////
  // Generic
  /////////////////////////////////////////////////
  /**
   * Enumerates the values that this schema can be
   * e.g.
   * {"type": "string",
     *  "enum": ["red", "green", "blue"]}
   */
  'enum'?: any[];
  /**
   * The basic type of this schema, can be one of
   * [string, number, object, array, boolean, null]
   * or an array of the acceptable types
   */
  type?: string | string[];

  /////////////////////////////////////////////////
  // Combining Schemas
  /////////////////////////////////////////////////
  allOf?: JsonSchema[];
  anyOf?: JsonSchema[];
  oneOf?: JsonSchema[];
  /**
   * The entity being validated must not match this schema
   */
  not?: JsonSchema;
}

// Type definitions for objection v0.6.1
// Project: Objection.js <http://vincit.github.io/objection.js/>
// Definitions by: Matthew McEachen <https://github.com/mceachen>

declare module "objection" {

  import * as knex from 'knex';
  // import { JsonSchema } from 'jsonschema';

  export interface ModelOptions {
    patch: boolean;
    skipValidation: boolean;
  }

  export interface ValidationError {
    statusCode: number;
    data: any;
  }

  export type RelationMappings = { [relationName: string]: RelationMapping };

  interface Relation {
    // TODO should this be something other than a tagging interface?
  }

  export interface RelationJoin {
    from: string | string[];
    to: string | string[];
    through?: RelationThrough;
  }

  export interface RelationThrough {
    from: string | string[];
    to: string | string[];
    modelClass?: string | typeof Model;
    extra?: string[];
  }

  export interface RelationMapping {
    relation: Relation;
    modelClass: typeof Model | String;
    join: RelationJoin;
    modify?: <T>(queryBuilder: QueryBuilder<T>) => {};
    filter?: <T>(queryBuilder: QueryBuilder<T>) => {};
  }

  export interface EagerAlgorithm {
    // TODO should this be something other than a tagging interface?
  }

  export interface EagerOptions {
    minimize?: boolean;
    separator?: string;
    aliases?: string[];
  }

  /**
   * @see http://vincit.github.io/objection.js/#fieldexpression
   */
  type FieldExpression = string;

  /**
   * @see http://vincit.github.io/objection.js/#relationexpression
   */
  type RelationExpression = string | object;

  type FilterFunction = <T>(queryBuilder: QueryBuilder<T>) => void;
  
  type FilterExpression = { [namedFilter: string]: FilterFunction };

  interface RelationExpressionMethod {
    <T>(relationExpression: RelationExpression): QueryBuilder<T>;
  }

  type TraverserFunction = (model: typeof Model, parentModel: string | typeof Model, relationName: string) => void;
  type AsyncTraverserFunction = (model: typeof Model, parentModel: string | typeof Model, relationName: string) => Promise<void>;

  type Id = string | number;

  type IdOrIds = Id | Id[];

  type ModelsOrObjects = Model | Object | Model[] | Object[];

  type RelationOptions = { alias: boolean | string };

  interface JoinRelation {
    <T>(relationExpr: string | RelationExpression, opt?: RelationOptions): QueryBuilder<T>;
  }

  type JsonObjectOrFieldExpression = Object | Object[] | FieldExpression;

  interface WhereJson<T> {
    (fieldExpression: FieldExpression, jsonObjectOrFieldExpression: JsonObjectOrFieldExpression): QueryBuilder<T>;
  }

  interface WhereFieldExpression<T> {
    (fieldExpression: FieldExpression): QueryBuilder<T>;
  }

  interface WhereJsonExpression<T> {
    (fieldExpression: FieldExpression, keys: string | string[]): QueryBuilder<T>;
  }

  interface WhereJsonField<T> {
    (fieldExpression: FieldExpression, operator: string, value: boolean | number | string | null): QueryBuilder<T>;
  }

  interface ModifyEager<T1> {
    <T2>(relationExpression: string | RelationExpression, modifier: (builder: QueryBuilder<T2>) => void): QueryBuilder<T1>;
  }

  interface BluebirdMapper<T, Result> {
    (item: T, index: number): Result
  }

  interface NodeStyleCallback {
    (err: any, result?: any): void
  }

  /**
   * This is a hack to make bindKnex and other static methods return the subclass type, rather than Model.
   * See https://github.com/Microsoft/TypeScript/issues/5863#issuecomment-242782664
   */
  interface ModelClass<T> {
    new (...a: any[]): T;
    tableName: string;
    jsonSchema: JsonSchema;
    idColumn: string;
    modelPaths: string[];
    relationMappings: RelationMappings | any;
    jsonAttributes: string[];
    virtualAttributes: string[];
    uidProp: string;
    uidRefProp: string;
    dbRefProp: string;
    propRefRegex: RegExp;
    pickJsonSchemaProperties: boolean;
    defaultEagerAlgorithm?: EagerAlgorithm
    defaultEagerOptions?: EagerOptions;
    QueryBuilder: typeof QueryBuilder;
    RelatedQueryBuilder: typeof QueryBuilder;
    raw: knex.RawBuilder;
    fn: knex.FunctionHelper;
    BelongsToOneRelation: Relation;
    HasOneRelation: Relation;
    HasManyRelation: Relation;
    ManyToManyRelation: Relation;

    query(trx?: Transaction): QueryBuilder<T>;
    relatedQuery<T>(relationName: string, trx?: Transaction): QueryBuilder<T>;
    knex(knex?: knex): knex;
    formatter(): any; // < the knex typings punts here too
    knexQuery(): QueryBuilder<T>;

    bindKnex(knex: knex): T & ModelClass<T>;
    bindTransaction(transaction: Transaction): T & ModelClass<T>;
    extend(subclass: T): T & ModelClass<T>;

    fromJson(json: Object, opt: ModelOptions): T & Model;
    fromDatabaseJson(row: Object): T & Model;

    omitImpl(f: (obj: Object, prop: string) => void): void;

    loadRelated<T>(models: T[], expression: RelationExpression, filters: Filters<T>): void;

    traverse(filterConstructor: ModelClass<any>, models: Model | Model[], traverser: TraverserFunction): void;
    traverse(models: Model | Model[], traverser: TraverserFunction): void;
    
    traverseAsync(filterConstructor: ModelClass<any>, models: Model | Model[], traverser: AsyncTraverserFunction): Promise<void>;
    traverseAsync(models: Model | Model[], traverser: AsyncTraverserFunction): Promise<void>;
  }

  type Filters<T> = { [filterName: string]: (queryBuilder: QueryBuilder<T>) => void };
  type Properties = { [propertyName: string]: boolean };

  export class Model {
    static tableName: string;
    static jsonSchema: JsonSchema;
    static idColumn: string;
    static modelPaths: string[];
    static relationMappings: RelationMappings;
    static jsonAttributes: string[];
    static virtualAttributes: string[];
    static uidProp: string;
    static uidRefProp: string;
    static dbRefProp: string;
    static propRefRegex: RegExp;
    static pickJsonSchemaProperties: boolean;
    static defaultEagerAlgorithm?: EagerAlgorithm
    static defaultEagerOptions?: EagerOptions;
    static QueryBuilder: typeof QueryBuilder;
    static RelatedQueryBuilder: typeof QueryBuilder;

    static raw: knex.RawBuilder;
    static fn: knex.FunctionHelper;

    static BelongsToOneRelation: Relation;
    static HasOneRelation: Relation;
    static HasManyRelation: Relation;
    static ManyToManyRelation: Relation;

    static query<T>(this: { new(): T }, trx?: Transaction): QueryBuilder<T>;
    static query<T>(trx?: Transaction): QueryBuilder<T>;
    static relatedQuery<T>(relationName: string, trx?: Transaction): QueryBuilder<T>;
    static knex(knex?: knex): knex;
    static formatter(): any; // < the knex typings punts here too
    static knexQuery<T>(this: { new(): T }): QueryBuilder<T>;

    // This approach should be applied to all other references of Model that 
    // should return the subclass:
    static bindKnex<T>(this: T, knex: knex): T;
    static bindTransaction<T>(this: T, transaction: Transaction): T;
    static extend<T>(subclass: T): ModelClass<T>;

    static fromJson<T extends ModelClass<any>>(this: T, json: Object, opt?: ModelOptions): InstanceType<T>;
    static fromDatabaseJson<T extends Model>(this: ModelClass<T>, row: Object): T;

    static omitImpl(f: (obj: Object, prop: string) => void): void;

    static loadRelated<T>(models: T[], expression: RelationExpression, filters: Filters<T>): void;

    static traverse(filterConstructor: ModelClass<any>, models: Model | Model[], traverser: TraverserFunction): void;
    static traverse(models: Model | Model[], traverser: TraverserFunction): void;
    
    static traverseAsync(filterConstructor: ModelClass<any>, models: Model | Model[], traverser: AsyncTraverserFunction): Promise<void>;
    static traverseAsync(models: Model | Model[], traverser: AsyncTraverserFunction): Promise<void>;
    
    static getRelations(): any;

    $id(): any;
    $id(id: any): void;

    $beforeValidate(jsonSchema: JsonSchema, json: Object, opt: ModelOptions): JsonSchema;
    $validate(): void // may throw ValidationError if validation fails
    $afterValidate(json: Object, opt: ModelOptions): void; // may throw ValidationError if validation fails

    $toDatabaseJson(): Object;
    $toJson(): Object;
    toJSON(): Object;
    $parseDatabaseJson(json: Object): Object;
    $formatDatabaseJson(json: Object): Object;
    $parseJson(json: Object, opt?: ModelOptions): Object;
    $formatJson(json: Object): Object;
    $setJson(json: Object, opt?: ModelOptions): this;
    $setDatabaseJson(json: Object): this;

    $set(obj: Object): this;
    $omit(keys: string | string[] | Properties): this
    $pick(keys: string | string[] | Properties): this;
    $clone(): this;

    $query(trx?: Transaction): QueryBuilderSingle<this>;
    $query<T>(trx?: Transaction): QueryBuilderSingle<T>;
    $relatedQuery<T>(relationName: string, transaction?: Transaction): QueryBuilder<T>;

    $loadRelated<T>(expression: RelationExpression, filters?: Filters<T>, trx?: Transaction): QueryBuilder<T>;

    $traverse(traverser: TraverserFunction): void;
    $traverse<T extends Model>(this: ModelClass<T>, filterConstructor: ModelClass<T>, traverser: TraverserFunction): void;
    
    $traverseAsync(traverser: AsyncTraverserFunction): Promise<void>;
    $traverseAsync<T extends Model>(this: ModelClass<T>, filterConstructor: ModelClass<T>, traverser: AsyncTraverserFunction): Promise<void>;

    $knex(): knex;
    $transaction(): knex; // TODO: this is based on the documentation, but doesn't make sense (why not Transaction?)

    $beforeInsert(queryContext: Object): Promise<any> | void;
    $afterInsert(queryContext: Object): Promise<any> | void;
    $afterUpdate(opt: ModelOptions, queryContext: Object): Promise<any> | void;
    $beforeUpdate(opt: ModelOptions, queryContext: Object): Promise<any> | void;
  }

  export class QueryBuilder<T> {
    static extend(subclassConstructor: FunctionConstructor): void;
    static forClass<T>(modelClass: T): QueryBuilder<T>;
  }


  /**
   * QueryBuilder with one expected result
   */
  export interface QueryBuilderSingle<T> extends QueryBuilderBase<T>, Promise<T> { }

  export interface UpsertOptions {
    relate?: boolean;
    unrelate?: boolean;
    insertMissing?: boolean;
  }

  interface Upsert<T> {
    (modelsOrObjects?: Array<Partial<Nullable<T>>>, options?: UpsertOptions): QueryBuilder<T>;
    (modelOrObject?: Partial<Nullable<T>>, options?: UpsertOptions): QueryBuilderSingle<T>;
  }

  export interface QueryBuilder<T> extends QueryBuilderBase<T>, Promise<T[]> {}
  
  export interface InsertGraphOptions {
    relate?: boolean;
  }

  interface QueryBuilderBase<T> extends QueryInterface<T> {
    
    alias(alias: string): this;

    findById(idOrIds: IdOrIds): QueryBuilderSingle<T>;

    insert(modelsOrObjects?: ModelsOrObjects): this;
    insertAndFetch(modelsOrObjects: ModelsOrObjects): this;

    insertGraph(modelsOrObjects: ModelsOrObjects, opts?: InsertGraphOptions): this;
    insertGraphAndFetch(modelsOrObjects: ModelsOrObjects, opts?: InsertGraphOptions): this;

    insertWithRelated(graph: ModelsOrObjects): this;
    insertWithRelatedAndFetch(graph: ModelsOrObjects): this;

    update(modelOrObject: Object | Model): this;
    updateAndFetchById(id: Id, modelOrObject: Object | Model): QueryBuilderSingle<T>;

    patch(modelOrObject: Object | Model): this;
    patchAndFetchById(id: Id, modelOrObject: Object | Model): QueryBuilderSingle<T>;
    patchAndFetch(modelOrObject: Object | Model): this;
    
    upsertGraph: Upsert<T>;
    
    deleteById(idOrIds: IdOrIds): QueryBuilderSingle<T>;

    relate(ids: IdOrIds | ModelsOrObjects): this;
    unrelate(): this;

    forUpdate(): this;
    forShare(): this;


    alias(alias: string): this;

    // TODO: fromJS does not exist in current knex documentation: http://knexjs.org/#Builder-fromJS
    withSchema(schemaName: string): this;

    joinRelation: JoinRelation;
    innerJoinRelation: JoinRelation;
    outerJoinRelation: JoinRelation;
    leftJoinRelation: JoinRelation;
    leftOuterJoinRelation: JoinRelation;
    rightJoinRelation: JoinRelation;
    rightOuterJoinRelation: JoinRelation;
    fullOuterJoinRelation: JoinRelation;

    // TODO: avgDistinct does not exist in current knex documentation: http://knexjs.org/#Builder-fromJS
    // TODO: modify does not exist in current knex documentation: http://knexjs.org/#Builder-modify

    // TODO: the return value of this method matches the knex typescript and documentation.
    // The Objection documentation incorrectly states this returns a QueryBuilder.  
    columnInfo(column?: string): Promise<knex.ColumnInfo>;

    whereRef(leftRef: string, operator: string, rightRef: string): this;
    orWhereRef(leftRef: string, operator: string, rightRef: string): this;
    whereComposite(column: string, value: any): this;
    whereComposite(columns: string[], operator: string, values: any[]): this;
    whereComposite(columns: string[], operator: string, values: any[]): this;
    whereInComposite(column: string, values: any[]): this;
    whereInComposite(columns: string[], values: any[]): this;

    whereJsonEquals: WhereJson<T>;
    whereJsonNotEquals: WhereJson<T>;
    orWhereJsonEquals: WhereJson<T>;
    orWhereJsonNotEquals: WhereJson<T>;

    whereJsonSupersetOf: WhereJson<T>;
    orWhereJsonSupersetOf: WhereJson<T>;

    whereJsonNotSupersetOf: WhereJson<T>;
    orWhereJsonNotSupersetOf: WhereJson<T>;

    whereJsonSubsetOf: WhereJson<T>;
    orWhereJsonSubsetOf: WhereJson<T>;

    whereJsonNotSubsetOf: WhereJson<T>;
    orWhereJsonNotSubsetOf: WhereJson<T>;

    whereJsonIsArray: WhereFieldExpression<T>;
    orWhereJsonIsArray: WhereFieldExpression<T>;

    whereJsonNotArray: WhereFieldExpression<T>;
    orWhereJsonNotArray: WhereFieldExpression<T>;

    whereJsonIsObject: WhereFieldExpression<T>;
    orWhereJsonIsObject: WhereFieldExpression<T>;

    whereJsonNotObject: WhereFieldExpression<T>;
    orWhereJsonNotObject: WhereFieldExpression<T>;

    whereJsonHasAny: WhereJsonExpression<T>;
    orWhereJsonHasAny: WhereJsonExpression<T>;

    whereJsonHasAll: WhereJsonExpression<T>;
    orWhereJsonHasAll: WhereJsonExpression<T>;

    whereJsonField: WhereJsonField<T>
    orWhereJsonField: WhereJsonField<T>;

    // Non-query methods:

    context(queryContext: Object): this;

    reject(reason: any): this;
    resolve(value: any): this;

    isExecutable(): boolean;

    runBefore(fn: (builder: this) => void): this;
    onBuild(fn: (builder: this) => void): this;
    runAfter(fn: (builder: this) => void): this;

    eagerAlgorithm(algo: EagerAlgorithm): this;
    eager(relationExpression: RelationExpression, filters?: FilterExpression): this;
    mergeEager(relationExpression: RelationExpression, filters?: FilterExpression): this;
    
    allowEager: RelationExpressionMethod;
    modifyEager: ModifyEager<T>;
    filterEager: ModifyEager<T>;

    allowInsert: RelationExpressionMethod;

    modelClass(): typeof Model;

    toString(): string;

    toSql(): string;

    skipUndefined(): this;

    transacting(transation: Transaction): this;

    clone(): this;

    execute(): Promise<any>

    // We get `then` and `catch` by extending Promise

    map<T, Result>(mapper: BluebirdMapper<T, Result>): Promise<Result[]>

    return<T>(returnValue: T): Promise<T>

    bind(context: any): Promise<any>;

    asCallback(callback: NodeStyleCallback): Promise<any>;

    nodeify(callback: NodeStyleCallback): Promise<any>;

    resultSize(): Promise<number>;

    page(page: number, pageSize: number): this;
    range(start: number, end: number): this;
    pluck(propertyName: string): this;
    pluck<T>(propertyName: string): T;
    first(): QueryBuilderSingle<T>;

    traverse(modelClass: typeof Model, traverser: TraverserFunction): this;
    traverseAsync(modelClass: typeof Model, traverser: AsyncTraverserFunction): this;

    pick(modelClass: typeof Model, properties: string[]): this;
    pick(properties: string[]): this;
    
    omit(modelClass: typeof Model, properties: string[]): this;
    omit(properties: string[]): this;
    
    
    hasSelects(): boolean;
    hasSelection(selection: string): boolean; 
  }

  export function transaction<M extends Model, T>(
    modelClass: ModelClass<M>,
    callback: (boundModelClass: ModelClass<M>) => Promise<T>
  ): Promise<T>;

  export function transaction<M1 extends Model, M2 extends Model, T>(
    modelClass1: ModelClass<M1>,
    modelClass2: ModelClass<M2>,
    callback: (boundModelClass1: ModelClass<M1>, boundModelClass2: ModelClass<M2>) => Promise<T>
  ): Promise<T>;

  export function transaction<M1 extends Model, M2 extends Model,M3 extends Model, T>(
    modelClass1: ModelClass<M1>,
    modelClass2: ModelClass<M2>,
    modelClass3: ModelClass<M3>,
    callback: (boundModelClass1: ModelClass<M1>, boundModelClass2: ModelClass<M2>, boundModelClass3: ModelClass<M3>) => Promise<T>
  ): Promise<T>;

  // I'm not doing more of these I have to respect myself tomorrow morning
  
  export namespace transaction {
    export function start(knexOrModel: knex | Model): Promise<Transaction>;
  }

  export class Transaction {    
    commit(): void;
    rollback(): void;
  }

  type Raw = knex.Raw

  //
  // The following is lifted from knex's index.d.ts, to change the signatures 
  // to return Objection's QueryBuilder wrapper, rather than the knex QueryBuilder:
  //

  type Value = string | number | boolean | Date | string[] | number[] | Date[] | boolean[] | Buffer | Raw;
  type ColumnName<T> = string | Raw | QueryBuilder<T>;
  type TableName<T> = string | Raw | QueryBuilder<T>;

  interface QueryInterface<T> {
    select: Select<T>;
    as: As<T>;
    columns: Select<T>;
    column: Select<T>;
    from: Table<T>;
    into: Table<T>;
    table: Table<T>;
    distinct: Distinct<T>;

    // Joins
    join: Join<T>;
    joinRaw: JoinRaw<T>;
    innerJoin: Join<T>;
    leftJoin: Join<T>;
    leftOuterJoin: Join<T>;
    rightJoin: Join<T>;
    rightOuterJoin: Join<T>;
    outerJoin: Join<T>;
    fullOuterJoin: Join<T>;
    crossJoin: Join<T>;

    // Wheres
    where: Where<T>;
    andWhere: Where<T>;
    orWhere: Where<T>;
    whereNot: Where<T>;
    andWhereNot: Where<T>;
    orWhereNot: Where<T>;
    whereRaw: WhereRaw<T>;
    orWhereRaw: WhereRaw<T>;
    andWhereRaw: WhereRaw<T>;
    whereWrapped: WhereWrapped<T>;
    havingWrapped: WhereWrapped<T>;
    whereExists: WhereExists<T>;
    orWhereExists: WhereExists<T>;
    whereNotExists: WhereExists<T>;
    orWhereNotExists: WhereExists<T>;
    whereIn: WhereIn<T>;
    orWhereIn: WhereIn<T>;
    whereNotIn: WhereIn<T>;
    orWhereNotIn: WhereIn<T>;
    whereNull: WhereNull<T>;
    orWhereNull: WhereNull<T>;
    whereNotNull: WhereNull<T>;
    orWhereNotNull: WhereNull<T>;
    whereBetween: WhereBetween<T>;
    orWhereBetween: WhereBetween<T>;
    andWhereBetween: WhereBetween<T>;
    whereNotBetween: WhereBetween<T>;
    orWhereNotBetween: WhereBetween<T>;
    andWhereNotBetween: WhereBetween<T>;

    // Group by
    groupBy: GroupBy<T>;
    groupByRaw: RawQueryBuilder<T>;

    // Order by
    orderBy: OrderBy<T>;
    orderByRaw: RawQueryBuilder<T>;

    // Union
    union: Union<T>;
    unionAll(callback: Function): this;    

    // Having
    having: Having<T>;
    andHaving: Having<T>;
    havingRaw: RawQueryBuilder<T>;
    orHaving: Having<T>;
    orHavingRaw: RawQueryBuilder<T>;

    // Paging
    offset(offset: number): this;
    limit(limit: number): this;

    // Aggregation
    count(columnName?: string): this;
    min(columnName: string): this;
    max(columnName: string): this;
    sum(columnName: string): this;
    avg(columnName: string): this;
    increment(columnName: string, amount?: number): this;
    decrement(columnName: string, amount?: number): this;

    // Others
    first(...columns: string[]): QueryBuilderSingle<T>;
    first<T>(...columns: string[]): QueryBuilderSingle<T>;

    debug(enabled?: boolean): this;
    pluck(column: string): this;

    insert(data: any, returning?: string | string[]): this;
    update(data: any, returning?: string | string[]): this;
    update(columnName: string, value: Value, returning?: string | string[]): this;
    returning(column: string | string[]): this;

    del(returning?: string | string[]): this;
    del<T>(returning?: string | string[]): QueryBuilderSingle<T>;
    delete(returning?: string | string[]): this;
    delete<T>(returning?: string | string[]): QueryBuilderSingle<T>;
    truncate(): this;

    transacting(trx: Transaction): this;
    connection(connection: any): this;

    clone(): this;
  }

  interface As<T> {
    (columnName: string): QueryBuilder<T>;
  }

  interface Select<T> extends ColumnNameQueryBuilder<T> {
  }

  interface Table<T> {
    (tableName: string): QueryBuilder<T>;
    (callback: Function): QueryBuilder<T>;
    (raw: Raw): QueryBuilder<T>;
  }

  interface Distinct<T> extends ColumnNameQueryBuilder<T> {
  }

  interface Join<T> {
    (raw: Raw): QueryBuilder<T>;
    (tableName: string, columns: { [key: string]: string | Raw }): QueryBuilder<T>;
    (tableName: string, callback: Function): QueryBuilder<T>;
    <T1>(tableName: TableName<T1>, raw: Raw): QueryBuilder<T>;
    <T1>(tableName: TableName<T1>, column1: string, column2: string): QueryBuilder<T>;
    <T1>(tableName: TableName<T1>, column1: string, raw: Raw): QueryBuilder<T>;
    <T1>(tableName: TableName<T1>, column1: string, operator: string, column2: string): QueryBuilder<T>;
  }

  interface JoinClause {
    on(raw: Raw): JoinClause;
    on(callback: Function): JoinClause;
    on(columns: { [key: string]: string | Raw }): JoinClause;
    on(column1: string, column2: string): JoinClause;
    on(column1: string, raw: Raw): JoinClause;
    on(column1: string, operator: string, column2: string): JoinClause;
    andOn(raw: Raw): JoinClause;
    andOn(callback: Function): JoinClause;
    andOn(columns: { [key: string]: string | Raw }): JoinClause;
    andOn(column1: string, column2: string): JoinClause;
    andOn(column1: string, raw: Raw): JoinClause;
    andOn(column1: string, operator: string, column2: string): JoinClause;
    orOn(raw: Raw): JoinClause;
    orOn(callback: Function): JoinClause;
    orOn(columns: { [key: string]: string | Raw }): JoinClause;
    orOn(column1: string, column2: string): JoinClause;
    orOn(column1: string, raw: Raw): JoinClause;
    orOn(column1: string, operator: string, column2: string): JoinClause;
    using(column: string | string[] | Raw | { [key: string]: string | Raw }): JoinClause;
    type(type: string): JoinClause;
  }

  interface JoinRaw<T> {
    (tableName: string, binding?: Value): QueryBuilder<T>;
  }

  interface Where<T> extends WhereRaw<T>, WhereWrapped<T>, WhereNull<T> {
    (raw: Raw): QueryBuilder<T>;
    <T1>(callback: (queryBuilder: QueryBuilder<T1>) => any): QueryBuilder<T>;
    (object: Object): QueryBuilder<T>;
    (columnName: string, value: Value): QueryBuilder<T>;
    (columnName: string, operator: string, value: Value): QueryBuilder<T>;
    <T1>(columnName: string, operator: string, query: QueryBuilder<T1>): QueryBuilder<T>;
    <T1>(columnName: string, operator: string, callback: (queryBuilder: QueryBuilder<T1>) => any): QueryBuilder<T>;
  }

  interface WhereRaw<T> extends RawQueryBuilder<T> {
    (condition: boolean): QueryBuilder<T>;
  }

  interface WhereWrapped<T> {
    (callback: Function): QueryBuilder<T>;
  }

  interface WhereNull<T> {
    (columnName: string): QueryBuilder<T>;
  }

  interface WhereIn<T> {
    (columnName: string, values: Value[]): QueryBuilder<T>;
    (columnName: string, callback: Function): QueryBuilder<T>;
    <T1>(columnName: string, query: QueryBuilder<T1>): QueryBuilder<T>;
  }

  interface WhereBetween<T> {
    (columnName: string, range: [Value, Value]): QueryBuilder<T>;
  }

  interface WhereExists<T> {
    (callback: Function): QueryBuilder<T>;
    <T1>(query: QueryBuilder<T1>): QueryBuilder<T>;
  }

  interface WhereNull<T> {
    (columnName: string): QueryBuilder<T>;
  }

  interface WhereIn<T> {
    (columnName: string, values: Value[]): QueryBuilder<T>;
  }

  interface GroupBy<T> extends RawQueryBuilder<T>, ColumnNameQueryBuilder<T> {
  }

  interface OrderBy<T> {
    (columnName: string, direction?: string): QueryBuilder<T>;
  }

  interface Union<T> {
    (callback: Function | QueryBuilder<any>, wrap?: boolean): QueryBuilder<T>;
    (callbacks: (Function |  QueryBuilder<any>)[], wrap?: boolean): QueryBuilder<T>;
    (...callbacks: (Function |  QueryBuilder<any>)[]): QueryBuilder<T>;
    // (...callbacks: Function[], wrap?: boolean): QueryInterface;
  }

  interface Having<T> extends RawQueryBuilder<T>, WhereWrapped<T> {
    (tableName: string, column1: string, operator: string, column2: string): QueryBuilder<T>;
  }

  // commons

  interface ColumnNameQueryBuilder<T> {
    (...columnNames: ColumnName<T>[]): QueryBuilder<T>;
    (columnNames: ColumnName<T>[]): QueryBuilder<T>;
  }

  interface RawQueryBuilder<T> {
    (sql: string, ...bindings: Value[]): QueryBuilder<T>;
    (sql: string, bindings: Value[]): QueryBuilder<T>;
    (raw: Raw): QueryBuilder<T>;
  }
}
