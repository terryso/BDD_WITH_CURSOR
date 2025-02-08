# Cursor + Cucumber BDD Development Guide

[中文版](./README.md)

This project demonstrates how to use Cursor + Cucumber framework for BDD (Behavior Driven Development). By combining Cursor's rule system with Cucumber's BDD framework, we can achieve a standardized and automated development process.

🎥 [Watch Demo Video](https://youtu.be/teiqYP-yW4U?si=_X4T81lLYlVYwF4-)

## Composer Setup

Before starting development, ensure the following settings in Cursor's Composer:

1. Enable Agent Mode:
   - Select "agent" mode in the bottom-right corner of the Composer input box
   - This enables more powerful AI assistant capabilities

2. Enable YOLO Mode:
   - Check "Enable YOLO Mode" in Cursor settings
   - This allows the AI assistant to directly execute certain safe operations, improving development efficiency

## Project Setup

1. After creating a new project in Cursor, first set up the project rules:

```bash
mkdir -p .cursor/rules
```

2. Add two core rule files:

- `.cursor/rules/project-rules.mdc`: Defines TDD and unit testing standards
- `.cursor/rules/story-rules.mdc`: Defines user story and requirements management standards

## Development Process

### 1. Story Creation
In Cursor's Composer, input:
```
I want to add [feature description], please generate a user story
```
Cursor Agent will:
- Create a user story file in the `stories/` directory based on `story-rules.mdc` template
- Include complete story structure (As a/I want/So that)
- Generate initial acceptance criteria
- Add supplementary information and related files

Wait for user confirmation of story content and acceptance criteria before proceeding.

### 2. Feature Creation
Prerequisite: User story confirmed

In Composer, input:
```
Based on [user story path], create feature file and first scenario
```
Cursor Agent will:
- Create corresponding feature file in features directory
- Create first basic scenario
- Ensure feature file header includes reference to corresponding user story

### 3. Steps Definition
In Composer, input:
```
Please define steps for [scenario name]
```
Cursor Agent will:
- Create corresponding `.steps.ts` file
- Write Given-When-Then steps following BDD standards
- Ensure step definitions are clear and comply with project standards

### 4. BDD Implementation
In Composer, input:
```
Run BDD tests and implement functionality
```
Cursor Agent will:
- Execute `npm run test:bdd`
- Analyze test failure reasons
- Implement necessary functionality
- Loop execution until BDD tests pass
- Perform necessary code refactoring

### 5. Unit Testing
Prerequisite: All BDD tests passing

In Composer, input:
```
Generate unit tests based on [scenario path]
```
Cursor Agent will:
- Create corresponding `.test.ts` file
- Write unit tests following TDD standards
- Execute `npm run test:unit`
- Refine implementation until unit tests pass
- Ensure test coverage meets requirements

### 6. Scenario Completion
Checklist:
- [ ] User story acceptance criteria met
- [ ] All BDD tests passing
- [ ] All unit tests passing
- [ ] Code properly refactored
- [ ] Documentation updated

### 7. Next Scenario
Repeat steps 2-6 until all scenarios are complete

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