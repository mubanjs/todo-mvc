import{r as c,o as l,c as i,b as t,w as a,F as r,e as s,a as n,d as e}from"./app.387eb9c4.js";import{_ as u}from"./plugin-vue_export-helper.21dcd24c.js";const d={},m=s(`<h1 id="_1-initial-setup" tabindex="-1"><a class="header-anchor" href="#_1-initial-setup" aria-hidden="true">#</a> 1. Initial Setup</h1><p>In this example we&#39;re using <code>Vite</code> to develop the project, but you can use whatever developer setup you want.</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">npm</span> init vite@latest

\u2714 Project name: \u2026 todo-app
\u2714 Select a framework: \u203A vanilla
\u2714 Select a variant: \u203A vanilla-ts
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>Then, <code>cd todo-app</code>, <code>npm install</code> the packages and run <code>npm run dev</code> to start your server. Visit <code>http://localhost:3000</code> to see the <code>Hello Vite</code> starting point.</p><p>To start with <code>muban</code>, install these two packages;</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">npm</span> i @muban/muban @muban/template
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h2 id="our-first-component" tabindex="-1"><a class="header-anchor" href="#our-first-component" aria-hidden="true">#</a> Our first component</h2><p>Our first component will be the <code>App</code> component, which will be the root of our application. To keep things simple, we are only going to render a custom title in the template, with no logic in the component itself.</p><h3 id="template-file" tabindex="-1"><a class="header-anchor" href="#template-file" aria-hidden="true">#</a> Template file</h3><p>Create a <code>src/components/App/App.template.ts</code> for our template;</p>`,10),h=n("div",{class:"language-typescript ext-ts line-numbers-mode"},[n("pre",{class:"language-typescript"},[n("code",null,[n("span",{class:"token keyword"},"import"),e(),n("span",{class:"token punctuation"},"{"),e(" html"),n("span",{class:"token punctuation"},","),e(" ComponentTemplateResult "),n("span",{class:"token punctuation"},"}"),e(),n("span",{class:"token keyword"},"from"),e(),n("span",{class:"token string"},"'@muban/template'"),n("span",{class:"token punctuation"},";"),e(`

`),n("span",{class:"token keyword"},"export"),e(),n("span",{class:"token keyword"},"type"),e(),n("span",{class:"token class-name"},"AppTemplateProps"),e(),n("span",{class:"token operator"},"="),e(),n("span",{class:"token punctuation"},"{"),e(`
  title`),n("span",{class:"token operator"},"?"),n("span",{class:"token operator"},":"),e(),n("span",{class:"token builtin"},"string"),n("span",{class:"token punctuation"},";"),e(`
`),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},";"),e(`

`),n("span",{class:"token keyword"},"export"),e(),n("span",{class:"token keyword"},"function"),e(),n("span",{class:"token function"},"appTemplate"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),e(" title "),n("span",{class:"token operator"},"="),e(),n("span",{class:"token string"},"'Todos'"),e(),n("span",{class:"token punctuation"},"}"),n("span",{class:"token operator"},":"),e(" AppTemplateProps"),n("span",{class:"token punctuation"},")"),n("span",{class:"token operator"},":"),e(" ComponentTemplateResult "),n("span",{class:"token punctuation"},"{"),e(`
  `),n("span",{class:"token keyword"},"return"),e(" html"),n("span",{class:"token template-string"},[n("span",{class:"token template-punctuation string"},"`"),n("span",{class:"token string"},`
    <div data-component="app">
      <h1>`),n("span",{class:"token interpolation"},[n("span",{class:"token interpolation-punctuation punctuation"},"${"),e("title"),n("span",{class:"token interpolation-punctuation punctuation"},"}")]),n("span",{class:"token string"},`</h1>
    </div>
  `),n("span",{class:"token template-punctuation string"},"`")]),n("span",{class:"token punctuation"},";"),e(`
`),n("span",{class:"token punctuation"},"}"),e(`
`)])]),n("div",{class:"line-numbers"},[n("span",{class:"line-number"},"1"),n("br"),n("span",{class:"line-number"},"2"),n("br"),n("span",{class:"line-number"},"3"),n("br"),n("span",{class:"line-number"},"4"),n("br"),n("span",{class:"line-number"},"5"),n("br"),n("span",{class:"line-number"},"6"),n("br"),n("span",{class:"line-number"},"7"),n("br"),n("span",{class:"line-number"},"8"),n("br"),n("span",{class:"line-number"},"9"),n("br"),n("span",{class:"line-number"},"10"),n("br"),n("span",{class:"line-number"},"11"),n("br"),n("span",{class:"line-number"},"12"),n("br"),n("span",{class:"line-number"},"13"),n("br")])],-1),k=s('<p>Here we have done the following;</p><ol><li>We import <code>html</code> from <code>@muban/template</code>, a helper to write our tagged template strings.</li><li>We define a <code>type</code> for our template props. We always pass our props as an object. Optional props can be marked with a <code>?</code> in the type, and potentially given a default value when destructuring them.</li><li>We create the template itself, which is a normal function, receiving the props as an object, and returning a <code>ComponentTemplateResult</code> (which is a <code>string</code>, or an <code>Array</code> of <code>strings</code>). Which is what the <code>html</code> helper will return.</li><li>We define our root element, adding a <code>data-component</code> attribute with <code>app</code>, to link it to our TypeScript Component file later. Each template should always have a single root element, that should have a matching <code>data-component</code> attribute. Besides linking it to our logic, it can also be used to style our components (as apposed to classnames).</li><li>We use our <code>title</code> prop in our html, as you would use any variable in a template string.</li></ol><div class="custom-container tip"><p class="custom-container-title">Initial State</p><p>When rendering any template in Muban, think of it as the <em>initial state</em> of your application or component. Even without executing any component initialisation, your templates should reflect what would be rendered on the server. This means that your templates should not include any &quot;interaction logic&quot;. The output should be a static string.</p></div><h3 id="component-file" tabindex="-1"><a class="header-anchor" href="#component-file" aria-hidden="true">#</a> Component file</h3><p>Now that we have our template, let&#39;s create the Component itself by creating <code>src/components/App/App.ts</code>.</p>',5),b=n("div",{class:"language-typescript ext-ts line-numbers-mode"},[n("pre",{class:"language-typescript"},[n("code",null,[n("span",{class:"token keyword"},"import"),e(),n("span",{class:"token punctuation"},"{"),e(" defineComponent "),n("span",{class:"token punctuation"},"}"),e(),n("span",{class:"token keyword"},"from"),e(),n("span",{class:"token string"},"'@muban/muban'"),n("span",{class:"token punctuation"},";"),e(`

`),n("span",{class:"token keyword"},"export"),e(),n("span",{class:"token keyword"},"const"),e(" App "),n("span",{class:"token operator"},"="),e(),n("span",{class:"token function"},"defineComponent"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},"{"),e(`
  name`),n("span",{class:"token operator"},":"),e(),n("span",{class:"token string"},"'app'"),n("span",{class:"token punctuation"},","),e(`
  `),n("span",{class:"token function"},"setup"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),e(),n("span",{class:"token punctuation"},"{"),e(`
    `),n("span",{class:"token builtin"},"console"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"log"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},"'App Running...'"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),e(`
    `),n("span",{class:"token keyword"},"return"),e(),n("span",{class:"token punctuation"},"["),n("span",{class:"token punctuation"},"]"),n("span",{class:"token punctuation"},";"),e(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},","),e(`
`),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),e(`
`)])]),n("div",{class:"line-numbers"},[n("span",{class:"line-number"},"1"),n("br"),n("span",{class:"line-number"},"2"),n("br"),n("span",{class:"line-number"},"3"),n("br"),n("span",{class:"line-number"},"4"),n("br"),n("span",{class:"line-number"},"5"),n("br"),n("span",{class:"line-number"},"6"),n("br"),n("span",{class:"line-number"},"7"),n("br"),n("span",{class:"line-number"},"8"),n("br"),n("span",{class:"line-number"},"9"),n("br")])],-1),g=s('<p>Here we have done the following:</p><ol><li>We import <code>defineComponent</code>, which is our factory function to create Muban Components.</li><li>As options, we give it a name, <code>app</code> in this case. This should match the <code>data-component</code> attribute from our template file.</li><li>Every component has a <code>setup</code> function, where it returns <code>bindings</code>. This is the &quot;minimum required&quot; code to be in there, we&#39;ll add more things later.</li><li>For now, we&#39;re adding a <code>console.log</code> to check if our component is correctly initialized.</li></ol><div class="custom-container tip"><p class="custom-container-title">Component Initialisation</p><p>A component is only initialized when there is an html element with the matching <code>data-component</code>attribute value present in the DOM.</p><p>Additionally, the <code>Component</code> file should be registered to a &quot;parent component&quot;, or globally to the Muban &quot;application&quot;.</p><p>In the parent component this can be done by using <code>refComponent</code> for the refs, or using the <code>components</code> array. More on this later.</p></div><h2 id="rendering-the-app" tabindex="-1"><a class="header-anchor" href="#rendering-the-app" aria-hidden="true">#</a> Rendering the App</h2><p>Now that we have our first component (a template and logic file), it&#39;s time to render it by mounting our Application.</p><p>In the <code>main.ts</code> (that was created by Vite), change the code to this:</p>',6),f=n("div",{class:"language-typescript ext-ts line-numbers-mode"},[n("pre",{class:"language-typescript"},[n("code",null,[n("span",{class:"token keyword"},"import"),e(),n("span",{class:"token string"},"'./style.css'"),n("span",{class:"token punctuation"},";"),e(`

`),n("span",{class:"token keyword"},"import"),e(),n("span",{class:"token punctuation"},"{"),e(" createApp "),n("span",{class:"token punctuation"},"}"),e(),n("span",{class:"token keyword"},"from"),e(),n("span",{class:"token string"},"'@muban/muban'"),n("span",{class:"token punctuation"},";"),e(`
`),n("span",{class:"token keyword"},"import"),e(),n("span",{class:"token punctuation"},"{"),e(" App "),n("span",{class:"token punctuation"},"}"),e(),n("span",{class:"token keyword"},"from"),e(),n("span",{class:"token string"},"'./components/app/App'"),n("span",{class:"token punctuation"},";"),e(`
`),n("span",{class:"token keyword"},"import"),e(),n("span",{class:"token punctuation"},"{"),e(" appTemplate "),n("span",{class:"token punctuation"},"}"),e(),n("span",{class:"token keyword"},"from"),e(),n("span",{class:"token string"},"'./components/app/App.template'"),n("span",{class:"token punctuation"},";"),e(`

`),n("span",{class:"token keyword"},"const"),e(" appRoot "),n("span",{class:"token operator"},"="),e(" document"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"getElementById"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},"'app'"),n("span",{class:"token punctuation"},")"),n("span",{class:"token operator"},"!"),n("span",{class:"token punctuation"},";"),e(`
`),n("span",{class:"token keyword"},"const"),e(" app "),n("span",{class:"token operator"},"="),e(),n("span",{class:"token function"},"createApp"),n("span",{class:"token punctuation"},"("),e("App"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),e(`

app`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"mount"),n("span",{class:"token punctuation"},"("),e("appRoot"),n("span",{class:"token punctuation"},","),e(" appTemplate"),n("span",{class:"token punctuation"},","),e(),n("span",{class:"token punctuation"},"{"),e(`
  title`),n("span",{class:"token operator"},":"),e(),n("span",{class:"token string"},"'Todos'"),n("span",{class:"token punctuation"},","),e(`
`),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),e(`
`)])]),n("div",{class:"line-numbers"},[n("span",{class:"line-number"},"1"),n("br"),n("span",{class:"line-number"},"2"),n("br"),n("span",{class:"line-number"},"3"),n("br"),n("span",{class:"line-number"},"4"),n("br"),n("span",{class:"line-number"},"5"),n("br"),n("span",{class:"line-number"},"6"),n("br"),n("span",{class:"line-number"},"7"),n("br"),n("span",{class:"line-number"},"8"),n("br"),n("span",{class:"line-number"},"9"),n("br"),n("span",{class:"line-number"},"10"),n("br"),n("span",{class:"line-number"},"11"),n("br"),n("span",{class:"line-number"},"12"),n("br")])],-1),w=s('<p>It does the following things:</p><ol><li>Import <code>createApp</code>, for creating our Muban Application.</li><li>Import our component and template files.</li><li>Query the root element of our application.</li><li>Call <code>createApp</code> by passing our <code>App</code> component, which returns the <code>app</code> instance.</li><li><code>mount</code> our application in the <code>appRoot</code>, passing the <code>appTemplate</code> to render the HTML, passing the <code>title</code> prop to pass to the template.</li></ol><p>If we check the browser, we should see a <code>Todos</code> title, and <code>App Running...</code> in the devtools console.</p><div class="custom-container tip"><p class="custom-container-title">Development mode</p><p>Calling <code>mount</code> with a template + data is normally something we only do in development, or abusing muban to create a client-side-rendered App. The strength of muban lies in working with existing HTML that is rendered on the server.</p><p>If you already have HTML on the page, you can leave out the <code>template</code> and <code>data</code> arguments.</p></div>',4);function y(v,_){const o=c("CodeGroupItem"),p=c("CodeGroup");return l(),i(r,null,[m,t(p,null,{default:a(()=>[t(o,{title:"src/components/app/App.template.ts"},{default:a(()=>[h]),_:1})]),_:1}),k,t(p,null,{default:a(()=>[t(o,{title:"src/components/app/App.ts"},{default:a(()=>[b]),_:1})]),_:1}),g,t(p,null,{default:a(()=>[t(o,{title:"src/main.ts"},{default:a(()=>[f]),_:1})]),_:1}),w],64)}var C=u(d,[["render",y]]);export{C as default};
