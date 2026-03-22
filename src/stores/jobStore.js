import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useJobStore = defineStore('job', () => {
  const jobs = ref(JSON.parse(localStorage.getItem('jobs') || '[]'));

  const addJob = (jobData) => {
    const newJob = {
      ...jobData,
      id: Date.now(), 
      posted_at: new Date().toLocaleDateString(),
      applications_count: 0,
      status: 'pending' // Added status since user mentioned admin review
    };
    
    jobs.value.push(newJob);
    localStorage.setItem('jobs', JSON.stringify(jobs.value));
    return newJob;
  };

  const getAllJobs = () => {
    return jobs.value;
  };

  return { 
    jobs, 
    addJob, 
    getAllJobs 
  };
});
