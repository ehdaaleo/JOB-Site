<!-- @startuml
title Job Board Application - Entity Relationship Dia

' ========================
' Users Section
' ========================
class User {
  -id: bigint PK
  -name: string
  -email: string UK
  -password: string
  -role: string
  -company_name: string
  -company_logo: string
  -phone: string
  -linkedin_profile: string
  -resume: string
  -profile_picture: string
  -bio: text
  -location: string
  -email_verified_at: timestamp
  -remember_token: string
  -created_at: timestamp
  -updated_at: timestamp
  +login()
  +logout()
  +register()
  +updateProfile()
}
-->

<script setup>
import Hero from '../components/Hero.vue'
</script>


<template>
  <Hero />
</template>


<style scoped>

</style>
