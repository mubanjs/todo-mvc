# Todo MVC Tutorial

In this tutorial we're going to recreate the classic Todo MVC app, something that most other frameworks have done as 
well. We're going to borrow the HTML and CSS from the Todo MVC template, so this tutorial can focus on how to 
organize your component file, and the actual implementation.

In this version we're going to create a purely client-side version of the app, which means we don't have any 
server-rendered HTML. Even though Muban is not meant for this purpose, it's still a good showcase on how it would 
deal with these kinds of apps.

Please remember that most templates here would normally exist on the server, except for the `TodoItem` template, 
since this will be rendered dynamically based on the available data.

## Initial Setup

In this example we're using `Vite` to develop the project, but you can use whatever developer setup you want.

```shell
npm init vite@latest

✔ Project name: … todo-app
✔ Select a framework: › vanilla
✔ Select a variant: › vanilla-ts
```

Then, `cd todo-app`, `npm install` the packages and run `npm run dev` to start your server.
Visit `http://localhost:3000` to see the `Hello Vite` starting point.

To start with `muban`, install these two packages;

```shell
npm i @muban/muban @muban/template
```

## Our first component

Our first component will be the `App` component, which will be the root of our application. To keep things simple, 
we are only going to render a custom title in the template, with no logic in the component itself.

### Template file
Create a `src/components/App/App.template.ts` for our template;
```ts
import { html, ComponentTemplateResult } from "@muban/template";

export type AppTemplateProps = {
  title?: string;
};

export function appTemplate({ title = 'Todos' }: AppTemplateProps): ComponentTemplateResult {
  return html`
    <div data-component="app">
      <h1>${title}</h1>
    </div>
  `;
}
```

Here we have done the following;

1. We import `html` from `@muban/template`, a helper to write our tagged template strings.
2. We define a `type` for our template props. We always pass our props as an object. Optional props can be marked 
   with a `?` in the type, and potentially given a default value when destructuring them.
3. We create the template itself, which is a normal function, receiving the props as an object, and returning a 
   `ComponentTemplateResult` (which is a `string`, or an `Array` of `strings`). Which is what the `html` helper will 
   return.
4. We define our root element, adding a `data-component` attribute with `app`, to link it to our TypeScript Component 
   file later. Each template should always have a single root element, that should have a matching `data-component` 
   attribute. Besides linking it to our logic, it can also be used to style our components (as apposed to classnames).
5. We use our `title` prop in our html, as you would use any variable in a template string.

> When rendering any template in Muban, think of it as the *initial state* of your application or component. Even 
> without executing any component initialisation, your templates should reflect what would be rendered on the server.
> This means that your templates should not include any "interaction logic". The output should be a static string.

### Component file

Now that we have our template, let's create the Component itself by creating `src/components/App/App.template.ts`.

```ts
import { defineComponent } from "@muban/muban";

export const App = defineComponent({
  name: "app",
  setup() {
    console.log('App Running...')
    return [];
  }
});
```

Here we have done the following:

1. We import `defineComponent`, which is our factory function to create Muban Components.
2. As options, we give it a name, `app` in this case. This should match the `data-component` attribute from our 
   template file.
3. Every component has a `setup` function, where it returns `bindings`. This is the "minimum required" code to be in 
   there, we'll add more things later.
4. For now, we're adding a `console.log` to check if our component is correctly initialized.

> A component is only initialized when there is an html element with the matching `data-component`attribute value
> present in the DOM. Additionally, the `Component` file should be known in the "parent component", or globally 
> registered within the "application". In the parent component this can be done by using `refComponent` for the refs,
> or otherwise using the `components` array. More on this later. 

### Rendering the App

Now that we have our first components (a template and logic file), it's time to render it by mounting our Application.

In the `main.ts` (that was created by Vite), change the code to this:

```ts
import './style.css'

import { createApp } from "@muban/muban";
import { App } from "./components/App/App";
import { appTemplate } from "./components/App/App.template";

const appRoot = document.getElementById("app")!;
const app = createApp(App);

app.mount(appRoot, appTemplate, {
  title: 'Todos'
});
```

It does the following things:

1. Import `createApp`, to, well, create our Application.
2. Import our component and template files.
3. Query the root element of our application
4. Call `createApp` by passing our `App` component, which returns the `app` instance.
5. `mount` our application in the `appRoot`, passing the `appTemplate` to render the HTML, passing the `title` prop 
   to pass to the template.

If we check the browser, we should see a `Todos` title, and `App Running..` in the devtools console.

> Calling `mount` with a template + data is normally something we only do in development, or abusing muban to create 
> a client-side-rendered App. The strength of muban lies in working with existing HTML that is rendered on the server.
> 
> If you already have HTML on the page, you can leave out those two parameters.


## The Todo MVC Templates and Styles

To save some time (and for consistency) we're going to copy all the html and css from the Todo MVC template repo.

The CSS can be found [here](TODO), and it can be copied over into your `src/style.css` file.

