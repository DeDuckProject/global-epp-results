import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from '@/utils/logger';

describe('logger', () => {
  beforeEach(() => {
    // Mock console methods
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('logs info messages with correct prefix', () => {
    logger.info('test message');
    expect(console.info).toHaveBeenCalledWith('[INFO] test message');
  });

  it('logs warning messages with correct prefix', () => {
    logger.warn('test warning');
    expect(console.warn).toHaveBeenCalledWith('[WARN] test warning');
  });

  it('logs error messages with correct prefix', () => {
    logger.error('test error');
    expect(console.error).toHaveBeenCalledWith('[ERROR] test error');
  });

  it('logs debug messages only in development', () => {
    const originalEnv = process.env.NODE_ENV;
    
    // Test production
    process.env.NODE_ENV = 'production';
    logger.debug('test debug');
    expect(console.debug).not.toHaveBeenCalled();
    
    // Test development
    process.env.NODE_ENV = 'development';
    logger.debug('test debug');
    expect(console.debug).toHaveBeenCalledWith('[DEBUG] test debug');
    
    // Restore
    process.env.NODE_ENV = originalEnv;
  });

  it('passes through additional arguments', () => {
    const obj = { key: 'value' };
    logger.info('test message', obj);
    expect(console.info).toHaveBeenCalledWith('[INFO] test message', obj);
  });
}); 