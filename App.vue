<template>
  <div id="app">
    <student-management></student-management>
  </div>
</template>

<script>
import StudentManagement from './student.vue'

export default {
  name: 'App',
  components: {
    StudentManagement
  }
}
</script>