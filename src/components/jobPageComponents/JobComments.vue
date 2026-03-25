
<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useJobStore } from '../../stores/jobStore';

const props = defineProps({
  jobId: {
    type: [String, Number],
    required: true
  }
});

const router = useRouter();
const jobStore = useJobStore();

// reactive job reference and comments array
const job = computed(() => jobStore.getJobById(props.jobId));
const comments = computed(() => job.value?.comments || []);

// mock auth data
const isLoggedIn = ref(true); // default to logged in for testing
const currentUser = ref({
  id: 'u1',
  name: 'Mostafa Ahmed',
  initials: 'MA',
  role: 'candidate'
});

// state
const newComment = ref('');
const replyText = ref('');
const replyTo = ref(null);
const editingCommentId = ref(null);
const updateContent = ref('');
const sortBy = ref('recent');
const isSortDropdownOpen = ref(false);
const sortOptions = [
  { value: 'recent', label: 'Most recent' },
  { value: 'oldest', label: 'Oldest' }
];
const currentSortLabel = computed(() => sortOptions.find(o => o.value === sortBy.value)?.label || 'Most recent');
const loadingMore = ref(false);
const isDeleteModalOpen = ref(false);
const commentToDeleteId = ref(null);

const visibleCount = ref(3); // how many comments to show in first time

// Computed
const sortedComments = computed(() => {
  let list = [...comments.value];
  if (sortBy.value === 'recent') {
    list.sort((a, b) => b.timestamp - a.timestamp);
  } else if (sortBy.value === 'oldest') {
    list.sort((a, b) => a.timestamp - b.timestamp);
  }
  // only return the visible count
  return list.slice(0, visibleCount.value);
});

// Computed flag to check if there are more comments hidden
const hasMoreComments = computed(() => {
  return visibleCount.value < comments.value.length;
});

// Methods
const postComment = () => {
  if (!newComment.value.trim() || !job.value) return;
  if (!job.value.comments) {
    job.value.comments = [];
  }
  job.value.comments.push({
    id: Date.now().toString(),
    user: {
      id: currentUser.value.id,
      name: currentUser.value.name,
      initials: currentUser.value.initials,
      avatarColor: '#8b5cf6',
      role: currentUser.value.role
    },
    time: 'Just now',
    content: newComment.value.trim(),
    timestamp: Date.now()
  });
  newComment.value = '';
};

const postReply = (commentId) => {
  if (!replyText.value.trim() || !job.value) return;
  const parent = comments.value.find(c => c.id === commentId);
  if (!parent) return;
  if (!job.value.comments) {
    job.value.comments = [];
  }
  job.value.comments.push({
    id: Date.now().toString(),
    user: {
      id: currentUser.value.id,
      name: currentUser.value.name,
      initials: currentUser.value.initials,
      avatarColor: '#8b5cf6',
      role: currentUser.value.role
    },
    time: 'Just now',
    content: `@${parent.user.name} ` + replyText.value.trim(),
    timestamp: Date.now()
  });
  replyText.value = '';
  replyTo.value = null;
};

const deleteComment = (id) => {
  commentToDeleteId.value = id;
  isDeleteModalOpen.value = true;
};

const confirmDelete = () => {
  const id = commentToDeleteId.value;
  if (!job.value || !job.value.comments || !id) return;
  const idx = job.value.comments.findIndex(c => c.id === id);
  if (idx !== -1) {
    job.value.comments.splice(idx, 1);
  }
  closeDeleteModal();
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  commentToDeleteId.value = null;
};

const startEdit = (comment) => {
  editingCommentId.value = comment.id;
  updateContent.value = comment.content;
  replyTo.value = null; // hide reply if open
};

const cancelEdit = () => {
  editingCommentId.value = null;
  updateContent.value = '';
};

const saveEdit = (id) => {
  if (!updateContent.value.trim() || !job.value || !job.value.comments) return;
  const comment = job.value.comments.find(c => c.id === id);
  if (comment) {
    comment.content = updateContent.value.trim();
  }
  cancelEdit();
};

const loadMore = () => {
  loadingMore.value = true;
  // simulate fetching data
  setTimeout(() => {
    visibleCount.value += 3; // Show 3 more comments
    loadingMore.value = false;
  }, 600);
};
</script>


