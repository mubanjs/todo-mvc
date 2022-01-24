# 3. Adding Interaction

Now that we have our templates set up, it's time to make things interactive. We might do some things that are
changed in later steps, those are to showcase some different methods of doing things, and help you understand the
thinking process.

## Editing a Todo

First, let's make our `TodoItem` interactive, so we can mark it as completed. Down the road we might want to manage
this in the parent component, but let's start with just the `TodoItem` in isolation.

Create `src/components/todo-item/TodoItem.ts`, first with an empty component.

<CodeGroup>
<CodeGroupItem title="src/components/todo-item/TodoItem.ts">

@[code ts](./steps/todoitem-1.ts)
</CodeGroupItem>
</CodeGroup>

Nothing special going on here, just make sure that the `name` matches that in the `data-component` template.

### Refs

Next, let's add our refs;

<CodeGroup>
<CodeGroupItem title="src/components/todo-item/TodoItem.ts">

@[code ts{5-10}](./steps/todoitem-2.ts)
</CodeGroupItem>
</CodeGroup>

The `refs` object specifies which elements from the template / DOM we want to use in our component. The keys of that
object is what we will be using in our `setup` function later. The value is the "definition" of the ref – in this
case, the value of the `data-ref` attribute.

If we only care about the HTML Element, and it's required, we can use a `string` value as a shortcut, what we are
doing here. It's the same as doing `completedInput: refElement('completedInput'),`. `refElement` also has some
options as its second parameter, something we might come across later, or you can look up in the docs.

There are other "refDefinitions" you can use (for components, or collections of elements or components), which will
also be covered at later steps.

### Props

Next up are the props;

<CodeGroup>
<CodeGroupItem title="src/components/todo-item/TodoItem.ts">

@[code ts{11-14}](./steps/todoitem-3.ts)
</CodeGroupItem>
</CodeGroup>

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

### Setup

<CodeGroup>
<CodeGroupItem title="src/components/todo-item/TodoItem.ts">

@[code ts{15-26}](./steps/todoitem-4.ts)
</CodeGroupItem>
</CodeGroup>

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

<CodeGroup>
<CodeGroupItem title="src/components/app/App.ts">

@[code ts{2,6}](./steps/app-2.ts)
</CodeGroupItem>
</CodeGroup>

We added `components: [TodoItem],` here.

If you look at your page again, you should now be able to click the checkbox left of the todo, and see it being
checked off.

Note that we haven't done anything with the `title` in our component yet, this will come in a future step when we
are going to implement the editing state.

### Editing state

To reduce the amount of duplicate code, we are just focussing on the `setup` part of the
`TodoItem` now;

<CodeGroup>
<CodeGroupItem title="src/components/todo-item/TodoItem.ts">

@[code{15-47} ts{3-5,11,17-31}](./steps/todoitem-5.ts)
</CodeGroupItem>
</CodeGroup>

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

<CodeGroup>
<CodeGroupItem title="src/components/todo-item/TodoItem.ts">

@[code{15-72} ts{6,8-17,40,44-55}](./steps/todoitem-6.ts)
</CodeGroupItem>
<CodeGroupItem title="Complete">

@[code ts](./steps/todoitem-6.ts)
</CodeGroupItem>
</CodeGroup>

Starting at the bottom, we added a `keydown` and `blur` event to detect the different ways to exit our editing state.
Some of which should save the value (passing `true`), where hitting Escape should discard our entered value.

The `exitEditing` function will then either save the `editValue` into the new `title` ref, or revert the `editValue`
to the value the `title` had.

Lastly we added the `text: title,` binding to our `refs.title`, to update the label when exiting editing state with
the new value.

Now we can enter and exit the edit state freely, and choose to accept or revert the value we entered.

In our next step we are going to try to create new Todos, which might require us to change some things in this
component as well.

## Adding new Todos

As with the TodoItem, let's create our component file in `src/components/app-header/AppHeader.ts`.

<CodeGroup>
<CodeGroupItem title="src/components/app-header/AppHeader.ts">

@[code ts](./steps/appheader-1.ts)
</CodeGroupItem>
</CodeGroup>

And to make sure we don't forget, add the `AppHeader` to the `components` array in `App`.

<CodeGroup>
<CodeGroupItem title="src/components/app/App.ts">

@[code ts{2,7}](./steps/app-3.ts)
</CodeGroupItem>
</CodeGroup>


With the basic setup there, let's add our refs, props and bindings.

<CodeGroup>
<CodeGroupItem title="src/components/app-header/AppHeader.ts">

@[code ts{6,9,12,14-24}](./steps/appheader-2.ts)
</CodeGroupItem>
</CodeGroup>

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

## Connecting child components

### Control the list of todos in the App

Before we start adding new todos, let's move the control of rendering our individual Todo items to our `App` component.

First, we create a ref to store our todo data in:
```ts:no-line-numbers
const todos = ref([]);
```

Next, we need to fill it with data. Since we already could have todos rendered on the server, we probably want to
extract these items from the page. Since we already have our `TodoItem` components mounted, and their `props`
extract the required info from the HTML, we can try to retrieve that information.

