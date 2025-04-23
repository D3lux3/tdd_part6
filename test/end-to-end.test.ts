import path from 'path';
import {it, describe, expect} from 'vitest';
import {execa } from 'execa';

describe('End-to-end test', () => {

    it ('should read and parse given file', async () => {
        const indexPath = path.resolve(__dirname, '..', 'src', 'index.ts');
        
        const { stdout } = await execa('ts-node', [indexPath, 'test-path', '123']);

        console.log('stdout', stdout);
    });
});