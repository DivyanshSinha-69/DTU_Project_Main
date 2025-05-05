import { userActionLogger, errorLogger } from '../utils/logger.js';

// Test user action logger
userActionLogger.info('This is a test user action');

// Test error logger
errorLogger.error('This is a test error message');

// Additional test cases
userActionLogger.info('User logged in');
userActionLogger.info('User performed action X');
errorLogger.error('Database connection failed');
errorLogger.warn('This warning should not appear in error log'); // Shouldn't appear in error log