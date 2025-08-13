## **🚀 Git Flow and Commit Best Practices**

This guide explains how to effectively use Git with a structured branching strategy and clear commit message conventions to ensure clean, maintainable project histories.

---

## **📖 Table of Contents**

1. [Git Flow Workflow](#-git-flow-workflow)
2. [Commit Best Practices](#-commit-best-practices)
3. [Examples of Good and Bad Commits](#-examples-of-good-and-bad-commits)
4. [Tools and Automation](#-tools-and-automation)
5. [Folder Structure](#-folder-structure)
6. [Mui Import Rules](#-mui-import-rules)
7. [Nextjs Top Loader](#-nextjs-top-loader)

---

## **🛠️ Git Flow Workflow**

A structured approach to managing branches in Git. It organizes code and ensures stable releases.

### **🌿 Branch Types**

| Branch Type | Description                        | Example Name            |
| ----------- | ---------------------------------- | ----------------------- |
| `main`      | Production-ready, stable code.     | `main`                  |
| `develop`   | Integration of features/bug fixes. | `develop`               |
| `feature`   | New features or enhancements.      | `feature/user-login`    |
| `bugfix`    | Fixing bugs in `develop` branch.   | `bugfix/fix-header`     |
| `hotfix`    | Urgent fixes on production code.   | `hotfix/critical-error` |

---

### **🚀 Workflow Steps**

1. **Start a new feature/bugfix branch**:
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/<feature-name>
   ```
2. **Commit your changes**.
3. **Push the branch** to the remote repository:
   ```bash
   git push -u origin feature/<feature-name>
   ```
4. **Create a Pull Request** to merge into `develop`.
5. After testing and reviews, **merge back** to `develop`.
6. **For hotfixes** (urgent issues):
   ```bash
   git checkout develop
   git pull
   git checkout -b hotfix/<description>
   ```

---

## **✍️ Commit Best Practices**

Follow these best practices to keep your commits clean, meaningful, and helpful.

### **✅ General Rules**

- **Atomic Commits**: One commit = One logical change.
- **Descriptive Messages**: Clearly describe what changed.
- **Imperative Mood**: Use "Add login feature" instead of "Added login feature".
- **Follow the Format**:

  ```
  <type>(<scope>): <subject>

  <body> (optional)
  ```

---

### **📺 Commit Types**

| **Type**   | **Purpose**                             | **Example**                           |
| ---------- | --------------------------------------- | ------------------------------------- |
| `feat`     | New feature                             | `feat(auth): add login endpoint`      |
| `fix`      | Bug fix                                 | `fix(ui): correct header alignment`   |
| `docs`     | Documentation updates                   | `docs: update README.md`              |
| `style`    | Code formatting (no functional changes) | `style: format code with Prettier`    |
| `refactor` | Code restructuring                      | `refactor(core): clean up utils`      |
| `test`     | Add or update tests                     | `test(api): add unit tests for login` |
| `chore`    | Maintenance tasks                       | `chore: update CI pipeline`           |

---

## **✅ Examples of Good and Bad Commits**

### **✅ Good Commit Messages**

- Meaningful, descriptive, and follows conventions.

| ✅ **Good**                                    | ❌ **Bad**            |
| ---------------------------------------------- | --------------------- |
| `feat(auth): add login feature`                | `Added login`         |
| `fix(ui): correct button alignment`            | `Fix bug`             |
| `docs: update README with setup instructions`  | `README changes`      |
| `chore: update dependencies to latest version` | `update dependencies` |

---

### **🔍 Why Good Commits Matter**

- ✅ **Easy to understand**: Clearly shows what changed.
- ✅ **Easy to revert**: Atomic changes can be rolled back safely.
- ✅ **Code reviews**: Makes PRs and reviews faster.

---

## **⚡ Tools and Automation**

### **1. Husky**

Husky is a Git hook manager that allows you to run scripts before commits, pushes, and more. It's a great way to automate tasks and ensure consistency across your project.

#### 1.1 pre-commit

Before each commit, Husky will run lint-staged and tsc to check for errors or warnings. If any issues are found, the commit will stop and display errors. If no issues are found, the commit proceeds.

#### 1.2 pre-push

Before pushing commits, Husky will build the project. If an error occurs, the push will stop; otherwise, the commits are pushed.

### **2. Package Manager ([bun](https://bun.sh))**

💡 **We are using bun for our project, and our Docker image is based on bun.**

🛡️ **Warning**: Do not change the package manager!

### **3. Docker**

We use a multi-stage Dockerfile and `docker-compose`. Run the following command at the project root:

```bash
docker-compose up --build
```

### **4. [Headwind](https://marketplace.visualstudio.com/items?itemName=heybourn.headwind) Extension (VSCode)**

Use Headwind to sort all Tailwind CSS classes.

### **5. ESLint**

🛡️ We have multiple ESLint rules (e.g., import order). Be cautious and adhere to the rules.

---

## **📂 Folder Structure**

Organize your project folders as follows:

```
web-platform/
│
├── src/                   # Source code root
│   ├── app/               # All pages (No other code allowed here)
│   ├── components/        # Custom components
│   │   ├── pages/         # All page components go here
│   ├── layout/            # Layout components for global design
│   ├── providers/         # Providers (e.g., MuiThemeProvider)
│   ├── styles/            # Global CSS and variables
│   ├── theme/             # MUI customized components
│
└── ...

```

### **Folder Rules**

- **`app`**: Strictly for pages; do not write any other logic, components, or configurations here.
- **`components`**: Place reusable custom components here.
  - pages: Subfolder for page components that structure the layout of pages.
- **`providers`**: Add global providers like `MuiThemeProvider`.
- **`styles`**: Store global CSS files and variables.
- **`theme`**: Add all MUI customizations for the project.

---

## **📦 Mui Import Rules**

- **Use import from `@mui/material` directly.**
- **Do not `import { ... } from '@mui/material'` instead.**

for example, instead of:

```tsx
import { Button } from "@mui/material";
```

use:

```tsx
import Button from "@mui/material/Button";
```

---

## **⏳ Nextjs Top Loader**

Use Nextjs Top Loader for loading indicators and progress bars.

🛡️ **Warning**: To activate top loader when you are using "push" method just import it from:

```tsx
import { useRouter } from "nextjs-toploader/app";
```

---

**Happy Coding! 🚀**  
Feel free to clone, fork, and contribute! 🎉

---

By following this structure, your Git workflow, commit history, and project folders will remain clean, readable, and professional.