```ts:no-line-numbers
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
```ts:no-line-numbers
setup({ refs }) {
  const initialTodoItems = refs.todoItems
    .getComponents()
    .map(({ props: { title, isCompleted } }) => ({ title, isCompleted }));
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
```js:no-line-numbers
[
  { title: 'Taste JavaScript', isCompleted: true },
  { title: 'Buy a unicorn', isCompleted: false }
]
```

In order to use this extracted data to render our Todo items (and later add or remove them), we use `bindTemplate`;

@[code{9-12} ts{2}:no-line-numbers](./steps/app-4.ts)
@[code{19-23} ts{2-4}:no-line-numbers](./steps/app-4.ts)


1. First we add a `todoList` ref definition, this is the `<ul>` container for our Todo items.
2. We pass this ref as our first parameter, since we want to modify the content of this element.
3. `todos` is passed second, this is the reactive data that `bindTemplate` is watching for changes
4. Whenever `todos` changes, our 3rd parameter – a template function – is executed. We use it to render our
   `todoItemTemplate` with the passed data, and return the mapped result. This will then replace the `innerHTML` of
   the `<ul>` container we bind to.
5. `bindTemplate` will also make sure that whenever the HTML is update, it initializes all new components.

In total, our code should now look like this;

<CodeGroup>
<CodeGroupItem title="src/components/app/App.ts">

@[code ts{8,10-11,14-17,20-22}](./steps/app-4.ts)
</CodeGroupItem>
</CodeGroup>

And if you would look in the browser, nothing would have visually changed. However, we're now ready to add new Todos.

### Add a new Todo

To get access to the new Todo, we need to pass our `onCreate` function to the `AppHeader` component.

We start by adding this as a `refComponent`, so we can bind to it. We can now also remove the `components` array
completely.
@[code{11-11} ts:no-line-numbers](./steps/app-5.ts)

Next, we add our binding;
@[code{20-24} ts:no-line-numbers](./steps/app-5.ts)


Here we pass the `onCreate` function to our `appHeader` component, so when you submit a new one, this function is
called. In the function, we take our `newTodo` and create an object (completed is false when we add it), and add it
to our existing array.

Because we use a `ref` – which only "triggers" changes when you set the `.value`, we use the immutable `concat`
method to construct a new array with the new item, and assign that to `todos.value`.

With this in place, our `bindTemplate` should automatically render our new Todo item when `onCreate` is called.

Our `App` component now looks like this:

<CodeGroup>
<CodeGroupItem title="src/components/app/App.ts">

@[code ts{16,27-31}](./steps/app-5.ts)
</CodeGroupItem>
</CodeGroup>

And if you look at your browser now, you should be able to add new Todos!

However, if we edit an existing Todo, and we add a new one after that, our earlier edit is reverted.
This is because those edit changes are stored locally in our component, and our `App` now manages the data of all
our Todos when it updates the list.

So our next step is to propagate changes from the `TodoItem` components back to the `App`.

## Syncing `TodoItem` with the `App`

For this next step we're going to make a few changes in the `TodoItem` component. Currently, that component is
"stateful" (in regard to the title/completed), since it keeps that state internally. Since we want to have that
managed by the `App` now, we want the `TodoItem` to become "stateless".

We can do that by removing the internal `ref`, using the `props` directly in our bindings, and dispatch `change`
events whenever those values update. Then make sure to update our `App` component connect everything up.

The changes in `TodoItem` look like this:

We add a `prop` to trigger changes.
<CodeGroup>
<CodeGroupItem title="src/components/todo-item/TodoItem.ts">

@[code{14-15} ts:no-line-numbers](./steps/todoitem-7.ts)
</CodeGroupItem>
</CodeGroup>


We **remove** the `refs` that stored the internal state:

@[code{16-16} ts:no-line-numbers](./steps/todoitem-6.ts)
@[code{20-20} ts:no-line-numbers](./steps/todoitem-6.ts)


We update our `exitEditing` function with these changes:
@[code{24-28} ts{2,4}:no-line-numbers](./steps/todoitem-7.ts)

We change our `title` and `isCompleted` bindings to use the `props` in a `computed`.
If we don't wrap it in a `computed`, we would be passing a non-reactive value, which means our bindings wouldn't update.

@[code{34-39} ts{3}:no-line-numbers](./steps/todoitem-7.ts)
@[code{50-62} ts{12}:no-line-numbers](./steps/todoitem-7.ts)

Then we update our `checked` binding on the `completedInput` ref to be read/writable. We read
the incoming props, and when the `checked` changes, we call the `onChange` with the new value.

@[code{40-49} ts{2-9}:no-line-numbers](./steps/todoitem-7.ts)

Our `TodoItem` now looks like this:

<CodeGroup>
<CodeGroupItem title="src/components/todo-item/TodoItem.ts">

@[code ts{14-15,25,27,36,41-48,61}](./steps/todoitem-7.ts)
</CodeGroupItem>
</CodeGroup>


Then to sync everything up, we add this new binding to our `App`:

<CodeGroup>
<CodeGroupItem title="src/components/app/App.ts">

@[code{36-42} ts](./steps/app-6.ts)
</CodeGroupItem>
<CodeGroupItem title="Complete">

@[code ts{36-42}](./steps/app-6.ts)
</CodeGroupItem>
</CodeGroup>

We're using `bindMap` as a utility to create a unique binding for each item in our component collection. It returns
an `Array`, so we `...` spread it out.

For each item in the collection it executes the callback function, where we receive the ref to the individual
component, and the index in the list.

Whenever `onChange` is called, we map over our todo list, and update the changed item based on index. The newly
mapped array is assigned back to `todos.value`, which will make sure that whenever the `bindTemplate` is updating
later, it passes the update values to each item.

With this in place, if we check our app again, we should be able to edit existing and add new todo items, without
anything getting reverted to outdated information.

## Deleting a Todo

Now that we can Add and Edit items, it's time for Deleting ones as well. For this to work, we need to add click
bindings to our delete button, and add a `onDelete` prop we can call. Then our `App` we need to pass the `onDelete`,
and remove our Todo from the list.

In our `TodoItem` we add our `onDelete` prop:
<CodeGroup>
<CodeGroupItem title="src/components/todo-item/TodoItem.ts">

@[code{16-16} ts](./steps/todoitem-8.ts)
</CodeGroupItem>
</CodeGroup>

Then add our `click` binding:
<CodeGroup>
<CodeGroupItem title="src/components/todo-item/TodoItem.ts">

@[code{79-83} ts](./steps/todoitem-8.ts)
</CodeGroupItem>
<CodeGroupItem title="Complete">

@[code ts{16,79-83}](./steps/todoitem-8.ts)
</CodeGroupItem>
</CodeGroup>

And lastly, in our `App` we handle the deletion by filtering the `todos` based on index.
<CodeGroup>
<CodeGroupItem title="src/components/app/App.ts">

@[code{36-45} ts{7-9}](./steps/app-7.ts)
</CodeGroupItem>
<CodeGroupItem title="Complete">

@[code ts{42-44}](./steps/app-7.ts)
</CodeGroupItem>
</CodeGroup>

Now we should be able to delete items.

## Manage our todos

Next up the `AppFooter`, where we:

1. show the uncompleted todo count – which should update after we add/remove/complete any todo
2. can clear the completed todos from the list – easier than deleting them one by one
3. filter our todos based on `isCompleted`

First, create our empty component:

<CodeGroup>
<CodeGroupItem title="src/components/app-footer/AppFooter.ts">

@[code ts](./steps/appfooter-1.ts)
</CodeGroupItem>
</CodeGroup>

### Remaining count

We can now add all our refs to the component, including the `remainingCount`, so we can update it.

<CodeGroup>
<CodeGroupItem title="src/components/app-footer/AppFooter.ts">

@[code{5-11} ts{2}](./steps/appfooter-2.ts)
</CodeGroupItem>
</CodeGroup>

And our props, including the `remainingCount` we will receive from the parent component.
We are not going to try to extract it from the HTML, but instead set it to `0` as default, since 
everything will client-rendered (and we only receive this information from the parent).

<CodeGroup>
<CodeGroupItem title="src/components/app-footer/AppFooter.ts">

@[code{12-15} ts{2}](./steps/appfooter-2.ts)
</CodeGroupItem>
</CodeGroup>

Then, we add the binding, to update the DOM whenever the prop changes.

<CodeGroup>
<CodeGroupItem title="src/components/app-footer/AppFooter.ts">

@[code{18-25} ts](./steps/appfooter-2.ts)
</CodeGroupItem>
</CodeGroup>

### Clear Completed

We already added our refs and props in the previous step, so we only have to add the `click` 
binding to `refs.clearCompletedButton` to call the `onClearCompleted` prop.

<CodeGroup>
<CodeGroupItem title="src/components/app-footer/AppFooter.ts">

@[code{26-30} ts](./steps/appfooter-2.ts)
</CodeGroupItem>
<CodeGroupItem title="Complete">

@[code ts{6-7,13-14,18-30}](./steps/appfooter-2.ts)
</CodeGroupItem>
</CodeGroup>

### Connect to parent

To initialize the `AppFooter` component, and connect the bindings, we have to add it to the 
`refs` in the `App` component.

@[code{22-22} ts](./steps/app-8.ts)

And then add the `bindings`.

For the `remainingTodoCount` we filter our `todos` to count everything that `isCompleted`.

And when `onClearCompleted` is called, we filter to only keep items that were not `isCompleted`.

<CodeGroup>
<CodeGroupItem title="src/components/app/App.ts">

@[code{49-54} ts](./steps/app-8.ts)
</CodeGroupItem>
<CodeGroupItem title="Complete">

@[code ts{22,49-54}](./steps/app-8.ts)
</CodeGroupItem>
</CodeGroup>

At this point you should see the counter in the footer update whenever you add, remove or (un)
complete todo items, and you should be able to use the "Clear Completed" button to remove 
everything that was checked off.

The **Filtering** is going to require quite some changes across the board, where we require some 
kind of "router", are going to include saving to localStorage, and add an `id` to our todo items 
to make things a bit easier.
