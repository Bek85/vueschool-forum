<script>
import { mapGetters } from 'vuex';

export default {
  name: 'TheNavbar',
  data() {
    return {
      userDropdownOpen: false,
    };
  },
  computed: {
    ...mapGetters(['authUser']),
  },
};
</script>

<template>
  <header id="header" class="header">
    <RouterLink :to="{ name: 'home' }" class="logo">
      <img src="@/assets/svg/vueschool-logo.svg" />
    </RouterLink>

    <div class="btn-hamburger">
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>

    <!-- use .navbar-open to open nav -->
    <nav class="navbar">
      <ul>
        <li v-if="authUser" class="navbar-user">
          <a
            :to="{ name: 'profile' }"
            @click.prevent="userDropdownOpen = !userDropdownOpen"
          >
            <img
              class="avatar-small"
              :src="authUser.avatar"
              :alt="`${authUser.name} profile picture`"
            />
            <span>
              {{ authUser?.name }}
              <img
                class="icon-profile"
                src="@/assets/svg/arrow-profile.svg"
                alt=""
              />
            </span>
          </a>

          <!-- dropdown menu -->
          <!-- add class "active-drop" to show the dropdown -->
          <div id="user-dropdown" :class="{ 'active-drop': userDropdownOpen }">
            <div class="triangle-drop"></div>
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item">
                <RouterLink :to="{ name: 'profile' }">View profile</RouterLink>
              </li>
              <li class="dropdown-menu-item">
                <a @click.prevent="$store.dispatch('signOut')"> Sign Out</a>
              </li>
            </ul>
          </div>
        </li>

        <li v-if="!authUser" class="navbar-item">
          <RouterLink :to="{ name: 'signIn' }">Sign In</RouterLink>
        </li>
        <li v-if="!authUser" class="navbar-item">
          <RouterLink :to="{ name: 'register' }">Register</RouterLink>
        </li>
      </ul>

      <!-- <ul>
        <li class="navbar-item">
          <a href="index.html">Home</a>
        </li>
        <li class="navbar-item">
          <a href="category.html">Category</a>
        </li>
        <li class="navbar-item">
          <a href="forum.html">Forum</a>
        </li>
        <li class="navbar-item">
          <a href="thread.html">Thread</a>
        </li> -->
      <!-- Show these option only on mobile-->
      <!-- <li class="navbar-item mobile-only">
          <a href="profile.html">My Profile</a>
        </li>
        <li class="navbar-item mobile-only">
          <a href="#">Logout</a>
        </li>
      </ul> -->
    </nav>
  </header>
</template>
