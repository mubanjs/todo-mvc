# Todo MVC Client Tutorial

In this tutorial we're going to recreate the classic Todo MVC app, something that most other frameworks have done as
well. We're going to borrow the HTML and CSS from the Todo MVC template, so this tutorial can focus on how to
organize your component file, and the actual implementation.

In this version we're going to create a purely client-side version of the app, which means we don't have any
server-rendered HTML. Even though Muban is not meant for this purpose, it's still a good showcase on how it would
deal with these kinds of apps.

Please remember that most templates here would normally exist on the server, except for the `TodoItem` template,
since this will be rendered dynamically based on the available data.

::: tip Code files
If you want to quickly see the code for each step, you can find them
[here](https://github.com/mubanjs/todo-mvc/tree/main/docs/todo-mvc-client/steps).

Or the final code version [here](https://github.com/mubanjs/todo-mvc/tree/main/projects/todo-app-client).

Or the running example [here](https://mubanjs.github.io/todo-mvc/projects/todo-mvc-client/).
:::

In this tutorial you will learn:

1. How to write (dev) `templates`
2. How to write `components`
3. How components **interact** with each other (parent `<>` child)
4. How to use `refs`
5. How to use `props`
6. How to set up basic `bindings`
7. How to set up **two-way** `bindings`
8. How to use `bindTemplate`
9. How to use `bindMap`
10. How to use **writable** `computed`
11. How to create and use **hooks**