The HTML can be cut into 4 different templates:
1. An individual `TodoItem`
2. The `AppHeader` section, with an input for new todos.
3. The `AppFooter` sections, which shows some information, and allows you to filter todos by state.
4. The `App` component itself, which is responsible for rendering the `TodoItem` components, and connect with the 
   `AppHeader` and `AppFooter` components.

### `TodoItem` Template

Create a `src/components/todo-item/TodoItem.template.ts` with the following content;

```ts
import { html } from '@muban/template';

export type TodoItemTemplateProps = {
  title: string;
  isCompleted: boolean;
}

export function todoItemTemplate({ title, isCompleted }: TodoItemTemplateProps) {
  // there is also an `editing` class, but that's only set when interacting with the element
  return html`<li data-component="todo-item" class="${isCompleted ? 'completed' : ''}">
    <div class="view">
      <input data-ref="completedInput" class="toggle" type="checkbox" checked=${isCompleted} />
      <label data-ref="title">${title}</label>
      <button data-ref="destroyButton" class="destroy"></button>
    </div>
    <input data-ref="editInput" class="edit" />
  </li>`
}
```

This template has two properties, the `title`, and `isCompleted`  to indicate it's done. From a "data" point of view,
this is all we know about the item. This is all the information we are going to save into `LocalStorage` later.

> It does have an `editing` state, but that is all handled by the Component if users interact with it. The "initial 
state" can never be "editing".

With the props we do the following:

1. We enter the `title` in the label.
2. We conditionally add the `completed` class. And we mark the checkbox as `checked`.
3. We're **not** setting the value of the "edit" `input` field, this will be done by the Component when switching 
   into "editing mode".

Besides the props, we have also added `data-ref` attributes on all elements that require updates from the Component 
after interacting with the application later.

1. The `data-component` doesn't need a `data-ref`, it can be referenced using `refs.self`.
2. The `data-ref="completedInput"` is for the checkbox, we need to listen when its state changes.
3. The `data-ref="title"` is to read the initial title value, and to update it later when editing.
4. The `data-ref="destroyButton"` needs a `click` binding, so we can remove the item.
5. The `data-ref="editInput"` needs a `value`, so we can set and update its value.

> Anything that doesn't have a `data-ref` attribute will stay as rendered.

The two properties that we passed to the template (`{ title, isCompleted }`) are not automatically available in JS 
when we create our Component. We might not even always need them. in this case we do, so we need to think about how 
the Component is going to get access to them later.

For the `title`, we can easily read the `textContent` of the `<label>` tag, so as long as that element has a 
`data-ref`, we're good.
For the `isCompleted` we have two options to extract it, we can either use the `class="completed"` on the root 
element, or use the `checked` attribute on the input.

### `AppHeader` template

Create a `src/components/app-header/AppHeader.template.ts` with the following content;

```ts
import { html } from '@muban/template';

export type AppHeaderTemplateProps = {
  title?: string;
};

export function appHeaderTemplate({ title = 'Todos'}: AppHeaderTemplateProps = {}) {
  return html`<div data-component="app-header" class="header">
      <h1>${title}</h1>
      <input data-ref="newTodoInput" class="new-todo" placeholder="What needs to be done?" autofocus />
    </div>`;
}
```

This template is similar to what we had before in the `App` template (the `title`). It also has a input to enter new 
todos.

What we have done here is;

1. Add the `data-component="app-header"` attribute to the root element.
2. Render the `title`.
3. Add `data-ref="newTodoInput"` to interact with the input element to add new todos.

There is no initial data in this template that our Component needs access to later, so there is nothing else to do.

### `AppFooter` template

Create a `src/components/app-footer/AppFooter.template.ts` with the following content;

```ts
import { html } from '@muban/template';

type AppFooterTemplateProps = {
   uncompletedCount?: number;
   selectedFilter?: 'active' | 'completed';
}

export function appFooterTemplate({ uncompletedCount = 0, selectedFilter}: AppFooterTemplateProps = {}) {
   return html`
    <footer data-component="app-footer" class="footer">
      <span data-ref="todoCount" class="todo-count">
        <strong>${uncompletedCount}</strong> ${uncompletedCount === 1 ? 'items' : 'item'} left
      </span>
      <ul class="filters">
        <li>
          <a data-ref="filterAll" class="${!selectedFilter ? 'selected' : ''}" href="#/">All</a>
        </li>
        <li>
          <a data-ref="filterActive" class="${selectedFilter === 'active' ? 'selected' : ''}" href="#/active">Active</a>
        </li>
        <li>
          <a data-ref="filterCompleted" class="${selectedFilter === 'completed' ? 'selected' : ''}" href="#/completed">Completed</a>
        </li>
      </ul>
      <!-- Hidden if no completed items are left ↓ -->
      <button data-ref="clearCompletedButton" class="clear-completed">Clear completed</button>
    </footer>
  `;
}
```

This template has 3 purposes:

