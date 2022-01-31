# 1. Initial Setup

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

<CodeGroup>
<CodeGroupItem title="src/components/app/App.template.ts">

@[code ts](./steps/app-template-1.ts)
</CodeGroupItem>
</CodeGroup>

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

::: tip Initial State
When rendering any template in Muban, think of it as the *initial state* of your application or component. Even
without executing any component initialisation, your templates should reflect what would be rendered on the server.
This means that your templates should not include any "interaction logic". The output should be a static string.
:::

### Component file

Now that we have our template, let's create the Component itself by creating `src/components/App/App.ts`.

<CodeGroup>
<CodeGroupItem title="src/components/app/App.ts">

@[code ts](./steps/app-1.ts)

</CodeGroupItem>
</CodeGroup>

Here we have done the following:

1. We import `defineComponent`, which is our factory function to create Muban Components.
2. As options, we give it a name, `app` in this case. This should match the `data-component` attribute from our
   template file.
3. Every component has a `setup` function, where it returns `bindings`. This is the "minimum required" code to be in
   there, we'll add more things later.
4. For now, we're adding a `console.log` to check if our component is correctly initialized.

::: tip Component Initialisation
A component is only initialized when there is an html element with the matching `data-component`attribute value
present in the DOM.

Additionally, the `Component` file should be registered to a "parent component", or globally 
to the Muban "application".

In the parent component this can be done by using `refComponent` for the refs, or otherwise 
using the `components` array. More on this later.
:::

## Rendering the App

Now that we have our first components (a template and logic file), it's time to render it by mounting our Application.

In the `main.ts` (that was created by Vite), change the code to this:

<CodeGroup>
<CodeGroupItem title="src/main.ts">

@[code ts](./steps/main-1.ts)

</CodeGroupItem>
</CodeGroup>

It does the following things:

1. Import `createApp`, to, well, create our Application.
2. Import our component and template files.
3. Query the root element of our application
4. Call `createApp` by passing our `App` component, which returns the `app` instance.
5. `mount` our application in the `appRoot`, passing the `appTemplate` to render the HTML, passing the `title` prop
   to pass to the template.

If we check the browser, we should see a `Todos` title, and `App Running..` in the devtools console.

::: tip Development mode
Calling `mount` with a template + data is normally something we only do in development, or abusing muban to create
a client-side-rendered App. The strength of muban lies in working with existing HTML that is rendered on the server.

If you already have HTML on the page, you can leave out the `template` and `data` arguments.
:::
