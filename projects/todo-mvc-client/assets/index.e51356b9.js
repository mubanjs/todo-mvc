var E=Object.defineProperty,F=Object.defineProperties;var S=Object.getOwnPropertyDescriptors;var b=Object.getOwnPropertySymbols;var w=Object.prototype.hasOwnProperty,O=Object.prototype.propertyIsEnumerable;var A=(t,e,o)=>e in t?E(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o,p=(t,e)=>{for(var o in e||(e={}))w.call(e,o)&&A(t,o,e[o]);if(b)for(var o of b(e))O.call(e,o)&&A(t,o,e[o]);return t},I=(t,e)=>F(t,S(e));import{d as v,p as u,b as i,c as s,r as f,a as k,h as C,u as D,n as M,e as $,f as x,w as N,g as _,i as H}from"./vendor.d35dc05b.js";const j=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const l of n)if(l.type==="childList")for(const d of l.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&r(d)}).observe(document,{childList:!0,subtree:!0});function o(n){const l={};return n.integrity&&(l.integrity=n.integrity),n.referrerpolicy&&(l.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?l.credentials="include":n.crossorigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function r(n){if(n.ep)return;n.ep=!0;const l=o(n);fetch(n.href,l)}};j();const U=v({name:"app-footer",refs:{remainingCount:"remainingCount",clearCompletedButton:"clearCompletedButton",filterAll:"filterAll",filterActive:"filterActive",filterCompleted:"filterCompleted"},props:{remainingTodoCount:u.number.defaultValue(0),onClearCompleted:u.func.optional.shape(),selectedFilter:u.string.optional},setup({refs:t,props:e}){return[i(t.remainingCount,{html:s(()=>`<strong>${e.remainingTodoCount}</strong> ${e.remainingTodoCount===1?"item":"items"} left`)}),i(t.clearCompletedButton,{click(){var o;(o=e.onClearCompleted)==null||o.call(e)}}),i(t.filterAll,{css:{selected:s(()=>e.selectedFilter===void 0)}}),i(t.filterActive,{css:{selected:s(()=>e.selectedFilter==="active")}}),i(t.filterCompleted,{css:{selected:s(()=>e.selectedFilter==="completed")}})]}}),q=v({name:"app-header",refs:{newTodoInput:"newTodoInput"},props:{onCreate:u.func.optional.shape()},setup({refs:t,props:e}){const o=f("");return[i(t.newTodoInput,{textInput:o,event:{keyup(r){var n;r.key==="Enter"&&((n=e.onCreate)==null||n.call(e,o.value),o.value="")}}})]}}),z=v({name:"todo-item",refs:{completedInput:"completedInput",title:"title",destroyButton:"destroyButton",editInput:k("editInput")},props:{id:u.string,title:u.string.source({type:"text",target:"title"}),isCompleted:u.boolean.source({type:"css",name:"completed"}),onChange:u.func.optional.shape(),onDelete:u.func.optional.shape()},setup({props:t,refs:e}){const o=f(!1),r=f(t.title),n=(l=!1)=>{var d;l?(d=t.onChange)==null||d.call(t,t.id,{title:r.value}):r.value=t.title,o.value=!1};return[i(e.self,{css:{completed:s(()=>t.isCompleted),editing:o}}),i(e.completedInput,{checked:s({get:()=>t.isCompleted,set(l){var d;(d=t.onChange)==null||d.call(t,t.id,{isCompleted:l})}})}),i(e.title,{event:{dblclick(){o.value=!0,queueMicrotask(()=>{var l;(l=e.editInput.element)==null||l.focus()})}},text:s(()=>t.title)}),i(e.editInput,{textInput:r,event:{keydown(l){["Esc","Escape"].includes(l.key)?n():["Enter"].includes(l.key)&&n(!0)},blur(){n(!0)}}}),i(e.destroyButton,{click(){var l;(l=t.onDelete)==null||l.call(t,t.id)}})]}});function L({id:t,title:e,isCompleted:o}){return C`<li
    data-component="todo-item"
    data-id=${t}
    class="${o?"completed":""}"
  >
    <div class="view">
      <input data-ref="completedInput" class="toggle" type="checkbox" checked=${o} />
      <label data-ref="title">${e}</label>
      <button data-ref="destroyButton" class="destroy"></button>
    </div>
    <input data-ref="editInput" class="edit" />
  </li>`}function B(){const[,t]=document.location.hash.split("/");if(t==="active"||t==="completed")return t}function J(t){const e=f(t),o=f(B());D(window,"popstate",()=>{o.value=B()});const r=s(()=>o.value===void 0?e.value:e.value.filter(a=>a.isCompleted===(o.value==="completed"))),n=s(()=>e.value.filter(a=>!a.isCompleted).length),l=a=>{const c=a.trim();c!==""&&(e.value=e.value.concat({title:c,isCompleted:!1,id:M()}))},d=a=>{e.value=e.value.filter(c=>c.id!==a)},h=(a,c)=>{let g=c;if(c.title!==void 0){const m=c.title.trim();if(m===""){d(a);return}g=I(p({},c),{title:m})}e.value=e.value.map(m=>m.id===a?p(p({},m),g):m)},T=()=>{e.value=e.value.filter(a=>!a.isCompleted)},y=s({get(){return n.value===0},set(a){e.value=e.value.map(c=>I(p({},c),{isCompleted:a}))}});return{todos:e,filteredTodos:r,selectedFilter:o,remainingTodoCount:n,addTodo:l,removeTodo:d,updateTodo:h,clearCompleted:T,allDone:y}}const P=v({name:"app",refs:{appHeader:$(q),toggleAllInput:k("toggleAllInput"),mainSection:"mainSection",todoList:"todoList",todoItems:x(z),appFooter:$(U)},setup({refs:t}){var c;const e=JSON.parse((c=localStorage.getItem("MUBAN_TODO_MVC_LIST"))!=null?c:"[]")||[],{todos:o,filteredTodos:r,selectedFilter:n,remainingTodoCount:l,addTodo:d,removeTodo:h,updateTodo:T,clearCompleted:y,allDone:a}=J(e);return N(()=>{localStorage.setItem("MUBAN_TODO_MVC_LIST",JSON.stringify(o.value))}),[i(t.appHeader,{onCreate:d}),i(t.toggleAllInput,{checked:a}),i(t.mainSection,{style:{display:s(()=>o.value.length===0?"none":"block")}}),_(t.todoList,r,g=>g.map(m=>L(m)).join(""),{renderImmediate:!0}),i(t.todoItems,{onChange:T,onDelete:h}),i(t.appFooter,{style:{display:s(()=>o.value.length===0?"none":"block")},remainingTodoCount:l,selectedFilter:n,onClearCompleted:y})]}});function V({uncompletedCount:t=0,selectedFilter:e}={}){return C`
    <footer data-component="app-footer" class="footer">
      <span data-ref="remainingCount" class="todo-count">
        <strong>${t}</strong> ${t===1?"item":"items"} left
      </span>
      <ul class="filters">
        <li>
          <a data-ref="filterAll" class="${e?"":"selected"}" href="#/">All</a>
        </li>
        <li>
          <a
            data-ref="filterActive"
            class="${e==="active"?"selected":""}"
            href="#/active"
          >
            Active
          </a>
        </li>
        <li>
          <a
            data-ref="filterCompleted"
            class="${e==="completed"?"selected":""}"
            href="#/completed"
          >
            Completed
          </a>
        </li>
      </ul>
      <!-- Hidden if no completed items are left ↓ -->
      <button data-ref="clearCompletedButton" class="clear-completed">Clear completed</button>
    </footer>
  `}function K({title:t="Todos"}={}){return C`<div data-component="app-header" class="header">
    <h1>${t}</h1>
    <input
      data-ref="newTodoInput"
      class="new-todo"
      placeholder="What needs to be done?"
      autofocus
    />
  </div>`}function R({title:t,todos:e=[]}={}){return C`
    <div data-component="app">
      <section class="todoapp">
        ${K({title:t})}
        <section data-ref="mainSection" class="main">
          <input data-ref="toggleAllInput" id="toggle-all" class="toggle-all" type="checkbox" />
          <label for="toggle-all">Mark all as complete</label>
          <ul data-ref="todoList" class="todo-list">
            ${e.map(o=>L(o))}
          </ul>
        </section>
        ${V({uncompletedCount:e.filter(o=>!o.isCompleted).length})}
      </section>
      <footer class="info">
        <p>Double-click to edit a todo</p>
        <p>Created by <a href="http://github.com/mubanjs">Muban</a></p>
      </footer>
    </div>
  `}const W=document.getElementById("app"),G=H(P);G.mount(W,R,{title:"Todos",todos:[]});
