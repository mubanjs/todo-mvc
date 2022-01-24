# 4. Completing the project

## Adding an `id`

To more easily manage our Todo items when filtering and editing them, it helps to add an `id` to 
each item.

In the `TodoItem.template.ts` we simply add the `id` as required prop, and set it as a `data-id` 
attribute, so it can be extracted within the component.

<CodeGroup>
<CodeGroupItem title="src/components/todo-item/TodoItem.template.ts">

@[code ts{5,11,18}](./steps/todoitem-template-final.ts)
</CodeGroupItem>
</CodeGroup>

Then, in the `TodoItem.ts` component, we define it has a required prop. We don't specify any 
source, since by default it will try to extract it from the root element, and use `data-` 
attributes as a default source (along with `json` and `class`, if it can't find an attribute).

We also update the `shape` of the `onChange` and `onDelete` props to require the `id` as a first 
parameter. Those callback functions can then use the `id` to identify the item, instead of 
trying to rely on an `index`.

<CodeGroup>
<CodeGroupItem title="src/components/todo-item/TodoItem.ts">

@[code{11-20} ts{2,7,9}](./steps/todoitem-final.ts)
</CodeGroupItem>
</CodeGroup>

The places where we call those functions, we provide the `props.id` as a first parameter.

<CodeGroup>
<CodeGroupItem title="src/components/todo-item/TodoItem.ts">

@[code{28-30} ts{2}](./steps/todoitem-final.ts)
</CodeGroupItem>
</CodeGroup>

<CodeGroup>
<CodeGroupItem title="src/components/todo-item/TodoItem.ts">

@[code{48-50} ts{1}](./steps/todoitem-final.ts)
</CodeGroupItem>
</CodeGroup>

<CodeGroup>
<CodeGroupItem title="src/components/todo-item/TodoItem.ts">

@[code{83-85} ts{2}](./steps/todoitem-final.ts)
</CodeGroupItem>
</CodeGroup>

Now that we don't longer need to use indexes to find the todo item to update/remove, we don't 
have to use `bindMap` for our `refs.todoItems` anymore, making this a lot simpler: 

<CodeGroup>
<CodeGroupItem title="src/components/app/App.ts">

@[code{65-68} ts{2-3}](./steps/app-final.ts)
</CodeGroupItem>
</CodeGroup>

As part of this big refactor, we have moved most code to a separate file called `useTodos.ts`. 
However, if you want to follow along with just this step, you can place these functions in the 
`App.ts` as well, since they only operate on the `todos` ref.

<CodeGroup>
<CodeGroupItem title="src/components/app/useTodos.ts">

@[code{33-57} ts{4,8-9,12,18,24}](./steps/usetodos-final.ts)
</CodeGroupItem>
</CodeGroup>

Besides adding the `id` (the highlighted lines, note that we use `nanoid()` to generate a random 
ID whenever we create a nte item), we made some other changes;

1. We're filtering on `item.id !== id`, instead of the index.
2. We sanitize the title using `title.trim()`, to ignore empty todos when adding them.
3. When editing todos, we delete items that would otherwise have an empty title.

At this point we also stop rendering our initial todos from the `main.ts`, since they require an 
`id`, and we don't have any server storage. In the next steps these will be synced with 
`LocalStorage`, so that will be the initial data source on page load.

<CodeGroup>
<CodeGroupItem title="src/components/main.ts">

@[code{10-12} ts](./steps/main-final.ts)
</CodeGroupItem>
</CodeGroup>

> Note; Full code of everything is shown at the bottom of this page.

## Moving code to a "hook"

The code in the `App.ts` is growing, so now is a good time to move it into a separate function. 
This function receives the initial state, and returns some data and a set of functions to be 
used for interacting with that data.

Create a `src/components/app/useTodos.ts` file and add in the following code:

<CodeGroup>
<CodeGroupItem title="src/components/app/useTodos.ts">

@[code ts{8,10,12,19,23,38,42,44,54-62}](./steps/usetodos-1.ts)
</CodeGroupItem>
</CodeGroup>

This code does the following:

1. It creates the `todo` ref to contain all the data, based on the `initialTodoItems` passed to 
   the function.
2. It created a `remainingTodoCount` computed, to be used in our component later.
3. It creates 4 functions that operate on our todos (add, remove, update, clear).
4. It creates the `allDone` computed, used by the `toggleAll` (making use of the 
   `remainingTodoCount` computed)
5. It returns all refs/computed/functions

Now we can use this in `App.ts`.

<CodeGroup>
<CodeGroupItem title="src/components/app/App.ts">

@[code{31-32} ts](./steps/app-9.ts)
</CodeGroupItem>
</CodeGroup>

First we call the `useTodos` hook, and destructure what's returned.

Then we can use this in our bindings. This now looks a lot nicer.

<CodeGroup>
<CodeGroupItem title="src/components/app/App.ts">

@[code{38-64} ts{3,5-7,17-18,24-25}](./steps/app-9.ts)
</CodeGroupItem>
</CodeGroup>

## Adding routing

Since we have some `<a href="#...">` code in the `AppFooter`, let's create a function that can 
extract this value from the URL when clicked. We add this in `useTodos.ts` since it's only used 
there for now.

<CodeGroup>
<CodeGroupItem title="src/components/app/useTodos.ts">

@[code{6-12} ts{2}](./steps/usetodos-final.ts)
</CodeGroupItem>
</CodeGroup>

## Adding filtering

Now that we have that set up, let's add in all the code required to filter the todos.

<CodeGroup>
<CodeGroupItem title="src/components/app/useTodos.ts">

@[code{15-30} ts{3,5-7,9-15}](./steps/usetodos-final.ts)
</CodeGroupItem>
</CodeGroup>

`selectedFilter` will keep track of which filter is selected, initialized by reading the current 
filter from the URL (this makes sure it's correct on page load).

Then, whenever the url changes (listing for `popstate` using the `useEventListener` hook from 
`@muban/hooks`), we update the `selectedFilter`.

Lastly, we create `computed` that filters the `todos` based on the `selectedFilter`. For 
performance reasons we the `todos.value` when no filter is set.

Then, make sure these are returned and destructured from the `useTodos`;

@[code{76-86} ts{3,4}](./steps/usetodos-final.ts)
@[code{30-40} ts{3,4}](./steps/app-final.ts)

And then update our bindings:

@[code{58-60} ts{1}](./steps/app-final.ts)
@[code{65-72} ts{6}](./steps/app-final.ts)

And of course, update `AppFooter.ts`;

@[code{12-16} ts{4}](./steps/appfooter-final.ts)
@[code{32-40} ts{2,5,8}](./steps/appfooter-final.ts)


## Sync to `LocalStorage`

Lastly, sync to `LocalStorage` is relatively simple;

1. We read what's in `LocalStorage`, and pass that as the `initialTodos`.
2. Whenever the `todos` list changes, we write that back to `LocalStorage`.

<CodeGroup>
<CodeGroupItem title="src/components/app/App.ts">

@[code{28-44} ts{1,15-17}](./steps/app-final.ts)
</CodeGroupItem>
</CodeGroup>

## All code

Below you can find the latest code (split into two sections).

You can also find these in [the repository](https://github.com/mubanjs/todo-mvc/tree/main/projects/todo-app-client/src).


<CodeGroup>
<CodeGroupItem title="main.ts">

@[code ts](./steps/main-final.ts)
</CodeGroupItem>

<CodeGroupItem title="App.ts">

@[code ts](./steps/app-final.ts)
</CodeGroupItem>

<CodeGroupItem title="App.template.ts">

@[code ts](./steps/app-template-final.ts)
</CodeGroupItem>

<CodeGroupItem title="useTodos.ts">

@[code ts](./steps/usetodos-final.ts)
</CodeGroupItem>

<CodeGroupItem title="TodoItem.ts">

@[code ts](./steps/todoitem-final.ts)
</CodeGroupItem>

<CodeGroupItem title="TodoItem.template.ts">

@[code ts](./steps/todoitem-template-final.ts)
</CodeGroupItem>
</CodeGroup>

<CodeGroup>
<CodeGroupItem title="AppHeader.ts">

@[code ts](./steps/appheader-2.ts)
</CodeGroupItem>

<CodeGroupItem title="AppHeader.template.ts">

@[code ts](./steps/appheader-template-1.ts)
</CodeGroupItem>

<CodeGroupItem title="AppFooter.ts">

@[code ts](./steps/appfooter-final.ts)
</CodeGroupItem>

<CodeGroupItem title="AppFooter.template.ts">

@[code ts](./steps/appfooter-template-1.ts)
</CodeGroupItem>

</CodeGroup>
