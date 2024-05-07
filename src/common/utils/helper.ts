import { Transform } from 'class-transformer';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { HttpException, HttpStatus } from '@nestjs/common';
import { customAlphabet } from 'nanoid';


/**
 *
 * @param token
 * @param {string} password
 * @returns
 */
export async function encodeToken(token, password) {
  try {
    const iv = randomBytes(16);
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv);
    const encryptedToken = Buffer.concat([
      cipher.update(JSON.stringify(token)),
      cipher.final(),
    ]);
    return encryptedToken.toString('hex') + 'ILN' + iv.toString('hex');
  } catch (err) {
    throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
  }
}

/**
 *
 * @param {string} token
 * @param {string} password
 * @returns
 */
export async function decodeToken(token: string, password: string) {
  try {
    const tokenSplit = token.split('ILN');
    const iv = Buffer.from(tokenSplit[1], 'hex');
    const tokenBuff = Buffer.from(tokenSplit[0], 'hex');
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const decipher = createDecipheriv('aes-256-ctr', key, iv);
    const decrypted = Buffer.concat([
      decipher.update(tokenBuff),
      decipher.final(),
    ]);
    return JSON.parse(decrypted.toString());
  } catch (err) {
    throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
  }
}

/**
 *
 * @param {string} email
 */
export function isEmail(email: string) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function ToBoolean() {
  return Transform((v) => ['1', 1, 'true', true].includes(v.value));
}

/**
 * @param {string} prefix
 * @param {number} id
 */
export function generateId(prefix: string, id: number) {
  const numberLength = (n) => String(Math.abs(n)).length;
  const idLength = numberLength(id);
  return `${prefix}${'0'.repeat(8 - idLength)}${id}`;
}

/**
 * prepare filter query
 * @Param query
 * @returns {Object}
 */
export function createSearchQuery(query) {
  try {
    let searchQuery: any = {
      isActive: true,
      isDeleted: false,
    };


    if (query.hasOwnProperty('noCondition') && query.noCondition === true) {

      delete searchQuery.isActive;
      delete searchQuery.isDeleted;
    }

    if (query.hasOwnProperty('filter') && query.filter) {
      searchQuery = {
        ...searchQuery,
        ...JSON.parse(query.filter),
      };
    }

    return searchQuery;
  } catch (err) {
    throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
  }
}

export function randomEnumValue(enumeration) {
  const values = Object.keys(enumeration);
  const enumKey = values[Math.floor(Math.random() * values.length)];
  return enumeration[enumKey];
}

export function createSelectQuery(query, populations) {
  try {
    const obj: any = {};
    const populationPathMap: any = populations.reduce((result, item) => {
      result[item] = { path: item, select: {} };
      return result;
    }, {});
    if (query && query.hasOwnProperty('select') && query.select) {
      const select: string[] = JSON.parse(query.select);
      if (Array.isArray(select) && select.length > 0) {
        select.map(prop => {
          const parts = prop.split('.');
          if (!populations.includes(parts[0]))
            obj[prop] = 1;
          else {
            populationPathMap[parts[0]]['select'][parts[1]] = 1
          }
        });
      }
    }
    return {
      select: obj,
      populationPathMap
    }
  } catch (err) {
    throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
  }
}

export function generateUniqueCode(key: string, length: number): string {
  return customAlphabet(key, length)();  
}

export const slug = customAlphabet(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890',
  8,
);