1. It shows how many todo items are uncompleted.
2. Some filters we can activate (we need to set up routing for this).
3. A button to remove everything that we have completed.

We receive two props:
1. An `uncompletedCount` that we render here, including the correct pluralisation of `items`. Note that this condition 
   is just for the template rendering, the initial state from the server. Whenever this changes after interacting 
   on the client, it will be updated from the Component using `bindings`.
2. An optional `selectedFilter`, which is used to set the `selected` class on the right filter element.

To update the count (and the correct label) later, we have added the `data-ref="todoCount"` to this span. For this 
example we're going to update the complete value later, including the `<strong>` tag – which means we will need to 
render `html`. We could also have chosen to introduce another `<span>` tag around the label, and update the count 
and the label separately with normal `text` bindings.

Our filters also have `data-ref` attributes added, so we can add or remove the `selected` class based on 
interactions we do later. 

And lastly we added `data-ref="clearCompletedButton"` to interact with the clear button.

### `App` template

Update our `src/components/app/App.template.ts` to the following;

```ts
import { ComponentTemplateResult, html } from '@muban/template';
import { appFooterTemplate } from '../app-footer/AppFooter.template';
import { appHeaderTemplate } from '../app-header/AppHeader.template';
import { todoItemTemplate, TodoItemTemplateProps } from '../todo-item/TodoItem.template';

export type AppTemplateProps = {
   title?: string;
   todos?: Array<TodoItemTemplateProps>;
};

export function appTemplate({ title, todos = [] }: AppTemplateProps = {}): ComponentTemplateResult {
   return html`
    <div data-component="app">
      <section class="todoapp">
        ${appHeaderTemplate({ title })}
        <section class="main">
          <input data-ref="toggleAllInput" id="toggle-all" class="toggle-all" type="checkbox" />
          <label for="toggle-all">Mark all as complete</label>
          <ul data-ref="todoList" class="todo-list">
            ${todos.map(todo => todoItemTemplate(todo))}
          </ul>
        </section>
        ${appFooterTemplate( { uncompletedCount: todos.filter(todo => !todo.isCompleted).length })}
      </section>
      <footer class="info">
        <p>Double-click to edit a todo</p>
        <p>Created by <a href="http://github.com/mubanjs">Muban</a></p>
      </footer>
    </div>
  `;
}
```

This is where everything comes together. Keep in mind that we're still just rendering templates, the "initial state" 
or our application, that is normally rendered on the server.

From the `main.ts` (that renders our component when mounting) we expect to receive the title, and a list of todo 
items (that are known on the server). We re-use the `TodoItemTemplateProps` type here to specify which fields each 
todo item should have. We could also have created a `TodoItem` type, and use that in the `TemplateProps` types of 
both components.

As you can see, we rendered some child templates:
1. `appHeaderTemplate` renders the header, passing along the `title` prop.
2. We map over our `todos` list, and for each item, we render the `todoItemTemplate` template, passing along the data.
3. `appFooterTemplate` renders the footer, passing the `uncompletedCount` using an inline filter.

And we have a `data-ref="toggleAllInput"` here as well, to toggle the state of all todos in the list.

### `main.ts` Data

And finally, since we update our App template, we should also pass different data when mounting our app. Please 
update `main.ts` to the following:

```ts
import './style.css'

import { createApp } from "@muban/muban";
import { App } from "./components/app/App";
import { appTemplate } from "./components/app/App.template";

const appRoot = document.getElementById("app")!;
const app = createApp(App);

app.mount(appRoot, appTemplate, {
  title: 'Todos',
  todos: [
    {
      title: 'Taste JavaScript',
      isCompleted: true,
    },
    {
      title: 'Buy a unicorn',
      isCompleted: false,
    }
  ]
});
```

In here we're passing the `todos` array with the `title` and `isCompleted` for each item. Everything in that object 
is typed, so your editor knows exactly what to specify here, and you will get an error if you make a typo, or forget 
a required property.

If you visit http://localhost:3000/, you should now see a nice static Todo app!

## Making everything interactive

Now that we have our templates set up, it's time to make things interactive. We might do some things that are 
changed in later steps, those are to showcase some different methods of doing things, and help you understand the 
thinking process.

### `TodoItem` - Editing our Todo

First, let's make our `TodoItem` interactive, so we can mark it as completed. Down the road we might want to manage 
this in the parent component, but let's start with just the `TodoItem` in isolation.

Create `src/components/todo-item/TodoItem.ts`, first with an empty component.

```ts
import { defineComponent } from '@muban/muban';

export const TodoItem = defineComponent({
  name: 'todo-item',
  setup() {
    return [];
  }
})
```

Nothing special going on here, just make sure that the `name` matches that in the `data-component` template.

#### refs

Next, let's add our refs;

```ts
import { defineComponent } from '@muban/muban';

export const TodoItem = defineComponent({
  name: 'todo-item', 
  refs: {
    completedInput: 'completedInput',
    title: 'title',
    destroyButton: 'destroyButton',
    editInput: 'editInput',
  },
  setup() {
    return [];
  }
})
```

