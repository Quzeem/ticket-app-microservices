import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

// Turn scrypt callback implementation to a promised based implementation
const scryptAsync = promisify(scrypt);

export class Password {
  static async hash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, enteredPassword: string) {
    const [hashed, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(enteredPassword, salt, 64)) as Buffer;

    return buf.toString('hex') === hashed;
  }
}
