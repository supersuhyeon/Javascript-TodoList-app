## TODOLIST with Router

![ezgif com-crop (7)](https://user-images.githubusercontent.com/94214512/220997763-a3b185c0-b413-4c69-9acf-72d50cd0064d.gif)

I previously made a to-do list app using React. However, this time I wanted to practice making the app using JavaScript and SCSS.
<br>
[To-do list React version](https://github.com/supersuhyeon/React-TodoList-app)

### Goals of the project

1. Create hash-based Routing system
2. Connect with local storage
3. Create a CRUD(Create, Read, Update, Delete) app with plain Javascript

### Languages

HTML, SCSS, JavaScript, rollup

### Featuers

**How to make a router in JavaScript**

In general, it is recommended to use a JavaScript library or framework to manage the routing of your web application like React router in React. However, you can also implement routing using only JavaScript. This approach seems to be simple and straightforward but it may not be suitable for managing complex routing rules in large projects.

There are many different ways to make a routing system and I used hash-based routing in this project.

- Hash-based Routing<br>
  Hash-based routing is a method of routing pages using the hash portion of a URL. A hash is the part of a URL that follows the # character. Browsers do not reload pages when the hash portion of the URL changes, so you can use hash-based routing to dynamically change pages.

```js
//example
class Router {
  constructor() {
    this.routes = {};
  }

  addRoute(route, handler) {
    this.routes[route] = handler;
  }

  route(currentRoute) {
    const handler = this.routes[currentRoute];
    if (handler) {
      handler();
    } else {
      console.error(`No handler found for route: ${currentRoute}`);
    }
  }
}

const router = new Router();
router.addRoute("/", () => console.log("Home page"));
router.addRoute("/about", () => console.log("About page"));
router.addRoute("/contact", () => console.log("Contact page"));

router.route("/");
// Output: "Home page"
router.route("/about");
// Output: "About page"
router.route("/invalid");
// Output: "No handler found for route: /invalid"
```

- apply to my project

```js
class TodoList {
  //...codes
  onClickRadioBtn(e) {
    //when the radio buttons are clicked (ALL, TODO, DONE)
    const target = e.target;
    window.location.href = `#/${target.value.toLowerCase()}`; //If the hash is changed, the init() method from Router class is re-executed.
  }
  filterTodo(status) {
    const todoDivEls = this.todoListEl.querySelectorAll("div.todo");
    for (const todoDivEl of todoDivEls) {
      switch (status) {
        case "ALL":
          todoDivEl.style.display = "flex";
          break;
        case "DONE":
          todoDivEl.style.display = todoDivEl.classList.contains("done")
            ? "flex"
            : "none";
          break;
        case "TODO":
          todoDivEl.style.display = todoDivEl.classList.contains("done")
            ? "none"
            : "flex";
          break;
      }
    }
  }
  //...codes
}
```

```js
class Router {
  routes = [];
  // 0:{url: '#/all', callback:f}
  // 1:{url: '#/todo', callback:f}
  // 2:{url: '#/done', callback:f}
  addRoute(url, callback) {
    this.routes.push({ url, callback });
    return this; //for the method's chaining.
  }
  checkRoute() {
    const currentRoute = this.routes.find((route) => {
      return route.url === window.location.hash; //current's url's hash
    });
    if (!currentRoute) {
      this.notFoundCallback();
      return;
    }
    currentRoute.callback();
  }
  init() {
    window.addEventListener("hashchange", () => {
      this.checkRoute();
    });
    if (!window.location.hash) {
      window.location.hash = "#/";
    }
    this.checkRoute();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const router = new Router();
  const todoList = new TodoList(new Storage());
  const routeCallback = (status) => () => {
    todoList.filterTodo(status);
    document.querySelector(
      `input[type='radio'][value = '${status}']`
    ).checked = true;
  };
  router
    .addRoute("#/all", routeCallback("ALL"))
    .addRoute("#/todo", routeCallback("TODO"))
    .addRoute("#/done", routeCallback("DONE"))
    .setNotFound(routeCallback("ALL"))
    .init();
});
```

- Method Chaining <br>
  Using method chaining, methods can be called continuously centering on one object, so the object returned by the previous method can be used again in the next method. For example router.addRoute(...).setNotFound(...).init(). Using method chaining in this way, you can write concise and highly readable code.

---

**Local Storage** <br>

- window.localStorage.setItem(key,value) - To add key and value
- window.localStorage.getItem(key) - To read the value
- Only strings are stored in localStorage. Therefore, to store an object or an array in localStorage, you need to convert the object to a string and store it. JSON.stringify() converts objects and arrays to JSON strings.
- When you convert JSON strings to objects or arrays, you can use JSON.parse()

  <img width="1271" alt="Screenshot 2023-02-22 at 5 45 03 PM" src="https://user-images.githubusercontent.com/94214512/220803718-0fcf2cca-a196-4fe3-88a4-303dfa1ca1f2.png">

```js
class TodoList {
  constructor(storage) {
    this.initStorage(storage);
    this.assignElement();
    this.addEvent();
    this.loadSavedData();
  }

  initStorage(storage) {
    this.storage = storage;
  }

  loadSavedData() {
    //load and display the data when dom content is loaded.
    const todosData = this.storage.getTodos();
    for (const todoData of todosData) {
      const { id, content, status } = todoData;
      this.createTodoElement(id, content, status);
    }
  }
}

class Storage {
  saveTodo(id, todoContent) {
    const todosData = this.getTodos();
    todosData.push({ id, content: todoContent, status: "TODO" });
    localStorage.setItem("todos", JSON.stringify(todosData));
  }

  editTodo(id, todoContent, status = "TODO") {
    const todosData = this.getTodos();
    const todoIndex = todosData.findIndex((todo) => todo.id == id);
    const targetTodoData = todosData[todoIndex];
    const editedTodoData =
      todoContent === ""
        ? { ...targetTodoData, status } //overwrite a status (DONE or TODO)
        : { ...targetTodoData, content: todoContent }; // if there is an updated input value through the todoContent, then overwrite the content
    todosData.splice(todoIndex, 1, editedTodoData);
    localStorage.setItem("todos", JSON.stringify(todosData));
  }

  deleteTodo(id) {
    const todosData = this.getTodos();
    todosData.splice(
      todosData.findIndex((todo) => todo.id == id),
      1
    );
    localStorage.setItem("todos", JSON.stringify(todosData));
  }

  getTodos() {
    //get the data from the localstorage
    return localStorage.getItem("todos") === null //if getItem can't find data then null is returned
      ? []
      : JSON.parse(localStorage.getItem("todos"));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const todoList = new TodoList(new Storage());
});
```

### Self-reflection

I wanted to make the to-do list app this time without libraries or frameworks. With this rule in mind, I realized how efficient and convenient it is to make a router in React with react-router library. In addition to challenging myself with that rule, I've also been trying to use all different kinds of module bundlers like parcel, webpack, and rollup. I felt from this project that when setting up the basic environment with rollup that rollup was very similar to webpack. Of course my project is too small for how rollup or webpack are intended to be used but I could see and feel the big differences for a future large-scale project.