The `refs` object specifies which elements from the template / DOM we want to use in our component. The keys of that 
object is what we will be using in our `setup` function later. The value is the "definition" of the ref – in this 
case, the value of the `data-ref` attribute.

If we only care about the HTML Element, and it's required, we can use a `string` value as a shortcut, what we are 
doing here. It's the same as doing `completedInput: refElement('completedInput'),`. `refElement` also has some 
options as its second parameter, something we might come across later, or you can look up in the docs.

There are other "refDefinitions" you can use (for components, or collections of elements or components), which will 
also be covered at later steps.

#### props

Next up are the props;

```ts
import { defineComponent, propType } from '@muban/muban';

export const TodoItem = defineComponent({
  name: 'todo-item', 
  refs: {
    completedInput: 'completedInput',
    title: 'title',
    destroyButton: 'destroyButton',
    editInput: 'editInput',
  },
  props: {
    title: propType.string.source({ type: 'text', target: 'title' }),
    isCompleted: propType.boolean.source({ type: 'css', name: 'completed' }),
  },
  setup() {
    return [];
  }
})
```

Instead of (only) receiving props from our parent components, in most cases we extract props from the HTML. Here 
want to extract the `title` of the do, and if it's `isCompleted` or not.

Same as with refs, the keys of the `props` object is what we will use in the `setup` function, and the value is the 
"prop definition". Here we use the `propType` helper to define what we want to extract, where from, if it has a 
default value, what type it should be converted to, etc.

`title` uses `propType.string`, since we want it as a `string`. `isCompleted` should be a `boolean`, so we use 
`propType.boolean`.

We want to extract the `title` prop from the `title` ref, so we specify that as `target` – the element (ref) we want 
to extract it from. Since we want the inner text of the `<label>`, we use the `text` type.

For the `isComleted`, we want know if the `completed` class was set on the component root element. Since it's the 
root, we don't have to specify a `target`. The `type` is set to `css` since we want to check the css class name, and 
`name` is `completed`, because we want to check for that value. If it's present, the result will be `true` – 
otherwise it's `false`.

Just as with the refs, we expect these values to always be there. Otherwise we could have configured the props as
`.optional` – where they become undefined when not present – or `.defaultValue('foo') to receive that value when 
missing.

#### setup

```ts
import { bind, defineComponent, propType, ref } from '@muban/muban';

