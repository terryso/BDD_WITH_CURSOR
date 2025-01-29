# Cursor + Cucumber BDD Development Guide

[中文版](./README.md)

This project demonstrates how to use Cursor + Cucumber framework for BDD (Behavior Driven Development). By combining Cursor's rule system with Cucumber's BDD framework, we can achieve a standardized and automated development process.

## Project Setup

1. After creating a new project in Cursor, first set up the project rules:

```bash
mkdir -p .cursor/rules
```

2. Add two core rule files:

- `.cursor/rules/project-rules.mdc`: Defines TDD and unit testing standards
- `.cursor/rules/story-rules.mdc`: Defines user story and requirements management standards

## Development Process

### 1. Create User Story

Create a user story file in the `stories/` directory, following the `story-rules.mdc` standard:

```bash
mkdir -p stories/[module_name]
touch stories/[module_name]/[feature_name].story.md
```

User Story Template:
```markdown
# [Story Title]

## As a
[User Role]

## I want to
[Desired Feature]

## So that
[Business Value]

## Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]

## Additional Information
- Business Rules:
  * [Rule 1]
  * [Rule 2]
- Technical Requirements:
  * [Requirement 1]
  * [Requirement 2]

## Related Files
- Feature: [path]
- Implementation: [path]
```

### 2. Create Feature File

Create a feature file in the `features/` directory:

```bash
mkdir -p features/[module_name]
touch features/[module_name]/[feature_name].feature
```

Feature File Template:
```gherkin
Feature: [Feature Name]
  As a [role]
  I want to [desired feature]
  So that [business value]

  Scenario: [Scenario 1 Description]
    Given [precondition]
    When [action]
    Then [expected result]

  Scenario: [Scenario 2 Description]
    Given [precondition]
    When [action]
    Then [expected result]
```

### 3. Implement Step Definitions

Create the step definition file:

```bash
touch features/[module_name]/[feature_name].steps.ts
```

Step Definition Template:
```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';

Given('precondition description', async function () {
  // Implement precondition
});

When('action description', async function () {
  // Implement action
});

Then('expected result description', async function () {
  // Verify result
});
```

### 4. Write Unit Tests

Create test file in the `src/` directory:

```bash
touch src/[module_name]/[file_name].test.ts
```

Test File Template:
```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('Module Name', () => {
  beforeEach(() => {
    // Prepare test environment
  });

  describe('Feature Name', () => {
    it('should behave as expected', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### 5. Implement Feature Code

Create implementation file in the `src/` directory:

```bash
touch src/[module_name]/[file_name].ts
```

### 6. Run Tests

```bash
# Run unit tests
npm run test:unit

# Run BDD tests
npm run test:bdd

# Run all tests
npm test
```

## Best Practices

1. **Follow TDD Process**:
   - Write test first (Red)
   - Implement feature (Green)
   - Refactor code (Refactor)

2. **BDD Scenario Development**:
   - Develop one scenario at a time
   - Ensure scenario independence
   - Use clear business language

3. **Code Commits**:
   - Small, frequent commits
   - Clear commit messages
   - Ensure tests pass

4. **Documentation Maintenance**:
   - Update user story status
   - Maintain doc-code consistency
   - Record key decisions

## Project Structure

```
.
├── .cursor/
│   └── rules/
│       ├── project-rules.mdc    # Project rules
│       └── story-rules.mdc      # Story rules
├── features/                    # BDD test directory
│   └── [module]/
│       ├── [feature].feature   # Feature description
│       └── [feature].steps.ts  # Step definitions
├── stories/                     # User story directory
│   └── [module]/
│       └── [feature].story.md  # User story file
├── src/                         # Source code directory
│   └── [module]/
│       ├── [file].ts          # Implementation file
│       └── [file].test.ts     # Unit test file
├── package.json
└── README.md
```

## Example

Reference the Todo module in this project as an example:

1. User Story: `stories/todo/add-todo.story.md`
2. Feature Description: `features/todo/add-todo.feature`
3. Step Definitions: `features/todo/add-todo.steps.ts`
4. Unit Tests: `src/services/todoService.test.ts`
5. Implementation: `src/services/todoService.ts`

## Common Questions

1. **How to handle complex scenarios?**
   - Break down into simpler scenarios
   - Use Scenario Outline for similar scenarios
   - Use Background for common preconditions

2. **How to manage test data?**
   - Use factory functions
   - Prepare common data in Background
   - Use Examples tables

3. **How to ensure test quality?**
   - Follow AAA (Arrange-Act-Assert) pattern
   - Test one behavior per test
   - Maintain readable and maintainable test code

## Important Notes

1. Ensure all tests are independent
2. Regularly check test coverage
3. Keep documentation and code in sync
4. Follow project coding and testing standards 