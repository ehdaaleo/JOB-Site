<script setup>
import Navbar from '@/components/homePageComponents/navbar.vue'
import Footer from '@/components/homePageComponents/footer.vue'

const developers = [
  {
    name: 'Ehdaa A.Salah',
    email: 'abdullahehdaa@gmail.com',
  },
  {
    name: 'Gerges Yousef',
    email: 'gergesyousef@gmail.com',
  },
  {
    name: 'Abdlerhman Tolba',
    email: 'abdotolba@gmail.com',
  },
  {
    name: 'Mostafa Ahmed',
    email: 'mostafaahmed@gmail.com',
  },
  {
    name: 'Isac Nady',
    email: 'isacnady@gmail.com',
  },
]

const initials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
</script>

<template>
  <Navbar />
  <main class="min-h-screen bg-slate-50 pt-16">
    <section class="border-b border-gray-200 bg-white">
      <div class="container mx-auto max-w-6xl px-4 py-14">
        <div class="max-w-3xl">
          <p class="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
            About Us
          </p>
          <h1 class="mb-5 text-4xl font-bold text-gray-950 md:text-5xl">
            Built to connect job seekers with better opportunities.
          </h1>
          <p class="text-lg leading-8 text-gray-600">
            Find Jobs site is a job platform designed to make searching,
            saving, applying, and managing job opportunities easier for
            candidates and employers. The project focuses on clear workflows,
            useful dashboards, and a simple experience for both sides of the
            hiring process.
          </p>
        </div>
      </div>
    </section>

    <section class="container mx-auto max-w-6xl px-4 py-12">
      <div class="mb-8 flex flex-col gap-2">
        <h2 class="text-2xl font-bold text-gray-950">Development Team</h2>
        <p class="max-w-2xl text-gray-600">
          This website was developed by the team below.
        </p>
      </div>

      <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="developer in developers"
          :key="developer.email"
          class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-colors hover:border-blue-300"
        >
          <div class="mb-5 flex items-center gap-4">
            <div
              class="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-700"
            >
              {{ initials(developer.name) }}
            </div>
            <div>
              <h3 class="font-semibold text-gray-950">{{ developer.name }}</h3>
              <p class="text-sm text-gray-500">Developer</p>
            </div>
          </div>
          <a
            :href="`mailto:${developer.email}`"
            class="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            {{ developer.email }}
          </a>
        </article>
      </div>
    </section>
  </main>
  <Footer />
</template>