export const TodoItem = defineComponent({
  name: 'todo-item',
   refs: {
      completedInput: 'completedInput',
      title: 'title',
      destroyButton: 'destroyButton',
      editInput: 'editInput',
   },
   props: {
      title: propType.string.source({ type: 'text', target: 'title' }),
      isCompleted: propType.boolean.source({ type: 'css', name: 'completed' }),
   },
  setup({ props, refs}) {
    const isCompleted = ref(props.isCompleted);

    return [
      bind(refs.self, {
        css: { 'completed': isCompleted }
      }),
      bind(refs.completedInput, {
        checked: isCompleted
      })
    ];
  }
})
```

Lastly we work on the setup function, where we add our bindings.

We receive our `props` and `refs` in the `setup` function, they have been "constructed" based on the definitions 
above, so we can use them.

By doing `const isCompleted = ref(props.isCompleted);` we create a new observable `ref`, so we can change this value 
inside the component (when toggling the checkbox). We can't mutate the incoming props. `props.isCompleted` is passed 
as the "initial value" for that ref.

Now that we have that ref, we can use it to do two things:
1. When `isCompleted` changes, we want to toggle the `completed` on `refs.self`
2. When the `checked` state of `refs.completedInput` changes, we want to update `isCompleted`.

And that's exactly what those two bindings do. We return an array with bindings, where each binding receives the 
`ref` to bind to, and a "binding object" that specifies _what_ to do when things change.

Note that we pass the observable `ref` as a binding value, not the `ref.value`. This allows the binding to watch for 
changes in the `ref`, and update the dom whenever `ref.value` is updated later.

> Some bindings are "read only", they are used to update the DOM when they are changed. Other bindings are "write 
> only", those are callback functions to react on events. And a small set are "two-way bindings", which can be bound 
> to a `ref`, where the value of the `ref` and the state of the DOM are always kept in sync, whichever changes first.


**Adding to the parent**

To have our `TodoItem` component initialized based on the HTML, we need to register it to the parent. Until we 
actually need these components as refs to add bindings to, we can add them in the `components` array, just so they 
are "known".

```ts
export const App = defineComponent({
  name: "app",
  components: [TodoItem],
  setup() {
    console.log('App Running...')
    return [];
  }
});
```

We added `components: [TodoItem],` here.

If you look at your page again, you should now be able to click the checkbox left of the todo, and see it being 
checked off.

Note that we haven't done anything with the `title` in our component yet, this will come in a future step when we 
are going to implement the editing state.

#### Editing state

To reduce the amount of duplicate code, we are just focussing on the `setup` part now;

```ts
setup({ props, refs}) {
   const isCompleted = ref(props.isCompleted);
   const isEditing = ref(false);
   // since we can exit edit mode without saving, we need to store the temp value here
   const editValue = ref(props.title);

   return [
      bind(refs.self, {
         css: {
            completed: isCompleted,
            editing: isEditing,
         }
      }),
      bind(refs.completedInput, {
         checked: isCompleted
      }),
      bind(refs.title, {
         event: {
            dblclick() {
               isEditing.value = true;
               // delay focussing until the element is updated to `display: block`
               // the `hasFocus` binding has the same issue – being too quick
               queueMicrotask(() => {
                  refs.editInput.element?.focus();
               })
            },
         },
      }),
      bind(refs.editInput, {
         textInput: editValue,
      })
   ];
}
```

We created a `isEditing` ref to switch editing mode. We updated the `css` binding on `refs.self` to include toggling 
the `editing` css class.

Then we added a binding for `refs.title` where we add a `dblclick` event. In this event we're switching
`isEditing. value` to `true`.
Note that we're using `.value` when reading or writing the value stored inside the `ref`.

We are also focussing the edit input – but with a small delay to give the DOM time to update itself.
Note that to let typescript understand we can do `element?.focus()` we have now typed our input ref as
`editInput: refElement<HTMLInputElement>('editInput'),`.

And we created an `editValue` ref, initialising it the extracted value from the `props`, and use that for the `textInput` 
binding on your `refs.editInput` – which set the initial value correctly, but will also change the `ref` when updating
the input.

When we visit our page now, and double click on the label, it should switch to editing mode, and focus the input. 
Unfortunately we don't have a way to exit the editing mode. This is our next step;

```ts
  setup({ props, refs}) {
    const isCompleted = ref(props.isCompleted);
    const isEditing = ref(false);
    // since we can exit edit mode without saving, we need to store the temp value here
    const editValue = ref(props.title);
    const title = ref(props.title);

    const exitEditing = (saveValue = false) => {
      // either save the value, or restore it to the previous state
      if (saveValue) {
        title.value = editValue.value;
      } else {
        editValue.value = title.value;
      }
      // exit editing mode
      isEditing.value = false;
    }

    return [
      bind(refs.self, {
        css: {
          completed: isCompleted,
          editing: isEditing,
        }
      }),
      bind(refs.completedInput, {
        checked: isCompleted
      }),
      bind(refs.title, {
        event: {
          dblclick() {
            isEditing.value = true;
            // delay focussing until the element is updated to `display: block`
            // the `hasFocus` binding has the same issue – being too quick
            queueMicrotask(() => {
              refs.editInput.element?.focus();
            })
          },
        },
        text: title,
      }),
      bind(refs.editInput, {
        textInput: editValue,
        event: {
          keydown(event) {
            if (['Esc', 'Escape'].includes(event.key)) {
              exitEditing();
            } else if (['Enter'].includes(event.key)) {
              exitEditing(true);
            }
          },
          blur() {
            exitEditing(true);
          }
        }
      })
    ];
  }
```

Starting at the bottom, we added a `keydown` and `blur` event to detect the different ways to exit our editing state.
Some of which should save the value (passing `true`), where hitting Escape should discard our entered value.

The `exitEditing` function will then either save the `editValue` into the new `title` ref, or revert the `editValue` 
to the value the `title` had.

Lastly we added the `text: title,` binding to our `refs.title`, to update the label when exiting editing state with 
the new value.

Now we can enter and exit the edit state freely, and choose to accept or revert the value we entered.

In our next step we are going to try to create new Todos, which might require us to change some things in this 
component as well.

### `AppHeader` - adding new Todos

As with the TodoItem, let's create our component file in `src/components/app-header/AppHeader.ts`.

```ts
import { defineComponent } from '@muban/muban';

export const AppHeader = defineComponent({
  name: 'app-header',
  setup({ refs, props }) {
    return [];
  }
})
```

And to make sure we don't forget, add it to our `App.ts` component list `components: [TodoItem, AppHeader],`.

With the basic setup there, let's add our refs, props and bindings. 

```ts
import { bind, defineComponent, propType, ref } from '@muban/muban';

