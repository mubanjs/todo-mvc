# 2. Templates and Styles

To save some time (and for consistency) we're going to copy all the html and css from the Todo MVC template repo.

The CSS can be found [here](https://github.com/mubanjs/todo-mvc/blob/main/projects/todo-app-client-vite/src/style.css),
and it can be copied over into your `src/style.css` file.

The HTML can be cut into 4 different templates:
1. An individual `TodoItem`
2. The `AppHeader` section, with an input for new todos.
3. The `AppFooter` sections, which shows some information, and allows you to filter todos by state.
4. The `App` component itself, which is responsible for rendering the `TodoItem` components, and connect with the
   `AppHeader` and `AppFooter` components.

## `TodoItem`

Create a `src/components/todo-item/TodoItem.template.ts` with the following content;

<CodeGroup>
<CodeGroupItem title="src/components/todo-item/TodoItem.template.ts">

@[code ts](./steps/todoitem-template-1.ts)

</CodeGroupItem>
</CodeGroup>

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

## `AppHeader`

Create a `src/components/app-header/AppHeader.template.ts` with the following content;

<CodeGroup>
<CodeGroupItem title="src/components/app-header/AppHeader.template.ts">

@[code ts{8,9,11}](./steps/appheader-template-1.ts)

</CodeGroupItem>
</CodeGroup>

This template is similar to what we had before in the `App` template (the `title`). It also has a input to enter new
todos.

What we have done here is;

1. Add the `data-component="app-header"` attribute to the root element.
2. Render the `title`.
3. Add `data-ref="newTodoInput"` to interact with the input element to add new todos.

There is no initial data in this template that our Component needs access to later, so there is nothing else to do.

## `AppFooter`

Create a `src/components/app-footer/AppFooter.template.ts` with the following content;

<CodeGroup>
<CodeGroupItem title="src/components/app-footer/AppFooter.template.ts">

@[code ts](./steps/appfooter-template-1.ts)
</CodeGroupItem>
</CodeGroup>

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

## `App`

Update our `src/components/app/App.template.ts` to the following;

<CodeGroup>
<CodeGroupItem title="src/components/app/App.template.ts">

@[code ts{8,15,19-21,23}](./steps/app-template-2.ts)
</CodeGroupItem>
</CodeGroup>

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

## `main.ts` Data

And finally, since we update our App template, we should also pass different data when mounting our app. Please
update `main.ts` to the following:

<CodeGroup>
<CodeGroupItem title="src/main.ts">

@[code ts{12-21}](./steps/main-2.ts)
</CodeGroupItem>
</CodeGroup>

In here we're passing the `todos` array with the `title` and `isCompleted` for each item. Everything in that object
is typed, so your editor knows exactly what to specify here, and you will get an error if you make a typo, or forget
a required property.

If you visit http://localhost:3000/, you should now see a nice static Todo app!