<template>
  <div class="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 font-sans">

    <!--  Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2 font-bold text-slate-900 text-sm sm:text-base">
        <div class="w-7 h-7 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        </div>
        Comments
      </div>
      <span class="bg-blue-50 border border-blue-100 text-blue-600 text-[11px] font-bold px-2.5 py-0.5 rounded-full">{{ comments.length }} comments</span>
    </div>

    <!--  Write box for logged in -->
    <div v-if="isLoggedIn" class="bg-slate-50 border border-slate-200 rounded-lg p-3.5 mb-4">
      <div class="flex gap-2.5 items-start">
        <div class="w-[34px] h-[34px] bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xs rounded-full flex items-center justify-center shrink-0">{{ currentUser.initials }}</div>
        <textarea
          v-model="newComment"
          class="flex-1 w-full bg-white border border-slate-200 rounded-lg text-slate-900 text-[13px] p-2.5 outline-none resize-none focus:border-blue-600 placeholder-slate-400 min-h-[80px]"
          rows="3"
          placeholder="Share a question or thought about this job"
        ></textarea>
      </div>
      <div class="flex items-center flex-wrap sm:flex-nowrap justify-between mt-2.5 pl-0 sm:pl-[44px]">
        <span class="text-[11px] text-slate-400">Be respectful and constructive</span>
        <button
          class="mt-2 sm:mt-0 bg-blue-600 text-white rounded-lg px-5 py-2 font-bold text-[13px] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!newComment.trim()"
          @click="postComment"
        >
          Post comment
        </button>
      </div>
    </div>

    <!-- layout for juest -->
    <div v-else class="bg-blue-50 border border-blue-100 rounded-lg p-3.5 px-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div class="flex items-center gap-2.5 self-start sm:self-auto">
        <div class="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        </div>
        <div>
          <p class="text-[15px] font-medium text-blue-700 mb-0.5">Join the discussion</p>
          <p class="text-[13px] text-blue-600 opacity-70">Login or register to post a comment</p>
        </div>
      </div>
      <div class="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
        <button class="flex-1 sm:flex-none px-4 py-1.5 bg-blue-600 text-white rounded-lg font-bold text-xs hover:bg-blue-700" @click="$router.push('/login')">Login</button>
        <button class="flex-1 sm:flex-none px-4 py-1.5 bg-white text-blue-600 border border-blue-100 rounded-lg font-medium text-xs hover:bg-blue-50" @click="$router.push('/register')">Register</button>
      </div>
    </div>

    <!-- sort by section -->
    <div v-if="comments.length > 0" class="flex items-center justify-between py-3 border-y border-slate-200 mb-4 relative">
      <span class="text-xs text-slate-400 font-medium">{{ comments.length }} comments</span>
      
      <div class="relative">
        <button 
          @click="isSortDropdownOpen = !isSortDropdownOpen"
          class="flex items-center gap-1.5 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 rounded-lg text-slate-700 text-xs font-semibold px-3 py-1.5 transition-all shadow-sm outline-none w-32 justify-between"
        >
          <span>{{ currentSortLabel }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': isSortDropdownOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
        </button>

        <!-- Invisible overlay to catch clicks outside -->
        <div v-if="isSortDropdownOpen" @click="isSortDropdownOpen = false" class="fixed inset-0 z-10"></div>

        <!-- Dropdown Menu -->
        <div 
          v-if="isSortDropdownOpen"
          class="absolute right-0 top-full mt-1.5 w-36 bg-white border border-slate-100 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] z-20 py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <button 
            v-for="option in sortOptions" 
            :key="option.value"
            @click="sortBy = option.value; isSortDropdownOpen = false"
            class="w-full text-left px-3.5 py-2 text-xs font-medium transition-colors hover:bg-slate-50 flex items-center justify-between"
            :class="sortBy === option.value ? 'text-blue-600 bg-blue-50' : 'text-slate-600'"
          >
            {{ option.label }}
            <svg v-if="sortBy === option.value" xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd" /></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Comments list -->
    <div class="flex flex-col">
      <div
        v-for="comment in sortedComments"
        :key="comment.id"
        class="group relative flex gap-3 py-4 border-b border-slate-200 last:border-0"
      >
        <!--  Delete Confirmation  -->
        <div 
          v-if="commentToDeleteId === comment.id && isDeleteModalOpen" 
          class="absolute inset-0 bg-white/95 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-xl animate-in fade-in zoom-in-95 duration-200 px-4 text-center"
        >
          <div class="flex flex-col items-center gap-3">
            <div class="flex items-center gap-2 text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <span class="text-[13px] font-bold">Do you want to delete comment?</span>
            </div>
            <div class="flex gap-2">
              <button 
                @click="closeDeleteModal" 
                class="px-5 py-1.5 text-[11px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                type="button"
              >
                Cancel
              </button>
              <button 
                @click="confirmDelete" 
                class="px-5 py-1.5 text-[11px] font-bold text-white bg-red-600 hover:bg-red-700 rounded-full shadow-lg shadow-red-600/20 active:scale-95 transition-all"
                type="button"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
        <!-- image -->
        <div
          class="w-9 h-9 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0"
          :style="{ background: comment.user.avatarColor }"
        >{{ comment.user.initials }}</div>

        <!-- comment body -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1.5 flex-wrap">
            <span class="text-[13px] font-medium text-slate-900">{{ comment.user.name }}</span>
            <span
              class="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              :class="comment.user.role === 'Employer' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-blue-50 border border-blue-100 text-blue-700'"
            >{{ comment.user.role }}</span>
            <span class="text-[11px] text-slate-400 ml-auto">{{ comment.time }}</span>
          </div>

          <div v-if="editingCommentId === comment.id" class="mb-2.5">
            <textarea
              v-model="updateContent"
              class="w-full bg-white border border-slate-200 rounded-lg text-slate-900 text-[13px] p-2.5 outline-none resize-none focus:border-blue-600 placeholder-slate-400 min-h-[60px]"
              rows="2"
            ></textarea>
            <div class="flex justify-end gap-2 mt-2">
              <button
                class="px-3.5 py-1.5 border border-slate-300 text-slate-400 rounded-lg text-xs hover:text-slate-600 hover:border-slate-400"
                @click="cancelEdit"
              >
                Cancel
              </button>
              <button
                class="px-3.5 py-1.5 bg-blue-600 text-white rounded-lg font-bold text-xs hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!updateContent.trim()"
                @click="saveEdit(comment.id)"
              >
                Save
              </button>
            </div>
          </div>
          <p v-else class="text-[13px] text-slate-600 leading-relaxed mb-2.5 break-words">{{ comment.content }}</p>

          <div class="flex items-center gap-1">
            <button
              v-if="isLoggedIn && comment.user.id === currentUser.id"
              class="text-xs text-slate-400 px-2 py-1 rounded-md transition-colors hover:bg-slate-50 hover:text-slate-600 border border-transparent hover:border-slate-200"
              @click="startEdit(comment)"
            >
              Edit
            </button>
            <!-- reply for only logged in users-->
            <button
              v-if="isLoggedIn"
              class="text-xs text-slate-400 px-2 py-1 rounded-md transition-colors hover:bg-slate-50 hover:text-slate-600 border border-transparent hover:border-slate-200"
              @click="replyTo = replyTo === comment.id ? null : comment.id"
            >
              Reply
            </button>

            <!-- delete my comment or if admin -->
            <button
              v-if="isLoggedIn && (comment.user.id === currentUser.id || currentUser.role === 'admin')"
              class="text-xs text-slate-400 px-2 py-1 rounded-md transition-colors hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-200"
              @click="deleteComment(comment.id)"
            >
              Delete
            </button>
          </div>

          <!-- reply box -->
          <div v-if="replyTo === comment.id && isLoggedIn" class="flex gap-2 items-start mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div class="w-7 h-7 bg-blue-50 border border-blue-100 text-blue-600 font-bold text-[10px] rounded-full flex items-center justify-center shrink-0">{{ currentUser.initials }}</div>
            <div class="flex-1">
              <textarea
                v-model="replyText"
                class="w-full bg-white border border-slate-200 rounded-lg text-slate-900 text-xs p-1.5 px-2.5 outline-none resize-none focus:border-blue-600 placeholder-slate-400 min-h-[50px]"
                rows="2"
                :placeholder="'Replying to ' + comment.name + 'â€¦'"
              ></textarea>
              <div class="flex justify-end gap-2 mt-2">
                <button class="px-3.5 py-1.5 border border-slate-300 text-slate-400 rounded-lg text-xs hover:text-slate-600 hover:border-slate-400" @click="replyTo = null">Cancel</button>
                <button
                  class="px-3.5 py-1.5 bg-blue-600 text-white rounded-lg font-bold text-xs hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="!replyText.trim()"
                  @click="postReply(comment.id)"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- empty state -->
    <div v-if="comments.length === 0" class="text-center py-9 px-5">
      <div class="flex justify-center mb-2.5 opacity-40">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      </div>
      <p class="font-bold text-[14px] text-slate-900 mb-1">No comments yet</p>
      <p class="text-xs text-slate-400 leading-relaxed mb-4">Be the first to ask a question or share a thought.</p>
    </div>

    <!-- load more -->
    <button
      v-if="hasMoreComments"
      class="w-full mt-4 p-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 text-[13px] hover:border-blue-600 hover:text-blue-600 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center min-h-[40px] transition-colors"
      :class="{ 'opacity-60 cursor-not-allowed': loadingMore }"
      @click="loadMore"
    >
      <span v-if="!loadingMore">Load more comments</span>
      <span v-else class="w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin flex"></span>
    </button>



  </div>
</template>