export const AppHeader = defineComponent({
  name: 'app-header',
  refs: {
    newTodoInput: 'newTodoInput',
  },
  props: {
    onCreate: propType.func.optional.shape<(value: string) => void>()
  },
  setup({ refs, props }) {
    const inputValue = ref('');
    return [
      bind(refs.newTodoInput, {
        textInput: inputValue,
        event: {
          keyup(event) {
            if (event.key === 'Enter') {
              props.onCreate?.(inputValue.value);
              inputValue.value = '';
            }
          }
        }
      })
    ];
  }
})
```

We have our `newTodoInput` ref, that's used to add bindings to.

We configured a `onCreate` prop, that will be passed from the parent component later. `func` types can never be 
extracted from the HTML, so should always be passed from the parent.

The order in which all components are initialized means that `onCreate` will never be present in the `setup` 
immediately, but it will be once the component is mounted and bindings are executed.

Also note the generic argument for `shape<(value: string) => void>()`, we use that to tell TypeScript what our 
function will be like. In this case, the function expects a value to be passed, and won't return anything.

For our `setup`, we start with a `inputValue` ref, where we store the value of our input field using the
`textInput: inputValue` binding.

And just like in our `TodoItem` bindings, we use the `keyup` to detect when we press `[Enter]`. Once we do, we call 
our `onCreate` callback (using `?.` optional chaining, since we can't be sure the parent already passed this prop), 
and pass the value we have stored in `inputValue`. Lastly, we reset our input back to `''`, so we can immediately 
start entering our next Todo.

If you look at your running application now, you should be able to type in the input field, and hit `[enter]` to 
empty the input again. Just like with the `TodoItem` this component now only works on isolation, we haven't 
connected it to the parent. This is what's next.

### `App` - connecting our child components

#### Control the list of todos in the App

Before we start adding new todos, let's move the control of rendering our individual Todo items to our `App` component.

First, we create a ref to store our todo data in:
```ts
const todos = ref([]);
```

Next, we need to fill it with data. Since we already could have todos rendered on the server, we probably want to 
extract these items from the page. Since we already have our `TodoItem` components mounted, and their `props` 
extract the required info from the HTML, we can try to retrieve that information.

```ts
refs: {
  todoItems: refComponents(TodoItem),
},
```

Here we define a new `ref` in our `App` component. We're using `refComponents` to get a collection of components. We 
pass `TodoItem` as a Component there, since we are interested in those. This will look for 
`data-component="todo-item"` elements in the DOM, and initialized the `TodoItem` component. The instances of those 
components will be available in the setup function as `refs.todoItems`.

Now that we have configured `TodoItem` as a `ref`, we can remove it from the `components: []` Array.

In our setup function we can now access these refs to get access to the data;
```ts
setup({ refs }) {
  const initialTodoItems = refs.todoItems.getComponents().map(({ props : { title, isCompleted } }) => ({ title, isCompleted }));
  const todos = ref(initialTodoItems);
  
  return [];
}
```

1. `refs.todoItems.getComponents()` retrieves all `TodoItem` component instances, where we `.map` over them.
2. `({ props : { title, isCompleted } })` destructures those two props, which is similar to `map(item => item.props.
   title)`.
3. For each component, we return the two props we're interested in; `({ title, isCompleted })`.

`initialTodoItems` now contains an array of todo objects, which we use to initialize our `todos` ref.

If we would add `console.log(todos.value)`, we'd see:
```js
[
  { title: 'Taste JavaScript', isCompleted: true },
  { title: 'Buy a unicorn', isCompleted: false }
]
```

In order to use this extracted data to render our Todo items (and later add or remove them), we use `bindTemplate`;

```ts
refs: {
  todoList: 'todoList',
  todoItems: refComponents(TodoItem),
}

// ...

return [
   bindTemplate(
     refs.todoList,
     todos,
     (items ) => items.map(itemData => todoItemTemplate(itemData)),
   ),
]
```

1. First we add a `todoList` ref definition, this is the `<ul>` container for our Todo items.
2. We pass this ref as our first parameter, since we want to modify the content of this element.
3. `todos` is passed second, this is the reactive data that `bindTemplate` is watching for changes
4. Whenever `todos` changes, our 3rd parameter – a template function – is executed. We use it to render our 
   `todoItemTemplate` with the passed data, and return the mapped result. This will then replace the `innerHTML` of 
   the `<ul>` container we bind to.
5. `bindTemplate` will also make sure that whenever the HTML is update, it initializes all new components.

In total, our code should now look like this;

```ts
import {
  bind,
  bindTemplate,
  defineComponent,
  ref,
  refComponents,
} from '@muban/muban';
import { AppHeader } from '../app-header/AppHeader';
import { TodoItem } from '../todo-item/TodoItem';
import { todoItemTemplate } from '../todo-item/TodoItem.template';

