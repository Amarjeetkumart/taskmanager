# Contributing to Task Management System

Thank you for your interest in contributing to the Task Management System! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what is best for the community
- Show empathy towards other community members

## How to Contribute

### Reporting Bugs

Before creating a bug report:
1. Check the existing issues to avoid duplicates
2. Collect relevant information (logs, screenshots, environment details)

When creating a bug report, include:
- **Clear title** describing the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **Environment details** (OS, Docker version, etc.)
- **Logs** from relevant services
- **Screenshots** if applicable

### Suggesting Features

Feature suggestions are welcome! Please:
1. Check if the feature has already been suggested
2. Clearly describe the feature and its benefits
3. Provide examples of how it would be used
4. Consider implementation complexity

### Pull Requests

#### Before Starting

1. **Fork the repository**
2. **Create a feature branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Discuss major changes** by opening an issue first

#### Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/taskManager.git
cd taskManager

# Install dependencies for local development
cd auth-service && npm install && cd ..
cd user-service && npm install && cd ..
cd task-service && npm install && cd ..
cd api-gateway && npm install && cd ..

# Start development environment
docker-compose up -d
```

#### Coding Standards

**JavaScript/Node.js**:
- Use ES6+ features
- Follow ESLint rules
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

**Code Style**:
```javascript
// Good
const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    logger.error('Error fetching user:', error);
    throw error;
  }
};

// Avoid
const getuser = async (id) => {
  return await User.findById(id);
};
```

**Error Handling**:
```javascript
// Always handle errors properly
try {
  // Your code
} catch (error) {
  console.error('Descriptive error message:', error);
  res.status(500).json({ error: 'User-friendly error message' });
}
```

**Validation**:
```javascript
// Validate all inputs
const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  // ... more validations
];
```

#### Docker Guidelines

- Keep Dockerfiles minimal and efficient
- Use multi-stage builds when appropriate
- Run containers as non-root user
- Include health checks
- Document environment variables

#### Database Changes

**PostgreSQL Migrations**:
```bash
# Create migration file
touch migrations/001_add_column.sql

# Apply migration
docker-compose exec postgres psql -U taskuser -d taskmanager < migrations/001_add_column.sql
```

**MongoDB Schema Changes**:
- Update Mongoose models
- Maintain backward compatibility
- Document schema changes

#### Testing

While automated tests are not yet implemented, manually test:

1. **Unit Testing** (future):
   ```bash
   npm test
   ```

2. **Integration Testing**:
   ```bash
   ./scripts/test-api.sh
   ```

3. **Manual Testing**:
   - Test all affected endpoints
   - Test error scenarios
   - Test edge cases
   - Verify security implications

#### Commit Guidelines

Follow conventional commits:

```
type(scope): subject

body

footer
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples**:
```
feat(auth): add password reset functionality

Implement password reset with email verification.
Adds new endpoints for requesting and confirming password reset.

Closes #123
```

```
fix(task): correct due date validation

The due date validation was allowing past dates.
Now validates that due dates are in the future.

Fixes #456
```

#### Pull Request Process

1. **Update documentation**:
   - Update README.md if needed
   - Update API_DOCUMENTATION.md for API changes
   - Add inline code comments

2. **Test your changes**:
   - Run the application locally
   - Test all affected functionality
   - Check for console errors/warnings

3. **Create pull request**:
   - Use a clear, descriptive title
   - Reference related issues
   - Describe what changed and why
   - Include screenshots for UI changes
   - List any breaking changes

4. **PR template**:
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## How Has This Been Tested?
   Describe testing process

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] No new warnings
   - [ ] Tests added/updated
   ```

5. **Address review feedback**:
   - Respond to all comments
   - Make requested changes
   - Re-request review when ready

## Project Structure

```
taskManager/
├── api-gateway/          # API Gateway service
│   ├── src/
│   │   └── index.js
│   ├── Dockerfile
│   └── package.json
├── auth-service/         # Authentication service
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── index.js
│   ├── Dockerfile
│   └── package.json
├── user-service/         # User management service
├── task-service/         # Task management service
├── nginx/                # Nginx configuration
├── scripts/              # Utility scripts
├── docker-compose.yml    # Docker orchestration
└── docs/                 # Documentation
```

## Adding a New Service

1. **Create service directory**:
   ```bash
   mkdir new-service
   cd new-service
   ```

2. **Initialize Node.js project**:
   ```bash
   npm init -y
   npm install express dotenv cors helmet
   ```

3. **Create Dockerfile**:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY src ./src
   RUN addgroup -g 1001 -S nodejs && \
       adduser -S nodejs -u 1001
   RUN chown -R nodejs:nodejs /app
   USER nodejs
   EXPOSE 3004
   CMD ["node", "src/index.js"]
   ```

4. **Add to docker-compose.yml**:
   ```yaml
   new-service:
     build:
       context: ./new-service
       dockerfile: Dockerfile
     container_name: taskmanager-new-service
     environment:
       # Add environment variables
     ports:
       - "3004:3004"
     networks:
       - taskmanager-network
   ```

5. **Update API Gateway** to route to new service

6. **Update documentation**

## Security Considerations

When contributing, always consider security:

- **Never commit secrets** (.env files, keys, passwords)
- **Validate all inputs** on server side
- **Sanitize outputs** to prevent XSS
- **Use parameterized queries** to prevent SQL injection
- **Implement rate limiting** for new endpoints
- **Add authentication** to protected endpoints
- **Review dependencies** for vulnerabilities
- **Follow principle of least privilege**

Run security checks:
```bash
# Check for known vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## Documentation

Keep documentation up to date:

- **README.md**: Overview and quick start
- **API_DOCUMENTATION.md**: All API endpoints
- **ARCHITECTURE.md**: System architecture
- **DEPLOYMENT.md**: Deployment instructions
- **Inline comments**: Complex logic
- **JSDoc**: Function documentation

Example JSDoc:
```javascript
/**
 * Create a new task for the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const createTask = async (req, res) => {
  // Implementation
};
```

## Getting Help

- **Documentation**: Read README.md, API_DOCUMENTATION.md, ARCHITECTURE.md
- **Issues**: Check existing issues or create new one
- **Discussions**: Start a discussion for questions

## Release Process

1. Update version in package.json files
2. Update CHANGELOG.md
3. Create git tag
4. Build and push Docker images
5. Create GitHub release

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the Task Management System! 🎉
