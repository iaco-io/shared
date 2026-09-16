<script lang="ts">
  import { page } from '$app/state'
  import type { Component } from 'svelte'
  import './style.css'

  type NavTab = {
    title: string
    href?: string
    onclick?: (event?: MouseEvent) => void
    icon: Component
  }

  let { tabs = [] }: { tabs: NavTab[] } = $props()
</script>

<nav class="glass-bg bottom-nav">
  {#each tabs as tab}
    {@const Icon = tab.icon}

    <a class:active={page.url.pathname === tab.href} href={tab.href}>
      <Icon
        class="icon-shadow"
        size={19}
        strokeWidth={page.url.pathname === tab.href ? 1.8 : 1.2}
        color={page.url.pathname === tab.href ? undefined : 'var(--gray)'}
      />
      <p style:color={page.url.pathname === tab.href ? undefined : 'var(--gray)'}>
        {tab.title}
      </p>
    </a>
  {/each}
</nav>

<style>
  nav {
    position: absolute;
    left: env(safe-area-inset-left);
    z-index: 10;
    display: flex;
    flex-direction: column;
    width: var(--navbar-size);
    height: 100dvh;
    padding-top: 30px;
    scrollbar-width: none;
  }

  nav a {
    display: flex;
    flex-direction: column;
    color: var(--fg);
    text-shadow: 0 0 4px var(--bg);
    width: 100%;
    height: calc(var(--navbar-size) + 10px);
    margin: 5px 0;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 10px;
    text-decoration: none;
    align-items: center;
    justify-content: center;
    gap: 2px;
  }

  nav a.active {
    border-right: 1px solid var(--fg);
    font-weight: bolder;
  }

  @media (max-width: 600px) {
    .bottom-nav {
      height: calc(var(--navbar-size) + env(safe-area-inset-bottom));
    }

    nav {
      bottom: 0;
      flex-direction: row;
      box-sizing: border-box;
      width: 100%;
      padding-top: unset;
      padding: 0 15px;
      border-right: unset;
      justify-content: space-evenly;
    }

    nav a {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: start;
      box-sizing: border-box;
      height: calc(var(--navbar-size) + env(safe-area-inset-bottom));
      margin: 0 5px;
      padding: 4px 0;
    }

    nav a.active {
      border-right: unset;
      border-top: 1px solid var(--fg);
    }
  }
</style>