export const App = defineComponent({
  name: "app",
  components: [AppHeader],
  refs: {
    todoList: 'todoList',
    todoItems: refComponents(TodoItem),
  },
  setup({ refs }) {
    const initialTodoItems = refs.todoItems.getComponents().map(({ props : { title, isCompleted } }) => ({ title, isCompleted }));
    const todos = ref(initialTodoItems);

    return [
      bindTemplate(
        refs.todoList,
        todos,
        (items ) => items.map(itemData => todoItemTemplate(itemData)),
      ),
    ];
  }
});
```

And if you would look in the browser, nothing would have visually changed. However, we're now ready to add new Todos.

#### Add a new Todo

To get access to the new Todo, we need to pass our `onCreate` function to the `AppHeader` component.

We start by adding this as a `refComponent`, so we can bind to it. We can now also remove the `components` array 
completely.

```ts
appHeader: refComponents(AppHeader),
```

Next, we add our binding;
```ts
bind(refs.appHeader, {
  onCreate(newTodo) {
    todos.value = todos.value.concat({title: newTodo, isCompleted: false});
  }
}),
```

Here we pass the `onCreate` function to our `appHeader` component, so when you submit a new one, this function is 
called. In the function, we take our `newTodo` and create an object (completed is false when we add it), and add it 
to our existing array.

Because we use a `ref` – which only "triggers" changes when you set the `.value`, we use the immutable `concat` 
method to construct a new array with the new item, and assign that to `todos.value`.

With this in place, our `bindTemplate` should automatically render our new Todo item when `onCreate` is called.

Our `App` component now looks like this:
```ts
import {
  bind,
  bindTemplate,
  defineComponent,
  ref,
  refComponents,
} from '@muban/muban';
import { AppHeader } from '../app-header/AppHeader';
import { TodoItem } from '../todo-item/TodoItem';
import { todoItemTemplate } from '../todo-item/TodoItem.template';

export const App = defineComponent({
  name: "app",
  refs: {
    todoList: 'todoList',
    todoItems: refComponents(TodoItem),
    appHeader: refComponents(AppHeader),
  },
  setup({ refs}) {
    const initialTodoItems = refs.todoItems.getComponents().map(({ props : { title, isCompleted } }) => ({ title, isCompleted }));
    const todos = ref(initialTodoItems);

    return [
      bind(refs.appHeader, {
        onCreate(newTodo) {
          todos.value = todos.value.concat({title: newTodo, isCompleted: false});
        }
      }),
      bindTemplate(
        refs.todoList,
        todos,
        (items ) => items.map(itemData => todoItemTemplate(itemData)),
      ),
    ];
  }
});
```

And if you look at your browser now, you should be able to add new Todos!

However, if we edit an existing Todo, and we add a new one after that, our earlier edit is reverted.
This is because those edit changes are stored locally in our component, and our `App` now manages the data of all 
our Todos when it updates the list.

So our next step is to propagate changes from the `TodoItem` components back to the `App`.

### Syncing `TodoItem` with the `App`

For this next step we're going to make a few changes in the `TodoItem` component. Currently, that component is 
"stateful" (in regard to the title/completed), since it keeps that state internally. Since we want to have that 
managed by the `App` now, we want the `TodoItem` to become "stateless".

We can do that by removing the internal `ref`, using the `props` directly in our bindings, and dispatch `change` 
events whenever those values update. Then make sure to update our `App` component connect everything up.

The changes in `TodoItem` look like this:

We add a `prop` to trigger changes. 
```ts
onChange: propType.func.optional.shape<(data: { title?: string; isCompleted?: boolean }) => void>(),
```

We **remove** the `refs` that stored the internal state:
```ts
const isCompleted = ref(props.isCompleted); // remove
const title = ref(props.title); // remove
```

We update our `exitEditing` function with these changes:
```ts
if (saveValue) {
  // now calls onChange
  props.onChange?.({ title: editValue.value });
} else {
  // now uses `props.title`
  editValue.value = props.title;
}
```

We change our `title` and `isCompleted` bindings to use the `props` in a `computed`.
If we don't wrap it in a `computed`, we would be passing a non-reactive value, which means our bindings wouldn't update.

```ts
// for the css binding on `refs.self`
completed: computed(() => props.isCompleted),

// for our binding on `refs.title`
text: computed(() => props.title),
```

Then we update our `checked` binding to be "read only", and add an `event` binding on the `completedInput`.
We don't need the two-way binding anymore in our new "stateless" setup.

```ts
bind(refs.completedInput, {
   checked: computed(() => props.isCompleted),
   event: {
      change() {
         props.onChange?.({ isCompleted: Boolean(refs.completedInput.element?.checked) });
      }
   }
}),
```

We also changed the type of our `computedInput` ref definition, so TypeScript understands we can access `.checked`;
```ts
completedInput: refElement<HTMLInputElement>('completedInput'),
```

Our `TodoItem` now looks like this:

```ts
import { bind, computed, defineComponent, propType, ref, refElement } from '@muban/muban';

