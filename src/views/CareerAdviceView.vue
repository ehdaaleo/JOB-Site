<script setup>
import Navbar from '@/components/homePageComponents/navbar.vue'
import Footer from '@/components/homePageComponents/footer.vue'

const interviewTips = [
  'Read the job description carefully and match your skills to the main requirements.',
  'Research the company, its products, services, and recent work before the interview.',
  'Prepare a short introduction about yourself, your education, your experience, and your goals.',
  'Practice common questions such as “Tell me about yourself” and “Why should we hire you?”',
  'Prepare examples from projects, training, internships, or previous jobs that show your skills.',
  'Dress professionally, arrive on time, and keep your phone silent during the interview.',
  'Ask clear questions about the role, team, work process, and next steps.',
]

const cvTips = [
  'Keep your CV clear, simple, and easy to scan. One or two pages is usually enough.',
  'Add your name, phone number, email, location, and links such as LinkedIn or GitHub if available.',
  'Write a short professional summary that explains your target role and strongest skills.',
  'List education, experience, projects, courses, and technical skills in separate sections.',
  'Use bullet points that start with action verbs and show results when possible.',
  'Customize your CV for each job by highlighting the most relevant skills and keywords.',
  'Check spelling, grammar, dates, and formatting before sending your CV.',
]
</script>

<template>
  <Navbar />
  <main class="min-h-screen bg-slate-50 pt-16">
    <section class="border-b border-gray-200 bg-white">
      <div class="container mx-auto max-w-6xl px-4 py-14">
        <div class="max-w-3xl">
          <p class="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
            Career Advice
          </p>
          <h1 class="mb-5 text-4xl font-bold text-gray-950 md:text-5xl">
            Prepare for interviews and build a stronger CV.
          </h1>
          <p class="text-lg leading-8 text-gray-600">
            Use these practical tips before applying for jobs, attending
            interviews, or updating your CV. A clear CV and good preparation
            can help you present your skills with more confidence.
          </p>
        </div>
      </div>
    </section>

    <section class="container mx-auto max-w-6xl px-4 py-12">
      <div class="grid gap-8 lg:grid-cols-2">
        <article class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div class="mb-6">
            <p class="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
              Interview Preparation
            </p>
            <h2 class="text-2xl font-bold text-gray-950">
              How to prepare yourself for interviews
            </h2>
          </div>

          <ul class="space-y-4">
            <li
              v-for="tip in interviewTips"
              :key="tip"
              class="flex gap-3 text-gray-700"
            >
              <span
                class="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700"
              >
                ✓
              </span>
              <span class="leading-7">{{ tip }}</span>
            </li>
          </ul>
        </article>

        <article class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div class="mb-6">
            <p class="mb-2 text-sm font-semibold uppercase tracking-wide text-green-600">
              CV Tips
            </p>
            <h2 class="text-2xl font-bold text-gray-950">
              How to make a good CV
            </h2>
          </div>

          <ul class="space-y-4">
            <li
              v-for="tip in cvTips"
              :key="tip"
              class="flex gap-3 text-gray-700"
            >
              <span
                class="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-50 text-sm font-bold text-green-700"
              >
                ✓
              </span>
              <span class="leading-7">{{ tip }}</span>
            </li>
          </ul>
        </article>
      </div>

      <div class="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 class="mb-3 text-2xl font-bold text-gray-950">Before You Apply</h2>
        <p class="leading-8 text-gray-600">
          Review your CV, save the jobs that match your goals, and apply only
          after checking that your skills and experience fit the role. A focused
          application is usually stronger than sending the same CV everywhere.
        </p>
      </div>
    </section>
  </main>
  <Footer />
</template>