export const TodoItem = defineComponent({
  name: 'todo-item',
  refs: {
    completedInput: refElement<HTMLInputElement>('completedInput'),
    title: 'title',
    destroyButton: 'destroyButton',
    editInput: refElement<HTMLInputElement>('editInput'),
  },
  props: {
    title: propType.string.source({ type: 'text', target: 'title' }),
    isCompleted: propType.boolean.source({ type: 'css', name: 'completed' }),
    onChange: propType.func.optional.shape<(data: { title?: string; isCompleted?: boolean }) => void>(),
  },
  setup({ props, refs}) {
    const isEditing = ref(false);
    // since we can exit edit mode without saving, we need to store the temp value here
    const editValue = ref(props.title);

    const exitEditing = (saveValue = false) => {
      // either save the value, or restore it to the previous state
      if (saveValue) {
        props.onChange?.({ title: editValue.value });
      } else {
        editValue.value = props.title;
      }
      // exit editing mode
      isEditing.value = false;
    }

    return [
      bind(refs.self, {
        css: {
          completed: computed(() => props.isCompleted),
          editing: isEditing,
        }
      }),
      bind(refs.completedInput, {
        checked: computed(() => props.isCompleted),
        event: {
          change() {
            props.onChange?.({ isCompleted: Boolean(refs.completedInput.element?.checked) });
          }
        }
      }),
      bind(refs.title, {
        event: {
          dblclick() {
            isEditing.value = true;
            // delay focussing until the element is updated to `display: block`
            // the `hasFocus` binding has the same issue – being too quick
            queueMicrotask(() => {
              refs.editInput.element?.focus();
            })
          },
        },
        text: computed(() => props.title),
      }),
      bind(refs.editInput, {
        textInput: editValue,
        event: {
          keydown(event) {
            if (['Esc', 'Escape'].includes(event.key)) {
              exitEditing();
            } else if (['Enter'].includes(event.key)) {
              exitEditing(true);
            }
          },
          blur() {
            exitEditing(true);
          }
        }
      })
    ];
  }
})
```

Then to sync everything up, we add this new binding to our `App`:

```ts
...bindMap(refs.todoItems, (_, refIndex) => ({
  ...todos.value[refIndex],
  onChange(newProps) {
    todos.value = todos.value.map((item, index) => index === refIndex ? ({...item, ...newProps}) : item)
  }
})),
```

We're using `bindMap` as a utility to create a unique binding for each item in our component collection. It returns 
an `Array`, so we `...` spread it out.

For each item in the collection it executes the callback function, where we receive the ref to the individual 
component, and the index in the list.

With this we can pass our `title` and `isCompleted` as `todos.value[refIndex]`, and add the `onChange` callback.
Whenever `onChange` is called, we map over our todo list, and update the changed item based on index. The newly 
mapped array is assigned back to `todos.value`, which will make sure that whenever the `bindTemplate` is updating 
later, it passes the update values to each item. 


Which now looks like:

```ts
import {
  bind, bindMap,
  bindTemplate,
  defineComponent,
  ref,
  refComponents,
} from '@muban/muban';
import { AppHeader } from '../app-header/AppHeader';
import { TodoItem } from '../todo-item/TodoItem';
import { todoItemTemplate } from '../todo-item/TodoItem.template';

export const App = defineComponent({
  name: "app",
  refs: {
    todoList: 'todoList',
    todoItems: refComponents(TodoItem),
    appHeader: refComponents(AppHeader),
  },
  setup({ refs}) {
    const initialTodoItems = refs.todoItems.getComponents().map(({ props : { title, isCompleted } }) => ({ title, isCompleted }));
    const todos = ref(initialTodoItems);

    return [
      bind(refs.appHeader, {
        onCreate(newTodo) {
          todos.value = todos.value.concat({title: newTodo, isCompleted: false});
        }
      }),
      ...bindMap(refs.todoItems, (_, refIndex) => ({
        ...todos.value[refIndex],
        onChange(newProps) {
          todos.value = todos.value.map((item, index) => index === refIndex ? ({...item, ...newProps}) : item)
        }
      })),
      bindTemplate(
        refs.todoList,
        todos,
        (items ) => items.map(itemData => todoItemTemplate(itemData)),
      ),
    ];
  }
});
```

With this in place, if we check our app again, we should be able to edit existing and add new todo items, without 
anything getting reverted to outdated information.

## Deleting an item

Now that we can Add and Edit items, it's time for Deleting ones as well. For this to work, we need to add click 
bindings to our delete button, and add a `onDelete` prop we can call. Then our `App` we need to pass the `onDelete`, 
and remove our Todo from the list.

In our `TodoIte` we add our `onDelete` prop:
```ts
onDelete: propType.func.optional.shape<() => void>(),
```

Then add our `click` binding:
```ts
bind(refs.destroyButton, {
  click() {
    props.onDelete?.();
  }
})
```

And lastly, in our `App` we handle the deletion by filtering the `todos` based on index.
```ts
...bindMap(refs.todoItems, (_, refIndex) => ({
   ...todos.value[refIndex],
   onChange(newProps) {
      todos.value = todos.value.map((item, index) => index === refIndex ? ({...item, ...newProps}) : item)
   },
   onDelete() {
      todos.value = todos.value.filter((_, index) => index !== refIndex)
   }
})),
```

Now we should be able to delete items.

## `AppFooter` - to manage our todos

Next up the `AppFooter`, where we:

1. show the uncompleted todo count – which should update after we add/remove/complete any todo
2. can clear the completed todos from the list – easier than deleting them one by one
3. filter our todos based on `isCompleted`

### Uncompleted count

